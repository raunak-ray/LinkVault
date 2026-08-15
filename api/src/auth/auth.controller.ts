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
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login.dto';
import { AuthGuard } from './guards/auth.guard';
import { CurrentUser } from 'src/common/decorator/current-user.decorator';
import { type Request, type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() body: RegisterUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.registerUser(body, res);

    return data;
  }

  @Post('login')
  @HttpCode(200)
  async login(
    @Body() body: LoginUserDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.loginUser(body, res);

    return data;
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const data = await this.authService.refreshTokens(req, res);

    return data;
  }

  @Post('logout')
  @HttpCode(200)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.logout(req, res);

    return data;
  }

  @UseGuards(AuthGuard)
  @Get('me')
  async me(@CurrentUser('sub') sub: string) {
    const data = await this.authService.fetchMe(sub);
    return data;
  }

  @UseGuards(AuthGuard)
  @Get('sessions')
  async sessions(@CurrentUser('sub') sub: string) {
    const data = await this.authService.getSessions(sub);
    return data;
  }

  @UseGuards(AuthGuard)
  @Delete('sessions/:id')
  async revokeSession(
    @CurrentUser('sub') sub: string,
    @Param('id') id: string,
  ) {
    const data = await this.authService.revokeSession(id, sub);
    return data;
  }
}
