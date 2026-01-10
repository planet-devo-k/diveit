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

## 리액트 팀이 권장하는 리액트 테스트 라이브러리

- 백엔드 테스트

  - 서버나 데이터베이스에서 원하는 데이터를 올바르게 가져올 수 있는지, 데이터 수정 간 교착 상태나 race condition이 발생 하지는 않는지, 데이터 손실은 없는지, 윽정 상황에서 장애가 발생하지 않는지 등을 확인
  - 화이트박스 테스트
  - GUI가 아닌 AUI에서 주로 수행해야 하기 때문에 어느 정도 백엔드에 대한 이해가 있는 사람만 가능

- 프론트엔드 테스트
  - 일반적인 사용자와 동일하거나 유사한 환경에서 수행
  - 사용자가 프로그램에서 수행할 주요 비즈니스 로직이나 모든 경우의 수를 고려해야 하며 이 과정에서 사용자는 굳이 프론트엔드 코드를 알 필요는 없다.
  - 블랙박스 테스트
  - 시나리오가 어느정도 정해져 있는 백엔드와는 다르게 프론트엔드는 사용자에게 완전히 노출된 영역이므로 어떻게 작동할 지 최대한 예측해서 확인. 사용자는 개발자의 의도대로만 사용하지 않기 때문.
  - 디자인 요소 뿐 아니라 사용자의 인터랙션, 의도치 않은 작동 등 브라우저에서 발생할 수 있는 다양한 시나리오를 고려해야 하기 때문에 테스팅하기 번거로움 → 제공되는 테스팅 라이브러리 다양
  - 함수나 컴포넌트 수준에서 유닛 테스트하거나 사용자가 하는 작동을 모두 흉내 내서 테스트할 수도 있다.

### React Testing Library

- DOM Testing Library를 기반으로 만들어졌다. 리액트를 기반으로 한 테스트를 수행.
  - DOM Testing Library는 jsdom을 기반으로 하고 있다.
  - jsdom
    - 순수하게 자바스크립트로 작성된 라이브러리
    - HTML 이 없는 자바스크립트만 존재하는 환경(Node.js 같은 환경)에서 HTML과 DOM을 사용할 수 있도록 해주는 라이브러리
    - 마치 HTML이 있는 것처럼 DOM을 불러오고 조작할 수 있다.
- jsdom을 사용해 자바스크립트 환경에서 HTML을 사용할 수 있는 DOM Testing Library를 기반으로, 리액트 환경에서 리액트 컴포넌트를 테스팅할 수 있는 라이브러리가 리액트 테스팅 라이브러리
- 리액트 테스팅 라이브러리를 사용하면 실제로 리액트 컴포넌트를 렌더링하지 않고도, 즉 브라우저를 직접 실행해 눈으로 확인하지 않아도 리액트 컴포넌트가 원하는 대로 렌더링되고 있는지 확인할 수 있다.
- 컴포넌트 뿐만 아니라 Provider, 훅 등 리액트를 구성하는 다양한 요소들을 테스트 할 수 있다.

### 자바스크립트 테스트의 기초

- 기본적인 테스트 코드를 작성하는 과정

1. 테스트할 함수나 모듈 선정
2. 함수나 모듈이 반환하길 기대하는 값을 적는다.
3. 함수나 모듈의 실제 반환 값을 적는다.
4. 3번의 기대에 따라 2번의 결과가 일치하는지 확인
5. 기대하는 결과를 반환하면 테스트 성공. 만약 기대와 다른 결과를 반환하는 에러를 던진다. → Node.js의 assert 모듈 사용

- 테스트 결과를 확인할 수 있도록 도와주는 라이브러리를 assertion 라이브러리라고 한다.
- assertion 라이브러리는 Node.js가 제공하는 assert 외에도 should.js, expect.js, chai 등 다양하다.
- assertion 라이브러리는 단순히 동등을 비교하는 equal외에도 객체 자체가 동일한지 확인하는 deepEqual, 같지 않은지 비교하는 notEqual, 에러를 던지는지 여부를 확인하는 throws 등 다양한 메서드 제공

- 일반적으로 테스트 코드와 실제 코드는 분리해 작성

- 테스팅 프레임워크

  - 테스팅 프레임워크들은 어설션을 기반으로 테스트를 수행 + 테스트 코드 작성자에게 도움이 될 만한 정보를 알려준다.
  - 무엇을 테스트했는지, 소요된 시간은 어느정도인지, 무엇이 성공하고 실패했는지, 전체 결과는 어떤지 등 자세한 정보 확인
  - 자바스크립트에서 유명한 테스팅 프레임워크: Jest, Mocha, Karma, Jasmine, Vitest 등

    - Jest의 경우 자체 제작한 expect패키지를 사용해 어설션 수행
    - Vitest는 Jest의 사용법을 거의 그대로 가져오면서도, 성능은 비약적으로 향상
      | 세대 | 대표 프레임워크 | 특징 | 현재 상태 |
      | :-------- | :----------------- | :------------------------------------------------- | :---------------------------- |
      | **1세대** | **Jasmine, Karma** | 초기 테스트 환경 구축 | 거의 사용되지 않음 (Legacy) |
      | **2세대** | **Mocha, Chai** | 유연성이 높지만 설정이 복잡함 | 일부 프로젝트에서 유지보수 중 |
      | **3세대** | **Jest** | 모든 기능이 포함된 'All-in-one'. 가장 높은 점유율. | 여전히 시장 점유율 1위 (표준) |
      | **4세대** | **Vitest** | Vite 기반, ESM 중심, 압도적 속도. | 신규 프로젝트에서 급부상 중 |

  - Vitest
    - Vite와의 통합: 프로젝트 빌드 도구로 Vite를 사용한다면 별도의 복잡한 설정 없이 Vite의 설정(vite.config.ts)을 그대로 공유해서 테스트를 수행할 수 있습니다.
    - 압도적인 속도: Vite의 핵심 강점인 HMR(Hot Module Replacement) 기능을 테스트에도 적용하여, 코드를 수정할 때마다 변경된 부분만 아주 빠르게 다시 테스트합니다.
    - Jest와의 호환성: API가 Jest와 거의 동일합니다(expect, describe, it 등). 그래서 Jest를 써본 사람이라면 공부할 필요 없이 바로 쓸 수 있습니다.
      - Vitest는 Jest와의 호환성을 최우선으로 설계되었기 때문에, 앞에 jest라고 붙이던 것을 vi로만 바꾸면 바로 작동합니다.
    - 기본 지원 기능: 별도의 플러그인 없이도 TypeScript, JSX, ESM 등을 바로 이해합니다. Jest에서 이들을 설정하느라 고생했던 시간을 획기적으로 줄여줍니다.

- 언제 무엇을 선택해야 할까?
  - Jest를 선택할 때:
  - 이미 Jest로 짜인 거대한 프로젝트를 유지보수할 때.
  - Webpack을 빌드 도구로 사용하는 기존 React 프로젝트.
  - 가장 넓은 커뮤니티 답변과 안정성이 필요할 때.
  - Vitest를 선택할 때:
    - Vite 기반으로 프로젝트를 생성했을 때 (예: npm create vite@latest).
    - 테스트 실행 속도가 너무 느려서 생산성이 떨어질 때.
    - 타입스크립트 설정을 최대한 간결하게 유지하고 싶을 때.

### 리액트 컴포넌트 테스트 코드 작성하기

1. 컴포넌트 렌더링
2. 필요하다면 컴포넌트에서 특정 액션 수행
3. 컴포넌트 렌더링과 2번 액션을 통해 기대하는 결과와 실제 결과 비교

#### 프로젝트 생성

- 리액트 컴포넌트에서 테스트하는 일반적인 시나리오는 특정한 무언가를 지닌 HTML 요소가 있는지 여부다. 이를 확인하는 방법은 크게 3가지가 있다.
  - getBy...
    - 인수 조건에 맞는 요소를 반환. 해당요소가 없거나 두개 이상이면 에러를 발생시킨다. 복수개를 찾고싶으면 getAllBy... 사용
  - findBy...
    - getBy와 유사하나 차이는 Promise를 반환한다. (비동기로 찾는다) 비동기 액션 이후 요소를 찾을 때 사용.
    - 기본값으로 1000ms 타임아웃을 가지고 있다.
    - 복수개를 찾고싶다면 findAllBy
  - queryBy...
    - 인수 조건에 맞는 요소를 반환하는 대신 찾지 못한다면 null 반환.
    - getBy와 findBy는 찾지 못하면 에러를 발생시키기 때문에 찾지 못해도 에러를 발생시키지 않고싶다면 queryBy를 사용. 복수개는 queryAllBy
- 컴포넌트를 테스트하는 파일은 같은 디렉터리상에 위치하는 것이 일반적이다. (App.tsx, App.test.tsx)
- 대부분의 프레임워크가 이러한 이름으로 된 파일은 번들링에서 제외 (\*.test.tsx)

#### 정적 컴포넌트

- 별도의 상태가 존재하지 않아 항상 같은 결과를 반환하는 컴포넌트
- 테스트를 원하는 컴포넌트를 렌더링한 다음 테스트를 원하는 요소를 찾아 원하는 테스트 수행
- 정적 컴포넌트 렌더링 → describe로 연관된 테스트를 묶어서 → it으로 it 함수 내부에 정의된 테스트 수행

- jest 메서드
  - beforeEach: 각 테스트(it)를 수행하기 전에 실행하는 함수.
  - describe: 비슷한 속성을 가진 테스트를 하나의 그룹으로 묶는 역할. 필수는 아니다. describe내부에 describe를 또 사용할수 있다.
  - it: test의 축약어(alias)
  - testId: 리액트 테스팅 라이브러리의 예약어. get 등의 선택자로 선택하기 어렵거나 곤란한 요소를 선택하기 위해 사용. HTML의 DOM요소에 testId 데이터셋을 선언해두면 이후 테스트 시에 getByTestId, findByTestId로 선택할 수 있다.

#### 동적 컴포넌트

- 사용자가 useState를 통해 입력을 변경하는 컴포넌트
  - 리액트 테스팅 라이브러리에서 사용자의 입력을 흉내내고 state변화에 따른 컴포넌트 변화 테스트
  - setup함수
    - 내부에서 컴포넌트를 렌더링하고 테스트에 필요한 button과 input을 반환한다.
    - 이 파일에서 수행하는 모든 테스트는 렌더링과 button, input을 필요로 하므로 이를 하나의 함수로 묶어 두었다.
  - userEvent.type
    - 사용자가 타이핑하는 것을 흉내내는 메서드
    - @testing-library/react 에서 제공하는 fireEvent와 차이가 있다.
      - 기본적으로 userEvent는 fireEvent의 여러 이벤트를 순차적으로 실행해 좀 더 자세하게 사용자의 작동을 흉내낸다. 즉, userEvent는 사용자의 작동을 여러 fireEvent를 통해 좀 더 자세히 흉내내는 모듈
      - 예를 들어 userEvent.click을 수행하면 내부적으로 아래와 같은 fireEvent가 실행
        - fireEvent.mouseOver
        - fireEvent.mouseMove
        - fireEvent.mouseDown
        - fireEvent.mouseUp
        - fireEvent.click
      - maxLength는 사용자가 하나씩 입력하는 경우에만 막히고 코드로 한번에 입력하는 경우에는 작동하지 않는다. fireEvent.type으로는 maxLength를 확인할수 없으므로 userEvent.type을 사용해야 한다.
      - 대부분의 이벤트를 테스트할때는 fireEvent로 충분하고 훨씬 더 빠르다. 단 특별히 사용자의 이벤트를 흉내내야할때만 userEvent를 사용한다.
  - jest.spyOn(window, 'alert').mockImplementation()
    - jest.spyOn
      - 특정 객체의 메서드를 오염시키지 않고 단순히 관찰하는 용도로 사용
      - 어떤 특정 메서드를 오염시키지 않고 실행이 됐는지, 또 어떤 인수로 실행됐는지 등 실행과 관련된 정보만 얻고 싶을 때 사용
      - 여기서는 window, alert 인수와 함께 사용됐는데 이는 window객체의 메서드 alert을 구현하지 않고 해당 메서드가 실행됐는지만 관찰하겠다는 뜻
      - 몇번 호출됐는지(toBeCalledTimes()), 원하는 인수와 함께 호출됐는지(toBeCalledWith()) 등 확인 가능
    - mockImplementation
      - 해당 메서드에 대한 모킹 구현을 돕는다.
      - 위에서는 Node.js환경에서 window.alert가 존재하지 않으므로 해당 메서드를 모의함수(mock)로 구현.
    - Node.js가 존재하지 않는 window.alert를 테스트하기 위해 jest.spyOn을 사용해 window.alert를 관찰하게끔 하고 mockImplementation을 통해 window.alert가 실행됐는지 등의 정보를 확인할수 있도록 처리한 것. 실제 alert가 발생할때 해당 모의 함수가 실행되어 함수가 몇번 실행됐는지, 어떤 인수와 함께 실행됐는지 관찰할 수 있다.
  - jest에서 사용자 작동을 흉내내는 메서드는 type외에도 click, 더블클릭(dbclick), clear 등 다양하다.
  - 액션이 수행된 이후에 DOM에 기댓값이 반영됐는지 확인하는 방법은 정적인 컴포넌트와 동일

#### 비동기 이벤트가 발생하는 컴포넌트

- MSW(Mock Service Worker)

  - Node.js나 브라우저 모두에서 사용할 수 있는 모킹 라이브러리
  - 브라우저에서는 서비스 워커를 활용해 실제 네트워크 요청을 가로채는 방식으로 모킹을 구현한다.
  - Node.js 환경에서는 https나 XMLHttpRequest 요청을 가로채는 방식으로 작동
  - fetch요청하는 것과 동일하게 네트워크 요청을 수행하면 MSW가 이를 감지하고 미리 준비한 모킹 데이터 제공
  - fetch의 모든 기능을 그대로 사용하면서도 응답에 대해서만 모킹

- setupServer
  - MSW에서 제공하는 메서드로 서버를 만드는 역할
  - 이 함수 내부에서 라우트를 선언할 수 있다. 이 라우트 내부에서 서버 코드를 작성하는 것과 동일하게 코드를 작성하고 대신 응답하는 데이터만 미리 준비해 둔 모킹 데이터 반환
- 테스트 코드를 시작하기 전에는 서버를 기동하고 테스트 코드 실행이 종료되면 서버를 종료
- setupServer에서는 정상적인 응답만 모킹했기 때문에 실패하는 경우를 테스트하기 위해 server.use 사용해 기존 setupServer 내용을 새롭게 덮어쓴다.
- 서버에서 실패가 발생하는 경우를 테스트하기 위해 res를 ctx.status(503)같은 형태로 변경하므로 테스트 실행마다 setupServer를 리셋
- findBy를 활용해 비동기 요청이 끝난 뒤에 제대로 된 렌더링이 일어났는지 기다린 후에 확인한다.

### 사용자 정의 훅 테스트하기

- react-hooks-testing-library
- 리액트 18부터는 @testing-library/react에 통합된 renderHook 사용

- 훅을 렌더링하기 위해서는 renderHook을 래핑해서 사용해야 한다.
- renderHook함수를 살펴보면 내부에서 TestComponent라는 컴포넌트를 생성하고 이 컴포넌트 내부에서 전달받은 훅을 실행.
- renderHook 하나당 하나의 독립된 컴포넌트가 생성되므로 같은 컴포넌트에서 훅을 두번 호출하려면 renderHook이 반환하는 객체의 값 중 하나인 rerender 함수 사용
- renderHook에서는 함수의 초깃값인 initialProps를 지정할 수 있는데 이후 rerender함수를 호출할 때 여기서 지정한 초깃값을 변경해 다시 렌더링

### 테스트를 작성하기에 앞서 고려해야 할 점

- 테스트 커버리지: 해당 소프트웨어가 얼마나 테스트됐는지를 나타내는 지표

  - 테스트 커버리지는 단순히 얼마나 많은 코드가 테스트 되고 있는지를 나타내는 지표일 뿐 테스트가 잘 되고 있는지를 나타내는 것은 아니다.
  - 테스트 커버리지를 100%까지 끌어올릴수 있는 상황은 드물다

- TDD(Test Driven Development)를 차용해 테스트를 우선시해도 서버 코드와 달리 프론트엔드 코드는 사용자의 입력이 매우 자유롭기 때문에 이런 모든 상황을 커버해 테스트를 작성하기란 불가능하다.

- 테스트 코드를 작성하기 전에 생각해봐야 할 최우선 과제는 애플리케이션에서 가장 취약하거나 중요한 부분을 파악하는 것이다.
- 애플리케이션에서 가장 핵심이 되는 부분부터 먼저 테스트 코드를 하나씩 작성
- 테스트 코드는 소프트웨어 코드를 100% 커버하기 위해 혹은 모두 그린 사인을 보기 위해 작성하는 것이 아니다. 소프트웨어 품질에 대한 확신을 얻기 위해 작성하는 것이다.

- 테스트가 이뤄야 할 목표는 애플리케이션이 비즈니스 요구사항을 충족하는지 확인하는 것

### 그 밖에 해볼 만한 여러가지 테스트

- 사용자도 한정적이고 사용할 수 있는 케이스도 어느정도 제한적인 백엔드에 비해 프론트엔드는 무작위 사용자가 애플리케이션에서 갖가지 작업을 한다.
- 프론트엔드 테스트 방법
  - 유닛 테스트: 각각의 코드, 컴포넌트가 독립적으로 분리된 환경에서 의도된 대로 정확히 작동하는지 검증
  - 통합테스트 (Integration Test): 유닛 테스트를 통과한 여러 컴포넌트가 묶여서 하나의 기능으로 정상 작동하는지 확인
  - E2E(End to End Test): 실제 사용자처럼 작동하는 로봇을 활용해 애플리케이션의 전체적인 기능을 확인
- 리액트 테스팅 라이브러리는 유닛테스트 내지는 통합테스트를 도와주는 도구
- E2E 테스트를 수행하려면 Cypress 같은 다른 라이브러리의 힘을 빌려야한다.

### 기타

- 카나리 배포(Canary): 새 버전을 전체 사용자에게 한 번에 배포하지 않고, 일부 사용자에게만 먼저 배포해서 문제가 없는지 확인한 뒤 점진적으로 확대하는 배포 전략
- AUI(Application User Interface): 특정 애플리케이션의 기능을 수행하기 위한 전용 인터페이스
  - 특정 응용 프로그램(Application) 내에서 사용자가 기능을 제어하고 데이터를 확인하기 위해 사용하는 모든 화면 요소
  - GUI(Graphical UI)와의 관계
    - GUI가 '그래픽'이라는 방식에 집중한다면, AUI는 '애플리케이션의 비즈니스 로직을 수행하는 통로'라는 목적에 집중한 표현입니다.
  - 일반적인 웹사이트보다는 복잡한 데이터를 다루는 어드민 페이지, 대시보드, 전문 툴(ERP, 솔루션) 등에서 "애플리케이션다운 인터페이스"를 강조할 때 사용됩니다.
- 화이트 박스 테스트(White-box Testing): 소프트웨어의 내부 구조와 소스 코드를 직접 들여다보며 수행하는 테스트 방식입니다. 내용물이 훤히 보이는 '투명한 박스'를 테스트한다는 의미에서 '글래스 박스(Glass Box)' 또는 '오픈 박스(Open Box)' 테스트라고도 부릅니다.
- 데이터셋
  - HTML의 특정 요소와 관련된 임의 정보를 추가할 수 있는 HTML속성
  - HTML의 특정 요소에 data-로 시작하는 속성은 무엇이든 사용할 수 있다.
- 서비스 워커(Service Worker)

  - 브라우저가 백그라운드에서 실행하는 스크립트로, 웹 페이지(메인 스레드)와 별개로 작동하는 일종의 '프록시 서버(중간 대리인)' 역할을 합니다.
  - 브라우저와 네트워크 사이에서 전송되는 데이터를 가로채고 조작할 수 있는 보이지 않는 일꾼
  - 서비스 워커의 핵심 역할 (프록시 서버)
    - 일반적인 웹 앱은 브라우저가 서버에 직접 데이터를 요청하지만, 서비스 워커가 설치되면 모든 요청이 일단 서비스 워커를 거쳐갑니다.
    - 네트워크 요청 가로채기: 브라우저가 fetch 요청을 보낼 때 이를 중간에서 낚아챕니다.
    - 캐싱 전략: "오프라인 상태네? 서버에 가지 말고 미리 저장해둔(캐시) 데이터를 보여줘야지." 하고 판단합니다.
    - 가짜 응답 보내기 (MSW의 핵심): "서버까지 갈 필요 없어. 내가 미리 준비한 가짜(Mock) 데이터를 줄게!" 하고 서버인 척 응답합니다.
  - 서비스 워커의 제약 사항
    - 서비스 워커는 매우 강력한 권한을 가지기 때문에 몇 가지 엄격한 규칙이 있습니다.
    - HTTPS 필수: 중간에서 데이터를 가로채는 특성상 보안을 위해 HTTPS 환경(또는 localhost)에서만 작동합니다.
    - DOM 접근 불가: 웹 페이지와 별개의 스레드이므로 window나 document 객체에 직접 접근할 수 없습니다. 대신 메인 페이지와 메시지를 주고받으며 소통합니다.
    - 비동기 처리: Promise 기반으로 작동하며, 동기적 작업(localStorage 등)은 사용할 수 없습니다.
  - 서비스 워커의 다른 활용 사례
    - PWA (Progressive Web Apps): 웹 사이트를 앱처럼 설치하고, 오프라인에서도 돌아가게 만듭니다.
    - 푸시 알림: 브라우저 창이 닫혀 있어도 서버에서 보낸 알림을 사용자에게 보여줍니다.
    - 백그라운드 동기화: 인터넷이 끊겼을 때 보낸 메시지를, 인터넷이 연결되는 순간 자동으로 재전송합니다.

- PWA

  - 웹사이트를 마치 스마트폰 앱(Native App)처럼 사용할 수 있게 해주는 기술

- PWA가 장점이 많지만 현업에서 리액트 네이티브(React Native) 같은 네이티브 앱 개발 방식을 여전히 선호하는 이유
  - 하드웨어 접근 권한의 차이 (가장 큰 이유)
    - PWA는 브라우저 위에서 실행되기 때문에 보안상 기기의 깊숙한 기능까지 건드리지 못합니다.
    - PWA가 못하는 것 (혹은 힘든 것): 연락처 접근, 블루투스 제어, 근거리 무선 통신(NFC), 고성능 가속도계 사용, Face ID/지문 인식 연동 등.
  - 성능과 부드러움 (UX)
    - PWA: 웹 기술(HTML/CSS/JS)로 화면을 그립니다. 애니메이션이 많거나 복잡한 계산이 들어가면 버벅일 수 있습니다.
    - 리액트 네이티브: 코드는 자바스크립트로 짜지만, 실제 화면은 iOS/Android의 진짜 네이티브 UI 구성 요소로 그려집니다. 게임이나 고해상도 그래픽 작업에서 훨씬 유리합니다.
  - 앱스토어 입점과 마케팅
    - PWA: 사용자가 웹사이트에 직접 접속해야 '설치' 팝업을 볼 수 있습니다. 일반 사용자는 "앱 = 앱스토어에서 다운로드"라고 생각하기 때문에 접근성에서 불리할 수 있습니다.
    - 리액트 네이티브: 구글 플레이스토어, 애플 앱스토어에 정식 출시가 가능합니다. '스토어 검색'을 통한 유입 무시할 수 없죠.
  - 플랫폼 최적화 (iOS vs Android)
    - PWA: 애플(iOS)은 PWA에 대해 상당히 보수적입니다. 푸시 알림 지원도 늦었고, 브라우저마다 동작이 조금씩 달라 모든 기기에서 동일한 경험을 주기 어렵습니다.
    - 리액트 네이티브: 각 OS의 특성에 맞는 UI(예: 아이콘 모양, 뒤로 가기 동작 등)를 더 세밀하게 구현할 수 있습니다.
- PWA를 선택하는 경우: 예산이 적고, 사용자가 앱스토어에서 다운로드받는 번거로움을 줄이고 싶을 때. (뉴스, 쇼핑몰, 가벼운 대시보드 등)
- 리액트 네이티브를 선택하는 경우: 고성능 애니메이션, 기기 기능(지문, 카메라 등)의 깊은 연동, 앱스토어를 통한 강력한 마케팅이 필요할 때. (금융 앱, SNS, 운동 추적 앱 등)
