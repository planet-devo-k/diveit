import type { ReactNode } from "react";
import Searchbar from "../../components/searchBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Searchbar />
      {children}
    </div>
  );
}
