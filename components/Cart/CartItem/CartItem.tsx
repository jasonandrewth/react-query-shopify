import { ChangeEvent, FocusEventHandler, useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Link from "next/link";
import Image from "next/image";

import nookies from "nookies";

import { formatPrice } from "lib/shopify/usePrice";

import {
  useGetCartQuery,
  useGetCartItemCountQuery,
  CheckoutLineItem,
  useRemoveCartItemMutation,
  RemoveCartItemMutation,
  RemoveCartItemMutationVariables,
  useUpdateCartItemMutation,
  UpdateCartItemMutation,
  UpdateCartItemMutationVariables,
} from "src/generated/graphql";

import { useQueryClient } from "@tanstack/react-query";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import s from "./CartItem.module.css";
import clsx from "clsx";

import { CART_QUERY, CART_ITEM_COUNT_QUERY } from "lib/const";

//Component
import { Cross } from "components/Icons";
import Adder from "components/UI/Adder";

interface IProps {
  item: CheckoutLineItem;
  checkoutId: string;
}

type ItemOption = {
  name: string;
  nameId: number;
  value: string;
  valueId: number;
};

export const CartItem: React.FC<IProps> = ({ item, checkoutId }) => {
  const [removing, setRemoving] = useState(false);
  const [quantity, setQuantity] = useState<number>(item.quantity);

  const queryClient = useQueryClient();

  function refetchCart() {
    queryClient.invalidateQueries(
      useGetCartQuery.getKey({ checkoutId: checkoutId })
    );
    queryClient.invalidateQueries(
      useGetCartItemCountQuery.getKey({ checkoutId: checkoutId })
    );
  }

  const {
    mutate,
    isLoading,
    error,
    mutateAsync: removeCartItemAsync,
  } = useRemoveCartItemMutation<RemoveCartItemMutation, Error>(
    shopifyGraphqlRequestClient,
    {
      onSuccess: refetchCart,
      onError: () => {
        console.error(error);
      },
    }
  );

  const {
    isLoading: updating,
    error: updateError,
    mutateAsync: updateCartItemAsync,
  } = useUpdateCartItemMutation<UpdateCartItemMutation, Error>(
    shopifyGraphqlRequestClient,
    {
      onSuccess: () => {
        console.log("success updating");
        refetchCart();
      },
      onError: () => {
        setQuantity(item.quantity);
      },
    }
  );

  const handleRemove = async () => {
    setRemoving(true);
    try {
      await removeCartItemAsync({
        checkoutId: checkoutId,
        lineItemId: item.id,
      });
    } catch (error) {
      setRemoving(false);
    }
  };

  const handleUpdate = async (quantity: number) => {
    try {
      await updateCartItemAsync({
        checkoutId: checkoutId,
        lineItem: { quantity: 3 },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useDebounce(
    () => {
      if (item.quantity !== quantity) {
        handleUpdate(quantity);
      }
    },
    2000,
    [quantity, item.quantity]
  );

  return (
    <li
      className={clsx(s.root, {
        "opacity-50 pointer-events-none": removing,
      })}
    >
      <div className="flex flex-row items-center space-x-4 py-4">
        <div className="w-16 h-16 relative overflow-hidden cursor-pointer z-0">
          <Link href={`/products/${item.variant.product.handle}`}>
            <a>
              <Image
                className={s.productImage}
                width={150}
                height={150}
                src={item.variant.image.url}
                alt={item.variant.image!.altText}
                unoptimized
              />
            </a>
          </Link>
        </div>
        <div className="flex-1 flex flex-col text-base">
          <Link href={`/products/${item.variant.product.handle}`}>
            <a>
              <span className={s.productName}>{item.title}</span>
            </a>
          </Link>
          <span className="text-sm font-normal tracking-wider">
            x{item.quantity}
          </span>
          {item.variant.selectedOptions &&
            item.variant.selectedOptions.length > 0 && (
              <div className="flex items-center pb-1">
                {item.variant.selectedOptions.map(
                  (option: ItemOption, i: number) => (
                    <div
                      key={`${item.id}-${option.name}`}
                      className="text-sm font-semibold text-accent-7 inline-flex items-center justify-center"
                    >
                      {option.name}
                      {option.name === "Color" ? (
                        <span
                          className="mx-2 rounded-full bg-transparent border w-5 h-5 p-1 text-accent-9 inline-flex items-center justify-center overflow-hidden"
                          style={{
                            backgroundColor: `${option.value}`,
                          }}
                        ></span>
                      ) : (
                        <span className="mx-2 rounded-full bg-transparent border h-5 p-1 text-accent-9 inline-flex items-center justify-center overflow-hidden">
                          {option.value}
                        </span>
                      )}
                      {i === item.variant.selectedOptions.length - 1 ? (
                        ""
                      ) : (
                        <span className="mr-3" />
                      )}
                    </div>
                  )
                )}
              </div>
            )}
          {item.variant.title === "display" && (
            <div className="text-sm tracking-wider">{quantity}x</div>
          )}
        </div>
        <div className="flex flex-col justify-between space-y-2 text-sm">
          <span>
            {formatPrice({
              amount: item.variant.priceV2.amount * item.quantity,
              currencyCode: item.variant.priceV2.currencyCode,
            })}
          </span>
        </div>
        <button onClick={handleRemove} className="">
          <Cross width={24} height={24} />
        </button>
      </div>
      {/* <Adder
        amount={quantity}
        add={() => setQuantity((prev) => prev + 1)}
        subtract={() => setQuantity((prev) => prev - 1)}
      /> */}
    </li>
  );
};

export default CartItem;
