import { Session } from "@shopify/shopify-api";

declare module "next" {
  interface NextApiRequest {
    user_session?: Session;
    user_shop?: string;
  }
}
