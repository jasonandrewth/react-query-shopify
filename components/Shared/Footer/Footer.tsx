import React from "react";

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="p-4 border-t border-secondary flex justify-between">
      <ul className="flex gap-4 font-black ">
        <li className=" hover:text-accent-5 transition-all duration-150 ease-linear">
          <Link href="/shipping">
            <a>Shipping</a>
          </Link>
        </li>
        <li className=" hover:text-accent-5 transition-all duration-150 ease-linear">
          <Link href="/Legal">
            <a>Legal</a>
          </Link>
        </li>
      </ul>
      <a
        href="https://github.com/jasonandrewth/react-query-shopify"
        rel="noreferrer"
        target={"_blank"}
      >
        <span className="font-black">Shopify React Query</span>
      </a>
    </footer>
  );
};

export default Footer;
