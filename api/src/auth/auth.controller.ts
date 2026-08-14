import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RegisterUserDto } from './dto/register.dto';
import { AuthService } from './services/auth.service';
import { LoginUserDto } from './dto/login.dto';

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
}
