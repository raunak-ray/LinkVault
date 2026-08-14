import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { JwtPayload } from '../interface/jwt-payload';

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
    return this.jwtService.signAsync(payload, {
      secret,
      expiresIn: expiry as JwtSignOptions['expiresIn'],
    });
  }

  async issueTokenPair(payload: JwtPayload) {
    const accessToken = await this.issueAccessToken(payload);
    const refreshToken = await this.issueRefreshToken(payload);
    return { accessToken, refreshToken };
  }

  async verifyAccessToken(token: string) {
    const secret = this.configService.getOrThrow<string>('ACCESS_SECRET');
    return this.jwtService.verifyAsync<JwtPayload>(token, { secret });
  }

  async verifyRefreshToken(token: string) {
    const secret = this.configService.getOrThrow<string>('REFRESH_SECRET');
    return this.jwtService.verifyAsync<JwtPayload>(token, { secret });
  }
}
