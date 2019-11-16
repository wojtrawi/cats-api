import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

import { CatsModule } from './cats/cats.module';
import { AuthModule } from './auth/auth.module';

dotenv.config();
const { DB_USER, DB_PASSWORD, DB_NAME } = process.env;

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb+srv://${DB_USER}:${DB_PASSWORD}@sandbox-iianb.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`,
    ),
    CatsModule,
    AuthModule,
  ],
  providers: [],
})
export class AppModule {}
