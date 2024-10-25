/**
 *
 * Do not remove the MongoDB query that upserts the shop to `true`.
 *
 */

import ShopifyStore from "@/models/shopifyStore";

const freshInstall = async ({ shop }: { shop: string }) => {
  try {
    console.log("This is a fresh install, running onboarding functions");

    await ShopifyStore.findOneAndUpdate(
      { shop: shop },
      {
        shop: shop,
        isActive: true,
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
