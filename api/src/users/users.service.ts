import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { RegisterUserDto } from 'src/auth/dto/register.dto';
import { DbProvider } from 'src/db/db.provider';
import { User } from 'src/db/schema';

@Injectable()
export class UsersService {
  constructor(private readonly dbProvider: DbProvider) {}

  async findByEmail(email: string) {
    const [user] = await this.dbProvider.db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    return user !== undefined ? this.mapUser(user) : null;
  }

  async findById(id: string) {
    const [user] = await this.dbProvider.db
      .select()
      .from(User)
      .where(eq(User.id, id))
      .limit(1);

    return user !== undefined ? this.mapUser(user) : null;
  }

  async findByEmailWithPassword(email: string) {
    const [user] = await this.dbProvider.db
      .select()
      .from(User)
      .where(eq(User.email, email))
      .limit(1);

    return user ?? null;
  }

  async create(input: RegisterUserDto) {
    const  [user] = await this.dbProvider.db
      .insert(User)
      .values(input)
      .returning();

    return this.mapUser(user);
  }

  mapUser(user: typeof User.$inferSelect) {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
    };
  }
}
