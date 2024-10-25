import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    return res.status(401).send("Must be POST");
  }
  try {
    const { body } = req;
    const shop = req.body.shop_domain;
    console.log("gdpr/customers_redact", body, shop);
    return res.status(200).send({ message: "ok" });
  } catch (e) {
    console.error(
      `---> An error occured at /api/gdpr/customers_redact: ${(e as Error).message}`,
      e
    );
    return res.status(500).send({ error: true });
  }
};

export default withMiddleware("verifyHmac", "dbConnect")(handler);
