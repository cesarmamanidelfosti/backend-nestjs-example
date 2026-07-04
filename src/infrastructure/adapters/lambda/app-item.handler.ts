import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../../app.module';
import { SaveAppItemUseCase } from '../../../application/use-cases/save-app-item.use-case';
import { CreateAppItemDto } from '../../../application/dtos/create-app-item.dto';
import { buildEnvelope } from '../../../shared/utils/response-helper';
import { ParentNotFoundError } from '../../../domain/errors';

export interface LambdaEvent {
  body: string | null;
  requestContext?: { authorizer?: { claims?: { sub?: string } } };
}

export interface LambdaResponse {
  statusCode: number;
  body: string;
}

/**
 * Handler de ejemplo para un despliegue serverless. Reutiliza el mismo caso
 * de uso que el controller HTTP para evitar divergencia de logica entre
 * ambos canales de entrada.
 */
export async function handler(event: LambdaEvent): Promise<LambdaResponse> {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const useCase = app.get(SaveAppItemUseCase);
    const sub = event.requestContext?.authorizer?.claims?.sub;

    if (!sub) {
      return {
        statusCode: 401,
        body: JSON.stringify(
          buildEnvelope(401, false, 'Missing authorizer context', null),
        ),
      };
    }

    const dto = JSON.parse(event.body ?? '{}') as CreateAppItemDto;
    const item = await useCase.execute({ dto, createdBy: sub });

    return {
      statusCode: 201,
      body: JSON.stringify(
        buildEnvelope(201, true, 'Elemento registrado', item),
      ),
    };
  } catch (error) {
    if (error instanceof ParentNotFoundError) {
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
