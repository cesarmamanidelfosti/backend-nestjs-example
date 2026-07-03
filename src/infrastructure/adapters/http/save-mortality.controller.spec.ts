import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import request from 'supertest';
import { App } from 'supertest/types';
import { SaveMortalityModule } from '../../modules/save-mortality.module';

interface SaveMortalityResponseBody {
  success: boolean;
  data: { campaignId: string };
}

describe('SaveMortalityController (integration)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [SaveMortalityModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();

    jwtService = moduleRef.get(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects requests without a bearer token', async () => {
    await request(app.getHttpServer())
      .post('/v1/save-mortality')
      .send({ campaignId: 'campaign-001', quantity: 1 })
      .expect(401);
  });

  it('rejects requests with an invalid token', async () => {
    await request(app.getHttpServer())
      .post('/v1/save-mortality')
      .set('Authorization', 'Bearer invalid-token')
      .send({ campaignId: 'campaign-001', quantity: 1 })
      .expect(401);
  });

  it('creates a mortality sample for a valid token and payload', async () => {
    const token = await jwtService.signAsync({ sub: 'user-1' });

    const response = await request(app.getHttpServer())
      .post('/v1/save-mortality')
      .set('Authorization', `Bearer ${token}`)
      .send({ campaignId: 'campaign-001', quantity: 4 })
      .expect(201);

    const body = response.body as SaveMortalityResponseBody;
    expect(body.success).toBe(true);
    expect(body.data.campaignId).toBe('campaign-001');
  });
});
