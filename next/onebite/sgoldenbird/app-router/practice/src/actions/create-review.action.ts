"use server";
import { delay } from "@/util/delay";
import { error } from "console";
import { revalidatePath, revalidateTag } from "next/cache";

// 서버 액션을 별도의 파일로 분리했을때는 지시자를 함수 안쪽이 아닌 최상단에 적는다.
export async function createReviewAction(_: any, formData: FormData) {
  // FormDataEntryValue 타입은 string이나 파일 타입
  const content = formData.get("content")?.toString();
  const author = formData.get("author")?.toString();
  const bookId = formData.get("bookId")?.toString();

  if (!bookId || !content || !author) {
    return {
      status: false,
      error: "리뷰내용과 작성자를 입력해주세요",
    };
  }

  try {
    // await delay(2000);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/`,
      {
        method: "POST",
        body: JSON.stringify({ bookId, content, author }),
      },
    );

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    // revalidatePath, revalidatTag를 사용하면 리렌더를 통해 서버액션의 결과를 화면에 바로 나타낼수 있다.
    revalidateTag(`review-${bookId}`, "max");

    return {
      status: true,
      error: "",
    };
  } catch (err) {
    console.error(err);
    return {
      status: false,
      error: `리뷰저장에 실패했습니다 : ${err}`,
    };
  }
}
