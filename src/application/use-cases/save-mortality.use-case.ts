import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { CreateMortalitySampleDto } from '../dtos/create-mortality-sample.dto';
import { CampaignNotFoundError } from '../../domain/errors';
import { MortalitySample } from '../../domain/entities/mortality-sample.entity';
import { CAMPAIGN_LOOKUP_PORT } from '../../domain/ports/campaign-lookup.port';
import type { CampaignLookupPort } from '../../domain/ports/campaign-lookup.port';
import { MORTALITY_SAMPLE_REPOSITORY_PORT } from '../../domain/ports/mortality-sample-repository.port';
import type { MortalitySampleRepositoryPort } from '../../domain/ports/mortality-sample-repository.port';

export interface SaveMortalityCommand {
  dto: CreateMortalitySampleDto;
  registeredBy: string;
}

@Injectable()
export class SaveMortalityUseCase {
  constructor(
    @Inject(CAMPAIGN_LOOKUP_PORT)
    private readonly campaignLookup: CampaignLookupPort,
    @Inject(MORTALITY_SAMPLE_REPOSITORY_PORT)
    private readonly mortalitySampleRepository: MortalitySampleRepositoryPort,
  ) {}

  async execute(command: SaveMortalityCommand): Promise<MortalitySample> {
    const { dto, registeredBy } = command;

    const campaignExists = await this.campaignLookup.existsById(dto.campaignId);
    if (!campaignExists) {
      throw new CampaignNotFoundError(dto.campaignId);
    }

    const sample: MortalitySample = {
      id: randomUUID(),
      campaignId: dto.campaignId,
      quantity: dto.quantity,
      cause: dto.cause,
      photoUrl: dto.photoUrl,
      notes: dto.notes,
      registeredBy,
      registeredAt: new Date().toISOString(),
    };

    return this.mortalitySampleRepository.save(sample);
  }
}
