import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from './services/token.service';
import { AuthGuard } from './guards/auth.guard';
import { RefreshTokenService } from './services/refresh-token.service';

@Module({
  imports: [JwtModule.register({})],
  providers: [
    AuthService,
    UsersService,
    TokenService,
    RefreshTokenService,
    AuthGuard,
  ],
  exports: [AuthGuard, TokenService, RefreshTokenService],
  controllers: [AuthController],
})
export class AuthModule {}
