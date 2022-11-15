import React, { useEffect, useState } from "react";
import Link from "next/link";

import nookies from "nookies";
import clsx from "clsx";
import useMedia from "use-media";

import { Collection, CollectionEdge } from "src/generated/graphql";
import { SHOPIFY_CHECKOUT_ID_COOKIE } from "lib/const";
import { shopifyGraphqlRequestClient } from "src/lib/clients/graphqlRequestClient";

import Bag from "components/Icons/Bag";

import {
  useGetCartItemCountQuery,
  GetCartItemCountQuery,
} from "src/generated/graphql";

interface IProps {
  navData?: CollectionEdge[];
}

const Navigation: React.FC<IProps> = ({ navData }) => {
  const isDesktop = useMedia({ minWidth: "1024px" });
  const [quantity, setQuantity] = useState(0);

  const checkoutId = nookies.get(
    null,
    SHOPIFY_CHECKOUT_ID_COOKIE
  ).shopify_checkoutId;

  const { data, isLoading, error, isSuccess } = useGetCartItemCountQuery<
    GetCartItemCountQuery,
    Error
  >(shopifyGraphqlRequestClient, {
    checkoutId: checkoutId,
  });

  useEffect(() => {
    if (data?.node?.__typename === "Checkout") {
      let count = 0;
      data.node.lineItems.edges.forEach(
        (item) => (count += item.node.quantity)
      );
      setQuantity(count);
    }
  }, [data]);

  return (
    <nav className="sticky w-screen z-50 top-0 left-0 px-4 md:px-8 py-4 flex items-center justify-between border-b border-secondary bg-white list-none ">
      <div className="text-sm md:text-base font-black uppercase hover:text-accent-6">
        <ul className="flex">
          <li className="mr-4">
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>

          <li className="mr-4">
            <Link href="/collections">
              <a>Collections</a>
            </Link>
          </li>

          <li>
            <Link href="/about/">
              <a>About</a>
            </Link>
          </li>
        </ul>
      </div>
      <div className="text-sm md:text-base relative font-bold uppercase cursor-pointer hover:text-accent-6">
        <Link href={`/cart`}>
          <a>
            Cart: {" " + quantity}
            {/* {data?.node?.__typename === "Checkout" &&
              data.node.lineItems.edges.length} */}
          </a>
        </Link>
      </div>
    </nav>
  );
};

export default React.memo(Navigation);
