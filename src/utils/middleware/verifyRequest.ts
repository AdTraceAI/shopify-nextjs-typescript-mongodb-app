import { NextApiRequest, NextApiResponse } from "next";
import { RequestedTokenType, Session } from "@shopify/shopify-api";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";
import validateJWT from "@/utils/validateJWT";

const verifyRequest = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      throw Error("No authorization header found.");
    }

    const payload = validateJWT(authHeader.split(" ")[1]);

    let shop = shopify.utils.sanitizeShop(payload.dest.replace("https://", ""));
    if (!shop) {
      throw Error("No shop found, not a valid request");
    }

    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!sessionId) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    let session =
      (await sessionHandler.loadSession(sessionId)) ??
      (await getSession({ shop, authHeader }));

    if (!session) {
      return res.status(401).send({ success: false, message: "Unauthorized" });
    }

    const sessionExpired = new Date(session.expires!) < new Date();
    const sessionScopesMatch = shopify.config.scopes!.equals(session.scope);

    if (sessionExpired || !sessionScopesMatch) {
      session = await getSession({ shop, authHeader });
    }

    console.log("session", session);

    await next();

    return;
  } catch (e) {
    console.error(
      `---> An error happened at verifyRequest middleware: ${(e as Error).message}`
    );
    return res.status(401).send({ error: "Unauthorized call" });
  }
};

export default verifyRequest;

async function getSession({
  shop,
  authHeader,
}: {
  shop: string;
  authHeader: string;
}) {
  try {
    const sessionToken = authHeader.split(" ")[1];

    const { session: onlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OnlineAccessToken,
    });

    await sessionHandler.storeSession(onlineSession);

    const { session: offlineSession } = await shopify.auth.tokenExchange({
      sessionToken,
      shop,
      requestedTokenType: RequestedTokenType.OfflineAccessToken,
    });

    await sessionHandler.storeSession(offlineSession);

    return new Session(onlineSession);
  } catch (e) {
    console.error(
      `---> Error happened while pulling session from Shopify: ${(e as Error).message}`
    );
  }
}
