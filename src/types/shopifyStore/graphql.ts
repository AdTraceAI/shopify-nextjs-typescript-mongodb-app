export interface IShopifyStoreDomain {
  url: string;
  id: string;
  host: string;
  sslEnabled: boolean;
}

export interface IShopifyStorePlan {
  displayName: string;
  partnerDevelopment: boolean;
  shopifyPlus: boolean;
}

export interface IShopifyStoreInfoGraphQLData {
  shop: {
    name: string;
    createdAt: string;
    email: string;
    id: string;
    ianaTimezone: string;
    myshopifyDomain: string;
    domains: IShopifyStoreDomain[];
    plan: IShopifyStorePlan;
    shopOwnerName: string;
    updatedAt: string;
    url: string;
    currencyCode: string;
  };
}
