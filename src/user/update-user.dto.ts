import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(5, 50)
  readonly nickname: string;
}
