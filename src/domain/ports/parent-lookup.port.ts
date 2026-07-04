export const PARENT_LOOKUP_PORT = Symbol('PARENT_LOOKUP_PORT');

export interface ParentLookupPort {
  existsById: (parentId: string) => Promise<boolean>;
}
