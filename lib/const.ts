export const SHOPIFY_CHECKOUT_ID_COOKIE = "shopify_checkoutId";

export const STORE_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

export const SHOPIFY_COOKIE_EXPIRE = 30;

export const API_URL = `https://${STORE_DOMAIN}/api/2022-07/graphql.json`;

export const API_TOKEN =
  process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

export const ADMIN_URL = `https://${STORE_DOMAIN}/admin/api/2022-07/graphql.json `;

export const CART_QUERY = "CART_QUERY";
export const CART_ITEM_COUNT_QUERY = "CART_ITEM_COUNT_QUERY";
