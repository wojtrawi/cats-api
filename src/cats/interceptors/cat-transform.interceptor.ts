import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { CatEntity } from '../entity';
import { catEntityMapperFactory } from '../helpers';
import { CatDto } from './../dto';

@Injectable()
export class CatTransformInterceptor
  implements NestInterceptor<CatEntity, CatDto> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<CatDto> {
    return next.handle().pipe(map(catEntityMapperFactory(context)));
  }
}
