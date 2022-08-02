import React from "react";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";
import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

import { useGetShopInfoQuery, GetShopInfoQuery } from "src/generated/graphql";

const ShippingPage = () => {
  const { isLoading, error, data } = useGetShopInfoQuery<
    GetShopInfoQuery,
    Error
  >(graphqlRequestClient);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Boom boy{error.message}</p>;

  return (
    <div
      dangerouslySetInnerHTML={{ __html: data?.shop?.shippingPolicy?.body }}
    />
  );
};

export default ShippingPage;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    useGetShopInfoQuery.getKey(),
    useGetShopInfoQuery.fetcher(graphqlRequestClient)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 180, // In seconds
  };
};
