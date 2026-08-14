import { Module } from '@nestjs/common';
import { AuthService } from './dto/services/auth.service';
import { UsersService } from 'src/users/users.service';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
