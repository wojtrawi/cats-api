import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

import { CatFiltersDto } from './cat-filters.dto';

export class CatFiltersConfig {
  @ValidateNested()
  @Type(() => CatFiltersDto)
  filters: CatFiltersDto;

  constructor(filters: CatFiltersDto) {
    this.filters = filters;
  }

  get dbFilters() {
    return Object.entries(this.filters).reduce(
      (acc, [key, value]) => ({
        ...acc,
        [key]: new RegExp(value),
      }),
      {},
    );
  }
}
