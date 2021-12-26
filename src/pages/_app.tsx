import type { AppProps } from "next/app";
import { css } from "@linaria/core";
import { Head } from "components/common/Head";

export const globals = css`
  :global() {
    body {
      margin: 0;
      padding: 0;
      font-family: "Noto Sans JP", sans-serif;
    }
  }
`;

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head />
      <Component {...pageProps} />
    </>
  );
}
