/**
 *
 * Do not remove the MongoDB query that upserts the shop to `true`.
 *
 */

import ShopifyStore from "@/models/shopifyStore";
import { IShopifyStoreDocument } from "@/models/shopifyStore/schema";
import { ShopifyStoreStatus } from "@/models/shopifyStore/types";
import { captureStoreInfo } from "./helpers";
import { Session } from "@shopify/shopify-api";

export const handleFreshInstall = async (session: Session) => {
  try {
    console.log("This is a fresh install, running onboarding functions");

    const shopifyStore =
      await ShopifyStore.findOneAndUpdate<IShopifyStoreDocument>(
        { shop: session.shop },
        {
          shop: session.shop,
          status: ShopifyStoreStatus.ACTIVE,
          accessToken: session.accessToken,
        },
        { upsert: true, new: true }
      );

    captureStoreInfo(shopifyStore);
  } catch (e) {
    console.error(
      `---> An error occurred in handleFreshInstall function: ${(e as Error).message}`,
      e
    );
  }
};
