import React from "react";
import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPageContext,
} from "next";

import nookies from "nookies";

import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import graphqlRequestClient from "src/lib/clients/graphqlRequestClient";

import Layout from "components/Layout";

import {
  useGetCartQuery,
  GetCartQuery,
  GetCartQueryVariables,
  GetCartItemCountQuery,
  CheckoutLineItem,
} from "src/generated/graphql";

const Cart = (context?: NextPageContext) => {
  const CHECKOUT_ID = "CHECKOUT_ID";

  const checkoutId = nookies.get(context, CHECKOUT_ID).CHECKOUT_ID;

  console.log(checkoutId);

  const { data, isLoading, error, isFetching } = useGetCartQuery<
    GetCartQuery,
    Error
  >(graphqlRequestClient, {
    checkoutId: checkoutId,
  });

  if (isLoading) return <h1>loading...</h1>;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  !checkoutId && <h1>cart empty</h1>;

  if (checkoutId && data) {
    return (
      <Layout
        main={
          <div>
            <ul>
              {
                // @ts-ignore
                data.node.lineItems.nodes.map((lineItem: CheckoutLineItem) => {
                  return (
                    <li key={lineItem.id}>
                      {lineItem.title}{" "}
                      <span className="text-red-700">{lineItem.quantity}</span>
                    </li>
                  );
                })
              }
            </ul>
          </div>
        }
      />
    );
  }
};

export default Cart;
