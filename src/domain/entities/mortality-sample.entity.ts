export interface MortalitySample {
  id: string;
  campaignId: string;
  quantity: number;
  cause?: string;
  photoUrl?: string;
  registeredBy: string;
  registeredAt: string;
}
