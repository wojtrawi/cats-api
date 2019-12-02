import { Document, PaginateModel, PaginateOptions, PaginateResult } from 'mongoose';

import { Pagination, PaginationConfig } from './pagination';
import { Sort, SortConfig } from './sort';

export interface BasePageRequestConfig {
  pagination?: PaginationConfig;
  sort?: SortConfig;
}

export abstract class BasePageRequest<T extends Document> {
  private pagination: Pagination;
  private sort: Sort;

  constructor(query: object, config: BasePageRequestConfig = {}) {
    this.pagination = new Pagination(query, config.pagination);
    this.sort = new Sort(query, config.sort);
  }

  public async getResponse(
    model: PaginateModel<T>,
  ): Promise<PaginateResult<T>> {
    const options: PaginateOptions = this.pagination.getPaginationQuery();
    const sortQuery = this.sort.getSortQuery();

    if (sortQuery) {
      options.sort = sortQuery;
    }

    return model.paginate(this.getQuery() || {}, options);
  }

  protected abstract getQuery(): object | null;
}
