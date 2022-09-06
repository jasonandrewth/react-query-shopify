import React from "react";

import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import Layout from "components/Layout";

import { useGetShopInfoQuery, GetShopInfoQuery } from "src/generated/graphql";

const ShippingPage = () => {
  const { isLoading, error, data } = useGetShopInfoQuery<
    GetShopInfoQuery,
    Error
  >(shopifyGraphqlRequestClient);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Boom boy{error.message}</p>;

  return (
    <Layout
      main={
        <div
          className="max-w-8xl"
          dangerouslySetInnerHTML={{ __html: data?.shop?.shippingPolicy?.body }}
        />
      }
    />
  );
};

export default ShippingPage;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useGetShopInfoQuery.getKey(),
    useGetShopInfoQuery.fetcher(shopifyGraphqlRequestClient)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 180, // In seconds
  };
};
