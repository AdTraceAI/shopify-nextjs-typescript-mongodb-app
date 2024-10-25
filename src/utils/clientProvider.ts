import { NextApiRequest, NextApiResponse } from "next";
import { IClientProvider, IOfflineClient } from "@/types/client";
import sessionHandler from "./sessionHandler";
import shopify from "./shopify";

/**
 * Fetches the offline session associated with a shop.
 */
const fetchOfflineSession = async (shop: string) => {
  const sessionID = shopify.session.getOfflineId(shop);
  const session = await sessionHandler.loadSession(sessionID);
  return session;
};

/**
 * Provides methods to create clients for offline access.
 */
const offline: IOfflineClient = {
  graphqlClient: async ({ shop }: { shop: string }) => {
    const session = await fetchOfflineSession(shop);

    if (!session) {
      throw new Error("Session not found");
    }

    const client = new shopify.clients.Graphql({ session });
    return { client, shop, session };
  },
};

/**
 * Fetches the online session associated with a shop.
 */
const fetchOnlineSession = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const sessionID = await shopify.session.getCurrentId({
    isOnline: true,
    rawRequest: req,
    rawResponse: res,
  });

  if (!sessionID) {
    return undefined;
  }

  const session = await sessionHandler.loadSession(sessionID);
  return session;
};

/**
 * Provides methods to create clients for online access.
 */
const online = {
  graphqlClient: async ({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => {
    const session = await fetchOnlineSession({ req, res });

    if (!session) {
      throw new Error("Session not found");
    }

    const client = new shopify.clients.Graphql({ session });
    const { shop } = session;
    return { client, shop, session };
  },
};

/**
 * Provides GraphQL client providers for both online and offline access.
 */
const clientProvider: IClientProvider = {
  offline,
  online,
};

export default clientProvider;
