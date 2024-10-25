import mongoose from "mongoose";
import { ISession } from "./types";

export interface ISessionDocument extends ISession, Document {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema<ISessionDocument>({
  id: { type: String, required: true, unique: true },
  content: { type: String },
  shop: { type: String },
});

export default sessionSchema;
