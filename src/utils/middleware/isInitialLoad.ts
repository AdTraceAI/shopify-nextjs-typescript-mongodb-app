import { NextPageContext } from "next";
import { RequestedTokenType } from "@shopify/shopify-api";
import ShopifyStore from "@/models/shopifyStore";
import { ShopifyStoreStatus } from "@/models/shopifyStore/types";
import { IShopifyStoreDocument } from "@/models/shopifyStore/schema";
import shopify from "../shopify";
import dbConnect from "../mongodb";
import sessionHandler from "../sessionHandler";
import { handleFreshInstall } from "@/utils/handleFreshInstall";

const isInitialLoad = async (
  context: NextPageContext
): Promise<{ props: { [key: string]: any } | undefined }> => {
  try {
    const shop = context.query.shop as string;
    const idToken = context.query.id_token as string;

    const shouldRunInitialLoad = idToken && shop;

    //Initial Load
    if (shouldRunInitialLoad) {
      const { session: offlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OfflineAccessToken,
      });

      const { session: onlineSession } = await shopify.auth.tokenExchange({
        sessionToken: idToken,
        shop,
        requestedTokenType: RequestedTokenType.OnlineAccessToken,
      });

      await dbConnect();
      await sessionHandler.storeSession(offlineSession);
      await sessionHandler.storeSession(onlineSession);

      const isFreshInstall = await ShopifyStore.findOne<IShopifyStoreDocument>({
        shop: onlineSession.shop,
      });

      if (
        !isFreshInstall ||
        isFreshInstall.status === ShopifyStoreStatus.UNINSTALLED
      ) {
        // !isFreshInstall -> New Install
        // isFreshInstall?.status === "uninstalled" -> Reinstall
        // we need to save the offline access token for future consumption
        await handleFreshInstall(offlineSession);
      }
    } else {
      // The user has visited the page again.
      // We know this because we're not preserving any url params and idToken doesn't exist here
    }
    return {
      props: {
        data: "ok",
      },
    };
  } catch (e) {
    if (
      (e as Error).message.includes("Failed to parse session token") &&
      process.env.NODE_ENV === "development"
    ) {
      console.warn(
        "JWT Error - happens in dev mode and can be safely ignored, but not in prod."
      );
    } else {
      console.error(
        `---> An error occured at isInitialLoad: ${(e as Error).message}`,
        e
      );
      return {
        props: {
          serverError: true,
        },
      };
    }
    return {
      props: {
        data: "ok",
      },
    };
  }
};

export default isInitialLoad;
