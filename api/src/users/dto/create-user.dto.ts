import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { AuthProviderValues } from 'src/auth/constants';
import { RegisterUserDto } from 'src/auth/dto/register-user.dto';
import { type AuthProviderType } from 'src/auth/interfaces/auth-provider.interface';

export class CreateUserDto extends RegisterUserDto {
  @IsString()
  @IsNotEmpty()
  avatar!: string;

  @IsIn(AuthProviderValues)
  authProvider!: AuthProviderType;
}
