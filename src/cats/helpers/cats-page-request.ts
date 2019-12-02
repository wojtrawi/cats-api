import * as Joi from '@hapi/joi';

import { BasePageRequest } from '../../shared';
import { CatEntity } from '../entity';

export class CatsPageRequest extends BasePageRequest<CatEntity> {
  private nameFilter: string | null = null;

  constructor(query: object) {
    super(query);

    this.setFilters(query);
  }

  protected getQuery() {
    if (!this.nameFilter) {
      return null;
    }

    return { name: new RegExp(this.nameFilter) };
  }

  private setFilters({ name }: { name?: string }) {
    if (this.isValidName(name)) {
      this.nameFilter = name;
    }
  }

  private isValidName(name: string): boolean {
    const { error } = Joi.string().validate(name);

    return !error;
  }
}
