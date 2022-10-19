import { gql, GraphQLClient } from "graphql-request";

const submitter = async (req, res) => {
  const { email } = req.body;

  console.log(email);

  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const ACCESS_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_ADMIN_ACCESS_TOKEN;
    const DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;
    const mutation = gql`
      mutation createCustomer($email: String!) {
        customerCreate(
          input: {
            email: $email
            emailMarketingConsent: {
              marketingState: SUBSCRIBED
              marketingOptInLevel: SINGLE_OPT_IN
            }
          }
        ) {
          customer {
            id
            email
            emailMarketingConsent {
              marketingState
              consentUpdatedAt
            }
          }
        }
      }
    `;

    const graphQLClient = new GraphQLClient(
      "https://ditto-press.myshopify.com/admin/api/2022-07/graphql.json",
      {
        headers: {
          "X-Shopify-Access-Token": ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );

    const response = await graphQLClient.request(mutation, { email: email });

    console.log("res", response);

    if (response.status >= 400) {
      return res.status(400).json({
        error: `There was an error subscribing to the newsletter. 
        Hit me up and I'll add you the old fashioned way :(.`,
      });
    }

    return res.status(201).json({ error: "", data: response });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message || error.toString() });
  }
};

export default submitter;
