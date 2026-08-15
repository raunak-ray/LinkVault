import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DbProvider } from 'src/db/db.provider';
import { RefreshToken } from 'src/db/schema';
import { CreateRefreshTokenDto } from '../dto/create-refresh-token.dto';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly dbProvider: DbProvider) {}

  async create(input: CreateRefreshTokenDto) {
    const [refreshToken] = await this.dbProvider.db
      .insert(RefreshToken)
      .values({
        id: input.id,
        token_hash: input.token,
        user_id: input.userId,
        expires_at: input.expiry,
      })
      .returning();

    return refreshToken;
  }

  async findById(id: string) {
    const [session] = await this.dbProvider.db
      .select()
      .from(RefreshToken)
      .where(eq(RefreshToken.id, id))
      .limit(1);

    return session ?? null;
  }

  async findActiveByUserId(userId: string) {
    return this.dbProvider.db
      .select()
      .from(RefreshToken)
      .where(
        and(eq(RefreshToken.user_id, userId), isNull(RefreshToken.revoked_at)),
      );
  }

  async revoke(id: string) {
    await this.dbProvider.db
      .update(RefreshToken)
      .set({ revoked_at: new Date() })
      .where(eq(RefreshToken.id, id));
  }

  async revokeAllForUser(userId: string) {
    await this.dbProvider.db
      .update(RefreshToken)
      .set({ revoked_at: new Date() })
      .where(
        and(eq(RefreshToken.user_id, userId), isNull(RefreshToken.revoked_at)),
      );
  }
}
