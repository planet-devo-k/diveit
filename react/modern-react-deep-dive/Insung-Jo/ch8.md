# 08. 좋은 리액트 코드 작성을 위한 환경 구축하기

## 8.1 ESLint를 활용한 정적 코드 분석

- 정적 코드 분석이란 코드의 실행과는 별개로 코드 그 자체만으로 코드 스멜을 찾아내어 문제의 소지가 있는 코드를 사전에 수정하는 것

### ESList 살펴보기

**ESLint는 어떻게 코드를 분석할까?**

- 코드 분석 순서

  1. 자바스크립트 코드를 문자열로 읽는다.

  2. 자바스크립트 코드를 분석할 수 있는 파서로 코드를 구조화한다.

  3. 2번에서 구조화한 트리를 AST라 하며, 이 구조화된 트리를 기준으로 각종 규칙과 대조한다.

  4. 규칙과 대조했을 때 이를 위반한 코드를 알리거나 수정한다.

여기에서 주목할 것은 2번 과정인데 JS를 분석하는 파서에도 종류가 있는데 기본 값을 espree를 사용한다.

단순한 자바스크립트 코드여도 JSON으로 생성된 트리에 다양한 정보가 담겨 있음을 확인할 수 있다.

```json
{
  "type": "Program", // 최상위 노드 타입
  "start": 0, // 코드 시작 위치
  "end": 10, // 코드 끝 위치
  "body": [
    // 프로그램 본문 내용
    {
      "type": "ExpressionStatement", // JSX는 표현식으로 처리됨
      "start": 0,
      "end": 10,
      "expression": {
        // 실제 JSX 요소
        "type": "JSXElement", // JSX 요소
        "start": 0,
        "end": 10,
        "openingElement": {
          // 여는 태그 정보
          "type": "JSXOpeningElement", // 닫는 태그 (self-closing이라 null)
          "start": 0,
          "end": 10,
          "attributes": [], // 프롭스 (없음)
          "name": {
            // 컴포넌트 이름
            "type": "JSXIdentifier",
            "start": 1,
            "end": 7,
            "name": "Sample"
          },
          "selfClosing": true
        },
        "closingElement": null,
        "children": [] // 자식 요소 (비어있음)
      }
    }
  ],
  "sourceType": "module"
}
```

### eslint-plugin과 eslint-config

**eslint-plugin**

- 특정 프레임워크나 도메인과 관련된 규칙을 묶어서 제공하는 패키지

**eslint-config**

- eslint-plugin을 한데 묶어서 완변하게 한 세트로 제공하는 패키지

**eslint-config-airbnb**

- 에어비앤비에서 만든 eslint-config
- 리액트 기반 프로젝트에서 많이 쓰임

**@titicaca/triple-config-kit**

- 한국 커뮤니티에서 운영하는 eslint-config
- 스타트업 개발사인 트리픈(현 인터파크트리플)에서 개발

**eslint-config-next**

- Next.js 프레임워크를 사용하고 있는 프로젝트에서 사용할 수 있는 eslint-config
- 페이지나 컴포넌트에서 반환하는 JSX 구문 및 \_app, \_document에서 작성돼 있는 HTML 코드 또한 정적 분석 대상으로 분류해 제공

### 나만의 ESLint 규칙 만들기

**이미 존재하는 규칙을 커스터마이징 해서 적용하기: import React를 제거하기 위한 ESLint 규칙 만들기**

- 리액트 17버전 부터 새로운 JSX 런타임 덕분에 import React 구문이 필요 없어졋다.
- 현재 ESLint 8버전은 공식적으로 지원 종료가 되었기 때문에 위에 구문과는 다른 9버전의 세팅 방식을 가지고 왔습니다. [참고 자료](https://velog.io/@kky1373/%ED%94%84%EB%A1%A0%ED%8A%B8%EC%97%94%EB%93%9C-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD-%EC%B5%9C%EC%8B%A0%EB%B2%84%EC%A0%84%EC%9C%BC%EB%A1%9C-%EC%B4%88%EA%B8%B0-%EC%84%A4%EC%A0%95%ED%95%98%EA%B8%B0-Next.js-ESLint-Prettier-Storybook)

```mjs
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import jsxA11yPlugin from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import storybookPlugin from "eslint-plugin-storybook";

export default [
  // 기본 ESLint 권장 규칙 설정
  eslint.configs.recommended,
  //프리티어 충돌방지
  prettierConfig,
  // TypeScript를 위한 권장 규칙 설정
  ...tseslint.configs.recommended,

  // 1️⃣ React 설정
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      ...reactPlugin.configs.recommended.rules, // React를 위한 권장 규칙 설정
      "react/jsx-pascal-case": "error", // React 컴포넌트는 PascalCase로
    },
    settings: {
      react: {
        version: "detect", // react 버전을 자동으로 감지해서 프로젝트에서 사용된 react 버전에 맞는 규칙이 적용된다.
      },
    },
  },

  // 2️⃣ React Hooks 설정
  {
    plugins: {
      "react-hooks": reactHooksPlugin,
    },
    rules: reactHooksPlugin.configs.recommended.rules,
    // React Hooks를 위한 권장 규칙 설정
  },

  // 3️⃣ Import 설정
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      ...importPlugin.configs.recommended.rules, // import 문을 위한 권장 규칙
      "import/no-unresolved": "off", // import 오류 경고 비활성화. ts 에서 이미 확인해서 중복 검사를 막기 위함이다.
      "import/no-duplicates": "error", // 같은 모듈에서 여러 번 import하는 것을 금지
    },

    settings: {
      // 이 부분은 import/order 설정을 추후 추가한다면 해주고, 안 해준다면 없애도 된다.
      "import/resolver": {
        node: {},
        typescript: {
          directory: "./src",
        },
      },
      "import/parsers": { "@typescript-eslint/parser": [".ts", ".tsx"] },
    },
  },

  // 4️⃣ Storybook 설정
  {
    plugins: {
      storybook: storybookPlugin,
    },
    rules: storybookPlugin.configs.recommended.rules, //Storybook을 위한 권장 규칙
  },

  // 5️⃣ 프로젝트 전체 공통 설정
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      ecmaVersion: latest, // 최신 js 문법 지원
      sourceType: "module", // esmodule 사용
      parser: tseslint.parser, // ts 를 eslint 가 이해할 수 있도록 파서 설정
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // jsx 문법 지원
        },
      },
    },
    rules: {
      // 함수 선언
      "prefer-arrow-callback": "error", // 콜백함수는 화살표 함수로
      "func-style": ["error", "expression"], // 함수는 선언문이 아닌 표현식으로

      // 네이밍
      "id-length": ["error", { min: 2 }], // 식별자 이름은 최소 2글자 이상

      // 상수
      "no-var": "error", // var 키워드 대신 let이나 const 사용
      "prefer-const": "error", // 재할당되지 않는 변수는 let 대신 const로
    },
  },
];
```

**주의할 점**

1. Prettier와의 충돌

   - ESLint에서도 Prettier에서 처리하는 작업을 처리할 수 있기 때문에 두 가지 모두를 자바스크립트 코드에서 실행한다면 서로 충돌하는 규칙으로 인해 에러가 발생한다.

2. 규칙에 대한 예외 처리, 그리고 react-hooks/no-exhaustive-deps

   - 일부 코드에서 특정 규칙을 임시로 제외시키고 싶다면 eslint-disable- 주석을 사용하면 된다.

   - eslint-disable-line no-exhaustive-deps: 의존성 배열이 필요한 훅에 의존성 배열을 제대로 선언했는지 확인하는 역할

3. ESLint 버전 충돌

   - 패키지가 가지고 있는 의존성의 버전이 서로 달라 발생할 수 있다.
   - ESLint에서 peerDependencies로 설정하라고 권장한다.
