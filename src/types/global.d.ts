import { PrismaClient } from "@prisma/client";

declare global {
  interface Window {
    shopify?: {
      config?: {
        shop?: string;
      };
      resourcePicker?: (options: any) => Promise<any>;
    };
  }
  var prisma: PrismaClient;
}
