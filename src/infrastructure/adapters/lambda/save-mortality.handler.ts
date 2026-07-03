import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { SaveMortalityUseCase } from '../../../application/use-cases/save-mortality.use-case';
import { CreateMortalitySampleDto } from '../../../application/dtos/create-mortality-sample.dto';
import { buildEnvelope } from '../../../shared/utils/response-helper';
import { CampaignNotFoundError } from '../../../domain/errors';

export interface LambdaEvent {
  body: string | null;
  requestContext?: { authorizer?: { claims?: { sub?: string } } };
}

export interface LambdaResponse {
  statusCode: number;
  body: string;
}

/**
 * Handler equivalente al lambda de origen `save-mortality.ts` (ver
 * PLAN_REFACTORIZACION_MIGRACION_SAVE_MORTALITY.md, seccion 2.2). Reutiliza
 * el mismo caso de uso que el controller HTTP para evitar divergencia de
 * logica entre ambos canales (seccion 3.3 / riesgo 7.1 del plan).
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const useCase = app.get(SaveMortalityUseCase);
    const sub = event.requestContext?.authorizer?.claims?.sub;

    if (!sub) {
      return {
        statusCode: 401,
        body: JSON.stringify(
          buildEnvelope(401, false, 'Missing authorizer context', null),
        ),
      };
    }

    const dto = JSON.parse(event.body ?? '{}') as CreateMortalitySampleDto;
    const sample = await useCase.execute({ dto, registeredBy: sub });

    return {
      statusCode: 201,
      body: JSON.stringify(
        buildEnvelope(201, true, 'Muestra de mortalidad registrada', sample),
      ),
    };
  } catch (error) {
    if (error instanceof CampaignNotFoundError) {
      return {
        statusCode: 404,
        body: JSON.stringify(buildEnvelope(404, false, error.message, null)),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify(buildEnvelope(500, false, 'Internal error', null)),
    };
  } finally {
    await app.close();
  }
}
