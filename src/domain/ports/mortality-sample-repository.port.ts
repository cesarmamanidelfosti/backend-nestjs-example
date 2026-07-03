import { MortalitySample } from '../entities/mortality-sample.entity';

export const MORTALITY_SAMPLE_REPOSITORY_PORT = Symbol(
  'MORTALITY_SAMPLE_REPOSITORY_PORT',
);

export interface MortalitySampleRepositoryPort {
  save: (sample: MortalitySample) => Promise<MortalitySample>;
}
