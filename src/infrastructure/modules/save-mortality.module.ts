import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { SaveMortalityController } from '../adapters/http/save-mortality.controller';
import { SaveMortalityUseCase } from '../../application/use-cases/save-mortality.use-case';
import { CAMPAIGN_LOOKUP_PORT } from '../../domain/ports/campaign-lookup.port';
import { MORTALITY_SAMPLE_REPOSITORY_PORT } from '../../domain/ports/mortality-sample-repository.port';
import { CampaignLookupInMemoryAdapter } from '../adapters/sql/campaign-lookup-in-memory.adapter';
import { MortalitySampleInMemoryAdapter } from '../adapters/sql/mortality-sample-in-memory.adapter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'demo-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [SaveMortalityController],
  providers: [
    SaveMortalityUseCase,
    JwtAuthGuard,
    { provide: CAMPAIGN_LOOKUP_PORT, useClass: CampaignLookupInMemoryAdapter },
    {
      provide: MORTALITY_SAMPLE_REPOSITORY_PORT,
      useClass: MortalitySampleInMemoryAdapter,
    },
  ],
  exports: [JwtModule],
})
export class SaveMortalityModule {}
