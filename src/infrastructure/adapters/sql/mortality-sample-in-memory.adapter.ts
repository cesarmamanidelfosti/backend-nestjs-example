import { Injectable } from '@nestjs/common';
import { MortalitySample } from '../../../domain/entities/mortality-sample.entity';
import { MortalitySampleRepositoryPort } from '../../../domain/ports/mortality-sample-repository.port';

/**
 * Adaptador en memoria. Reemplaza al adaptador Prisma del plan de migracion
 * (ver PLAN_REFACTORIZACION_MIGRACION_SAVE_MORTALITY.md, seccion 3.3) para
 * este esqueleto de prueba: mismo puerto, sin dependencia de base de datos.
 */
@Injectable()
export class MortalitySampleInMemoryAdapter implements MortalitySampleRepositoryPort {
  private readonly samples: MortalitySample[] = [];

  save(sample: MortalitySample): Promise<MortalitySample> {
    this.samples.push(sample);
    return Promise.resolve(sample);
  }
}
