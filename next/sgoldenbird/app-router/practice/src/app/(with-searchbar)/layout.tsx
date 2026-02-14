import { ReactNode, Suspense } from "react";
import Searchbar from "../../components/searchbar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      {/* suspense로 감싼 컴포넌트는 사전렌더링 배제되고 오직 클라이언트측에서만 실행된다.  */}
      <Suspense fallback={<div>Loading...</div>}>
        <Searchbar />
      </Suspense>

      {children}
    </div>
  );
}
