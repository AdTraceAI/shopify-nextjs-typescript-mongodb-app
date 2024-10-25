import crypto from "crypto";
import { NextApiRequest, NextApiResponse } from "next";
import shopify from "@/utils/shopify";

const verifyHmac = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: () => Promise<void>
) => {
  try {
    const generateHash = crypto
      .createHmac("SHA256", process.env.SHOPIFY_API_SECRET!)
      .update(JSON.stringify(req.body), "utf8")
      .digest("base64");

    const hmac = req.headers["x-shopify-hmac-sha256"];

    if (!hmac) {
      return res
        .status(401)
        .send({ success: false, message: "HMAC verification failed" });
    }

    if (shopify.auth.safeCompare(generateHash, hmac)) {
      await next();
    } else {
      return res
        .status(401)
        .send({ success: false, message: "HMAC verification failed" });
    }
  } catch (e) {
    console.log(
      `---> An error occured while verifying HMAC`,
      (e as Error).message
    );
    return res
      .status(500)
      .send({ success: false, message: "Internal server error" });
  }
};

export default verifyHmac;
