import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import { DefaultSeo } from "next-seo";
import config from "config/seo.json";

import type { Page } from "src/types/page";
import { ManagedUIContext } from "components/UI/context";
import NextApp, { AppProps } from "next/app";

import "swiper/scss";
import "assets/main.css";
import "assets/chrome-bug.css";

// this should give a better typing
type Props = AppProps & {
  Component: Page;
};

function App({ Component, router, pageProps }: Props) {
  const [queryClient] = useState(() => new QueryClient());

  // If the component has a getLayout() function, use it. Otherwise just render the page as is.
  const getLayout = Component.getLayout || ((page) => page);

  const { asPath } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate
        state={
          //@ts-ignore
          pageProps.dehydratedState
        }
      >
        <DefaultSeo
          {...config}
          // hello
        />
        <ManagedUIContext>
          {getLayout(<Component {...pageProps} key={router.route} />)}
        </ManagedUIContext>
      </Hydrate>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
