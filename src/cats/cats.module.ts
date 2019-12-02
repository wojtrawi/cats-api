import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CatsController } from './cats.controller';
import { CatsGateway } from './cats.gateway';
import { CatsService } from './cats.service';
import { CatSchema } from './schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }])],
  controllers: [CatsController],
  providers: [CatsService, CatsGateway],
})
export class CatsModule {}
