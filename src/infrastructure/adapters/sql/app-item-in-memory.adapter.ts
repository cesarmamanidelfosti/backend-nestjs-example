import { Injectable } from '@nestjs/common';
import { AppItem } from '../../../domain/entities/app-item.entity';
import { AppItemRepositoryPort } from '../../../domain/ports/app-item-repository.port';

/**
 * Adaptador en memoria: implementa el puerto sin depender de una base de
 * datos real. Sirve como punto de partida para reemplazarlo por un
 * adaptador real (Prisma, TypeORM, etc.) cuando este ejemplo se adapte a
 * un caso de uso concreto.
 */
@Injectable()
export class AppItemInMemoryAdapter implements AppItemRepositoryPort {
  private readonly items: AppItem[] = [];

  save(item: AppItem): Promise<AppItem> {
    this.items.push(item);
    return Promise.resolve(item);
  }
}
