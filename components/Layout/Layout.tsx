import React, { ReactElement, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import clsx from "clsx";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";

import { useUI } from "components/UI/context";
//components
import Nav from "components/Shared/Nav";
import Footer from "components/Shared/Footer";

interface IProps {
  main: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ main }) => {
  const { displayMenu } = useUI();

  useEffect(() => {
    console.log("rerender");
  }, []);

  return (
    <>
      <Nav />
      <main
        className={clsx(
          displayMenu ? "mt-[183px]" : "mt-[120px]",
          "relative px-4 pt-6 mb-16 md:px-6 xl:px-8 transition-all duration-300 ease-in-out"
        )}
      >
        {main}
      </main>
      <Footer />
    </>
  );
};

export const getLayout = (page: ReactElement) => <Layout main={page} />;

export default Layout;
