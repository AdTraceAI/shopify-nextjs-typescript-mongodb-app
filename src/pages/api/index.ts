import { NextApiRequest, NextApiResponse } from "next";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "GET") {
    //GET, POST, PUT, DELETE
    console.log("Serve this only if the request method is GET");
    return res.status(405).send({ error: true });
  }

  try {
    return res.status(200).send({ text: "This is an example route" });
  } catch (e) {
    console.error(e);
    return res.status(403).send({ error: true });
  }
};

export default withMiddleware("verifyRequest", "dbConnect")(handler);
