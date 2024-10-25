import mongoose from "mongoose";
import { IShopifyStoreDocument, storeSchema } from "./schema";

const ShopifyStore =
  mongoose.models.ShopifyStore ||
  mongoose.model<IShopifyStoreDocument>("ShopifyStore", storeSchema);

export default ShopifyStore;
