import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokenService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async issueAccessToken(payload: JwtPayload) {
    const secret = this.configService.getOrThrow<string>('ACCESS_SECRET');
    const expiry = this.configService.getOrThrow<string>('ACCESS_EXPIRY');
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiry as JwtSignOptions['expiresIn'],
    });
  }

  async issueRefreshToken(payload: JwtPayload) {
    const secret = this.configService.getOrThrow<string>('REFRESH_SECRET');
    const expiry = this.configService.getOrThrow<string>('REFRESH_EXPIRY');
    const token = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiry as JwtSignOptions['expiresIn'],
    });

    const decoded = await this.jwtService.verifyAsync<
      JwtPayload & { exp: number }
    >(token, { secret });
    return { token, expiry: new Date(decoded.exp * 1000) };
  }

  async issueTokenPair(payload: JwtPayload) {
    const accessToken = await this.issueAccessToken(payload);
    const { token: refreshToken, expiry: refreshExpiry } =
      await this.issueRefreshToken(payload);
    return { accessToken, refreshToken, refreshExpiry };
  }

  async verifyAccessToken(token: string) {
    const secret = this.configService.getOrThrow<string>('ACCESS_SECRET');
    return this.jwtService.verifyAsync<JwtPayload>(token, { secret });
  }

  async verifyRefreshToken(token: string) {
    const secret = this.configService.getOrThrow<string>('REFRESH_SECRET');
    return this.jwtService.verifyAsync<JwtPayload>(token, { secret });
  }

  async hashRefreshToken(token: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(token, salt);
  }
}
