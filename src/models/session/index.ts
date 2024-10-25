import mongoose from "mongoose";
import sessionSchema, { ISessionDocument } from "./schema";

const SessionModel =
  mongoose.models.Session ||
  mongoose.model<ISessionDocument>("Session", sessionSchema);

export default SessionModel;
