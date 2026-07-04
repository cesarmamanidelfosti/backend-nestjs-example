import { Test } from '@nestjs/testing';
import { SaveAppItemUseCase } from './save-app-item.use-case';
import {
  PARENT_LOOKUP_PORT,
  ParentLookupPort,
} from '../../domain/ports/parent-lookup.port';
import {
  APP_ITEM_REPOSITORY_PORT,
  AppItemRepositoryPort,
} from '../../domain/ports/app-item-repository.port';
import { ParentNotFoundError } from '../../domain/errors';
import { CreateAppItemDto } from '../dtos/create-app-item.dto';

describe('SaveAppItemUseCase', () => {
  let useCase: SaveAppItemUseCase;
  let parentLookup: jest.Mocked<ParentLookupPort>;
  let repository: jest.Mocked<AppItemRepositoryPort>;

  beforeEach(async () => {
    parentLookup = { existsById: jest.fn() };
    repository = { save: jest.fn((item) => Promise.resolve(item)) };

    const moduleRef = await Test.createTestingModule({
      providers: [
        SaveAppItemUseCase,
        { provide: PARENT_LOOKUP_PORT, useValue: parentLookup },
        { provide: APP_ITEM_REPOSITORY_PORT, useValue: repository },
      ],
    }).compile();

    useCase = moduleRef.get(SaveAppItemUseCase);
  });

  it('throws ParentNotFoundError when the parent does not exist', async () => {
    parentLookup.existsById.mockResolvedValue(false);
    const dto: CreateAppItemDto = {
      parentId: 'unknown',
      quantity: 1,
    };

    await expect(useCase.execute({ dto, createdBy: 'user-1' })).rejects.toThrow(
      ParentNotFoundError,
    );
    expect(repository.save).not.toHaveBeenCalled();
  });

  it('persists an item without an attachment', async () => {
    parentLookup.existsById.mockResolvedValue(true);
    const dto: CreateAppItemDto = {
      parentId: 'parent-001',
      quantity: 5,
      description: 'observacion general',
    };

    const result = await useCase.execute({ dto, createdBy: 'user-1' });

    expect(result.parentId).toBe('parent-001');
    expect(result.createdBy).toBe('user-1');
    expect(repository.save).toHaveBeenCalledTimes(1);
  });

  it('persists an item with an attachment url', async () => {
    parentLookup.existsById.mockResolvedValue(true);
    const dto: CreateAppItemDto = {
      parentId: 'parent-001',
      quantity: 2,
      attachmentUrl: 'https://example.com/photo.jpg',
    };

    const result = await useCase.execute({ dto, createdBy: 'user-2' });

    expect(result.attachmentUrl).toBe('https://example.com/photo.jpg');
  });

  it('persists an item with notes', async () => {
    parentLookup.existsById.mockResolvedValue(true);
    const dto: CreateAppItemDto = {
      parentId: 'parent-001',
      quantity: 3,
      notes: 'Revisar antes de cerrar',
    };

    const result = await useCase.execute({ dto, createdBy: 'user-3' });

    expect(result.notes).toBe('Revisar antes de cerrar');
  });
});
