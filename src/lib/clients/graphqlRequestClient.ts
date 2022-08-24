import { GraphQLClient } from "graphql-request";
import { API_TOKEN, API_URL, ADMIN_TOKEN, ADMIN_URL } from "../../../lib/const";

const storefrontRequestHeaders = {
  "X-Shopify-Storefront-Access-Token": API_TOKEN,
  "Content-Type": "application/json",
};

const adminRequestHeaders = {
  "X-Shopify-Access-Token": ADMIN_TOKEN,
  "Content-Type": "application/json",
};

export const shopifyGraphqlRequestClient = new GraphQLClient(
  API_URL as string,
  {
    headers: storefrontRequestHeaders,
  }
);

export const shopifyAdminGraphqlRequestClient = new GraphQLClient(
  ADMIN_URL as string,
  {
    headers: adminRequestHeaders,
  }
);
