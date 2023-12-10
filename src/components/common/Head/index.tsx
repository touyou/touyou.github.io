import NextHead from "next/head";
import { FC } from "react";

export const Head: FC = () => {
  return (
    <NextHead>
      <meta content="ie=edge" httpEquiv="X-UA-Compatible" />
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
      <meta content="103823749687650" property="fb:admins" />
    </NextHead>
  );
};
