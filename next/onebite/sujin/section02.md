# **02. Page Router 핵심 정리**

## **Page Router를 소개합니다**

많은 기업에서 사용되고 있는 안정적인 라우터. React Router와 같이 페이지 라우팅 기능을 제공함. Pages라는 폴더의 구조를 기반으로 페이지 라우팅을 제공

![스크린샷 2026-03-20 162225.png](attachment:784ac2a1-0776-4794-b7d7-84d2fc8ff7d4:스크린샷_2026-03-20_162225.png)

Next.js는 파일명 기반의 페이지 라우팅이지만. 폴더를 기준으로 설정할 수도 있음

![스크린샷 2026-03-20 162342.png](attachment:bedf1d30-0402-404e-bb82-d07b08b64dc0:스크린샷_2026-03-20_162342.png)

### **동적 경로(Dynamic Routes)**

![스크린샷 2026-03-20 162451.png](attachment:c21a7471-459b-4752-8f08-1eea52969174:스크린샷_2026-03-20_162451.png)

### **\_\_app.ts**

모든 페이지 컴포넌트의 부모역할을 하는 루트 컴포넌트. 레이아웃이나 비즈니스 로직을 작성하는데 쓰임.

### **\_\_document.ts**

모든 페이지에 공통적으로 적용되어야하는 Next.js 앱의 HTML을 설정.

메타 태그, 폰트 불러오기, 캐릭터 셋 설정, 서드 파티 스크립트 등

### **next.config.mjs**

## **네비게이팅**

### **Link 컴포넌트**

a태그를 사용하게 되면 서버로 새로운 페이지를 요청하는 방식으로 페이지를 이동시키게 됨.

a 태그와 사용법이 동일하며, href 속성에 이동하려는 경로를 기입하면 됨.

```
<Link href={"/"}/>
```

### **프로그래매틱한 페이지 이동**

> 사용자가 링크를 직접 클릭했을 때 페이지를 이동시키는 게 아닌 특정 버튼이 클리이 되었거나 특정 조건을 만족시킬 경우 함수내부에서 일어나는 경우를 말함

```
import "@/styles/globals.css";
import type { AppProps } from "next/app"
import Link from "next/link"
import { userRouter } from "next/router"

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const onClickButton = () => {
        router.push("/test");
    };

    return (
        <>
            <header>
                <Link href={"/"}>index</Link>
                <div>
                    <button onClick={onClickButton}>/test page로 이동</button>
                <div>
            <header>
            <Component {...pageProps} />
        </>
    )
}
```

## **프리페칭**

> 페이지를 사전에 미리 불러오는것.

### **Next.js에서의 프리페칭**

현재 보고 있는 페이지에서 이동할 수 있는 페이지들을 사전에 미리 다 불러와 놓음으로써 페이지 이동을 지체없이 빨리 이동하도록 하는 기능.

### **왜 필요한가?**

넥스트.js 앱은 모든 리액트 컴포넌트들을 페이지별로 분리해서 저장을 해두기 때문.

사전 렌더링의 과정에서 자바 스크립트 번들 파일을 전달할때 현재 페이지에 해당되는 자바스크립트 코드들만 전달되기 때문.

이렇게 동작하는 이유는 초기 접속시 전달되는 자바스크립트 코드의 양을 줄이기 위해서.

번들 양이 많아지면 하이드레이션 과정도 느려질 것이고, TTI가 늦어지는 문제가 발생할 수 있기 때문

이렇게 되면 나머지 페이지는 CSR로 처리될 수 있는게 아님.

그래서 페이지 이동시 자바스크립트 코드를 또 불러와야 하는 과정이 필요할 수 있음 ⇒ 오히려 페이지 이동은 느려지고 비효율적으로 가져옴.

이러한 문제를 방지하기 위해 프리페칭이라는 기능이 있는것!

링크 컴포넌트로 명시된 경로가 아니면 프리패칭이 이루어지지 않음.

이럴 경우 라우터 객체의 특정 메서드 이용해서 직접 프리패칭하도록 코드를 작성하면 됨.

프리페칭을 원하지 않는 경우 Link 컴포넌트의 prefetch 속성을 false로 명시하면 됨.

## **API Routes**

> Next.js 앱에서 APi를 구축할 수 있게 해주는 기능

### **API Routes 공식 문서**

https://nextjs.org/docs/pages/building-your-application/routing/api-routes

## **스타일링**

### **인라인방식**

길어지면 가독성을 해칠 수 있음

### **스타일 분리**

Next.js 에서는 앱 컴포넌트가 아닌 다른 파일에서는 임포트 문을 통해 CSS파일을 그대로 불러오는걸 제한하고 있음. 페이지별로 CSS의 클래스네임이 겹치는 문제를 원천차단하기위함. CSS 모듈을 사용해서 작업하면 됨.

## **사전 렌더링과 데이터 페칭**

기존 리액트에서 초기 접속 시 데이터 페칭은 컴포넌트가 마운트 된 이후에나 발생하기 때문에 데이터의 로딩이 오래걸림.

사전 렌더링을 진행하는 과정에서 현재 페이지에 필요한 데이터까지 불러올 수 있음.

다양한 방식으로 사전렌더링 할 수 있도록 여러 방식을 제공

### **1. SSR(서버 사이드 렌더링)**

- 가장 기본적인 사전 렌더링 방식
- 요청이 들어올 때마다 사전 렌더링을 진행
- 페이지 내의 데이터를 최신으로 유지할 수 있다는 장점이 있음
- 데이터의 응답속도가 느려지게 되면 브라우저의 로딩을 기다려야 하기 때문에 불편함을 초래할 수 있음.

### **2. SSG(정적 사이트 생성)**

- SSR의 단점을 해결하는 사전 렌더링 방식
- 빌드 타임에 미리 페이지를 사전 렌더링 해둠
- 사전 렌더링에 많은 시간이 소요되는 페이지더라도 사용자의 요청에는 매우 빠른 속도로 응답 가능
- 매번 똑같은 페이지만 응답함. 최신 데이터 반영은 어렵다는 단점이 존재

### 2-1. SSG 동적 경로에 적용하기

정적 경로에 적용하는 것처럼 getStaticProps로 바꾸게 되면 해당 오류가 발생

```c
Error: getStaticPaths is required for dynamic SSG pages and is missing for '/book/[id]'.
Read more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value
```

이 오류가 발생하는 이유는 동적 경로를 갖도록 설정한 페이지에서는 SSG 방식으로 사전 렌더링 하여 미리 생성해두기 위해선 어떤 URL 파라미터들이 존재할 수 있는지 설정해주어야 함.

```c
export const getStaticPaths = () => {
  return {
    paths: [{ params: { id: "1" } }, { params: { id: "2" } }, { params: { id: "3" } }],
    fallback: false,
  };
};
```

### 2-3 SSG 폴백 옵션 설정하기

위의 코드에서 폴백옵션은 3가지중 하나로 설정할 수 있음.

- false: 패스에 없는 경로로 요청시 404 페이지 반환
- blocking: 즉시 생성(SSR 처럼)
  ![image.png](attachment:9ddfa57f-f68f-4fe3-9a48-469899d414f1:image.png)
  주의사항 : 존재하지 않았던 페이지를 추가적으로 요청할 때 사전 렌더링 시간이 길어지면 로딩이 발생하게 될 수 있음
- true : 먼저 props없는 페이지를 반환하고 Props를 계산하여 Props만 따로 반환.
  ![image.png](attachment:45a890f2-d8ff-403a-bba6-7581babe793b:image.png)

### **3. 증분 정적 재생성(ISR; Incremental Static Regeneration)**

SSG 방식으로 생성된 정적 페이지를 일정시간을 주기로 다시 생성하는 기술

![image.png](attachment:22ce1b77-4c60-494d-b833-bb2c2a1b665b:image.png)

### 3-1. ISR 주문형 재검증(On-Demand ISR)

- 시간 기반의 ISR을 적용하기 어려운 페이지
  - 시간과 관계없이 사용자의 행동에 따라 데이터가 업데이트 되는 페이지
  - ex) 커뮤니티 사이트의 게시글 페이지

요청할 때마다 페이지를 다시 생성하는 ISR

# 페이지 라우터의 단점

1. 페이지별 레이아웃 설정이 번거롭다
2. 데이터 페칭이 페이지 컴포넌트에 집중된다
3. 불필요한 컴포넌트들도 JS Bundle에 포함된다.

   하이드레이션이 필요없는 컴포넌트들 까지 포함될 수 있음. ⇒ 하이드레이션 하는 시간이 더 걸리게 됨.
