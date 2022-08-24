import React from "react";

import { dehydrate, QueryClient } from "@tanstack/react-query";

//Layout
import { getLayout } from "components/Layout/Layout";

const About = () => {
  return <div>about</div>;
};

About.getLayout = getLayout;

export default About;

export const getStaticProps = async () => {
  const queryClient = new QueryClient();

  return {
    props: {
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
    revalidate: 180, // In seconds
  };
};
