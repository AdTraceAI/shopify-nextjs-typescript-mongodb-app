import { label } from "next-api-middleware";
import verifyHmac from "./verifyHmac";
import verifyProxy from "./verifyProxy";
import verifyRequest from "./verifyRequest";
import dbConnectMiddleware from "./dbConnectMiddleware";

const withMiddleware = label({
  verifyRequest,
  verifyProxy,
  verifyHmac,
  dbConnectMiddleware,
});

export default withMiddleware;
