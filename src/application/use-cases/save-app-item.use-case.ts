import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { CreateAppItemDto } from '../dtos/create-app-item.dto';
import { ParentNotFoundError } from '../../domain/errors';
import { AppItem } from '../../domain/entities/app-item.entity';
import { PARENT_LOOKUP_PORT } from '../../domain/ports/parent-lookup.port';
import type { ParentLookupPort } from '../../domain/ports/parent-lookup.port';
import { APP_ITEM_REPOSITORY_PORT } from '../../domain/ports/app-item-repository.port';
import type { AppItemRepositoryPort } from '../../domain/ports/app-item-repository.port';

export interface SaveAppItemCommand {
  dto: CreateAppItemDto;
  createdBy: string;
}

@Injectable()
export class SaveAppItemUseCase {
  constructor(
    @Inject(PARENT_LOOKUP_PORT)
    private readonly parentLookup: ParentLookupPort,
    @Inject(APP_ITEM_REPOSITORY_PORT)
    private readonly appItemRepository: AppItemRepositoryPort,
  ) {}

  async execute(command: SaveAppItemCommand): Promise<AppItem> {
    const { dto, createdBy } = command;

    const parentExists = await this.parentLookup.existsById(dto.parentId);
    if (!parentExists) {
      throw new ParentNotFoundError(dto.parentId);
    }

    const item: AppItem = {
      id: randomUUID(),
      parentId: dto.parentId,
      quantity: dto.quantity,
      description: dto.description,
      attachmentUrl: dto.attachmentUrl,
      notes: dto.notes,
      createdBy,
      createdAt: new Date().toISOString(),
    };

    return this.appItemRepository.save(item);
  }
}
