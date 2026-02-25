// import books from "@/mock/books.json";
import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import type { BookData } from "@/types";
import { delay } from "@/util/delay";
import type { Metadata } from "next";
import { Suspense } from "react";

async function SearchResult({ query }: { query: string }) {
  // await delay(1500);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/book/search?q=${query}`,
    {
      cache: "force-cache",
    },
  );

  if (!response.ok) {
    return <div>오류가 발생했습니다...</div>;
  }

  const books: BookData[] = await response.json();

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}): Promise<Metadata> {
  // 현재 페이지의 메타데이터를 동적으로 생성하는 역할.
  // Page컴포넌트가 전달받는 매게변수 props를 그대로 전달받을 수 있다.
  const { q } = await searchParams;

  return {
    title: `${q}: 한입북스 검색`,
    description: `${q}의 검색 결과입니다`,
    openGraph: {
      title: `${q}: 한입북스 검색`,
      description: `${q}의 검색 결과입니다`,
      images: ["/thumbnail.png"],
    },
  };
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string;
  }>;
}) {
  const { q } = await searchParams;
  const query = q || "";

  return (
    <Suspense key={query} fallback={<BookListSkeleton count={3} />}>
      <SearchResult query={query} />
    </Suspense>
  );
}
