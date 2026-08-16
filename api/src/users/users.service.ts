import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { eq, and, isNull } from 'drizzle-orm';
import { DbProvider } from 'src/db/db.provider';
import { User } from 'src/db/schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { RefreshTokenService } from 'src/auth/services/refresh-token.service';

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
    const [user] = await this.dbProvider.db
      .insert(User)
      .values(input)
      .returning();

    return this.mapUser(user);
  }

  async update(id: string, input: UpdateUserDto) {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const [updatedUser] = await this.dbProvider.db
      .update(User)
      .set(input)
      .where(eq(User.id, id))
      .returning();

    return this.mapUser(updatedUser);
  }

  async softDelete(id: string) {
    await this.dbProvider.db
      .update(User)
      .set({ deleted_at: new Date() })
      .where(and(isNull(User.deleted_at), eq(User.id, id)))
      .returning();

    await this.refreshTokenService.revokeAllForUser(id);
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
