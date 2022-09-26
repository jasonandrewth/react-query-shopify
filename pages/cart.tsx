import React, { useEffect } from "react";
import { NextSeo } from "next-seo";

import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPageContext,
} from "next";

import nookies, { destroyCookie } from "nookies";

import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import { getLayout } from "components/Layout/Layout";

//Components
import CartItem from "components/Cart/CartItem";
import Button from "components/UI/Button";
import Loader from "components/UI/Loader";

import {
  useGetCartQuery,
  GetCartQuery,
  GetCartQueryVariables,
  GetCartItemCountQuery,
  CheckoutLineItem,
  useRemoveCartItemMutation,
  RemoveCartItemMutation,
  RemoveCartItemMutationVariables,
} from "src/generated/graphql";

const CartPage = (context?: NextPageContext) => {
  const CHECKOUT_ID = "CHECKOUT_ID";

  const checkoutId = nookies.get(context, CHECKOUT_ID).CHECKOUT_ID;

  const { data, isLoading, error, isSuccess } = useGetCartQuery<
    GetCartQuery,
    Error
  >(shopifyGraphqlRequestClient, {
    checkoutId: checkoutId,
  });

  const emptyMessage = (
    <>
      <NextSeo title="Cart" />
      <h1 className="text-center uppercase font-bold text-2xl">cart empty</h1>
    </>
  );

  useEffect(() => {
    //@ts-ignore
    if (data?.node?.completedAt) {
      console.log("destroy");
      destroyCookie(context, CHECKOUT_ID);
    }
    //@ts-ignore
  }, [data?.node?.completedAt, context]);

  if (!checkoutId) {
    return emptyMessage;
  }

  if (isLoading)
    return (
      <>
        <NextSeo title="Cart" />
        <Loader />
      </>
    );

  if (error)
    return (
      <>
        <NextSeo title="Cart" />
        <div className="flex-1 px-4 flex flex-col justify-center items-center max-w-8xl">
          <h2 className="pt-6 text-xl font-light text-center">
            We couldn’t process the purchase. Please check your card information
            and try again.
          </h2>
        </div>
      </>
    );

  if (data) {
    // @ts-ignore
    if (data?.node?.lineItems?.nodes.length <= 0) {
      return emptyMessage;
    } else {
      if (isSuccess) {
        return (
          <>
            <NextSeo title="Cart" />
            <div className="px-4 sm:px-6 text-xl flex-1 uppercase font-bold">
              My Cart
              {/* <Text variant="pageHeading">My Cart</Text>
        <Text variant="sectionHeading">Review your Order</Text> */}
              <ul className="py-6 space-y-6 sm:py-0 sm:space-y-0 sm:divide-y sm:divide-accent-2 border-b border-accent-2">
                {
                  // @ts-ignore
                  data.node.lineItems.nodes.map((item: CheckoutLineItem) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      checkoutId={checkoutId}
                    />
                  ))
                }
              </ul>
              {
                //@ts-ignore
                data?.node?.lineItems?.nodes.length <= 0 ? (
                  <Button
                    href="/"
                    Component="a"
                    className="py-3 w-full md:w-auto"
                  >
                    Continue Shopping
                  </Button>
                ) : (
                  <Button
                    href={
                      //@ts-ignore
                      data?.node?.webUrl
                    }
                    Component="a"
                    openSeperate
                    className="py-3 md:px-2 md:mt-4 w-full md:w-auto"
                  >
                    Proceed to Checkout
                  </Button>
                )
              }
            </div>
          </>
        );
      }
    }
  }
};

CartPage.getLayout = getLayout;

export default CartPage;
