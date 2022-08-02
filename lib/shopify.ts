import Client from "shopify-buy";
import { isBrowser } from "./helpers";
import { API_TOKEN, API_URL } from "./const";

// // First, check that Shopify variables are set
// const hasShopify =
//   "process.env.SHOPIFY_STORE_DOMAIN" &&
//   "process.env.SHOPIFY_STORE_FRONT_ACCESS_TOKEN";

// // Warn the client if variables are missing
// if (!hasShopify && isBrowser) {
//   console.warn("Shopify .env variables are missing");
// }

export const shopifyClient = Client.buildClient({
  storefrontAccessToken: API_TOKEN,
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN,
});

export const parseShopifyResponse = (response: any) =>
  JSON.parse(JSON.stringify(response));
