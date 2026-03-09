# 04. 서버 사이드 렌더링

## 4.1 서버 사이드 렌더링이란?

### 싱글 페이지 애플리케이션의 세상

**싱글 페이지 애플리케이션이란?**

- 렌더링과 라우팅에 필요한 대부분의 기능을 서버가 아닌 브라우저의 자바스크립트에 의존하는 방식
- `<body>` 내부 내용을 모두 자바스크립트 코드로 삽입한 이후 렌더링 됨

**장단점**

- 장점: 한 번 로딩 이후 필요한 리소스가 적어져 훌륭한 UI/UX 제공
- 단점: 초기에 로딩해야 하는 자바스크립트 리소스가 커짐

### 서버 사이드 렌더링이란?

- 최초에 사용자에게 보여줄 페이지를 서버에서 렌더링해 빠르게 사용자에게 화면을 제공하는 방식

**장단점**

- 장점
  - 최초 페이지 진입이 비교적 빠르다
  - 검색 엔진과 SNS 공유 등 메타데이터 제공이 쉽다
  - 누적 레이아웃 이동이 적다
  - 사용자의 디바이스 성능에 비교적 자유롭다
  - 보안에 좀 더 안전하다
- 단점
  - 소스코드를 작성할 때 항상 서버를 고려해야 한다
  - 적절한 서버가 구축돼 있어야 한다
  - 서비스 지연에 따른 문제

### SPA와 SSR을 모두 알아야 하는 이유

**서버 사이드 렌더링 역시 만능이 아니다**

- 잘못 설계하면 오히려 성능을 해칠 뿐만 아니라 서버와 클라이언트 두 군데로 관리 포인트만 늘어날 수 있다
- 웹페이지의 설계와 목적, 우선 순위에 따라서 SPA 또는 SSR을 알맞게 선택 해야 한다

## 4.2 서버 사이드 렌더링을 위한 리액트 API 살펴보기

### renderToString

```jsx
const result = ReactDOMServer.renderToString(
  React.createElement('div', {id : 'root'}, <Component />),
)

// 반환
<div id="root" data-reactroot="">
// ...
</div>
```

- 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수
- 훅과 이벤트 헨들러는 결과물에 포함되지 않는다 (의도된 것)

### renderToStaticMarkup

```jsx
const result = ReactDOMServer.renderToStaticMarkup(
  React.createElement('div', {id : 'root'}, <Component />),
)

// 반환
<div id="root">
// ...
</div>
```

- renderToString과 유사한 함수
- 차리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는 차이점이 존재
- HTML 크기를 약간 이라도 줄일 수 있는 장점이 있다
- 브라우저 액션이 없는 정적인 내용만 필요한 경우 유용

### renderToNodeStream

- renderToString과 결과물이 동일하지만 두 가지 차이점이 존재

**차이점**

1. 브라우저에서 사용하는 것이 완적이 불가능하다.
2. 결과물의 타입이 다르다.
   - renderToNodeStream의 결과물은 Node.js의 ReadableStream이다.
   - ReadableStream은 utf-8로 인코딩 되어 Node.js,Deno,Bun 같은 서버 환경에서만 사용 가능

**왜 사용할까?**

- renderToNodeStream은 결국 큰 데이터를 다룰 때 데이터를 청크(작은 단위)로 분할해 조금씩 가져온다. 예) 유튜브
- 만약 HTML의 크기가 매우 클 때 renderToString을 사용하면 서버의 부담이 증가됨 반대로 renderToNodeStream은 청크 단위로 분리해 순차적을 처리할 수 있는 장점이 있다.

### renderToStaticNodeStream

- renderToStaticMarkup과 마찬가지로 순수 HTML 결과물이 필요할 때 사용하는 메서드

### hydrate

- renderToString과 renderToNodeStream으로 생성된 HTML 콘텐츠에 자바스크립트 핸들러나 이벤트를 붙이는 역할

**hydrate 불일치**

- hydrate는 두 번째 인수로 렌더링된 정적인 HTML 정보가 반드시 담겨 있어야 함
- 해당 작업이 단순히 이벤트나 핸들러를 추가하는 것 외에도 hydrate가 수행한 결과물 HTML과 인수로 넘겨받은 HTML 비교하는 작업을 수행한다 => 바로 이 부분에서 불일치가 발생하는 것
- `suppressHydrationWarning` 을 통해 해당 경고를 끄는 것이 가능하다.

## 4.3 Next.js 돌아보기

### Next.js란?

- Vercel이라는 미국 스타트업에서 만든 풀스택 웹 애플리케이션 구축을 위한 리액트 기반 플레임워크
- PHP의 영감을 받아 만들어져 설계 당시 부터 서버 사이드 렌더링을 염두에 두었던 것으로 보임

### Next.js 시작하기

**기본 설정 파일**

- `package.json` : 프로젝트 구동에 필요한 모든 명령어 및 의존성이 포함되어 있는 곳

- `next.config.js`: Next.js 프로젝트의 환경 설정을 담당

```js
/** @type {import('next').NextConfig} */ // TS의 타입 도움을 받기 위해 추가
const nextConfig = {
  /* config options here */
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
```

- `reactStrictMode`: 리액트 애플리케이션 배부에 잠재적인 문제를 개발자에게 알리기 위한 도구

- `swcMinify`: 번들링과 컴파일을 더욱 빠르게 수행할 수 있음

  - SWC라 불리는 오픈 소스 사용 기존 바벨과는 다르게 러스트라는 언어를 사용

  - 작업을 병렬로 처리

**페이지 구조**

**pages/\_app.tsx**

- 애플리케이션의 전체 페이지의 시작점
- 공통으로 설정해야 하는 것들을 여기에서 실행할 수 있다

**종류**

- 에러 바운더리를 사용해 애플리케이션 전역에서 발생하는 에러 처리
- `reset.css` 같은 전역 CSS 선언
- 모든 페이지에 공통으로 사용 또는 제공해야 하는 데이터 제공

**`console.log`를 출력하면 무슨 일이 발생할까?**

- 출력하게 되면 해당 로그는 브라우저 콘솔 창이 아닌 터미널에 기록되는 것을 확인할 수 있다.

- 또 여기에서 페이지를 전환하면 서버에서 로깅되지 않고 브라우저에서 로깅되는 것을 확인할 수 있다. -> 초기 진입(서버 사이드 렌더링) 이후 클라이언트에서 렌더링

**pages/\_document.tsx**

- `create-next-app`으로 생성하면 페이지가 존재하지 않는다.

- HTML 문서 구조를 커스터마이징 하기 위한 파일

- 기존 page-router에서만 사용되며 추후에 등장한 app-router에서는 사용하지 않는다. => layout.tsx로 대체됨

- `CSS-in-JS`의 스타일을 서버에서 모아 HTML로 제공할 수 있다

```tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
```

**`_app.tsx`와 차이점**

- `<html>`이나 `<body>`에 DOM 속성을 추가할 수 있다.

- `_document.tsx`는 서버에서만 실행되기 때문에 이벤트 핸들러를 추가할 수 없다.

- `getServerSideProps`, `getStaticProps` 등 서버에서 사용 가능한 데이터 불러오기 함수는 사용 불가

**요약**

- `_app.tsx`: Next.js를 초기화 하는 파일로 Next.js 설정과 관련된 코드를 모아두는 곳이며, 경우에 따라 서버 or 클라이언트 모두에서 렌더링 가능

- `_document.tsx`: 웹사이트의 뼈대가 되는 HTML 설정과 관련된 코드를 추가하는 곳, 반드시 서버에서만 렌더링됨

**`_pages/error.tsx`**

- 클라이언트에서 발생하는 에러 또는 서버에서 발생하는 500에러를 처리할 목적으로 만들어짐

- 개발 모드로는 이 페이지를 방문할 수 없어 프로덕션으로 빌드해서 확인해야 함

```tsx
function Error({ statusCode }) {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on server`
        : "An error occurred on client"}
    </p>
  );
}

Error.getInitialProps = ({ res, err }) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
```

**`_pages/404.tsx`**

- 404 페이지를 정의할 수 있는 파일

```tsx
export default function Custom404() {
  return <h1>404 - Page Not Found</h1>;
}
```

**`_pages/500.tsx`**

- 500 페이지를 정의할 수 있는 파일

- `_pages/error.tsx` 보다 우선적으로 실행됨

```tsx
export default function Custom500() {
  return <h1>500 - Page Not Found</h1>;
}
```

**`pages/index.tsx`**

- 개발자가 자유롭게 명칭을 지정해 만들 수 있는 페이지

**여러 구성 법**

1. `/pages/index.tsx`: localhost:3000과 같은 루트 주소를 의미

2. `/pages/about.tsx`: 파일명이 주소가 되며 `localhost:3000/about` 으로 접근이 가능하다.

3. `/pages/first.tsx/second.tsx`: `localhost:3000/first.tsx/second.tsx` 으로 접근되며 디렉터리의 깊이 만큼 주소를 설정 가능

4. `/pages/hello/[greeting].tsx`: `[ ]`의 의미는 어떠한 문자도 올 수 있다 예시로는 `/pages/hello/3212` 이러한 주소도 유효하게 동작됨

5. `/pages/hello/[...props].tsx`: hello를 제외한 모든 하위 주소가 유효해짐 `/pages/hello/foo/bar/baz` 이러한 형태도 가능 해당 `[...props]` 값은 props라 변수에 배열로 오게됨

**주의점**

- 주소에 숫자를 입력해도 숫자로 형변환이 이루어지지 않으니 주의
- `[...props]` 같은 경우는 주소가 하나가 들어가더라도 `String 주소`가 아닌 `String[] [주소]`가 들어간다

**서버 라우팅과 클라이언트 라우팅의 차이**

- 두 예시로 차이점을 비교해보자

1. `<a>` 태그

- 링크 클릭 시 브라우저가 서버로 새 요청을 보내고 전체 페이지가 다시 로드된다.
- 네트워크 탭을 보면 모든 리소스를 다시 받는다.
- 즉, 서버 라우팅이며 전체 렌더링 과정이 다시 시작된다.

2. `<Link>` 컴포넌트

- 브라우저 리로드 없이 자바스크립트로 페이지 전환을 처리한다.
- 네트워크 탭에서도 전체 HTML이 아닌 필요한 JS 청크나 데이터만 요청된다.
- 즉, 클라이언트 라우팅이며 불필요한 렌더링을 방지할 수 있다.

**결론**

- `<a>`는 전통적인 서버 라우팅 방식으로, 전체 리소스를 재다운로드하므로 성능 부담이 있다.
- `<Link>`는 Next.js가 제공하는 클라이언트 라우팅 방식으로, 필요한 리소스만 로드해 빠르고 효율적이다.

**내부 페이지 이동 규칙**

- `<a>` 대신 `<Link>`를 사용
- `window.location.push` 대신 `router.push` 사용

**페이지에서 getServerSideProps를 제거하면 어떻게 될까?**

1. 있는 경우

   - 빌드로 확인해보면 서버 사이드 런타임 체크가 되어 있는 것을 확인할 수 있다.

2. 없는 경우

   - 빌드 크기가 줄었으며, 서버 사이드 렌더링이 필요없는 정적인 페이지로 분류된다.

**왜 이런 일이 발생할까?**

- 빌드 시 서버에서 해당 페이지를 빌드 시점에 미리 만들어도 되는 페이지로 간주함

- `type of window === 'undefined' : '서버' : '클라이언트`를 해도 단순히 `클라이언트`로 축약된 것을 확인할 수 있다.

- `getServerSideProps`가 없으면 서버에서 실행하지 않아도 되는 페이지로 처리하고 `typeof window`의 처리를 모두 `object`로 바꾸고 빌드 시점에서 미리 트리쉐이킹을 하게 된다.

**/pages/api/hello.tsx**

- 서버의 API를 정의하는 폴더

- pages 파일과 다르게 HTML을 요청하는 것이 아닌 서버 요청을 주고 받게 됨

- 서버에서만 실행되기 때문에 브라우저에서만 접근 가능한 `window`, `document` 사용 불가

- 일반적으로 `BFF(backend-for-frontend)`나 `CORS` 우회 용도로 사용된다.

```tsx
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const data = req.body;
  const id = await createItem(data);
  res.status(200).json({ id });
}
```

### Data Fetching

- Next.js의 데이터 불러오기 전략

- `pages/`의 폴더에 있는 라우팅이 되는 파일만 사용 가능

- 예약어로 지정되어 반드시 정해진 함수명으로 `export`를 사용해 함수를 파일 외부로 내보내야 함

**getStaticPaths와 getStaticProps**

- 어떠한 페이지를 CMS(Contents Management System)나 블로그, 게시판과 같이 사용자와 관계 없이 정적으로 결정된 페이지를 보여줄 때 사용

**getStaticPaths**

- 해당 경로에 접근 가능한 주소를 정의하는 함수
- `params`를 통하여 유효한 주소를 정의할 수 있다(다른 주소는 404 반환)

**getStaticProps**

- 정의한 페이지를 기준으로 페이지 요청이 올 때 제공할 props를 반환

**fallback**

- `getStaticPaths`의 반환값 중 하나 `true`나 `"blocking"`으로 선언 가능

- `true`: 미리 빌드하지 않는 페이지에 접근하면 fallback 컴포넌트를 보여줄 수 있다.

- `"blocking"`: 로딩처리를 하지 않고 사용자를 기다리게 하는 옵션

```tsx
export default function Page({ data }) {
  const router = useRouter();

  // fallback 상태
  if (router.isFallback) {
    return <h1>Loading...</h1>;
  }

  // 렌더링
}
```

```tsx
import type {
  InferGetStaticPropsType,
  GetStaticProps,
  GetStaticPaths,
} from "next";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getStaticPaths = (async () => {
  return {
    paths: [
      {
        params: {
          name: "next.js", // next.js라는 주소로만 접근 가능
        },
      }, // See the "paths" section below
    ],
    fallback: true, // false or "blocking"
  };
}) satisfies GetStaticPaths;

// satisfies: 객체가 특정 타입 조건을 만족하는지 검사하되, 그 객체의 실제 타입 정보는 그대로 유지하는 문법
export const getStaticProps = (async (context) => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo = await res.json();
  return { props: { repo } };
}) satisfies GetStaticProps<{
  repo: Repo;
}>;

export default function Page({
  repo,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return repo.stargazers_count;
}
```

**getServerSideProps**

- 서버에서 실행되는 함수이며 무조건 페이지 진입 전에 실행됨

- HTML은 `getServerSideProps`의 반환 값을 기반으로 페이지가 렌더링됨

- 반환된 HTML을 보게 되면 `__NEXT_DATA__`라는 id의 스크립트가 존재하는데 해당 스크립트에 Next.js 구동에 필요한 정보가 담겨 있다.

```tsx
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

type Repo = {
  name: string;
  stargazers_count: number;
};

export const getServerSideProps = (async () => {
  // Fetch data from external API
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const repo: Repo = await res.json();
  // Pass data to the page via props
  return { props: { repo } };
}) satisfies GetServerSideProps<{ repo: Repo }>;

export default function Page({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{repo.stargazers_count}</p>
    </main>
  );
}
```

**`__NEXT_DATA__` 이건 무엇일까?**

- 알기 전 SSR의 작동을 설명하자면

```
1. 서버에서 fetch 등으로 렌더링에 필요한 정보를 가져옴

2. 1번에서 가져온 정보를 기반으로 HTML 완성

3. 2번의 정보를 클라이언트에 제공

4. 3번을 바탕으로 클라이언트에서 hydrate 작업 실시

5. 4번 작업으로 만든 리액트 컴포넌트 트리와 서버에서 만든 HTML이 다르면 불일치 에러 표시

6. 5번 작업도 1번과 마찬가지로 fetch 등으로 정보를 가져옴
```

- fetch 시점에 따랏 결과물의 불일치가 발생할 수 있기 때문에 1번에서 가져온 정보를 HTML의 script 형태로 내려주는 것

**주의점**

- JSON으로 제공할 수 있는 값으로 제한되기 때문에 직렬화할 수 없는 값(class, Data)는 제공 불가 = 가공이 필요하면 실제 페이지 or 컴포넌트

- 무조건 서버에서만 실행되기 떄문에 다음과 같은 제약이 존재

  - window, document 접근 불가

  - API 호출 시 `/api/a/path`와 같이 protocol과 domain 없이 요청할 수 없다 브라우저와 다르게 서버는 자신의 호스트를 유추할 수 없기 때문

  - 에러 발생 시 `500.tsx`와 같이 정의해 둔 에러 페이지로 리다이렉트

**추가 내용**

- `getServerSideProps`는 반드시 해당 페이지를 렌더링하는 데 있어 중요한 역할을 하는 데이터만 가져오는 것이 좋다.

- 조건에 따라서 redirect를 사용할 수 있다.

```tsx
export const getServerSideProps = (async (context) => {
  const{
    query: {id = ''}
  } = context;
  const post = await fetchPost(id.toString());

  if(!post){
    redirect: {
      destination: '/404',
    }
  }
return {
  props: {post},
}
})

```

**getInitialProps**

- `getServerSideProps`, `getStaticProps`이 나오기 전 사용됨.

- `_app.tsx`와 같이 일부 페이지에서는 `getInitialProps`밖에 사용할 수 없다.

```tsx
import { NextPageContext } from "next";

Page.getInitialProps = async (ctx: NextPageContext) => {
  const res = await fetch("https://api.github.com/repos/vercel/next.js");
  const json = await res.json();
  return { stars: json.stargazers_count };
};

export default function Page({ stars }: { stars: number }) {
  return stars;
}
```

- 페이지의 루트 함수에 정적 메서드로 추가한다는 점과 props 객체를 반환하는 것이 아닌 객체를 반환한다는 차이점이 존재

**context객체**

- `getServerSideProps`와`getInitialProps`에서 사용되는 객체

**종류**

- pathname: 현재 경로명. 단 실제 경로가 아닌 페이지상 경로
- asPath: 브라우저에 표시되는 실제 경로
- query: URL에 존재하는 쿼리 pathname에 있는 값도 포함됨
- req: 노드에서 제공하는 HTTP request 객체
- res: 노드에서 제공하는 HTTP response 객체

### 스타일 적용하기

**전역 스타일**

```tsx
import "@/styles/global.css";

export default function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}
```

**컴포넌트 레벨 CSS**

- `[name].module.css`와 같은 명명 규칙 준수

```tsx
//base-button.module.css
.primary {
  font-size: 16px;
  color: blue;
}

import styles from './base-button.module.css'

export function BaseButton() {
  return <button className={styles.primary} />
}
```

**SCSS와 SASS**

```tsx
// variables.module.scss
$primary-color: #64ff00;

:export {
  primaryColor: $primary-color;
}

import variables from '../styles/variables.module.scss'

export default function MyApp({ Component, pageProps }) {
  return (
    <Layout color={variables.primaryColor}>
      <Component {...pageProps} />
    </Layout>
  )
}
```

**CSS-in-JS**

- 대표적인 styled-components(아아.. 그는 좋은 별이 되었습니다..) 의 스타일을 추가하려면 다음과 같은 코드가 필요하다

```tsx
import Document from "next/document";
// 서버에서 초기화해 사용되는 클래스
import { ServerStyleSheet } from "styled-components";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        //기존 ctx.renderPage가 하는 작업에 추가적으로 작업 수행
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            // 기존 앱 위에 styled-components의 Context.API로 감싸는 역할 수행
            sheet.collectStyles(<App {...props} />),
        });
      // _document.tsx가 렌더링을 수행할 때 필요한 getInitialProps를 생성
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        // 이후 기존 props에 추가적으로 styled-components가 모아둔 자바스클비트 파일 내 스타일을 반ㅂ
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return; // ...
  }
}
```

- 요약하면 다음과 같다

1. 리액트 트리 내부에 styled-components의 스타일을 모두 모음

2. 각각의 스타일에 유니크한 클래스명을 부여해 스타일이 충돌하지 않게 클래스명과 스타일을 정리

3. 이를 `_document.tsx`가 서버에서 렌더링 시 `React.Context` 형태로 제공하는 것

**안 하면 어떻게 될까?**

- 이 과정을 수행하지 않으면 스타일이 브라우저에서 뒤늦게 추가되어 FOUC(flash of unstyled content)가 일어날 수 있다.

**바벨 대신 swc를 사용한다면?**

```tsx
const nextConfig = {
  // ...

  compiler: {
    styledComponents: true,
  },
};
```

~~깔ㅡ끔~~

### `_app.tsx` 응용하기

- `getInitialProps`와 `<Link>`를 이용하여 웹서비스 최초 접근 시에만 실행하고 싶은 내용을 담을 수 있다.

**작동 순서**

1. 브라우저 최초 접근 시

   - 요청이 들어옴 -> 서버에서 페이지 렌더링
   - 이 때 `getInitialProps`가 실행됨
   - 서버에서 props를 만들고 HTML과 같이 보내게됨

2. 이후 내부 `<Link>`로 재방문

   - 이 때는 클라이언트에서 실행됨

※ `getServerSideProps` 같은 경우는 `<Link>`로 이동해도 무조건 서버 호출만 발생

### `next.config.js` 살펴보기

**실무에서 자주 사용하는 설정**

- basePath: URL을 위한 접두사를 추가할 수 있다.
- swcMinify: swc를 이용해 코드 압축 여부 설정 기본 값은 true
- poweredByHeader: 응답 헤더의 X-power-by: Next.js 정보를 없앨 수 있다. (해당 헤더를 취약점으로 분류해 false가 좋다)
- redirects: 특정 주소를 다른 주소로 보내고 싶을 떄 사용 (정규식 사용 가능)
- reactStrictMode: 리액트에서 제공하는 엄격 모드 설정 여부를 나타냄
- assetPrefix: 만약 next에서 빌드된 결과물을 동일한 호스트가 아닌 다른 CDN에 업로드 하고자 하면 해당 옵션에 CDN 주소 명시
