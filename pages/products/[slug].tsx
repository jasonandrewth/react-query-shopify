import React from "react";
import { useRouter } from "next/router";
import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPageContext,
} from "next";
import Image from "next/image";

import nookies from "nookies";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";
// Import Swiper React components
import { Swiper } from "swiper";
import { Swiper as SwiperSlider, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Lazy } from "swiper";

import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";

import { useAddItem } from "lib/shopify/CartHooks";
import { getLayout } from "components/Layout/Layout";
import Adder from "components/UI/Adder";

import {
  GetProductBySlugQuery,
  useGetProductBySlugQuery,
  useGetAllCollectionsQuery,
  Product,
  useGetNavItemsQuery,
  useGetShopInfoQuery,
} from "src/generated/graphql";

import ProductSingle from "components/Product/ProductSingle";

const ProductPage = (context?: NextPageContext) => {
  const router = useRouter();
  const pid = router.query;

  const {
    isLoading: isLoadingProduct,
    error: productError,
    data,
  } = useGetProductBySlugQuery<
    GetProductBySlugQuery,
    Error
    //@ts-ignore
  >(shopifyGraphqlRequestClient, { slug: pid.slug });

  const product = data?.productByHandle;

  if (isLoadingProduct) return <p>Loading...</p>;
  if (productError) return <p>Boom boy{productError.message}</p>;

  if (!product) router.replace("/");

  return <ProductSingle context={context} product={product as Product} />;
};

ProductPage.getLayout = getLayout;

export default ProductPage;

export async function getStaticPaths() {
  // Return a list of possible value for slug
  const { products } = await shopifyGraphqlRequestClient.request(
    GET_ALL_PROD_HANDLES_QUERY
  );

  return {
    paths: products.nodes.map(
      (product: Product) => `/products/${product.handle}`
    ),
    fallback: false,
  };
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ slug: string }>) => {
  const queryClient = new QueryClient();

  const { slug } = params;

  await queryClient.prefetchQuery(
    useGetProductBySlugQuery.getKey({ slug: slug }),
    useGetProductBySlugQuery.fetcher(shopifyGraphqlRequestClient, {
      slug: slug,
    })
  );

  await queryClient.prefetchQuery(
    useGetShopInfoQuery.getKey(),
    useGetShopInfoQuery.fetcher(shopifyGraphqlRequestClient)
  );

  await queryClient.prefetchQuery(
    useGetAllCollectionsQuery.getKey(),
    useGetAllCollectionsQuery.fetcher(shopifyGraphqlRequestClient)
  );

  await queryClient.prefetchQuery(
    useGetNavItemsQuery.getKey(),
    useGetNavItemsQuery.fetcher(shopifyGraphqlRequestClient)
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 180, // In seconds
  };
};

const GET_ALL_PROD_HANDLES_QUERY = gql`
  query getAllProductHandles {
    products(first: 250) {
      nodes {
        handle
      }
    }
  }
`;
