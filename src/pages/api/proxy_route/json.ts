import { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (!req.user_shop) {
      return res.status(403).send({ error: true });
    }

    const { client } = await clientProvider.offline.graphqlClient({
      shop: req.user_shop as string, // req.user_session isn't available in proxy routes
    });

    return res.status(200).send({ content: "Proxy Be Working" });
  } catch (e) {
    console.error(
      `---> An error occured at /api/proxy_route/json: ${(e as Error).message}`
    );
    return res.status(400).send({ error: true });
  }
};

export default withMiddleware("verifyProxy")(handler);
