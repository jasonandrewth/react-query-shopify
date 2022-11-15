import React from "react";
import Image from "next/image";
import Link from "next/link";
import InfiniteScroll from "react-infinite-scroll-component";

import { useRouter } from "next/router";
import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPageContext,
} from "next";

import { getLayout } from "components/Layout/Layout";
import ProductGrid from "components/Product/ProductGrid";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";
import Layout from "components/Layout";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import Loader from "components/UI/Loader";

import { formatPrice } from "lib/shopify/usePrice";

import {
  useGetCollectionByHandleQuery,
  GetCollectionByHandleQuery,
  useInfiniteGetCollectionByHandleQuery,
  Collection,
  useGetAllCollectionsQuery,
  useGetShopInfoQuery,
} from "src/generated/graphql";

const CollectionSingle = () => {
  const router = useRouter();
  const pid = router.query;

  const {
    isLoading,
    error,
    data,
    isError,
    isSuccess,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteGetCollectionByHandleQuery<GetCollectionByHandleQuery, Error>(
    "productsAfter",
    shopifyGraphqlRequestClient,
    //@ts-ignore
    { productsAfter: null, handle: pid.id },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.collectionByHandle.products.pageInfo.hasNextPage) {
          return {
            productsAfter:
              lastPage.collectionByHandle.products.pageInfo.endCursor,
          };
        }
      },
      onSuccess: () => {
        console.log(Date.now(), "Fetching collection products succeed");
      },
    }
  );

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Boom boy{error.message}</p>;

  return (
    <InfiniteScroll
      dataLength={data?.pages?.length * 20}
      next={fetchNextPage}
      hasMore={hasNextPage}
      loader={<Loader />}
    >
      <div className="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mx-auto px-2 lg:px-6 max-w-8xl">
        {data?.pages?.map((page, idx) => (
          <React.Fragment key={`page-${page.__typename}-${idx}`}>
            {page?.collectionByHandle.products?.edges.map(
              ({ node: product }, idx) => {
                const productImage = product?.featuredImage || null;
                return (
                  <article
                    key={`product-${product?.id}-${idx}`}
                    className=" overflow-hidden transition-all duration-200 ease-in-out"
                  >
                    <Link href={`/products/${product.handle}`}>
                      <a>
                        {productImage && (
                          <Image
                            src={productImage.url}
                            alt={productImage.altText}
                            width={productImage.width}
                            height={productImage.height}
                            blurDataURL={productImage.url} //automatically provided
                            placeholder="blur" // Optional blur-up while loading
                          />
                        )}

                        <div className="grid grid-cols-4 max-w-[500px] bg-white text-primary font-bold uppercase px-4 py-2">
                          <div className="col-span-3">
                            {product.title && (
                              <h2 className="whitespace-normal m-0 p-0 pr-2">
                                {product.title}
                              </h2>
                            )}
                          </div>

                          <div className="col-span-1 border-none border-secondary flex items-center justify-end">
                            {product.priceRange.maxVariantPrice && (
                              <h2 className="whitespace-normal m-0 p-0">
                                {formatPrice({
                                  amount:
                                    product.priceRange.maxVariantPrice.amount,
                                  currencyCode:
                                    product.priceRange.maxVariantPrice
                                      .currencyCode,
                                })}
                              </h2>
                            )}
                          </div>
                        </div>
                      </a>
                    </Link>
                  </article>
                );
              }
            )}
          </React.Fragment>
        ))}
      </div>
    </InfiniteScroll>
  );
};

CollectionSingle.getLayout = getLayout;

export default CollectionSingle;

export async function getStaticPaths() {
  // Return a list of possible value for id
  const { collections } = await shopifyGraphqlRequestClient.request(
    GET_ALL_COLLECTION_HANDLES_QUERY
  );

  return {
    paths: collections.nodes.map(
      (collection: Collection) => `/collections/${collection.handle}`
    ),
    fallback: false,
  };
}

export const getStaticProps = async ({
  params,
}: GetStaticPropsContext<{ id: string }>) => {
  const queryClient = new QueryClient();

  const { id } = params;

  await queryClient.prefetchQuery(
    useInfiniteGetCollectionByHandleQuery.getKey({
      productsAfter: null,
      handle: id,
    }),
    useGetCollectionByHandleQuery.fetcher(shopifyGraphqlRequestClient, {
      productsAfter: null,
      handle: id,
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

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: 180, // In seconds
  };
};
const GET_ALL_COLLECTION_HANDLES_QUERY = gql`
  query getAllCollectionHandles {
    collections(first: 250) {
      nodes {
        handle
      }
    }
  }
`;
