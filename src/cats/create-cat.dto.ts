import { IsString, Length } from 'class-validator';

export class CreateCatDto {
  @IsString()
  @Length(5, 50)
  readonly name: string;
}
