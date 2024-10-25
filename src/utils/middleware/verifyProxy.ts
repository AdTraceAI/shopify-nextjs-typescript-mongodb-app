import crypto from "crypto";
import { NextApiRequest, NextApiResponse, NextApiHandler } from "next";

const verifyProxy = async (
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextApiHandler
) => {
  const { signature, shop } = req.query;

  if (!signature || !shop) {
    return res.status(400).send({
      success: false,
      message: "Missing signature or shop",
    });
  }

  const queryURI = encodeQueryData(req.query)
    .replace("/?", "")
    .replace(/&signature=[^&]*/, "")
    .split("&")
    .map((x) => decodeURIComponent(x))
    .sort()
    .join("");

  const calculatedSignature = crypto
    .createHmac("sha256", process.env.SHOPIFY_API_SECRET!)
    .update(queryURI, "utf-8")
    .digest("hex");

  if (calculatedSignature === signature) {
    req.user_shop = shop as string; //myshopify domain
    await next(req, res);
  } else {
    return res.status(401).send({
      success: false,
      message: "Signature verification failed",
    });
  }
};

const encodeQueryData = (data: Record<string, any>) => {
  const queryString = [];
  for (let d in data) queryString.push(d + "=" + encodeURIComponent(data[d]));
  return queryString.join("&");
};

export default verifyProxy;
