import { ValidationPipe } from '@nestjs/common';
import { getModelToken, MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Model } from 'mongoose';
import * as mongoose from 'mongoose';
import * as request from 'supertest';

import { CreateCatDto } from '../src/cats/dto';
import { CatSchema } from '../src/cats/schema';
import { AppModule } from './../src/app.module';
import { CatEntity } from './../src/cats/entity';
import { login, loginAsAdmin } from './auth.helpers';

const mockCats: CreateCatDto[] = [{ name: 'Kitten#1' }, { name: 'Kitten#1' }];

describe('Cats API (e2e)', () => {
  let accessToken: string;
  let adminAccessToken: string;
  let invalidAccessToken: string;
  let app;
  let catsModel: Model<CatEntity>;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    accessToken = await login();
    adminAccessToken = await loginAsAdmin();
    invalidAccessToken = accessToken
      .split('')
      .reverse()
      .join();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => {
            mongod = new MongoMemoryServer();
            const uri = await mongod.getConnectionString();

            return { uri };
          },
        }),
        AppModule,
        MongooseModule.forFeature([{ name: 'Cat', schema: CatSchema }]),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    catsModel = moduleFixture.get(getModelToken('Cat'));
    await setDB();
  });

  afterEach(async () => {
    await app.close();
    await mongod.stop();
  });

  describe('POST', () => {
    it('should create cat', async () => {
      const newCat = { name: 'Hello Kitty' };

      const response = await createCat(newCat, accessToken);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('_id');
      expect(response.body).toHaveProperty('name', newCat.name);
    });

    it('should return 400 for too short name', async () => {
      const newCat = { name: 'H' };

      const response = await createCat(newCat, accessToken);

      expect(response.status).toBe(400);
    });

    it('should return 400 for too long name', async () => {
      const newCat = { name: 'H'.repeat(51) };

      const response = await createCat(newCat, accessToken);

      expect(response.status).toBe(400);
    });

    it('should return 401 for invalid access token', async () => {
      const newCat = { name: 'Hello Kitty' };

      const response = await createCat(newCat, invalidAccessToken);

      expect(response.status).toBe(401);
    });
  });

  describe('GET', () => {
    it('should return cats', async () => {
      const response = await request(app.getHttpServer()).get('/cats');

      expect(response.status).toBe(200);
      expect(response.body.docs.length).toBe(mockCats.length);
    });
  });

  describe('GET/:id', () => {
    it('should return cat', async () => {
      const { body: newCat } = await createCat(
        { name: 'Hello Kitty' },
        accessToken,
      );

      const response = await request(app.getHttpServer()).get(
        `/cats/${newCat._id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(newCat._id);
    });

    it('should return 404 for invalid id', async () => {
      const response = await request(app.getHttpServer()).get(
        `/cats/${new mongoose.Types.ObjectId().toHexString()}`,
      );

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE/:id', () => {
    it('should remove cat', async () => {
      const { body: newCat } = await createCat(
        { name: 'Hello Kitty' },
        accessToken,
      );

      const response = await request(app.getHttpServer())
        .delete(`/cats/${newCat._id}`)
        .set({ authorization: `Bearer ${adminAccessToken}` });

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(newCat._id);
    });

    it('should return 404 for invalid id', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cats/${new mongoose.Types.ObjectId().toHexString()}`)
        .set({ authorization: `Bearer ${adminAccessToken}` });

      expect(response.status).toBe(404);
    });

    it('should return 403 for non admin access token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cats/${new mongoose.Types.ObjectId().toHexString()}`)
        .set({ authorization: `Bearer ${accessToken}` });

      expect(response.status).toBe(403);
    });

    it('should return 401 for invalid access token', async () => {
      const response = await request(app.getHttpServer())
        .delete(`/cats/${new mongoose.Types.ObjectId().toHexString()}`)
        .set({ authorization: `Bearer ${invalidAccessToken}` });

      expect(response.status).toBe(401);
    });
  });

  async function createCat(
    newCat: CreateCatDto,
    token: string,
  ): Promise<request.Response> {
    return await request(app.getHttpServer())
      .post('/cats')
      .set({ authorization: `Bearer ${token}` })
      .send(newCat);
  }

  async function setDB(): Promise<void> {
    await catsModel.deleteMany({});
    await catsModel.insertMany(mockCats);
  }
});
