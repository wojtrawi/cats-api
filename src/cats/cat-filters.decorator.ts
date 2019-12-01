import { ValidationPipe } from '@nestjs/common';

import { Filters } from '../shared';
import { CatFiltersPipe } from './cat-filters.pipe';

export const CatFilters = Filters('name')(
  CatFiltersPipe,
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    validateCustomDecorators: true,
    transform: true,
  }),
);
