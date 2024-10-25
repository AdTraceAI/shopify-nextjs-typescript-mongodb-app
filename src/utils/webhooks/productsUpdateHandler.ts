import { WebhookTopic } from "@/_developer/types";
import { ApiVersion } from "@shopify/shopify-api";

export const productsUpdateHandler = async (
  topic: string | WebhookTopic,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: ApiVersion
) => {
  try {
    const webhookBody = JSON.parse(webhookRequestBody);
  } catch (e) {
    console.error(e);
  }
};
