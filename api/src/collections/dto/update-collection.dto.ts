import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateCollectionDto {
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'name must be at least 3 characters' })
  @MaxLength(255, { message: 'name must be within 255 characters' })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'icon must be within 100 characters' })
  icon?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10, { message: 'color must be within 10 characters' })
  color?: string;
}
