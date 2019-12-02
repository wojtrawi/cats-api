import * as Joi from '@hapi/joi';

type SortDir = 'asc' | 'desc';

export interface SortConfig {
  defaultSortBy: string;
  defaultSortDir?: SortDir;
}

export interface SortQuery {
  [key: string]: SortDir;
}

export class Sort {
  private static defaultSortDir: SortDir = 'asc';

  private sortBy: string | null;
  private sortDir: SortDir;

  constructor(
    query: { sortBy?: string; sortDir?: SortDir },
    private config?: SortConfig,
  ) {
    this.setDefaultSort();
    this.setSort(query);
  }

  private get defaultSortDir(): SortDir {
    return (this.config && this.config.defaultSortDir) || Sort.defaultSortDir;
  }

  private get defaultSortBy(): string | null {
    return (this.config && this.config.defaultSortBy) || null;
  }

  public setSort({ sortBy, sortDir }: { sortBy?: string; sortDir?: SortDir }) {
    if (this.isValidSortBy(sortBy)) {
      this.sortBy = sortBy;
    }

    if (this.isValidSortDir(sortDir)) {
      this.sortDir = sortDir;
    }
  }

  public getSortQuery(): SortQuery | null {
    if (!this.sortBy) {
      return null;
    }

    return { [this.sortBy]: this.sortDir };
  }

  public setDefaultSort() {
    this.sortDir = this.defaultSortDir;
    this.sortBy = this.defaultSortBy;
  }

  private isValidSortBy(sortBy: string): boolean {
    const { error } = Joi.string()
      .required()
      .validate(sortBy);

    return !error;
  }

  private isValidSortDir(sortDir: SortDir): boolean {
    const { error } = Joi.string()
      .valid('asc', 'desc')
      .required()
      .validate(sortDir);

    return !error;
  }
}
