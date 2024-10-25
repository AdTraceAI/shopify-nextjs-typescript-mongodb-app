import { GraphqlClient, Session } from "@shopify/shopify-api";
import { NextApiRequest, NextApiResponse } from "next";

export interface IOfflineClient {
  graphqlClient: ({ shop }: { shop: string }) => Promise<{
    client: GraphqlClient;
    shop: string;
    session: Session;
  }>;
}

export interface IOnlineClient {
  graphqlClient: ({
    req,
    res,
  }: {
    req: NextApiRequest;
    res: NextApiResponse;
  }) => Promise<{ client: GraphqlClient; shop: string; session: Session }>;
}

export interface IClientProvider {
  offline: IOfflineClient;
  online: IOnlineClient;
}
