import { Module } from '@nestjs/common';
import { AppItemModule } from './infrastructure/modules/app-item.module';
import { HealthController } from './infrastructure/adapters/http/health.controller';

@Module({
  imports: [AppItemModule],
  controllers: [HealthController],
})
export class AppModule {}
