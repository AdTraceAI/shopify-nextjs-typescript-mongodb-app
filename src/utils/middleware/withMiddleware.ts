import { label } from "next-api-middleware";
import verifyHmac from "./verifyHmac";
import verifyProxy from "./verifyProxy";
import verifyRequest from "./verifyRequest";

const withMiddleware = label({
  verifyRequest,
  verifyProxy,
  verifyHmac,
});

export default withMiddleware;
