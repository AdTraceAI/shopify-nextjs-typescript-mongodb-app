// To create a new webhook, create a new `.js` folder in /utils/webhooks/ and use the project snippet
// `createwebhook` to generate webhook boilerplate

import { ApiVersion } from "@shopify/shopify-api";
import prisma from "../prisma.js";
import { WebhookTopic } from "@/_developer/types/webhookTopics";

const appUninstallHandler = async (
  topic: string | WebhookTopic,
  shop: string,
  webhookRequestBody: string,
  webhookId: string,
  apiVersion: ApiVersion
) => {
  try {
    /** @type {AppUninstalled} */
    const webhookBody = JSON.parse(webhookRequestBody);

    await prisma.session.deleteMany({ where: { shop } });
    await prisma.stores.upsert({
      where: { shop: shop },
      update: { isActive: false },
      create: { shop: shop, isActive: false },
    });
  } catch (e) {
    console.error(e);
  }
};

export default appUninstallHandler;
