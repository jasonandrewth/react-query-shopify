import React from "react";
import { NextSeo } from "next-seo";

import { dehydrate, QueryClient } from "@tanstack/react-query";

//Layout
import { getLayout } from "components/Layout/Layout";

const About = () => {
  return (
    <>
      <NextSeo title="About" />

      <section className="px-4 max-w-8xl mx-auto">
        <h1 className="uppercase font-bold text-2xl lg:text-3xl">
          Static About
        </h1>
        <p className="mt-3 lg:mt-4 lg:text-xl max-w-[850px] 2xl:max-w-[1312px]">
          Du siehst mich nie zweimal in den selben Klamotten / Und nach ein Mal
          driven lass ich meinen Maybach verschrotten / Socken und Unterhosen
          werden nicht gewaschen / Ein Mal rocken und am nächsten Tag frische
          Sachen / Ich bin frisch, wie die Fische die wo Fischers Fritze fischen
          tut / Louis Belt, Armani Shirt und ein Gucci Fischerhut / Flyer als
          ein Zeppelin, oder als ein Pelikan / Ich bin jetzt am ballen wie ne
          Kugel auf ner Kegelbahn
        </p>

        <a
          href="https://www.jason-andrew.com/"
          rel="noreferrer"
          target={"_blank"}
          className="block pt-4 italic hover:text-accent-6"
        >
          <span className="block pt-4">Jason Andrew © 2022</span>
        </a>

        <a
          href="https://github.com/jasonandrewth/react-query-shopify"
          rel="noreferrer"
          target={"_blank"}
          className="block pt-4 italic hover:text-accent-6"
        >
          Find The Source on Github
        </a>
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
