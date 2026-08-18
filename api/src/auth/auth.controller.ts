import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { RegisterUserDto } from './dto/register-user.dto';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { type Request, type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ResponseMessage('User registered successfully')
  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.registerUser(body, res);

    return data;
  }

  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ResponseMessage('Login successful')
  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.loginUser(body, res);

    return data;
  }

  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ResponseMessage('Tokens refreshed')
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.refreshTokens(req, res);

    return data;
  }

  @ResponseMessage('Logged out successfully')
  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.logout(req, res);

    return data;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage('Profile fetched successfully')
  @Get('me')
  async me(@CurrentUser('sub') sub: string) {
    const data = await this.authService.fetchMe(sub);
    return data;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage('Sessions fetched successfully')
  @Get('sessions')
  async sessions(@CurrentUser('sub') sub: string) {
    const data = await this.authService.getSessions(sub);
    return data;
  }

  @UseGuards(AuthGuard)
  @ResponseMessage('Session revoked')
  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
  ) {
    const data = await this.authService.revokeSession(id, sub);
    return data;
  }
}
