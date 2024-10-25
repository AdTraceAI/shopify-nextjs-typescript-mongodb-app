import mongoose from "mongoose";
import dbConnect from "./mongodb";

export const getMongoose = async () => {
  await dbConnect();
  return mongoose;
};

export default getMongoose;
