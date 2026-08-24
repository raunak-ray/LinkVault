import { IsOptional, IsString } from 'class-validator';

export class CollectionQueryDto {
  @IsString()
  @IsOptional()
  search?: string;

  @IsString()
  @IsOptional()
  page?: string;

  @IsString()
  @IsOptional()
  limit?: string;

  @IsString()
  @IsOptional()
  sort?: string;
}
