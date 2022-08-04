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

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";
import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";

import { dehydrate, QueryClient } from "@tanstack/react-query";

import {
  useGetCollectionByHandleQuery,
  GetCollectionByHandleQuery,
  useInfiniteGetCollectionByHandleQuery,
  Collection,
} from "src/generated/graphql";

const Collection = () => {
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
    graphqlRequestClient,
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
    <>
      {isSuccess && (
        <InfiniteScroll
          dataLength={hasNextPage ? data?.pages?.length * 20 : 20}
          next={fetchNextPage}
          hasMore={hasNextPage}
          loader={<h4>Loading...</h4>}
        >
          <div className="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data?.pages?.map((page) => (
              <>
                {page?.collectionByHandle?.products?.nodes.map((product) => {
                  const productImage = product?.featuredImage || null;
                  return (
                    <article key={product?.id} className="relative">
                      <Link scroll={false} href={`/products/${product.handle}`}>
                        <a>
                          {product.title && (
                            <h1
                              className="inline-block absolute left-0 bottom-0 p-4 z-40 bg-white text-black"
                              key={product.id}
                            >
                              {product.title}
                            </h1>
                          )}
                          {productImage && (
                            <Image
                              src={productImage.url}
                              alt={productImage.altText}
                              width={500}
                              height={500}
                              blurDataURL={productImage.url} //automatically provided
                              placeholder="blur" // Optional blur-up while loading
                            />
                          )}
                        </a>
                      </Link>
                    </article>
                  );
                })}
              </>
            ))}
          </div>
        </InfiniteScroll>
      )}
    </>
  );
};

export default Collection;

export async function getStaticPaths() {
  // Return a list of possible value for id
  const { collections } = await graphqlRequestClient.request(
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
    useGetCollectionByHandleQuery.fetcher(graphqlRequestClient, {
      productsAfter: null,
      handle: id,
    })
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
