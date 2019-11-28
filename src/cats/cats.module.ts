import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CatSchema } from './cat.schema';
import { CatsController } from './cats.controller';
import { CatsGateway } from './cats.gateway';
import { CatsService } from './cats.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService, CatsGateway],
})
export class CatsModule {}
