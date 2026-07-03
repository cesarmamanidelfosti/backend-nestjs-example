export const CAMPAIGN_LOOKUP_PORT = Symbol('CAMPAIGN_LOOKUP_PORT');

export interface CampaignLookupPort {
  existsById: (campaignId: string) => Promise<boolean>;
}
