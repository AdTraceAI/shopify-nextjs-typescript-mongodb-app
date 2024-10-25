import { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    //false for offline session, true for online session
    const { client } = await clientProvider.online.graphqlClient({
      req,
      res,
    });

    const response = await client.request(
      `{
      appInstallation {
        activeSubscriptions {
          name
          status
          lineItems {
            plan {
              pricingDetails {
                ... on AppRecurringPricing {
                  __typename
                  price {
                    amount
                    currencyCode
                  }
                  interval
                }
              }
            }
          }
          test
        }
      }
    }`
    );

    res.status(200).send(response);
  } catch (error) {
    console.error((error as Error).message);
    res.status(500).send((error as Error).message);
  }
};

export default withMiddleware("verifyRequest", "dbConnectMiddleware")(handler);
