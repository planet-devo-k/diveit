import "../styles/globals.css";
import type { AppProps } from "next/app";

// 모든 페이지 역할 컴포넌트들의 부모 역할(루트 컴포넌트. 리액트의 app.tsx 역할)
export default function App({ Component, pageProps }: AppProps) {
  // Component: 페이지 컴포넌트를 받는다.
  // 페이지 컴포넌트에 전달될 page props를 객체로 보관한 것
  return (
    <>
      <header>글로벌 헤더</header>
      <Component {...pageProps} />;
    </>
  );
  // 공통 요소 추가
}
