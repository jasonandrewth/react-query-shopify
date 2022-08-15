import { useState } from "react";
import Head from "next/head";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import type { Page } from "src/types/page";
import Layout from "components/Layout";

import NextApp, { AppProps } from "next/app";

import "../styles/globals.css";
import "swiper/scss";

// this should give a better typing
type Props = AppProps & {
  Component: Page;
};

function App({
  Component,
  pageProps: { session, dehydratedState, ...pageProps },
}: Props) {
  const [queryClient] = useState(() => new QueryClient());

  // If the component has a getLayout() function, use it. Otherwise just render the page as is.
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        {getLayout(<Component {...pageProps} />)}
      </Hydrate>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
