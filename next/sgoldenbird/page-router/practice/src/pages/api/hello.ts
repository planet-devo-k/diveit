// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// 브라우저에서 api/hello 로 요청 -> handler 함수 실행
// http://localhost:3000/api/hello -> { name: "John Doe" } 응답 확인
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  res.status(200).json({ name: "John Doe" });
}
