import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <head
        dangerouslySetInnerHTML={{
          __html: `<!-- /*   .o######0o.
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
            */ -->`,
        }}
      ></head>
      <Head>
        <link
          rel="preload"
          href="/fonts/EduFavorit/EduFavorit-Regular.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
