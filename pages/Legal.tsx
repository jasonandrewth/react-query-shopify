import React from "react";
import { NextSeo } from "next-seo";
//Layout
import { getLayout } from "components/Layout/Layout";

const Legal = () => {
  return (
    <>
      <NextSeo title="Legal" />

      <section className="px-4 max-w-8xl mx-auto">
        <h1 className="uppercase font-bold text-2xl lg:text-3xl">
          Legal Stuff
        </h1>
      </section>
    </>
  );
};

Legal.getLayout = getLayout;

export default Legal;
