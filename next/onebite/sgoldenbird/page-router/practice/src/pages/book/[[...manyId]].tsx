import { useRouter } from "next/router";

export default function Page() {
  const router = useRouter();
  console.log(router);
  // book/1/2/3 ... 같이 연속적인 url parameter 가능
  const { manyId } = router.query;

  return <h1>Book {manyId}</h1>;
}
