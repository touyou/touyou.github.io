import NextHead from "next/head";

export const Head = () => {
  return (
    <NextHead>
      <meta content="width=device-width, initial-scale=1.0" name="viewport" />
      <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
      <meta content="touyou" name="author" />
      <meta content="index, follow" name="robots" />
      <meta content="touyou, touyoubuntu, とうよう, とーよー" name="keywords" />
      <meta content="touyou Fujii Yosuke" name="description" />
      <link
        href="favicon/apple-touch-icon.png"
        rel="apple-touch-icon"
        sizes="180x180"
      />
      <link
        href="favicon/favicon-32x32.png"
        rel="icon"
        sizes="32x32"
        type="image/png"
      />
      <link
        href="favicon/favicon-16x16.png"
        rel="icon"
        sizes="16x16"
        type="image/png"
      />
      <link href="favicon/site.webmanifest" rel="manifest"></link>
      <link
        color="#111111"
        href="favicon/safari-pinned-tab.svg"
        rel="mask-icon"
      />
      <meta content="#eeeeee" name="msapplication-TileColor" />
      <meta content="#ffffff" name="theme-color" />
      <meta content="1200" property="og:image:width" />
      <meta content="628" property="og:image:height" />
      <meta content="https://touyou.dev/" property="og:url" />
      <meta content="https://touyou.dev/og-image.jpg" property="og:image" />
      <meta content="touyou&#39;s portfolio site" property="og:description" />
      <meta content="touyou.dev" property="og:title" />
      <meta content="photo" name="twitter:card" />
      <meta content="103823749687650" property="fb:admins" />
    </NextHead>
  );
};
