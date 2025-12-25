# Takeaways

## ESLint를 활용한 정적 코드 분석

### 정적 코드 분석

- 버그를 방지하기 위한 방법 중 하나
- 코드의 실행과는 별개로 코드 그 자체만으로 코드 스멜(잠재적으로 버그를 야기할 수 있는 코드)을 찾아내어 문제의 소지가 있는 코드를 사전에 수정하는 것
- JS생태계 대표적 정적 코드 분석 도구: ESLint

### ESLint는 어떻게 코드를 분석할까

1. 자바스크립트 코드를 문자열로 읽는다.
2. 자바스크립트 코드를 분석할 수 있는 parser로 코드를 구조화한다.

- 자바스크립트를 분석하는 parser에는 여러가지가 있는데, ESLint는 기본값으로 espree를 사용
  - espree같은 코드 분석 도구는 코드의 정확한 위치와 같은 세세한 정보도 분석해 알려준다. 그래야 ESLint나 Prettier같은 도구가 코드 줄바꿈, 들여쓰기 등을 파악할 수 있게 된다.
  - 타입스크립트도 @typescript-eslin/typescript-estree 라고 하는 espree 기반 파서가 있다. 이를 통해 타입스크립트 코드를 분석해 구조화한다.
- JSON형태로 구조화된다.
- AST explorer

3. 구조화한 트리를 AST(Abstract Syntax Tree)라 하며, AST를 기준으로 각종 규칙과 대조한다.
4. 규칙과 대조했을때 이를 위반한 코드를 알리거나(report) 수정한다.(fix)

#### ESLint 규칙

- plugins: 특정한 규칙 모음

debugger만 있는 코드를 espree로 분석한 모습

```
{
"type": "Program",
"body": [
  {
    "type": "DebuggerStatement",
    "range": [0,8]
  }
],
"sourceType": "module",
"range": [0, 8]
}
```

no-debugger 규칙

```
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow the use of `debugger`',
      recommended: true,
      url: 'https://eslint.org/docs/rules/no-debugger',
    },
    fixable: null,
    schema: [],
    messages: {
      unexpected: "Unexpected 'debugger' statement.",
    },
  },
  create(context){
    return {
      DebuggerStatement(node){
        context.report({
          node,
          messageId: 'unexpected',
        })
      }
    }
  }
}
```

- meta: 해당 규칙과 관련된 메타 정보

  - messages: 규칙을 어겼을때 반환하는 경고 문구
  - docs: 문서화에 필요한 정보
  - fixable: eslint --fix 로 수정 가능한지 여부

- create: 실제로 코드에서 문제점을 확인하는 곳, create 필드에 만들 함수는 espree로 만들어진 AST트리를 순회해, 여기서 선언한 특정 조건을 만족하는 코드를 찾고, 이러한 작업을 코드 전체에서 반복한다. 여기서는 DebuggerStatement를 만나면 해당 노드를 리포트해 debugger를 사용했다는 것을 알려준다.
  - create 필드에 만든 함수는 객체를 반환해야 하는데, 이 객체에서는 코드 스멜을 감지할 선택자나 이벤트명 등을 선언할 수 있다.

### eslint-plugin과 eslint-config

- ESlint관련 npm 패키지
- 네이밍 규칙
  - eslint-plugin과 eslint-config라는 접두사를 준수해야한다.
  - 반드시 한 단어로 구성해야 한다. (eslint-plugin-naver-financials는 불가능. eslint-plugin-naver 가능)
  - 특정 스코프가 앞에 붙는 것 까지는 가능(@titicaca/eslint-config-triple)

#### eslint-plugin-\*

- 특정 프레임워크나 도메인과 관련된 규칙을 묶어서 제공하는 패키지
- eslint-plugin-import: JS에서 다른 모듈을 불러오는 import와 관련된 다양한 규칙 제공
- eslint-plugin-react: react/jsx-key 등 (ESLint는 코드 정적 분석 도구라서 key가 유니크한 값인지까지는 확인 불가, key 존재 여부는 확인 가능)

#### eslint-config-\*

- eslint-plugin을 한데 묶어서 한 세트로 제공하는 패키지
- eslint-config-airbnb
- @titicaca/triple-config-kit
  - 외부로 제공하는 규칙에 대한 테스트 코드가 존재
- eslint-config-next
  - JS코드를 정적으로 분석할 뿐 아니라 JSX구문, \_app, \_document에 작성돼 있는 HTML 코드 또한 정적 분석 대상으로 분류해 제공
  - 핵심 웹 지표 분석해 제공

### 나만의 ESLint 규칙 만들기

#### 이미 존재하는 규칙을 커스터마이징해서 적용하기: import React를 제거하기 위한 ESLint 규칙 만들기

- no-restricted-imports를 커스터마이징하면 import하는 모듈을 제한할 수 있다.
- 웹팩이 빌드 시 트리쉐이킹을 한다 해도, 웹팩이 트리쉐이킹 하는 데 걸리는 시간을 줄일 수 있으므로 import React를 제거하는 것은 유용하다. 트리쉐이킹에 소요되는 시간이 없어진다면 빌드 속도 또한 빨라지기 때문.

.eslintrc.js 파일

```
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        // paths에 금지시킬 모듈 추가
        paths: [
          {
            // 모듈명
            name: 'react',
            // 모듈의 이름
            importNames: ['default'],
            // 경고 메시지
            message: "import React from 'react'는 react 17부터 더 이상 필요하지 않습니다. 필요한 겂만 react로 부터 import해서 사용해주세요.",
          }
        ]
      }
    ]
  }
}
```

- no-restricted-imports: 어떠한 모듈을 import하는 것을 금지하기 위해 만들어진 규칙
- 금지시킬 모듈은 react인데 그 중에서도 default export만 금지

트리쉐이킹이 되지 않는 lodash같은 라이브러리를 import하는 것 방지

```
module.exports = {
  rules: {
    'no-restricted-imports': [
      'error',
      {
        name: 'lodash',
        message: "lodash는 CommonJS로 작성돼 있어 트리쉐이킹이 되지 않아 번들 사이즈를 크게 합니다. lodash/* 형식으로 import 해주세요",
      }
    ]
  }
}

```

- lodash는 CommonJS로 만들어져 있어서, 필요한 함수 하나만 써도 번들러가 전부 다 포함해버릴 수 있다 → 그래서 lodash/\*로 쪼개서 가져오라는 뜻
- lodash-es (ESM 버전)
  - ES Module 기반
  - 트리 쉐이킹 가능
  - 최신 번들러(Vite, Rollup)에 최적

#### 완전히 새로운 규칙 만들기: new Date를 금지시키는 규칙

- new Date(): 기기에 종속된 현재 시간. 기기의 현재 시간을 변경하면 같이 변경됨.
- 항상 한국 시간을 반환하는 서버에 의존해 작업하는 규칙
  - 서버의 시간을 반환하는 함수인 ServerDate()사용
  - new Date(1664608053676)나 new Date('2022-01-01')은 허용해야 한다.

```
...

create: function (context){
  return {
    NewExpression: function(node){
      if(node.callee.name === 'Date' && node.arguments.length === 0){
        context.report({
          node: node,
          messageId: 'message',
          fix: function(fixer){
            return fixer.replaceText(node, 'ServerDate()')
          }
        })
      }
    }
  }
}

```

- create 필드에 만든 함수는 객체를 반환해야 하는데, 이 객체에서는 코드 스멜을 감지할 선택자나 이벤트명 등을 선언할 수 있다.
- 아래 예시에서는 NewExpression이라고 하는 타입의 선택자를 키로 선언해서 new 생성자를 사용할 때 ESLint가 실행되게 한다.
- 그리고 해당 NewExpression을 찾았을 때, 해당 node를 기준으로 찾고자 하는 생성자인지 검증하는 코드를 넣는다. 여기서는 callee.name이 Date이고, 인수는 없는 경우를 찾는다.
- 이를 찾았다면 context.report를 통해 해당 코드 스멜을 리포트하고 문제가 되는 노드와 찾았을때 노출하고 싶은 메시지를 가리킨다. 이 메시지 정보는 meta.messages에서 가져올 수 있는데, meta.messages의 객체에 키 값을 선언해두면 해당 키 값을 가진 meta.messages의 값을 가져오게 된다.
- 마지막으로 fix를 키로 하는 함수를 활용해 자동으로 수정하는 코드를 넣어줄 수 있다. 여기서는 ServerDate()라고 하는 함수로 대체하는 코드까지 넣어준다.

#### 만든 규칙 배포

- 이렇게 규칙을 만들었으면, 해당 규칙을 배포. 규칙은 하나씩 배포는 불가능. 반드시 eslint-plugin 형태로 묶어서 배포.
- 먼저 빈 패키지를 만든 다음, yo와 generate-eslint를 활용해 eslint-plugin을 구성할 환경 구성
  - yo(Yeoman): 프로젝트 초기 구조(보일러플레이트)를 자동으로 만들어주는 도구. yo 자체는 아무것도 안만들고 어떤 생성기를 실행할지만 관리
    - create-next-app → Next.js 전용 생성기
    - yo → 범용 생성기 실행기
  - generator-eslint: ESLint 플러그인 / 규칙 / config를 만들어주는 Yeoman용 생성기
  - `yo eslint:plugin` = ESLint 플러그인 패키지 뼈대를 만들어 달라는 뜻
  - `yo eslint:rule` = 규칙(rule) 하나 생성
  - `yo eslint:config` = shareable config 생성
- rules/no-new-date.js 파일을 열고 앞에서 작성한 규칙을 붙여넣는다. 그리고 docs에는 해당 규칙을 위한 설명을, tests에는 테스트 코드를 작성한다.
- 마지막으로 npm publish로 배포한다음 원하는 프로젝트에서 설치해 사용

### 주의할 점

#### Prettier와의 충돌

- JS에서만 작동하는 ESLint와는 다르게 Prettier는 JS뿐만 아니라 HTML, CSS, 마크다운, JSON 등 다양한 언어에도 적용 가능
- ESLint에서도 Prettier에서 처리하는 작업(들여쓰기, 줄바꿈, 따옴표, 최대 글자 수 등)을 처리할 수 있기 때문에 두 가지 모두를 자바스크립트 코드에서 실행하면 서로 충돌하는 규칙으로 인해 에러가 발생하고 최악의 경우 둘 다 모두 만족하지 못하는 코드가 만들어짐

**해결방법**

1. Prettier에서 제공하는 규칙을 어기지 않도록 ESLint에서는 해당 규칙을 끈다. 이 경우 코드에 ESLint를 적용하는 작업과 코드의 포매팅을 하는 작업이 서로 다른 패키지에서 발생.
2. 자바스크립트나 타입스크립트는 ESLint에, 그 외의 파일(마크다운, YAML, JSON 등)은 모두 Prettier에 맡기는 것. 그 대신 자바스크립트에 추가적으로 필요한 Prettier관련 규칙은 모두 eslint-plugin-prettier를 사용한다.
   `npm install -D eslint prettier eslint-plugin-prettier eslint-config-prettier`

- eslint-plugin-prettier: Prettier에서 제공하는 모든 규칙을 ESLint에서 사용할 수 있는 규칙으로 만들어둔 플러그인이다.

#### 규칙에 대한 예외 처리, 그리고 react-hooks/no-exhaustive-deps

- 일부 코드에서 특정 규칙을 임시로 제외시키고 싶다면 eslint-disable- 주석 사용
- `// eslint-disable-line no-exhaustive-deps`: useEffect나 useMemo와 같이 의존 배열이 필요한 훅에 의존성 배열을 제대로 선언했는지 확인하는 역할
  - 의존성 배열이 너무 길어지거나, 혹은 빈배열을 넣어서 컴포넌트가 마운트 되는 시점에 한번만 강제로 실행되게 하고 싶을때 등 사용. 그러나 이것은 위험한 발상이며 잠재적 버그를 야기할 수 있다.
  - 괜찮다고 임의로 판단한 경우: 가장 위험. 실제로 면밀히 검토해서 괜찮은 경우라면 해당 변수는 컴포넌트의 상태와 별개로 동작한다는 것을 의미한다. 이 경우는 해당 변수를 어디서 어떻게 선언할지 다시 고민해 봐야 한다.
  - 의존성 배열이 너무 긴 경우: 의존성 배열이 너무 길다는 것은 useEffect 내부 함수가 너무 길다는 말과 동일. useEffect를 쪼개서 의존성 배열의 가독성과 안정성을 확보
  - 마운트 시점에 한번만 실행하고 싶은 경우: 이러한 접근 방법은 과거 클래스 컴포넌트에서 사용되던 생명 주기 형태의 접근 방법으로, 함수 컴포넌트 패러다임과는 맞지 않을 가능성이 있다. 또한 []배열이 있다는 것은 컴포넌트의 상태값과 별개의 부수 효과가 되어 컴포넌트의 상태와 불일치가 일어날 수 있게 된다. 마지막으로 상태와 관계없이 한번만 실행되야 하는 것이 있다면 해당 컴포넌트에 존재할 이유가 없다. 이 경우 적절한 위치로 옮기는 것이 옳다.
    물론 정말 넣을 것이 없어서 []를 넣는 경우는 당연히 제외된다. 여기서 말하는 경우는 상태에 의존하고 있음에도 고의로 빈 배열을 넣는 경우를 말한다.
- `typescript-eslint/no-explicit-any` : 타입스크립트 any를 강제로 사용
- 그러나 정말로 필요 없는 규칙이라면 off를 사용해 끄는 것이 옳다. eslint-disable을 많이 사용하고 있다면 그렇게 무시하는것이 옳은지, 아니면 해당 규칙을 제거하는 것이 옳은지 꼭 점검.

```js
// 특정 줄만 제외
console.log("hello world"); // eslint-disable-line no-console

// 다음 줄 제외
// eslint-disable-next-line no-console
console.log("hello world");

// 특정 여러 줄 제외
/* eslint-disable no-console */
console.log("hello world");
console.log("good world");
/* eslint-disable no-console */

// 파일 전체에서 제외
/* eslint-disable no-console */
console.log("hello world");
```

#### ESLint 버전 충돌

- ESLint 공식 문서에서는 ESLint를 peerDependencies로 설정하라고 권장.
  - peerDependencies: "이 패키지는 이 라이브러리랑 같이 쓰는 걸 전제로 만들어졌어요. 대신 제가 직접 설치하진 않을게요."
- 설치하고자 하는 eslint-config, eslint-plugin이 지원하는 ESLint 버전을 확인, 또 설치하고자 하는 프로젝트에서 ESLint 버전을 어떻게 지원하고 있는지 확인

```
"peerDependencies": {
  "eslint": "^8 || ^9"
}

// “이 패키지는 ESLint 위에서 동작합니다. ESLint는 당신 프로젝트가 직접 설치해야 해요.”
```

- peerDependencies가 없을 때

```
eslint-plugin-prettier
 └─ eslint@8.56.0   ← 플러그인이 자체 설치
프로젝트
 └─ eslint@9.0.0

결과:
- ESLint가 2개
- 플러그인이 다른 ESLint 인스턴스에 붙음
- 규칙 안 먹힘 / 에러 / 충돌
```

- peerDependencies가 있을 때

```
프로젝트
 ├─ eslint@9.0.0
 └─ eslint-plugin-prettier
      (eslint는 peer로만 요구)

결과:
- ESLint 1개
- 플러그인이 같은 ESLint 인스턴스 사용
- 정상 동작
```

- 예) eslint-plugin-prettier의 package.json

```
{
  "peerDependencies": {
    "eslint": ">=7"
  }
}

의미:
- “난 ESLint 위에서 돌아가”
- “ESLint는 네가 설치해”
- “버전은 최소 7 이상이면 돼”
```

### 기타

- 카나리 배포(Canary): 새 버전을 전체 사용자에게 한 번에 배포하지 않고, 일부 사용자에게만 먼저 배포해서 문제가 없는지 확인한 뒤 점진적으로 확대하는 배포 전략
