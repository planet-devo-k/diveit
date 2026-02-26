import BookItem from "@/components/book-item";
import SearchableLayout from "@/components/searchable-layout";
import { useRouter } from "next/router";
import { ReactNode } from "react";
// import books from "@/mock/books.json";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import fetchBooks from "@/lib/fetch-books";
import Head from "next/head";

// query를 읽어와서 해당 q 데이터 받아와야함
// context 매개변수: 브라우저로부터 받은 모든 정보 포함
export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  console.log(context); //서버 출력
  const query = context.query.q;

  const books = await fetchBooks(query as string);

  return {
    props: {
      books,
    },
  };
};

export default function Page({
  books,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter(); // 라우팅 관련 대부분의 정보 저장되어 있다.
  console.log(router);

  const { q } = router.query;

  return (
    <div>
      <Head>
        <title>한입북스 - 검색결과</title>
        <meta property="og:image" content="/thumbnail.png" />
        <meta property="og:title" content="한입북스 - 검색결과" />
        <meta
          property="og:description"
          content="한입 북스에 등록된 도서들을 만나보세요"
        />
      </Head>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

Page.getLayout = (page: ReactNode) => {
  return <SearchableLayout>{page}</SearchableLayout>;
};
