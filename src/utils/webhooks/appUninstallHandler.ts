// To create a new webhook, create a new `.js` folder in /utils/webhooks/ and use the project snippet
// `createwebhook` to generate webhook boilerplate

import { ApiVersion } from "@shopify/shopify-api";
import { WebhookTopic } from "@/_developer/types/webhookTopics";
import SessionModel from "@/models/session";
import ShopifyStore from "@/models/shopifyStore";

export const appUninstallHandler = async (
  topic: string | WebhookTopic,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: ApiVersion
) => {
  try {
    /** @type {AppUninstalled} */
    const webhookBody = JSON.parse(webhookRequestBody);

    await SessionModel.deleteMany({ shop });
    await ShopifyStore.findOneAndUpdate(
      { shop },
      { isActive: false },
      { upsert: true }
    );
  } catch (e) {
    console.error(e);
  }
};
