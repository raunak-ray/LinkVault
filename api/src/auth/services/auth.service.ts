import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { RegisterUserDto } from '../dto/register.dto';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from '../dto/login.dto';
import { TokenService } from './token.service';
import { Request, Response } from 'express';
import { RefreshTokenService } from './refresh-token.service';
import { JwtPayload } from '../interface/jwt-payload';
import { randomUUID } from 'crypto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('auth');
  constructor(
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async registerUser(input: RegisterUserDto, res: Response) {
    const existingUser = await this.userService.findByEmail(input.email);

    if (existingUser) {
      this.logger.warn(`Failed registration attempt for email: ${input.email}`);
      throw new ConflictException('User with this email already exists');
    }

    const SALT = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, SALT);

    const user = await this.userService.create({
      ...input,
      password: hashedPassword,
    });

    const { accessToken } = await this.issueSession(user.id, user.email, res);

    this.logger.log(`Successful registration for email: ${input.email}`);

    return { ...user, accessToken };
  }

  async loginUser(input: LoginUserDto, res: Response) {
    const user = await this.userService.findByEmailWithPassword(input.email);

    if (!user) {
      this.logger.warn(`Failed login attempt for email: ${input.email}`);
      throw new ConflictException('Invalid credentials');
    }

    const passwordsMatch = await bcrypt.compare(input.password, user.password);

    if (!passwordsMatch) {
      this.logger.warn(`Failed login attempt for email: ${input.email}`);
      throw new ConflictException('Invalid credentials');
    }

    const safeUser = this.userService.mapUser(user);

    const { accessToken } = await this.issueSession(
      safeUser.id,
      safeUser.email,
      res,
    );

    this.logger.log(`Successful login for email: ${input.email}`);
    return { ...safeUser, accessToken };
  }

  async refreshTokens(req: Request, res: Response) {
    const token = (req.cookies?.refreshToken as string | undefined) ?? null;

    if (!token) {
      throw new UnauthorizedException('Refresh token not found');
    }

    let payload: JwtPayload;
    try {
      payload = await this.tokenService.verifyRefreshToken(token);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    if (!payload.jti) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const session = await this.refreshTokenService.findById(payload.jti);

    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const tokenMatches = await bcrypt.compare(token, session.token_hash);

    if (!tokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (session.revoked_at) {
      this.logger.warn(
        `Refresh token reuse detected for user: ${session.user_id}`,
      );
      await this.refreshTokenService.revokeAllForUser(session.user_id);
      this.clearRefreshToken(res);
      throw new UnauthorizedException('Session has been revoked');
    }

    if (session.expires_at < new Date()) {
      await this.refreshTokenService.revoke(session.id);
      throw new UnauthorizedException('Refresh token expired');
    }

    await this.refreshTokenService.revoke(session.id);

    const { accessToken } = await this.issueSession(
      session.user_id,
      payload.email,
      res,
    );

    return { accessToken };
  }

  async logout(req: Request, res: Response) {
    const token = (req.cookies?.refreshToken as string | undefined) ?? null;

    if (token) {
      try {
        const payload = await this.tokenService.verifyRefreshToken(token);
        if (payload.jti) {
          await this.refreshTokenService.revoke(payload.jti);
        }
      } catch {
        this.logger.warn('Logout attempt with invalid refresh token');
      }
    }

    this.clearRefreshToken(res);
    return { success: true };
  }

  async fetchMe(id: string) {
    const user = await this.userService.findById(id);
    return user;
  }

  async getSessions(userId: string) {
    const sessions = await this.refreshTokenService.findActiveByUserId(userId);

    return sessions.map((session) => ({
      id: session.id,
      createdAt: session.created_at,
      expiresAt: session.expires_at,
    }));
  }

  async revokeSession(sessionId: string, userId: string) {
    const session = await this.refreshTokenService.findById(sessionId);

    if (!session || session.user_id !== userId) {
      throw new NotFoundException('Session not found');
    }

    await this.refreshTokenService.revoke(sessionId);
    return { success: true };
  }

  private async issueSession(userId: string, email: string, res: Response) {
    const jti = randomUUID();
    const { accessToken, refreshToken, RefreshTokenExpiry } =
      await this.tokenService.issueTokenPair({
        sub: userId,
        email,
        jti,
      });

    this.storeRefreshToken(refreshToken, res);

    const refreshTokenHash =
      await this.tokenService.hashRefreshToken(refreshToken);

    await this.refreshTokenService.create({
      id: jti,
      token: refreshTokenHash,
      expiry: RefreshTokenExpiry,
      userId,
    });

    return { accessToken };
  }

  private storeRefreshToken(token: string, res: Response) {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });
  }

  private clearRefreshToken(res: Response) {
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/auth',
    });
  }
}
