import { IsBoolean, IsNotEmpty } from 'class-validator';

export class MarkFavouriteDto {
  @IsBoolean()
  @IsNotEmpty()
  isFavourite!: boolean;
}
