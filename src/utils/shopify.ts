import {
  LogSeverity,
  shopifyApi,
  Shopify,
  ApiVersion,
} from "@shopify/shopify-api";
import "@shopify/shopify-api/adapters/node";
import appUninstallHandler from "./webhooks/appUninstallHandler";
import { WebhookSubscription } from "@/_developer/types";
import { NextApiHandler } from "next";

const isDev = process.env.NODE_ENV === "development";

export interface ShopifyConfig extends Shopify {
  user?: {
    webhooks: Array<WebhookSubscription>;
  };
}

let shopify: ShopifyConfig = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  scopes: process.env.SHOPIFY_API_SCOPES!.split(","),
  hostName: process.env.SHOPIFY_APP_URL!.replace(/https:\/\//, ""),
  hostScheme: "https",
  apiVersion: process.env.SHOPIFY_API_VERSION! as ApiVersion,
  isEmbeddedApp: true,
  logger: { level: isDev ? LogSeverity.Info : LogSeverity.Error },
});
/*
  Template for adding new topics:
  ```
    {
      topics: ["",""] //Get this from `https://shopify.dev/docs/api/webhooks?reference=toml`
      url: "/api/webhooks/topic_name" //this can be AWS, PubSub or HTTP routes.
      callback: () //This HAS to be in utils/webhooks/ and created with the `createwebhook` snippet.
      filter: "" //Optional - filter what webhooks you recieve
      include_fields: ["",""] //Optional - decide what fields you want to recieve
    }
  ```
 */

//Add custom user properties to base shopify obj
shopify = {
  ...shopify,
  user: {
    /**
     * @type {Array<{
     *   topics: import("@/_developer/types/webhookTopics.js").WebhookTopics["topic"],
     *   url: string,
     *   callback: Function,
     *   filter?: string,
     *   include_fields?: string[]
     * }>}
     */
    webhooks: [
      {
        topics: ["app/uninstalled"],
        url: "/api/webhooks/app_uninstalled",
        callback: appUninstallHandler,
      },
    ],
  },
};

export default shopify;
