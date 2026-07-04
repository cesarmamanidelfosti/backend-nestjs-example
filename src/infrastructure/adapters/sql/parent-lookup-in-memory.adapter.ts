import { Injectable } from '@nestjs/common';
import { ParentLookupPort } from '../../../domain/ports/parent-lookup.port';

/**
 * Adaptador en memoria: implementa el puerto sin depender de una base de
 * datos real. Sirve como punto de partida para reemplazarlo por un
 * adaptador real (Prisma, TypeORM, etc.) cuando este ejemplo se adapte a
 * un caso de uso concreto.
 */
@Injectable()
export class ParentLookupInMemoryAdapter implements ParentLookupPort {
  private readonly knownParentIds = new Set(['parent-001', 'parent-002']);

  existsById(parentId: string): Promise<boolean> {
    return Promise.resolve(this.knownParentIds.has(parentId));
  }
}
