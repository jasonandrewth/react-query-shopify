import React, { ReactElement, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";

import { gql } from "graphql-request";
import { GraphQLResponse } from "graphql-request/dist/types";

import Nav from "components/Shared/Nav";
import Footer from "components/Shared/Footer";

interface IProps {
  main: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ main }) => {
  useEffect(() => {
    console.log("rerender");
  }, []);

  return (
    <>
      <Nav />
      <main className="relative p-4 mb-10 md:p-6 xl:p-8">{main}</main>
      <Footer />
    </>
  );
};

export const getLayout = (page: ReactElement) => <Layout main={page} />;

export default Layout;
