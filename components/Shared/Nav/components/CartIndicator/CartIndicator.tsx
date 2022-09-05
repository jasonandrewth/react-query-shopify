import { memo } from "react";
import Link from "next/link";
import nookies from "nookies";

import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import Bag from "components/Icons/Bag";

import {
  useGetCartItemCountQuery,
  GetCartItemCountQuery,
} from "src/generated/graphql";

const CartIndicator = () => {
  const CHECKOUT_ID = "CHECKOUT_ID";

  const checkoutId = nookies.get(null, CHECKOUT_ID).CHECKOUT_ID;

  const { data, isLoading, error, isSuccess } = useGetCartItemCountQuery<
    GetCartItemCountQuery,
    Error
  >(shopifyGraphqlRequestClient, {
    checkoutId: checkoutId,
  });

  if (!checkoutId) {
    console.log("no checkout id");
    return (
      <div className="relative font-bold uppercase text-xl cursor-pointer">
        <Link href={`/cart`}>
          <a>
            <Bag width={20} height={20} />
          </a>
        </Link>
      </div>
    );
  }

  if (error) {
    console.log(error.name, error.message);
    return (
      <div className="font-bold uppercase text-xl cursor-pointer">
        <Link href={`/cart`}>
          <a>
            <Bag width={20} height={20} />
          </a>
        </Link>
      </div>
    );
  }

  console.log("countCart", data);

  return (
    <div className="relative font-bold uppercase text-xl cursor-pointer">
      <Link href={`/cart`}>
        <a>
          <Bag width={20} height={20} />{" "}
          {
            //@ts-ignore
            data?.node?.lineItems?.edges?.length ? (
              <div className="rounded-full bg-pink w-3 h-3 absolute -top-1/2 -right-1/2 translate-y-1/2 -translate-x-1/2" />
            ) : null
          }
        </a>
      </Link>
    </div>
  );
};

export default CartIndicator;
