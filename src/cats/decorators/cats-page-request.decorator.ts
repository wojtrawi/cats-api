import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

import { CatsPageRequest } from '../helpers/cats-page-request';

export const CatsPageReq = createParamDecorator(
  (data, { query }: Request) => new CatsPageRequest(query || {}),
);
