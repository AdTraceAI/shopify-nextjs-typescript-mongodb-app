import { label } from "next-api-middleware";
import verifyHmac from "./verifyHmac";
import verifyProxy from "./verifyProxy";
import verifyRequest from "./verifyRequest";
import dbConnect from "../mongodb";

const withMiddleware = label({
  verifyRequest,
  verifyProxy,
  verifyHmac,
  dbConnect,
});

export default withMiddleware;
