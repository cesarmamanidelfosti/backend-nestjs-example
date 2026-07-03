import { Test } from '@nestjs/testing';
import { SaveMortalityUseCase } from './save-mortality.use-case';
import {
  CAMPAIGN_LOOKUP_PORT,
  CampaignLookupPort,
} from '../../domain/ports/campaign-lookup.port';
import {
  MORTALITY_SAMPLE_REPOSITORY_PORT,
  MortalitySampleRepositoryPort,
} from '../../domain/ports/mortality-sample-repository.port';
import { CampaignNotFoundError } from '../../domain/errors';
import { CreateMortalitySampleDto } from '../dtos/create-mortality-sample.dto';

describe('SaveMortalityUseCase', () => {
  let useCase: SaveMortalityUseCase;
  let campaignLookup: jest.Mocked<CampaignLookupPort>;
  let repository: jest.Mocked<MortalitySampleRepositoryPort>;

  beforeEach(async () => {
    campaignLookup = { existsById: jest.fn() };
    repository = { save: jest.fn((sample) => Promise.resolve(sample)) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SaveMortalityUseCase,
        { provide: CAMPAIGN_LOOKUP_PORT, useValue: campaignLookup },
        { provide: MORTALITY_SAMPLE_REPOSITORY_PORT, useValue: repository },
      ],
    }).compile();

    useCase = moduleRef.get(SaveMortalityUseCase);
  });

  it('throws CampaignNotFoundError when the campaign does not exist', async () => {
    campaignLookup.existsById.mockResolvedValue(false);
    const dto: CreateMortalitySampleDto = {
      campaignId: 'unknown',
      quantity: 1,
    };

    await expect(
      useCase.execute({ dto, registeredBy: 'user-1' }),
    ).rejects.toThrow(CampaignNotFoundError);
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('persists a sample without photo', async () => {
    campaignLookup.existsById.mockResolvedValue(true);
    const dto: CreateMortalitySampleDto = {
      campaignId: 'campaign-001',
      quantity: 5,
      cause: 'calor',
    };

    const result = await useCase.execute({ dto, registeredBy: 'user-1' });

    expect(result.campaignId).toBe('campaign-001');
    expect(result.registeredBy).toBe('user-1');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('persists a sample with photo url', async () => {
    campaignLookup.existsById.mockResolvedValue(true);
    const dto: CreateMortalitySampleDto = {
      campaignId: 'campaign-001',
      quantity: 2,
      photoUrl: 'https://example.com/photo.jpg',
    };

    const result = await useCase.execute({ dto, registeredBy: 'user-2' });

    expect(result.photoUrl).toBe('https://example.com/photo.jpg');
  });
});
