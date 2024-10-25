import { NextApiRequest, NextApiResponse } from "next";
import clientProvider from "@/utils/clientProvider";
import withMiddleware from "@/utils/middleware/withMiddleware";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
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
};

export default withMiddleware("verifyRequest", "dbConnect")(handler);
