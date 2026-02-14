import "./globals.css";
import Link from "next/link";
import style from "./layout.module.css";
import type { BookData } from "@/types";

async function Footer() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book`,
    { cache: "force-cache" }, //-> full route cache로 만들기 위해 force-cache
  );
  if (!response.ok) {
    return <footer>제작 @winterlood</footer>;
  }

  const books: BookData[] = await response.json();
  const bookCount = books.length;

  return (
    <footer>
      <div>제작 @winterlood</div>
      <div>{bookCount}개의 도서가 등록되어 있습니다.</div>
    </footer>
  );
}

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className={style.container}>
          <header>
            <Link href={"/"}>📚 ONEBITE BOOKS</Link>
          </header>
          <main>{children}</main>
          <Footer />
        </div>
        {/* children과 modal을 parallel 렌더링 */}
        {modal}
        <div id="modal-root"></div>
      </body>
    </html>
  );
}

/*
사용자가 book/1 로 접속한다면 원래는 book/1/page.tsx가 렌더링되야하지만 
intercepting route가 동작하고 있으므로 
children은 그냥 기존의 페이지를(상세페이지 클릭 전 페이지) 유지한다. 
그리고 modal이란 값에 intercepting된 페이지 컴포넌트가 들어온다. @/modal/(.)book/[id]/page.tsx
이때 children과 modal(@/modal/(.)book/[id]/page.tsx)이 병렬로 렌더링된다. 
*/
