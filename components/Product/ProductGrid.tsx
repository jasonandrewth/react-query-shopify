import React from "react";
import Link from "next/link";
import Image from "next/image";

import InfiniteScroll from "react-infinite-scroll-component";
import {
  InfiniteData,
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";

import {
  Product,
  GetAllProductsQuery,
  GetCollectionByHandleQuery,
  useGetAllProductsQuery,
  useInfiniteGetAllProductsQuery,
} from "src/generated/graphql";

interface IProps {
  productData: InfiniteData<GetAllProductsQuery>;
  fetchNextPage?: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      GetCollectionByHandleQuery | GetAllProductsQuery,
      Error
    >
  >;
  hi?: string;
}

const ProductGrid: React.FC<IProps> = ({ productData }) => {
  const { isLoading, error, data, isSuccess, fetchNextPage, hasNextPage } =
    useInfiniteGetAllProductsQuery<GetAllProductsQuery, Error>(
      "after",
      graphqlRequestClient,
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

  if (isLoading) return <h1>loading...</h1>;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  if (isSuccess) {
    return (
      <InfiniteScroll
        dataLength={productData?.pages?.length * 20}
        next={fetchNextPage}
        hasMore={hasNextPage}
        loader={<h4>Loading...</h4>}
      >
        <div className="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {productData?.pages?.map((page) => (
            <>
              {page?.products?.nodes.map((product) => {
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
    );
  } else <div>{JSON.stringify(error)}</div>;
};

export default ProductGrid;
