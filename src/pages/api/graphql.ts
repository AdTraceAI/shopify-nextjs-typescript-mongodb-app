import { NextApiRequest, NextApiResponse } from "next/types";
import withMiddleware from "@/utils/middleware/withMiddleware";
import sessionHandler from "@/utils/sessionHandler";
import shopify from "@/utils/shopify";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  //Reject anything that's not a POST
  if (req.method !== "POST") {
    return res.status(400).send({ text: "We don't do that here." });
  }

  try {
    const sessionId = await shopify.session.getCurrentId({
      isOnline: true,
      rawRequest: req,
      rawResponse: res,
    });

    if (!sessionId) {
      return res.status(403).send({ error: true });
    }

    const session = await sessionHandler.loadSession(sessionId);

    if (!session) {
      return res.status(403).send({ error: true });
    }

    const response = await shopify.clients.graphqlProxy({
      session,
      rawBody: req.body,
    });

    res.status(200).send(response.body);
  } catch (e) {
    console.error(`An error occured at /api/graphql: ${(e as Error).message}`);
    return res.status(403).send(e);
  }
};

withMiddleware("verifyRequest")(handler);
