export class ParentNotFoundError extends Error {
  constructor(parentId: string) {
    super(`Parent ${parentId} not found`);
    this.name = 'ParentNotFoundError';
  }
}
