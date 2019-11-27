import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AuthModule } from './auth/auth.module';
import { CatsModule } from './cats/cats.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: getDBUri(configService),
      }),
      inject: [ConfigService],
    }),
    CatsModule,
    AuthModule,
    ConfigModule,
  ],
  providers: [],
})
export class AppModule {}

function getDBUri(configService: ConfigService): string {
  const dbUser = configService.get('DB_USER');
  const dbPassword = configService.get('DB_PASSWORD');
  const dbName = configService.get('DB_NAME');

  return `mongodb+srv://${dbUser}:${dbPassword}@sandbox-iianb.mongodb.net/${dbName}?retryWrites=true&w=majority`;
}
