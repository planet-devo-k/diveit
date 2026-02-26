import { Html, Head, Main, NextScript } from "next/document";

// 모든 페이지에 공통 적용 HTML 설정(리액트의 index.html과 비슷한 역할)
// meta tag, GA 같은 3rd party script 삽입, font 설정 등
export default function Document() {
  return (
    <Html lang="kr">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
