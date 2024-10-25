import { NextPageContext } from "next";
import { RequestedTokenType } from "@shopify/shopify-api";
import sessionHandler from "../sessionHandler";
import shopify from "../shopify";
import freshInstall from "../freshInstall";
import ShopifyStore from "@/models/shopifyStore";

const isInitialLoad = async (
  context: NextPageContext
): Promise<{ props: { [key: string]: any } | undefined }> => {
  try {
    const shop = context.query.shop as string;
    const idToken = context.query.id_token as string;

    //Initial Load
    if (idToken && shop) {
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

      await sessionHandler.storeSession(offlineSession);
      await sessionHandler.storeSession(onlineSession);

      const isFreshInstall = await ShopifyStore.findOne({
        shop: onlineSession.shop,
      });

      if (!isFreshInstall || isFreshInstall?.isActive === false) {
        // !isFreshInstall -> New Install
        // isFreshInstall?.isActive === false -> Reinstall
        await freshInstall({ shop: onlineSession.shop });
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
