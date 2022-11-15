import React, { ReactElement, useEffect } from "react";

import { gql } from "graphql-request";

import { useUI } from "components/UI/context";

//components
import Nav from "components/Shared/Nav";
import Footer from "components/Shared/Footer";

interface IProps {
  main: React.ReactNode;
}

const Layout: React.FC<IProps> = ({ main }) => {
  return (
    <>
      <Nav />
      <main
        // math >.<
        className={
          "relative py-4 px-4 pb-20 md:px-6 xl:px-8 lg:py-8 lg:pb-16 lg:mb-0 min-h-[calc(100vh-110px)] "
        }
      >
        {main}
      </main>
      <Footer />
    </>
  );
};

export const getLayout = (page: ReactElement) => <Layout main={page} />;

export default Layout;
