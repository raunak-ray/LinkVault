import { Injectable, Logger } from '@nestjs/common';
import { SessionService } from './session.service';
import { UsersService } from 'src/users/users.service';
import { OAuthProfile } from '../interfaces/oauth-profile.interface';
import { AVATAR_URL } from '../constants';
import { Response } from 'express';
import { UserResponse } from 'src/users/interface/user-response.interface';

@Injectable()
export class OAuthService {
  private readonly logger = new Logger(OAuthService.name);

  constructor(
    private readonly sessionService: SessionService,
    private readonly userService: UsersService,
  ) {}

  async handleOAuthLogin(profile: OAuthProfile, res: Response) {
    const existing = await this.userService.findByEmail(profile.email);

    let user: UserResponse | null = null;

    if (!existing) {
      const avatar = AVATAR_URL + profile.email;
      user = await this.userService.create({
        name: profile.name,
        email: profile.email,
        authProvider: profile.provider,
        avatar,
      });
    } else {
      user = existing;
    }

    const { accessToken } = await this.sessionService.issueSession(
      user.id,
      user.email,
      res,
    );

    this.logger.log(`User registered (id: ${user.id})`);

    return { ...user, accessToken };
  }
}
