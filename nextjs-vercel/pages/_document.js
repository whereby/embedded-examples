import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <link
            href="https://d2qulvgqu65efe.cloudfront.net/assets/fonts/whereby-roslindale/WherebyRoslindaleDisplayCondensed-Regular.woff2"
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            href="https://d2qulvgqu65efe.cloudfront.net/assets/fonts/whereby-roslindale/WherebyRoslindaleText-Regular.woff2"
            rel="preload"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            href="https://d2qulvgqu65efe.cloudfront.net/assets/fonts/whereby-fonts.css"
            rel="stylesheet"
            type="text/css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
