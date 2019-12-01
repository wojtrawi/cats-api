import { Injectable, PipeTransform } from '@nestjs/common';

import { CatFiltersConfig } from './cat-filters.config';
import { CatFiltersDto } from './cat-filters.dto';

@Injectable()
export class CatFiltersPipe
  implements PipeTransform<CatFiltersDto, CatFiltersConfig> {
  transform(filters: CatFiltersDto): CatFiltersConfig {
    return new CatFiltersConfig(filters);
  }
}
