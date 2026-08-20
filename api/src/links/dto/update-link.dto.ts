import { IsOptional, IsString } from 'class-validator';

export class UpdateLinkDto {
  @IsString()
  @IsOptional()
  url?: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  collectionId?: string;
}
