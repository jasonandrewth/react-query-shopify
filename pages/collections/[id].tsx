import React from "react";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";
import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";

import { dehydrate, QueryClient, useQuery } from "@tanstack/react-query";

const Collection = () => {
  return <div>Collection</div>;
};

export default Collection;

export async function getStaticPaths() {
  // Return a list of possible value for id
  const { collections } = await graphqlRequestClient.request(
    GET_ALL_PRODS_QUERY,
    { first: 20 }
  );

  const possibleVals = collections.edges.map((colName) => {
    return colName.node.handle;
  });

  return {
    paths: collections.edges.map(
      (colName: any) => `/collections/${colName.node.handle}`
    ),
    fallback: "blocking",
  };
}

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["products"], async () => {
    return graphqlRequestClient.request(GET_ALL_PRODS_QUERY, { first: 20 });
  });

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 180, // In seconds
  };
};

const GET_ALL_PRODS_QUERY = gql`
  query getProducts($first: Int!) {
    products(first: $first) {
      edges {
        node {
          id
          title
          availableForSale
          totalInventory
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
      }
    }

    collections(first: 30) {
      edges {
        node {
          title
          handle
          image {
            altText
          }
        }
      }
    }
  }
`;
