## 📝 좋은 리액트 코드 작성을 위한 환경 구축: ESLint 활용 심층 분석

본 내용은 \*\*ESLint(정적 코드 분석)\*\*를 활용하여 고품질의 리액트 코드를 작성하고 환경을 구축하는 방법에 대해 다룹니다.

---

## 1\. ESLint를 활용한 정적 코드 분석

\*\*정적 코드 분석(Static Code Analysis)\*\*이란 코드를 실제로 **실행하지 않고** 코드 그 자체만으로 \*\*코드 스멜(Code Smell)\*\*이나 잠재적 문제 소지가 있는 부분을 찾아내어 사전에 수정하는 과정입니다.

### ESLint의 코드 분석 원리 (AST 기반)

ESLint는 다음 4단계 과정을 거쳐 코드를 분석하고 문제점을 찾아냅니다.

1.  **읽기:** 자바스크립트 코드를 단순한 **문자열**로 읽습니다.
2.  **구조화 (파싱):** 자바스크립트 코드를 분석할 수 있는 **파서** (기본값: **espree**)를 사용해 코드를 구조화합니다.
3.  **트리 생성:** 구조화된 형태를 \*\*AST(Abstract Syntax Tree, 추상 구문 트리)\*\*라는 JSON 기반의 트리 구조로 만듭니다. AST의 각 노드에는 코드 타입(`"type": "Program"`, `"type": "JSXElement"`), 시작/끝 위치(`start`, `end`) 등의 정보가 담깁니다.
4.  **규칙 대조:** 생성된 AST를 기준으로 ESLint에 설정된 각종 \*\*규칙(Rules)\*\*과 대조하여 위반 코드를 알리거나 자동으로 수정합니다.

<!-- end list -->

```json
// AST 예시 (JSX Element)
{
  "type": "Program",
  "body": [
    {
      "type": "ExpressionStatement",
      "expression": {
        "type": "JSXElement", // JSX 요소 타입
        "openingElement": {
          "name": { "name": "Sample" } // 컴포넌트 이름
        },
        "closingElement": null,
        "children": []
      }
    }
  ],
  "sourceType": "module"
}
```

---

## 2\. ESLint 플러그인과 설정 (Plugin & Config)

ESLint의 기능을 확장하고 특정 도메인에 맞는 규칙 세트를 적용하기 위해 `plugin`과 `config`를 사용합니다.

| 종류                | 역할          | 설명                                                                                                            | 예시                                                                        |
| :------------------ | :------------ | :-------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------- |
| **`eslint-plugin`** | **규칙 제공** | 특정 프레임워크나 도메인(예: React, TypeScript, Import 순서)과 관련된 **새로운 규칙**을 묶어서 제공하는 패키지. | `eslint-plugin-react`, `eslint-plugin-import`                               |
| **`eslint-config`** | **규칙 묶음** | 여러 개의 `eslint-plugin`을 한데 묶어 **완벽한 설정 세트**로 제공하는 패키지.                                   | `eslint-config-airbnb`, `eslint-config-next`, `@titicaca/triple-config-kit` |

### 주요 ESLint Config 소개

- **`eslint-config-airbnb`:** 에어비앤비에서 만든 설정으로, 가장 엄격하고 널리 사용되는 리액트 기반 프로젝트용 설정 세트입니다.
- **`eslint-config-next`:** Next.js 프레임워크 전용 설정으로, 페이지나 컴포넌트의 JSX, 그리고 `_app.js`, `_document.js` 등의 Next.js 특정 파일에 대한 정적 분석 규칙을 제공합니다.

---

## 3\. 나만의 ESLint 규칙 만들기 및 커스터마이징

ESLint 설정 파일을 통해 이미 존재하는 규칙을 수정하거나 새로운 규칙을 정의할 수 있습니다.

### 커스터마이징 예시: `import React` 제거

리액트 17버전부터 **새로운 JSX 런타임**이 도입되어 JSX를 사용해도 파일 상단에 `import React from 'react';` 구문이 필요 없어졌습니다. 이를 위해 설정 파일에서 관련 규칙을 조정할 수 있습니다 (최신 ESLint 9 버전 기준 설정 예시).

```javascript
// eslint.config.mjs (최신 형식)

export default [
  // 1️⃣ TypeScript 설정
  ...tseslint.configs.recommended,

  // 2️⃣ React 설정
  {
    plugins: {
      react: reactPlugin,
    },
    rules: {
      // ✅ 최신 JSX 런타임 사용 시 'import React' 불필요 경고 끄기 (예시)
      // "react/react-in-jsx-scope": "off",

      "react/jsx-pascal-case": "error", // React 컴포넌트는 PascalCase 강제
    },
    settings: {
      react: {
        version: "detect", // 프로젝트 react 버전을 자동으로 감지
      },
    },
  },

  // 3️⃣ Import 설정
  {
    plugins: { import: importPlugin },
    rules: {
      "import/no-unresolved": "off", // TypeScript가 확인하므로 ESLint 중복 검사 비활성화
      "import/no-duplicates": "error", // 같은 모듈에서 여러 번 import 하는 것을 금지
    },
    // ... import resolver 설정 (TypeScript 경로와 연동)
  },

  // 4️⃣ 프로젝트 전체 공통 설정
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      "prefer-arrow-callback": "error", // 콜백함수는 화살표 함수로
      "func-style": ["error", "expression"], // 함수는 선언문이 아닌 표현식으로
      "prefer-const": "error", // 재할당되지 않는 변수는 const로
      "no-var": "error", // var 키워드 금지
    },
  },
];
```

---

## 4\. ESLint 환경 구축 시 주의사항

### 1\. Prettier와의 충돌 방지

- **문제점:** ESLint에도 **스타일 관련 규칙**(예: 세미콜론 사용 여부, 들여쓰기)이 많고, Prettier 또한 포맷팅을 담당하므로 두 도구가 서로 충돌하는 규칙으로 인해 에러가 발생할 수 있습니다.
- **해결:** `eslint-config-prettier` 패키지를 사용하여 **ESLint의 모든 스타일 관련 규칙**을 비활성화하고 포맷팅은 **Prettier**에게 전적으로 위임해야 합니다.

### 2\. 규칙에 대한 예외 처리 (주석 사용)

특정 코드 라인에서만 규칙을 **임시로 제외**하고 싶다면 주석을 사용합니다.

- `// eslint-disable-line [규칙명]`: 해당 라인에서만 규칙을 비활성화.
- `// eslint-disable-next-line [규칙명]`: 다음 라인에서만 규칙을 비활성화.
- **`react-hooks/no-exhaustive-deps`:** `useEffect`, `useCallback` 등 의존성 배열(`deps array`)이 필요한 훅에 의존성이 제대로 선언되었는지 확인하는 중요한 규칙입니다. 이 규칙을 임의로 비활성화하는 것은 **주의**해야 합니다.

### 3\. ESLint 버전 충돌

- **문제점:** 설치한 플러그인(`eslint-plugin-*`)이나 설정(`eslint-config-*`) 패키지가 ESLint 코어 버전이나 다른 의존성의 버전과 서로 달라 충돌이 발생할 수 있습니다.
- **해결:** ESLint는 `peerDependencies`를 설정하여 의존성 충돌을 피하도록 권장합니다. 환경 설정 시 의존성 버전을 명확히 맞춰야 합니다.
