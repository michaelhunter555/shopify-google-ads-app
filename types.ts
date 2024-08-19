export type GoogleAuthUser = {
  id: string;
  planType?: string;
  emailVerified?: boolean;
  name?: string;
  googleAccountId?: string;
  merchantCenterId?: string;
  selectedClientId?: string;
  access_token?: string;
  refresh_token?: string;
  createdCampaigns?: number;
  campaignQuota?: number;
  totalCampaigns?: number;
  Session: string;
};

export type ShopifySession = {
  id: string;
  shop: string;
  state: string;
  isOnline: boolean;
  scope?: string;
  accessToken: string;
  userId?: number;
  firstName?: string;
  lastName?: string;
  googleAuthId?: string;
};
