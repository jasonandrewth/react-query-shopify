import Head from "next/head";
import Link from "next/link";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";
import { NextSeo } from "next-seo";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import { getLayout } from "components/Layout/Layout";
import ProductGrid from "components/Product/ProductGrid";
import Loader from "components/UI/Loader";

import {
  Product,
  GetAllProductsQuery,
  useGetAllProductsQuery,
  useInfiniteGetAllProductsQuery,
  useGetShopInfoQuery,
} from "src/generated/graphql";

export default function ProductsPage() {
  const { isLoading, error, data, isSuccess, fetchNextPage, hasNextPage } =
    useInfiniteGetAllProductsQuery<GetAllProductsQuery, Error>(
      "after",
      shopifyGraphqlRequestClient,
      {
        after: null,
      },
      {
        // initialData: ,
        getNextPageParam: (lastPage, allPages) => {
          if (lastPage.products.pageInfo.hasNextPage) {
            return {
              after: lastPage.products.pageInfo.endCursor,
            };
          }
        },
        onSuccess: () => {
          console.log(Date.now(), "Fetching products succeed");
        },
      }
    );

  if (isLoading) return <Loader />;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  return (
    <>
      <NextSeo
        title={"Home"}
        description={"Home"}
        openGraph={{
          type: "website",
          title: "Home",
          description: "Home",
        }}
      />

      <ProductGrid productData={data} />
    </>
  );
}

ProductsPage.getLayout = getLayout;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery(
    useInfiniteGetAllProductsQuery.getKey({ after: null }),
    useGetAllProductsQuery.fetcher(shopifyGraphqlRequestClient, { after: null })
  );

  await queryClient.prefetchQuery(
    useGetShopInfoQuery.getKey(),
    useGetShopInfoQuery.fetcher(shopifyGraphqlRequestClient)
  );

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 180, // In seconds
  };
};
