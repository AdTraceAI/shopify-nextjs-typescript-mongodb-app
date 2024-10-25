import mongoose, { Document } from "mongoose";
import { IShopifyStore } from "./types";

export interface IShopifyStoreDocument extends IShopifyStore, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

export const storeSchema = new mongoose.Schema<IShopifyStoreDocument>(
  {
    shop: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);
