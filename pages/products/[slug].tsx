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
import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Scrollbar, A11y } from "swiper";

import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";

import { useAddItem } from "lib/shopify/CartHooks";

import {
  GetProductBySlugQuery,
  useGetProductBySlugQuery,
  CheckoutLineItemInput,
  CheckoutLineItem,
  ProductVariant,
  useAddCartItemMutation,
  AddCartItemMutation,
  AddCartItemMutationVariables,
  useCreateCartMutation,
  CreateCartMutation,
  CreateCartMutationVariables,
} from "src/generated/graphql";

import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import "swiper/css/effect-flip";

const Product = (context?: NextPageContext) => {
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
  >(graphqlRequestClient, { slug: pid.slug });

  const queryClient = useQueryClient();

  // Create Cart
  const { mutateAsync: mutateCreateCartAsync } = useCreateCartMutation<
    CreateCartMutation,
    Error
  >(graphqlRequestClient, {
    onSuccess: (
      data: AddCartItemMutation,
      _variables: CreateCartMutationVariables,
      _context: unknown
    ) => {
      queryClient.invalidateQueries(useCreateCartMutation.getKey());
      console.log("mutation data", data);
    },
    onError: () => {
      console.log(error);
    },
  });

  const CHECKOUT_ID = "CHECKOUT_ID";

  const {
    mutate,
    isLoading,
    error,
    mutateAsync: mutateCartItemAsync,
  } = useAddCartItemMutation<AddCartItemMutation, Error>(graphqlRequestClient, {
    onSuccess: (
      data: AddCartItemMutation,
      _variables: AddCartItemMutationVariables,
      _context: unknown
    ) => {
      queryClient.invalidateQueries(useAddCartItemMutation.getKey());
      console.log("mutation data", data);
      // setResponse(data);
    },
    onError: () => {
      console.log(error);
    },
  });

  const addItemToCart = async (lineItem: CheckoutLineItemInput) => {
    try {
      const checkoutId = nookies.get(context, CHECKOUT_ID).CHECKOUT_ID;
      await mutateCartItemAsync({ checkoutId: checkoutId, lineItem: lineItem });
      // await ShopifyService.addCartItem({ checkoutId, lineItem });
      console.log("worked, checkoutid:", checkoutId);
    } catch (error) {
      const { checkoutCreate } = await mutateCreateCartAsync({
        input: { lineItems: [lineItem] },
      });

      nookies.set(context, CHECKOUT_ID, checkoutCreate?.checkout?.id!, {
        maxAge: 30 * 24 * 60 * 60,
      });
      console.log("error");
    }
  };

  const product = data?.productByHandle;

  const [state, setState] = React.useState<{
    variant: string;
    quantity: number;
  }>({
    variant: product?.variants?.nodes[0]?.id,
    quantity: 1,
  });

  if (isLoadingProduct) return <p>Loading...</p>;
  if (productError) return <p>Boom boy{productError.message}</p>;

  if (!product) router.replace("/");

  const pagination = {
    clickable: true,
    renderBullet: function (index, className) {
      return '<span class="' + className + '">' + (index + 1) + "</span>";
    },
  };

  return (
    <div className="grid grid-cols-2">
      <div>
        <Swiper
          // install Swiper modules
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={1}
          centeredSlides={true}
          navigation
          pagination={pagination}
          onSwiper={(swiper) => console.log(swiper)}
          onSlideChange={() => console.log("slide change")}
        >
          {product?.images?.nodes?.map((image) => {
            return (
              <SwiperSlide key={image.altText}>
                <Image
                  src={image.url}
                  alt={image.altText}
                  width={500}
                  height={500}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="flex flex-col">
        <h1>{product?.title}</h1>
        {product?.description}
        <h1>Variants</h1>
        {product?.variants?.nodes?.map((variant) => {
          if (variant.title !== "Default Title") {
            return (
              <>
                <h2>{variant.title}</h2>
                <h2>{variant.availableForSale && "forSale"}</h2>
                <div>
                  {variant.selectedOptions.map((option) => option.name)}
                </div>
              </>
            );
          }
        })}

        <button
          onClick={async () => {
            await addItemToCart({
              quantity: state.quantity,
              variantId: product?.variants?.nodes[0]?.id,
            });

            // setState({
            //   quantity: state.quantity + 1,
            //   variant: product.variants.nodes[0].id,
            // });
          }}
        >
          Buy
        </button>
      </div>
    </div>
  );
};

export default Product;

export async function getStaticPaths() {
  // Return a list of possible value for slug
  const { products } = await graphqlRequestClient.request(
    GET_ALL_PROD_HANDLES_QUERY
  );

  return {
    paths: products.nodes.map((product: any) => `/products/${product.handle}`),
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
    useGetProductBySlugQuery.fetcher(graphqlRequestClient, { slug: slug })
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
