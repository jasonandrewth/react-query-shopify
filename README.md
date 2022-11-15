# 🛍 Next Shopify Storefront

A **headless shopify storefront** built with [TypeScript](https://www.typescriptlang.org/), [Next.js](https://nextjs.org/), [React.js](https://reactjs.org/), [React Query](https://react-query.tanstack.com/), [Shopify Storefront GraphQL API](https://shopify.dev/api/storefront) and [Tailwind](https://tailwindcss.com/).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Type generation

```bash
npm run graphql:codegen
# or
yarn graphql:codegen
```

This will generate types with react-query and GraphQL Codegen as specified in the `codegen.yml`
Check out this [blog post](https://nhost.io/blog/how-to-use-graphql-code-generator-with-react-query) for an intro to this stack. Curently when types are generated they are stored in src/generated/graphql.ts but with the old version of reaxt-query. To make it work simply update the import to `from "@tanstack/react-query"`
The Schema comes directly from the API Endpoint your querying so right now, in the `codegen.yml`, this secret is exposed but ideally you should store in an .env file.

```
//.env file in project root
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=yourshopifytoken
NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN=yourshop.myshopify.com
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
