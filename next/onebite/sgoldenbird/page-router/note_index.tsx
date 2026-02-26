// @ts-nocheck
/* eslint-disable */

import SearchableLayout from "@/components/searchable-layout";
// style 객체에 저장
import style from "./index.module.css";
import { useEffect, type ReactNode } from "react";
// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import type { InferGetServerSidePropsType } from "next";
import fetchBooks from "@/lib/fetch-books";
import fetchRandomBooks from "@/lib/fetch-random-books";

// getServerSideProps 선언, export -> index.tsx페이지는 SSR 사전렌더링이 이뤄진다.
// 페이지 역할하는(Home) 컴포넌트보다 먼저 실행. 필요한 데이터를 불러오는 등 기능
// index페이지 요청 -> getServerSideProps -> Home
// 사전렌더링하는 과정에서 한번만 실행. 서버측에서만 실행
export const getServerSideProps = async () => {
  console.log("서버사이드프롭스");

  /*
  각각 기다렸다 받기보단 아래처럼 병렬로 받는다. 
  const allBooks = await fetchBooks();
  const recoBooks = await fetchRandomBooks();
  */

  const [allBooks, recoBooks] = await Promise.all([
    fetchBooks(),
    fetchRandomBooks(),
  ]);

  // getServerSideProps의 리턴값은 props 프로퍼티를 포함하는 하나의 객체여야함
  // 그래야 next가 props를 페이지 역할하는 컴포넌트에 전달
  return {
    props: {
      allBooks,
      recoBooks,
    },
  };
};

// 서버에서 한번 실행된(사전렌더링) 후 브라우저에서도 실행(하이드레이션) -> 콘솔 서버랑 브라우저 둘 다 출력
export default function Home({
  allBooks,
  recoBooks,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  // window 사용 못함 -> 서버에서도 한번 실행되니까
  console.log(allBooks);

  // 브라우저에서만 실행하는 코드
  useEffect(() => {
    console.log(window);
  }, []);

  return (
    <div className={style.container}>
      <section>
        <h3>지금 추천하는 도서</h3>
        {recoBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <section>
        <h3>등록된 모든 도서</h3>
        {allBooks.map((book) => (
          <BookItem key={book.id} {...book} />
        ))}
      </section>
      <h1 className={style.h1}>인덱스</h1>
    </div>
  );
}

// Home 컴포넌트(=Home함수=Home객체)에 적용할 getLayout 메서드
// Home 함수 내부에 선언하면 Home이 렌더링될 때마다 매번 새로 생성되는 지역 함수가 됩니다. -> 외부에서 Home.getLayout으로 접근할 수 없습니다.
Home.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
