"use client";

import { deleteReviewAction } from "@/actions/delete-review.action";
import { useActionState, useEffect, useRef } from "react";

export default function ReviewItemDeleteButton({
  reviewId,
  bookId,
}: {
  reviewId: number;
  bookId: number;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction, isPending] = useActionState(
    deleteReviewAction,
    null,
  );

  useEffect(() => {
    if (state && !state.status) {
      alert(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction}>
      <input name="reviewId" value={reviewId} hidden readOnly />
      <input name="bookId" value={bookId} hidden readOnly />
      {isPending ? (
        <div>...</div>
      ) : (
        <div onClick={() => formRef.current?.requestSubmit()}>삭제하기</div>
      )}
    </form>
  );
}

/*
button이 아닌 요소를(div, a 등) 버튼처럼 작동하게 useRef사용 
-> 삭제하기 클릭하면 form이 submit된다. 

current.submit대신 requestSubmit메서드를 사용하는 이유
- current.submit은 유효성검사나 이벤트핸들러 등을 다 무시하고 무조건 강제로 form에 제출을 발생시킨다. 
- requestSubmit은 사용자가 submit버튼을 클릭한 것과 동일하게 동작 

*/
