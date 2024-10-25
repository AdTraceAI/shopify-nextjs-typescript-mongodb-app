/**
 *
 * Do not remove the MongoDB query that upserts the shop to `true`.
 *
 */

import ShopifyStore from "@/models/shopifyStore";
import { IShopifyStoreDocument } from "@/models/shopifyStore/schema";
import { ShopifyStoreStatus } from "@/models/shopifyStore/types";

const freshInstall = async (shop: string, accessToken: string) => {
  try {
    console.log("This is a fresh install, running onboarding functions");

    await ShopifyStore.findOneAndUpdate<IShopifyStoreDocument>(
      { shop: shop },
      {
        shop: shop,
        status: ShopifyStoreStatus.ACTIVE,
        accessToken,
      },
      { upsert: true, new: true }
    );

    //Other functions start here
  } catch (e) {
    console.error(
      `---> An error occurred in freshInstall function: ${(e as Error).message}`,
      e
    );
  }
};

export default freshInstall;
