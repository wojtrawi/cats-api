import { createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { pickBy } from 'lodash';

export const Filters = (...filterKeys: string[]) =>
  createParamDecorator((_, { query }: Request) => {
    if (!filterKeys.length) {
      return query;
    }

    return pickBy(query, (value, key) => value && filterKeys.includes(key));
  });
