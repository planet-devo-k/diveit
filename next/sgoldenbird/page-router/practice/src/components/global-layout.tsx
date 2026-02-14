import { ReactNode } from "react";
import Link from "next/link";
import style from "./global-layout.module.css";

// props는 항상 하나의 객체로 전달. 객체 안의 children이라는 속성이 ReactNode 타입임을 명시
export default function GlobalLayout({
  children,
  pageProps,
}: {
  children: ReactNode;
  pageProps?: any;
}) {
  return (
    <div className={style.container}>
      <header className={style.header}>
        <Link href={"/"}>📗 ONEBITE BOOKS</Link>
      </header>
      <main className={style.main}>{children}</main>
      <footer className={style.footer}>제작 @winterlood</footer>
    </div>
  );
}
