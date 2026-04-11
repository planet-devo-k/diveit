# App Router 시작하기

## 변경되거나 추가되는 사항

- 페이지 라우팅 설정 방식 변경
- 레이아웃 설정 방식 변경
- 데이터 페칭 방식 변경
- React 18 신규 기능 추가(ex; React Server Component, Streaming)

## 크게 변경되지 않는 사항

- 네비게이팅
- 프리페칭
- 사전렌더링

# 페이지 라우팅 설정하기

페이지 라우터에서의 라우팅과 방식 자체가 다르지는 않음.

![image.png](attachment:c0f83f63-3cd4-48f6-845e-91b71245c463:image.png)

## 동적 경로

![image.png](attachment:5bbac13d-1a04-44c7-ab88-e58480836e61:image.png)

# 레이아웃 설정하기

![image.png](attachment:b1724121-3d1c-4737-b649-8ed9322fc57f:image.png)

여기서 layout.tsx 파일은 ‘/search’ 경로로 시작하는 모든 페이지의 레이아웃으로 적용됨

# 리액트 서버 컴포넌트 이해하기

## 등장 배경

Page Router 버전의 Next.js에서의 문제점

상호작용이 필요없는 컴포넌트들까지 JS Bundle안에 포함됨. ⇒ 번들 크기가 커지면 하이드레이션 하는 과정이 길어지고, 사용자가 상호작용할 수 있기 까지의 시간(TTI)가 늦어져버림.

## React Server Component

서버 측에서만 실행되는 컴포넌트. 하이드레이션 이전에 JS Bundle로 전달하는 과정에서 서버 컴포넌트 들은 빠지게 됨.

![image.png](attachment:110fa730-3b8a-42de-8ee9-3d95b3518eb1:image.png)

페이지의 대부분을 서버 컴포넌트로 구성할 것을 권장하고, 클라이언트 컴포넌트는 꼭 필요한 경우에만 사용할 것.

co-location

# 리액트 서버 컴포넌트 주의사항

1. 서버 컴포넌트에는 브라우저에서 실행될 코드가 포함되면 안된다

   ![image.png](attachment:6be583ba-6a38-40f8-9d0d-3eb39a362e08:image.png)

2. 클라이언트 컴포넌트는 클라이언트에서만 실행되지 않는다

   ![image.png](attachment:4e92db4c-c98c-4439-b712-fd880f4fcc20:image.png)

3. 클라이언트 컴포넌트에서 서버 컴포넌트를 import할 수 없다

   ![image.png](attachment:8bf24ad2-7e37-4fc4-b543-0ac02813dfb6:image.png)

   ![image.png](attachment:20fc1963-b3f3-4c33-81fd-062931653472:image.png)

   이런 경우 Next.js 는 자동으로 서버 컴포넌트를 클라이언트 컴포넌트로 변경

4. 서버 컴포넌트에서 클라이언트 컴포넌트에게 직렬화 되지 않는 Props 는 전달 불가

   직렬화: 객체, 배열, 클래스 등의 복잡한 구조의 데이터를 네트워크 상으로 전송하기 위해 아주 단순한 형태(문자열, Byte)로 변환하는 것.

   자바스크립트의 함수는 직렬화가 불가능 함. 이처럼 함수같은 값은 서버 컴포넌트에서 클라이언트 컴포넌트로 전달되는 Props가 될수 없음.

   이건 Next 서버에서 서버 컴포넌트가 어떻게 실행되는지를 살펴보면 됨.

   서버 컴포넌트는 사전 렌더링 시 클라이언트 컴포넌트와 함께 실행 되며, 모든 컴포넌트 들이 한번에 실행되지는 않음. 먼저 서버 컴포넌트 ⇒ 클라이언트 컴포넌트

   ![image.png](attachment:29e9f914-93f8-42d2-af7c-d64837f5e527:image.png)

   먼저 RSC 페이로드라는 json 형태의 문자열이 생성됨.

   RSC Payload : React Server Component 의 순수한 데이터(결과물) . RCS를 직렬화한 결과

# 네비게이션

Page Router 방식과 동일하게 Client Side Rendering 방식으로 처리됨

![image.png](attachment:ad7f4f07-53f8-4c51-8756-2f8ec6248677:image.png)
