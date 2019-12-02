import { ApiModelProperty } from '@nestjs/swagger';

export class CatDto {
  @ApiModelProperty()
  // tslint:disable-next-line: variable-name
  readonly _id: string;

  @ApiModelProperty()
  readonly name: string;
}
