import * as Joi from '@hapi/joi';

export interface PaginationConfig {
  defaultPage?: number;
  defaultLimit?: number;
  limitOptions?: number[];
}

export interface PaginationQuery {
  page: number;
  limit: number;
}

export class Pagination {
  private static defaultLimitOptions = [10, 25, 50, 75, 100];
  private static defaultPage = 1;
  private static defaultLimit = Pagination.defaultLimitOptions[0];

  private page: number;
  private limit: number;

  constructor(
    query: { page?: string; limit?: string },
    private config?: PaginationConfig,
  ) {
    this.setDefaultPagination();
    this.setPagination(query);
  }

  private get defaultPage(): number {
    return (this.config && this.config.defaultPage) || Pagination.defaultPage;
  }

  private get defaultLimit(): number {
    return (this.config && this.config.defaultLimit) || Pagination.defaultLimit;
  }

  private get limitOptions(): number[] {
    return (
      (this.config && this.config.limitOptions) ||
      Pagination.defaultLimitOptions
    );
  }

  public setPagination({ page, limit }: { page?: string; limit?: string }) {
    if (this.isValidPage(page)) {
      this.page = Number(page);
    }

    if (this.isValidLimit(limit)) {
      this.limit = Number(limit);
    }
  }

  public getPaginationQuery(): PaginationQuery {
    return { page: this.page, limit: this.limit };
  }

  public setDefaultPagination() {
    this.page = this.defaultPage;
    this.limit = this.defaultLimit;
  }

  private isValidPage(page: string): boolean {
    const { error } = Joi.number()
      .min(1)
      .integer()
      .required()
      .validate(page);

    return !error;
  }

  private isValidLimit(limit: string): boolean {
    const { error } = Joi.number()
      .valid(...this.limitOptions)
      .required()
      .validate(limit);

    return !error;
  }
}
