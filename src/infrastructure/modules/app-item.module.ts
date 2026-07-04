import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AppItemController } from '../adapters/http/app-item.controller';
import { SaveAppItemUseCase } from '../../application/use-cases/save-app-item.use-case';
import { PARENT_LOOKUP_PORT } from '../../domain/ports/parent-lookup.port';
import { APP_ITEM_REPOSITORY_PORT } from '../../domain/ports/app-item-repository.port';
import { ParentLookupInMemoryAdapter } from '../adapters/sql/parent-lookup-in-memory.adapter';
import { AppItemInMemoryAdapter } from '../adapters/sql/app-item-in-memory.adapter';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET ?? 'demo-secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AppItemController],
  providers: [
    SaveAppItemUseCase,
    JwtAuthGuard,
    { provide: PARENT_LOOKUP_PORT, useClass: ParentLookupInMemoryAdapter },
    {
      provide: APP_ITEM_REPOSITORY_PORT,
      useClass: AppItemInMemoryAdapter,
    },
  ],
  exports: [JwtModule],
})
export class AppItemModule {}
