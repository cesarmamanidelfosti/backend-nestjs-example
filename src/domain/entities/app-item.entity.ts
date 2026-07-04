export interface AppItem {
  id: string;
  parentId: string;
  quantity: number;
  description?: string;
  attachmentUrl?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}
