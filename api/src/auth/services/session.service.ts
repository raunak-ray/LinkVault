import { UsersService } from 'src/users/users.service';
import { RefreshTokenService } from './refresh-token.service';
import { TokenService } from './token.service';
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'bullmq';
import { Response } from 'express';

@Injectable()
export class SessionService {
  private readonly logger = new Logger(SessionService.name);

  constructor(
    private readonly refreshTokenService: RefreshTokenService,
    private readonly tokenService: TokenService,
    private readonly userService: UsersService,
  ) {}
  public async getSessions(userId: string) {
    const user = await this.userService.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const sessions = await this.refreshTokenService.findActiveByUserId(userId);

    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
    }));
  }

  public async revokeSession(sessionId: string, userId: string) {
    const session = await this.refreshTokenService.findById(sessionId);

    if (!session || session.user_id !== userId) {
      throw new NotFoundException('Session not found');
    }

    await this.refreshTokenService.revoke(sessionId);
    this.logger.log(`Session revoked (id: ${sessionId}, user: ${userId})`);
    return { success: true };
  }

  public async issueSession(userId: string, email: string, res: Response) {
    const jti = randomUUID();
    const { accessToken, refreshToken, refreshExpiry } =
      await this.tokenService.issueTokenPair({
        sub: userId,
        email,
        jti,
      });

    this.storeRefreshToken(refreshToken, res, refreshExpiry);

    const refreshTokenHash =
      await this.tokenService.hashRefreshToken(refreshToken);

    await this.refreshTokenService.create({
      id: jti,
      token: refreshTokenHash,
      expiry: refreshExpiry,
      userId,
    });

    return { accessToken, refreshExpiry };
  }

  private storeRefreshToken(token: string, res: Response, expiresAt: Date) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      path: '/',
      maxAge: expiresAt.getTime() - Date.now(),
    });
  }

  public clearRefreshToken(res: Response) {
    // Clear both '/' and legacy '/auth' paths to purge stale cookies from previous builds
    const opts = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:
        process.env.NODE_ENV === 'production'
          ? ('none' as const)
          : ('lax' as const),
      path: '/',
    };
    res.clearCookie('refreshToken', opts);
    res.clearCookie('refreshToken', { ...opts, path: '/auth' });
  }
}
