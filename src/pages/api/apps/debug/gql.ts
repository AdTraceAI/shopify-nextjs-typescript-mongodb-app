import { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    try {
      const { client } = await clientProvider.online.graphqlClient({
        req,
        res,
      });
      const shop = await client.request(`{shop{name}}`);
      return res.status(200).send({ text: shop.data.shop.name });
    } catch (e) {
      console.error(`---> An error occured`, e);
      return res.status(400).send({ text: "Bad request" });
    }
  } else {
    res.status(400).send({ text: "Bad request" });
  }
};

export default withMiddleware("verifyRequest")(handler);
