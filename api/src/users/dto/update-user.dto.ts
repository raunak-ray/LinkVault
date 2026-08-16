import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(1, {
    message: 'Name must not be empty',
  })
  @MaxLength(255, {
    message: 'Name must be at most 255 characters long',
  })
  name?: string;
}
