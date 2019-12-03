import { ExecutionContext } from '@nestjs/common';

import { CatDto } from '../dto';
import { CatEntity } from '../entity';

export function catEntityMapperFactory(context: ExecutionContext) {
  const user = context.getArgs()[0].user;
  const sub = user && user.sub;

  return (catEntity: CatEntity): CatDto => {
    const { userId, ...rest } = catEntity.toJSON();

    return {
      ...rest,
      isUserCat: userId === sub,
    };
  };
}
