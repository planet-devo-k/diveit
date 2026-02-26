import Link from "next/link";
import type { ReactNode } from "react";

export default function Layout({
  children,
  sidebar,
  feed,
}: {
  children: ReactNode;
  sidebar: ReactNode;
  feed: ReactNode;
}) {
  return (
    <div>
      <div>
        <Link href={"/parallel"}>parallel</Link>
        &nbsp;
        <Link href={"/parallel/setting"}>parallel/setting</Link>
      </div>
      <br />
      {sidebar}
      {feed}
      {children}
    </div>
  );
}

/*
<Link href={"/parallel/setting"}>parallel/setting</Link> 클릭했을때 

- feed slot의 경우 setting/page.tsx 가 props로 전달된다. @feed/setting/page.tsx 
- sidebar slot의 경우 setting.가 없다. 이럴때 넥스트는 그냥 이전 페이지를 유지하도록 처리 @sidebar/page.tsx
- children도 이전 페이지 그대로 유지 

결과적으로 feed slot의 페이지만 업데이트되고 나머지 슬롯은 이전 페이지 유지 

- 단, 각각의 slot들이 이전페이지를 유지하는 것은 링크 컴포넌트로 브라우저측에서 CSR방식으로 페이지를 이동할때만 한정된다. 
- 브라우저 주소창에 url 직접 적으면 404 뜬다. http://localhost:3000/parallel/setting
- http://localhost:3000/parallel/setting 이 경로에 처음 접속하면(새로고침) layout에서 children이나 sidebar, 즉 해당 slot의 이전 값을 모르기 때문이다. 
초기 접속하면 이전에 렌더링해둔 페이지가 없으니까. 
- 이럴때는 slot별로 렌더링할 페이지가 없을 떄 대신 렌더링할 default page를 만든다. default.tsx

*/
