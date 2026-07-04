import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppItemModule } from '../../modules/app-item.module';

interface AppItemResponseBody {
  success: boolean;
  data: { parentId: string };
}

describe('AppItemController (integration)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppItemModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();

    jwtService = moduleRef.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects requests without a bearer token', async () => {
    await request(app.getHttpServer())
      .post('/v1/app-items')
      .send({ parentId: 'parent-001', quantity: 1 })
      .expect(401);
  });

  it('rejects requests with an invalid token', async () => {
    await request(app.getHttpServer())
      .post('/v1/app-items')
      .set('Authorization', 'Bearer invalid-token')
      .send({ parentId: 'parent-001', quantity: 1 })
      .expect(401);
  });

  it('creates an app item for a valid token and payload', async () => {
    const token = await jwtService.signAsync({ sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/v1/app-items')
      .set('Authorization', `Bearer ${token}`)
      .send({ parentId: 'parent-001', quantity: 4 })
      .expect(201);

    const body = response.body as AppItemResponseBody;
    expect(body.success).toBe(true);
    expect(body.data.parentId).toBe('parent-001');
  });

  it('rejects requests with unexpected fields', async () => {
    const token = await jwtService.signAsync({ sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/v1/app-items')
      .set('Authorization', `Bearer ${token}`)
      .send({
        parentId: 'parent-001',
        quantity: 4,
        unexpectedField: 'nope',
      })
      .expect(400);

    const body = response.body as { message: string[] };
    expect(body.message.join(' ')).toContain('unexpectedField');
  });
});
