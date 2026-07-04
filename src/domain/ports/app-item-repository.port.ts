import { AppItem } from '../entities/app-item.entity';

export const APP_ITEM_REPOSITORY_PORT = Symbol('APP_ITEM_REPOSITORY_PORT');

export interface AppItemRepositoryPort {
  save: (item: AppItem) => Promise<AppItem>;
}
