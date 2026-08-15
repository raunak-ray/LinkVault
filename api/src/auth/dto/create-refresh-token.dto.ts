import {
  IsDate,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateRefreshTokenDto {
  @IsOptional()
  @IsUUID()
  id?: string;

  @IsString()
  @IsNotEmpty()
  token: string;

  @IsDate()
  expiry: Date;

  @IsString()
  @IsNotEmpty()
  userId: string;
}
