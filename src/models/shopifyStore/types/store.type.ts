import { IShopifyStoreInfoGraphQLData } from "@/types/shopifyStore/graphql";

export enum ShopifyStoreStatus {
  ACTIVE = "active",
  UNINSTALLED = "uninstalled",
}

export interface IShopifyStore {
  shop: string;
  status: ShopifyStoreStatus;
  accessToken: string;
  shopInfo: IShopifyStoreInfoGraphQLData["shop"];
}
