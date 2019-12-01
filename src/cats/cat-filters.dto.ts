import { IsOptional, IsString, Length } from 'class-validator';

export class CatFiltersDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  readonly name?: string;
}
