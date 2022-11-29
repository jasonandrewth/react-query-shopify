import { CodegenConfig } from "@graphql-codegen/cli";
// import { API_URL } from "lib/const";
require("dotenv").config();

const config: CodegenConfig = {
  schema: [
    {
      [`https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}/api/2022-07/graphql.json`]:
        {
          headers: {
            "X-Shopify-Storefront-Access-Token":
              process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN,
          },
        },
    },
  ],
  documents: ["./src/**/**/*.graphql"],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    "./src/generated/graphql.ts": {
      // preset: "client",
      plugins: [
        "typescript",
        "typescript-operations",
        "typescript-react-query",
      ],
      config: {
        fetcher: "graphql-request",
        addInfiniteQuery: true,
        legacyMode: false,
        exposeFetcher: true,
        exposeQueryKeys: true,
        exposeMutationKeys: true,
      },
    },
  },
};

export default config;
