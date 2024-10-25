import clientProvider from "@/utils/clientProvider";
import { IShopifyStoreInfoGraphQLData } from "@/types/shopifyStore/graphql";
import { SHOPIFY_STORE_INFO_QUERY } from "./constants";
import { IShopifyStoreDocument } from "@/models/shopifyStore/schema";
import ShopifyStore from "@/models/shopifyStore";

export const captureStoreInfo = async (shopifyStore: IShopifyStoreDocument) => {
  try {
    const { client } = await clientProvider.offline.graphqlClient({
      shop: shopifyStore.shop,
    });

    const shopInfo = await client.request<IShopifyStoreInfoGraphQLData>(
      SHOPIFY_STORE_INFO_QUERY
    );

    if (!shopInfo.data) {
      throw new Error("No shop info found");
    }

    await ShopifyStore.updateOne(
      { shop: shopifyStore.shop },
      { $set: { shopInfo: shopInfo.data.shop } }
    );
  } catch (error) {
    console.error((error as Error).message);
    throw error;
  }
};
