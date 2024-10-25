import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../mongodb";

const dbConnectMiddleware = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) => {
  try {
    await dbConnect();
    await next();
  } catch (error) {
    console.error("Error connecting to database:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export default dbConnectMiddleware;
