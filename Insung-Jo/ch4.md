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
