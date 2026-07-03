import { Injectable } from '@nestjs/common';
import { CampaignLookupPort } from '../../../domain/ports/campaign-lookup.port';

/**
 * Adaptador en memoria. Reemplaza al adaptador Prisma del plan de migracion
 * (ver PLAN_REFACTORIZACION_MIGRACION_SAVE_MORTALITY.md, seccion 3.3) para
 * este esqueleto de prueba: mismo puerto, sin dependencia de base de datos.
 */
@Injectable()
export class CampaignLookupInMemoryAdapter implements CampaignLookupPort {
  private readonly knownCampaignIds = new Set(['campaign-001', 'campaign-002']);

  existsById(campaignId: string): Promise<boolean> {
    return Promise.resolve(this.knownCampaignIds.has(campaignId));
  }
}
