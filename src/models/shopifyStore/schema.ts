import mongoose, { Document } from "mongoose";
import { IShopifyStore, ShopifyStoreStatus } from "./types";

export interface IShopifyStoreDocument extends IShopifyStore, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const storeSchema = new mongoose.Schema<IShopifyStoreDocument>(
  {
    shop: { type: String, required: true, unique: true },
    status: {
      type: String,
      enum: Object.values(ShopifyStoreStatus),
      default: ShopifyStoreStatus.ACTIVE,
    },
    accessToken: { type: String, required: true },
    shopInfo: {
      name: { type: String, required: true },
      createdAt: { type: String, required: true },
      email: { type: String, required: true },
      ianaTimezone: { type: String, required: true },
      myshopifyDomain: { type: String, required: true },
      domains: {
        type: [
          {
            url: { type: String, required: true },
          },
        ],
        required: true,
      },
      plan: {
        type: {
          displayName: { type: String, required: true },
          partnerDevelopment: { type: Boolean, required: true },
          shopifyPlus: { type: Boolean, required: true },
        },
        required: true,
      },
      shopOwnerName: { type: String, required: true },
      updatedAt: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  {
    timestamps: true,
  }
);
