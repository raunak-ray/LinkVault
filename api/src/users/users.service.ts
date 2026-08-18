import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DbProvider } from 'src/db/db.provider';
import { Collection, User } from 'src/db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenService } from 'src/auth/services/refresh-token.service';
import { DEFAULT_COLLECTION } from 'src/collections/constants';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    private readonly dbProvider: DbProvider,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async findByEmail(email: string) {
    const [user] = await this.dbProvider.db
      .select()
      .from(User)
      .where(and(eq(User.email, email), isNull(User.deleted_at)))
      .limit(1);

    return user !== undefined ? this.mapUser(user) : null;
  }

  async findById(id: string) {
    const [user] = await this.dbProvider.db
      .select()
      .from(User)
      .where(and(eq(User.id, id), isNull(User.deleted_at)))
      .limit(1);

    return user !== undefined ? this.mapUser(user) : null;
  }

  async findByEmailWithPassword(email: string) {
    const [user] = await this.dbProvider.db
      .select()
      .from(User)
      .where(and(eq(User.email, email), isNull(User.deleted_at)))
      .limit(1);

    return user ?? null;
  }

  async create(input: CreateUserDto) {
    return this.dbProvider.db.transaction(async (t) => {
      const [user] = await t.insert(User).values(input).returning();

      await t.insert(Collection).values({
        user_id: user.id,
        name: DEFAULT_COLLECTION.name,
        icon: DEFAULT_COLLECTION.icon,
        color: DEFAULT_COLLECTION.color,
      });

      return this.mapUser(user);
    });
  }

  async update(id: string, input: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      this.logger.warn(`Profile update blocked: user not found (id: ${id})`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const hasUpdates = Object.values(input).some(
      (value) => value !== undefined,
    );

    if (!hasUpdates) {
      this.logger.warn(`Profile update no-op: no fields provided (id: ${id})`);
      throw new BadRequestException('At least one field must be provided');
    }

    const [updatedUser] = await this.dbProvider.db
      .update(User)
      .set(input)
      .where(and(eq(User.id, id), isNull(User.deleted_at)))
      .returning();

    if (!updatedUser) {
      this.logger.warn(`Profile update blocked: user not found (id: ${id})`);
      throw new NotFoundException(`User with id ${id} not found`);
    }

    this.logger.log(`Profile updated (id: ${id})`);
    return this.mapUser(updatedUser);
  }

  async softDelete(id: string) {
    const user = await this.findById(id);

    if (!user) {
      this.logger.warn(
        `Account delete blocked: user not found or already deleted (id: ${id})`,
      );
      return;
    }

    await this.dbProvider.db
      .update(User)
      .set({ deleted_at: new Date() })
      .where(and(isNull(User.deleted_at), eq(User.id, id)))
      .returning();

    await this.refreshTokenService.revokeAllForUser(id);

    this.logger.log(`Account deleted (id: ${id})`);
  }

  mapUser(user: typeof User.$inferSelect) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      createdAt: user.created_at,
    };
  }
}
