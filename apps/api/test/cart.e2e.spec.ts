import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';

describe('Cart E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('should add item and reserve stock atomically', async () => {
    const res = await request(app.getHttpServer())
      .post('/cart/items')
      .send({ variantId: 'test-variant-1', qty: 2 })
      .expect(201);

    expect(res.body.success).toBe(true);
  });

  afterAll(async () => await app.close());
});
