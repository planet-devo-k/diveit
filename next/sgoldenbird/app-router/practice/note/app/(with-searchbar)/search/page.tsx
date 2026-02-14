export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  // promise 객체는 반드시 await로 먼저 결과를 확정한 뒤에 프로퍼티에 접근해야 합니다.
  const { q } = await searchParams;
  return <div>Search 페이지 {q}</div>;
}
