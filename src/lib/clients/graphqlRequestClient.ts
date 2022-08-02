import { GraphQLClient } from "graphql-request";
import { API_TOKEN, API_URL } from "../../../lib/const";

const requestHeaders = {
  "X-Shopify-Storefront-Access-Token": API_TOKEN,
  "Content-Type": "application/json",
};

const graphqlRequestClient = new GraphQLClient(API_URL as string, {
  headers: requestHeaders,
});

export default graphqlRequestClient;
