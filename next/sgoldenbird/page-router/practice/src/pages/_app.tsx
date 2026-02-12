import GlobalLayout from "@/components/global-layout";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import type { ReactNode } from "react";
import type { NextPage } from "next";

// NextPage가 type으로 정의되어 있기 때문에 동일한 이름으로 재선언하여 확장하는 방식의 오버라이딩은 불가능합니다.
// 교차 타입(Intersection Type, &)을 사용하는 방식으로 type을 확장합니다.
type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactNode) => ReactNode;
};

export default function App({
  Component,
  pageProps,
}: AppProps & { Component: NextPageWithLayout }) {
  const getLayout = Component.getLayout ?? ((page: ReactNode) => page);
  return <GlobalLayout>{getLayout(<Component {...pageProps} />)}</GlobalLayout>;
}
