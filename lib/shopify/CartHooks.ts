import { CheckoutCreatePayload } from "./../../src/generated/graphql";
import { useState, useEffect } from "react";
import { NextPageContext } from "next";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";
import nookies from "nookies";
import formatTitle from "title";
import { useQueryClient } from "@tanstack/react-query";
import { gql } from "graphql-request";

import {
  CheckoutLineItemInput,
  CheckoutLineItem,
  useAddCartItemMutation,
  AddCartItemMutation,
  AddCartItemMutationVariables,
  useCreateCartMutation,
  CreateCartMutation,
  CreateCartMutationVariables,
} from "src/generated/graphql";

const CHECKOUT_ID = "CHECKOUT_ID";

export const useAddItem = async (
  lineItem: CheckoutLineItemInput,
  context?: NextPageContext
): Promise<void> => {
  const [response, setResponse] = useState({});

  const queryClient = useQueryClient();

  // Create Cart
  const { mutateAsync: mutateCreateCartAsync } = useCreateCartMutation<
    CreateCartMutation,
    Error
  >(shopifyGraphqlRequestClient, {
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

  const {
    mutate,
    isLoading,
    error,
    mutateAsync: mutateCartItemAsync,
  } = useAddCartItemMutation<AddCartItemMutation, Error>(
    shopifyGraphqlRequestClient,
    {
      onSuccess: (
        data: AddCartItemMutation,
        _variables: AddCartItemMutationVariables,
        _context: unknown
      ) => {
        queryClient.invalidateQueries(useAddCartItemMutation.getKey());
        console.log("mutation data", data);
        setResponse(data);
      },
      onError: () => {
        console.log(error);
      },
    }
  );

  // return {mutateCartItemAsync}

  try {
    const checkoutId = nookies.get(context, CHECKOUT_ID).CHECKOUT_ID;
    await mutateCartItemAsync({ checkoutId: checkoutId, lineItem: lineItem });
    // await ShopifyService.addCartItem({ checkoutId, lineItem });
  } catch (error) {
    const { checkoutCreate } = await mutateCreateCartAsync({
      input: { lineItems: [lineItem] },
    });

    nookies.set(context, CHECKOUT_ID, checkoutCreate?.checkout?.id!, {
      maxAge: 30 * 24 * 60 * 60,
    });
  }
};
