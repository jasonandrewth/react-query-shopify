import React from "react";

import type {
  GetStaticPathsContext,
  GetStaticPropsContext,
  InferGetStaticPropsType,
  NextPageContext,
} from "next";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";

import nookies from "nookies";

import { dehydrate, QueryClient, useQueryClient } from "@tanstack/react-query";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import { getLayout } from "components/Layout/Layout";

//Components
import CartItem from "components/Cart/CartItem";

import {
  useGetCartQuery,
  GetCartQuery,
  GetCartQueryVariables,
  GetCartItemCountQuery,
  CheckoutLineItem,
} from "src/generated/graphql";

const CartPage = (context?: NextPageContext) => {
  const CHECKOUT_ID = "CHECKOUT_ID";

  const checkoutId = nookies.get(context, CHECKOUT_ID).CHECKOUT_ID;

  const { data, isLoading, error, isFetching } = useGetCartQuery<
    GetCartQuery,
    Error
  >(shopifyGraphqlRequestClient, {
    checkoutId: checkoutId,
  });

  if (isLoading) return <h1>loading...</h1>;

  if (error) return <h1>{JSON.stringify(error)}</h1>;

  !checkoutId && <h1>cart empty</h1>;

  if (checkoutId && data) {
    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: "bold" }}>Image</TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Title</TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="center">
              Quantity
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
              align="center"
            >
              Unit Price
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold", whiteSpace: "nowrap" }}
              align="center"
            >
              Total Price
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }} align="right">
              Remove
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            // @ts-ignore
            data.node.lineItems.nodes.map((item: CheckoutLineItem) => (
              <CartItem key={item.id} item={item} />
            ))
          }
        </TableBody>
      </Table>
    );
  }
};

CartPage.getLayout = getLayout;

export default CartPage;
