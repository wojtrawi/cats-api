import { ApiModelProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCatDto {
  @ApiModelProperty()
  @IsString()
  @Length(5, 50)
  readonly name: string;
}
