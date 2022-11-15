import { GraphQLClient } from "graphql-request";
import { API_TOKEN, API_URL } from "../../../lib/const";

const storefrontRequestHeaders = {
  "X-Shopify-Storefront-Access-Token": API_TOKEN,
  "Content-Type": "application/json",
};

export const shopifyGraphqlRequestClient = new GraphQLClient(
  API_URL as string,
  {
    headers: storefrontRequestHeaders,
  }
);
