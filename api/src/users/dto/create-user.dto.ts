import { IsNotEmpty, IsString } from 'class-validator';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';

export class CreateUserDto extends RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  avatar!: string;
}
