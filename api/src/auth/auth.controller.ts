import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { type AuthenticatedRequest } from '../common/interface/authenticated-request';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { JwtPayload } from './interface/jwt-payload';
import { PgUUID } from 'drizzle-orm/pg-core';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() body: RegisterUserDto) {
    const data = await this.authService.registerUser(body);

    return data;
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() body: LoginUserDto) {
    const data = await this.authService.loginUser(body);

    return data;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@CurrentUser('sub') sub: string) {
    const data = await this.authService.fetchMe(sub);
    return data;
  }
}
