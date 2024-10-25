//This is the same as `pages/api/index.js`.

import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    return res
      .status(200)
      .send({ text: "This text is coming from `/api/apps route`" });
  }

  if (req.method === "POST") {
    return res.status(200).send(req.body);
  }

  return res.status(400).send({ text: "Bad request" });
};

export default withMiddleware("verifyRequest")(handler);
