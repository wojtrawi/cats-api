import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { PaginateResult } from 'mongoose';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CatEntity } from '../entity';
import { catEntityMapperFactory } from '../helpers';
import { CatDto } from './../dto';

@Injectable()
export class CatsPageTransformInterceptor
  implements
    NestInterceptor<PaginateResult<CatEntity>, PaginateResult<CatDto>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<PaginateResult<CatDto>> {
    return next.handle().pipe(
      map((catsPageResponse: PaginateResult<CatEntity>) => ({
        ...catsPageResponse,
        docs: catsPageResponse.docs.map(catEntityMapperFactory(context)),
      })),
    );
  }
}
