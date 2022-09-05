import React from "react";
import Link from "next/link";
import Image from "next/image";

import InfiniteScroll from "react-infinite-scroll-component";
import {
  InfiniteData,
  FetchNextPageOptions,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import {
  Product,
  GetAllProductsQuery,
  GetCollectionByHandleQuery,
  useGetAllProductsQuery,
  useInfiniteGetAllProductsQuery,
} from "src/generated/graphql";

import { formatPrice } from "lib/shopify/usePrice";

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
}

const ProductGrid: React.FC<IProps> = ({ productData }) => {
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
        <div className="grid-container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 mx-auto px-2 lg:px-0">
          {productData?.pages?.map((page, idx) => (
            <React.Fragment key={`page-${page.__typename}-${idx}`}>
              {page?.products?.nodes.map((product, idx) => {
                const productImage = product?.featuredImage || null;
                return (
                  <article
                    key={`product-${product?.id}-${idx}`}
                    className="shadow-xl lg:shadow-none lg:hover:shadow-xl rounded-lg border border-black overflow-hidden transition-all duration-200 ease-in-out"
                  >
                    <Link href={`/products/${product.handle}`}>
                      <a>
                        {productImage && (
                          <Image
                            src={productImage.url}
                            alt={productImage.altText}
                            width={500}
                            height={500}
                            blurDataURL={productImage.url} //automatically provided
                            placeholder="blur" // Optional blur-up while loading
                            className="rounded-t-md"
                          />
                        )}

                        <div className="grid grid-cols-4 max-w-[500px] bg-white text-black font-bold uppercase px-4 py-2">
                          <div className="col-span-3">
                            {product.title && (
                              <h2 className="whitespace-normal m-0 p-0 pr-2">
                                {product.title}
                              </h2>
                            )}
                          </div>

                          <div className="col-span-1 border-none border-black flex items-center justify-end">
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
              })}
            </React.Fragment>
          ))}
        </div>
      </InfiniteScroll>
    );
  } else <div>{JSON.stringify(error)}</div>;
};

export default ProductGrid;
