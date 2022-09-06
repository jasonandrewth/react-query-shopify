import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { motion, AnimatePresence } from "framer-motion";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DefaultSeo } from "next-seo";
import config from "config/seo.json";

import type { Page } from "src/types/page";
import { ManagedUIContext } from "components/UI/context";
import NextApp, { AppProps } from "next/app";

import "swiper/scss";
import "assets/main.css";
import "assets/chrome-bug.css";

const variants = {
  in: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.1,
      delay: 0.01,
    },
  },
  out: {
    opacity: 0,
    scale: 1,
    y: 10,
    transition: {
      duration: 0.1,
    },
  },
};

// this should give a better typing
type Props = AppProps & {
  Component: Page;
};

function App({
  Component,
  router,
  pageProps: { session, dehydratedState, ...pageProps },
}: Props) {
  const [queryClient] = useState(() => new QueryClient());

  // If the component has a getLayout() function, use it. Otherwise just render the page as is.
  const getLayout = Component.getLayout || ((page) => page);

  useEffect(() => {
    console.log(
      `  
           .o######0o.
          0###########0.      .
         o####" "######0.    (## m#o
         ####(    ######0  ._ ##.##"nn
         0####o   ###" ## (##o.######"
  o00o.    0#####o,##. ,#"  "#######(
  .0#####0.   0###########0     ########
  .0#######0.   "0#########"  _.o###'"00"
  .0###########o._ ""################       _  .
  0####" "#########################0      .0#0n0
  #####.   ""#####################"    _  0#####
  0#####.     "###################._.o##o.#####"
  "0#####..##mn ""#############################
  "0#######""_    ""##################"#####"
  ""####m###m      ""############"   ####
  .########"""         .########"     "##"
  ####"##"###o        (0######"        ""
  "##".###,##     .o#o ""####.
      "##"      .0############.
              .n##======####### 
   
   WEB BY JASON ANDREW jason-andrew.com
   `
    );
  }, []);

  const { asPath } = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={dehydratedState}>
        <DefaultSeo
          {...config}
          // hello
        />
        <ManagedUIContext>
          {getLayout(
            <AnimatePresence initial={false} mode="wait">
              <motion.div
                key={asPath}
                variants={variants}
                animate="in"
                initial="out"
                exit="out"
              >
                <Component {...pageProps} key={router.route} />
              </motion.div>
            </AnimatePresence>
          )}
        </ManagedUIContext>
      </Hydrate>
      {/* <ReactQueryDevtools initialIsOpen={false} /> */}
    </QueryClientProvider>
  );
}

export default App;
