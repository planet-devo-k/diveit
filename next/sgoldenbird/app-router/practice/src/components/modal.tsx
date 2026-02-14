"use client";

import { useEffect, useRef, type ReactNode } from "react";
import style from "./modal.module.css";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

export default function Modal({ children }: { children: ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal(); // 모달 컴포넌트가 화면에 마운트되면 보여지도록(dialog는 안보이는게 기본)
      dialogRef.current?.scrollTo({
        // 모달 스크롤 위치 최상단으로 고정
        top: 0,
      });
    }
  });

  return createPortal(
    <dialog
      ref={dialogRef}
      className={style.modal}
      // esc누르면 onClose
      onClose={() => router.back()}
      onClick={(e) => {
        //모달의 배경 클릭 -> 뒤로가기
        if ((e.target as any).nodeName === "DIALOG") {
          // 현재 클릭이 발생한 노드의 이름이 DIALOG이면 모달의 바깥 영역을 클릭했다는 것
          // 타입스크립트에서 아직 nodName타입 지원안해서 e.target as any 처리
          router.back();
        }
      }}
    >
      {children}
    </dialog>,
    document.getElementById("modal-root") as HTMLElement,
  );
}

/*
createPortal 메서드를 통해 브라우저에 존재하는 modal-root아이디를 갖는 DOM 요소 안에 dialog요소가 렌더링

*/
