import { Module } from '@nestjs/common';
import { SaveMortalityModule } from './infrastructure/modules/save-mortality.module';
import { HealthController } from './infrastructure/adapters/http/health.controller';

@Module({
  imports: [SaveMortalityModule],
  controllers: [HealthController],
})
export class AppModule {}
