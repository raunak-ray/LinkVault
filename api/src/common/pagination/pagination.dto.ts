import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsPositive } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  page?: number;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @IsPositive()
  limit?: number;
}
