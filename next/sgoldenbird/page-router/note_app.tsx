// @ts-nocheck
/* eslint-disable */

import "../styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

// 모든 페이지 역할 컴포넌트들의 부모 역할(루트 컴포넌트. 리액트의 app.tsx 역할)
export default function App({ Component, pageProps }: AppProps) {
  // Component: 페이지 컴포넌트를 받는다.
  // 페이지 컴포넌트에 전달될 page props를 객체로 보관한 것

  const router = useRouter();

  const onClickButton = () => {
    router.push("/test");
  };

  useEffect(() => {
    router.prefetch("/test");
  }, []);

  return (
    <div>
      <header>
        <Link href={"/"}>index</Link>
        &nbsp;
        <Link href={"/search"} prefetch={false}>
          search
        </Link>
        &nbsp;
        <Link href={"/book/1"}>book/1</Link>
        <div>
          <button onClick={onClickButton}>/test 페이지로 이동</button>
        </div>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
      <footer>푸터</footer>
    </div>
  );
  // 공통 요소 추가
}
