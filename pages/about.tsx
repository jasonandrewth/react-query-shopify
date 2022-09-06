import React from "react";
import { NextSeo } from "next-seo";

import { dehydrate, QueryClient } from "@tanstack/react-query";

//Layout
import { getLayout } from "components/Layout/Layout";

const About = () => {
  return (
    <>
      <NextSeo title="About" />

      <section className="px-4 max-w-[1920px] mx-auto">
        <h1 className="uppercase font-bold text-2xl mb-3">About</h1>
        <p className="mt-3 lg:mt-5 max-w-[850px] 2xl:max-w-[1312px]">
          Ved tidenes morgen delte en fjord seg og sprutet ut vulkansk stein,
          som en salamander med vinger steg opp fra. Han tilintetgjorde tusenvis
          av hærer og slukte sjelene til millioner. Det ble ført en krig for å
          stoppe ham, men intet menneske og ingen algoritme kunne beseire ham.
          Til den dag i dag hersker han over alt fra sitt bevoktede domene,
          plassert på et taggete fjell av blod og tårer. Navnet hans er Ben
          Ditto.
        </p>
      </section>
    </>
  );
};

About.getLayout = getLayout;

export default About;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 20, // In seconds
  };
};
