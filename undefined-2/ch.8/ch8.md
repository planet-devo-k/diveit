# Chapter 8

## 1. ESLint를 활용한 정적 코드 분석

### 1. ESLint 살펴보기

#### ESLint는 어떻게 코드를 분석할까

1. 자바스크립트 코드를 문자열로 읽는다
2. 자바스크립트 코드를 분석할 수 있는 파서(parser)로 코드를 구조화 한다.
3. 2번에서 구조화한 트리를 AST(Abstract Syntax Tree)라 하며, 이 구조화된 트리를 기준으로 각종 규칙과 대조한다.
4. 규칙과 대조했을 떄 이를 위반한 코드를 알리거나 수정한다.

자바스크립트를 분석하는 파서에는 여러가지가 있는데, ESLint는 기본값으로 espree를 사용하.

*   espree가 구조화 하는 방법

    ```jsx
    function hello(str) {}
    ```

    이 코드를 espree로 분석하면 다음과같이 JSON형태로 구조화된 결과를 얻을 수 있음

    ```jsx
    {
    	"type": "Program",
    	"start": 0,
    	"end": 22,
    	"range": [0,22],
    	"body": [
    		{
    			"type": "FunctionDecalration",
    			"start": 0,
    			"end": 22,
    			"range": [0,22],
    			"id": {
    				"type": "Identifier",
    				"start": 9,
    				"end": 14,
    				"range": [9, 14],
    				"name": hello,
    			},
    			"expression": false,
    			"generator": false,
    			"async": false,
    			"params": [
    				{
    					"type": "Identifier",
    					"start": 15,
    					"end": 18,
    					"range": [15, 18],
    					"name": "str",
    				}
    			],
    			"body": {
    				"type": "BlockStatement",
    				"start": 20,
    				"end": 22,
    				"range": [20, 22],
    				"body": []
    			}
    		}
    	],
    	"sourceType": "module"
    }
    ```

    espree 같은 코드 분석 도구는 단순히 변수인지, 함수인지, 함수명은 무엇인지 등만 파악하는 것이 아닌 코드의 정확한 위치와 같은 아주 세세한 정보도 분석해 알려줌. 이러한 정보가 있어야 ESLint나 Prettier와 같은 도구가 코드의 줄바꿈, 들여쓰기 등을 파악할 수 있음. 타입스크립트의 경우에도 @typescript-eslint/typescript-estree 라고 하는 estree 기반 파서가 있으며, 이를 통해 타입스크립트 코드를 분석해 구조화 함. 이 두 파서 모두 AST explorer에서 사용해볼 수 있음.

    * **`ESLint 규칙(rules)`:** ESLint가 espree로 코드를 분석한 결과를 바탕으로, 어떻게 수정해야 할지 정하는 것
      *   no-debugger 규칙

          ```jsx
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
          	create(context) {
          	return {
          		DebuggerStatement(node) {
          			context.report({
          				node,
          				messageId: 'unexpected'm
          				})
          			},
          		}
          	},
          }
          ```

          * meta: 해당 규칙과 관련된 메타 정보
          * messages: 규칙을 어겼을 떄 반환하는 경고문구
          * docs: 문서화에 필요한 정보
          * fixable: exlint —fix로 수정했을 떄 수정가능 여부
          * create: 실제로 문제점을 확인하는 곳. espree로 만들어진 AST트리를 순회해 여기서 선언한 특정 조건을 ㅁ나족하는 코드를 찾고, 이러한 작업을 코드 전체에서 반복.
    * **`plugins`:** 특정한 규칙의 모음

### 2. eslint-plugin과 eslint-config

#### eslint-plugin

규칙을 모아놓은 패키지.

* eslint-plugin-import
* eslint-plugin-react

#### eslint-config

eslint-plugin을 한데 묶어서 완벽하게 한 세트로 제공하는 패키지

eslint-plugin, eslint-config와 관련된 네이밍 규칙이 있는데, eslint-plugin, eslint-config라는 접두사를 준수해야 하며, 반드시 한 단어로 구성해야 함

* 대표적으로 알려진 eslint-config
  * eslint-config-airbnb
  * @titicaca/triple-config-kit
  * eslint-config-next

### 3. 나만의 ESLint 규칙 만들기

#### 이미 존재하는 규칙을 커스터마이징 해서 적용하기

*   import React에 대해 리포트할 수 있는 ESLint 규칙 만들어보기 여기서 사용할 규칙은 no-restricted-imports no-restricted-imports : 어떠한 모듈을 금지하기 위해 만들어진 규칙

    ```jsx
    module.exports = {
    	rules: {
    		'mo-restricted-imports': {
    			'error',
    			{
    				// path에 금지시킬 모듈을 추가한다.
    				paths: [
    					{
    						// 모듈명
    						name: 'react',
    						// 모듈의 이름
    						importNames: ['default'],
    						// 경고 메시지
    						message:
    							"import React from 'react'는 react 17부터 더 이상 필요하지 않습니다. 필요한 것만 react로 부터 import해서 사용해주세요.",
    					},
    				],
    			},
    		],
    	},
    }

    ```

#### 완전히 새로운 규칙 만들기

```jsx
{
	"type": "Program",
	"start": 0,
	"end": 10,
	"range": [0, 10],
	"body": [
		{
			"type": "ExpressionStatement",
			"start": 0,
			"end": 10,
			"range": [0, 10],
			"expression": {
				"type": "NewExpression",
				"start": 0,
				"end": 10,
				"range": [0, 10],
				"callee": {
					"type": "Identifier",
					"start": 4,
					"end": 8,
					"range": [4, 8],
					"name": "Date",
				},
				"arguments": []
			}
		}
	],
	"sourceType": "module"
}
```

* ExpressionStatement: 해당 코드의 표현식 전체
* ExpressionStatement.expression : ExpressionStatement에 어떤 표현이 들어가있는지 확인. 이것이 ESLint에서 확인하는 하나의 노드 단위.
* ExpressionStatement.expression.type: 해당 표현이 어떤 타입인지 나타냄.
* ExpressionStatement.expression.callee: 생성자를 사용한 표현식에서 생성자의 이름
* ExpressionStatement.expression.arguments: 생성자를 표현한 표현식에서 생성자에 전달하는 인수
* 규칙 만들기

```jsx
/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: "suggestion",
    docs: {
      description: "disallow use of the new Date()",
      recommended: false,
    },
    fixable: "code",
    schema: [],
    messages: {
      message:
        "new Date()는 클라이언트에서 실행 시 해당 기기의 시간에 의존적이라 정확하지 않습니다. 현재 시간이 필요하다면 ServerDate()를 사용해주세요.",
    },
  },
  create: function (context) {
    return {
      NewExpression: function (node) {
        if (node.callee.name === "Date" && node.arguments.length === 0) {
          context.report({
            node: node,
            messageId: "message",
            fix: function (fixer) {
              return fixer.replaceText(node, "ServerDate()");
            },
          });
        }
      },
    };
  },
};
```

* 만든 규칙 배포하기 eslint-plugin 형태로 규칙을 묶음으로 배포하는 것만 가능 먼저 빈 패키지를 만든 다음 yo와 generate-eslint를 활용하면 됨.

### 4. 주의할 점

#### Prettier와의 충돌

* ESLint: 코드의 잠재적인 문제가 될 수 있는 부분을 분석
* Prettier: 포매팅과 관련된 작업(줄바꿈, 들여쓰기, 작은따옴표, 큰따옴표)

서로 충돌하는 문제를 해결하는 방법

1. 서로 규칙이 충돌되지 않게끔 규칙을 잘 선언하는것
2. 자바스크립트나 타입스크립트는 ESLint, 그 외에 파일은 모두 Prettier에게 맡기기. 그대신 자바스크립트에 추가적으로 필요한 Prettier 관련 규칙은 eslint-plugin-prettier를 사용.

#### 규칙에 대한 예외처리, 그리고 react-hooks/no-exhaustive-deps

특정 줄, 파일 전체, 특정 범위에 걸쳐 특정 규칙을 임시로 제외처리 할 수 있다.

* // eslint-disable-line no-exhaustive-deps useEffect, useMemo와 같이 의존 배열이 필요한 훅에 의존성 배열을 제대로 선언했는지 확인하는 역할을 함. 일반적으로 리액트 개발자들은 개발 시 이 의존성 배열이 너무 길어지거나, 혹은 컴포넌트가 마운트되는 시점에 한번만 강제로 실행시키고 싶거나 임의로 괜찮다고 판단할떄 사용.
  * 무엇이 잘못되었는가?
    1. 괜찮다고 임의로 판단한 경우: 가장 위험한 경우.
    2. 의존성 배열이 너무 긴 경우: 의존성 배열이 길다 === useEffect 내부 함수가 너무 길다. useEffect가 너무 길다면 useEffect를 쪼개서 의존성 배열의 가독성과 안정성을 확보해야 함
    3. 마운트 시점에 한번만 실행하고 싶은 경우: 이러한 접근 방법은 함수 컴포넌트의 패러다임과는 맞지 않을 가능성이 있음. 또한 \[] 배열이 있다는 것은 컴포넌트의 상태값과 별개의 부수 효과가 되어 컴포넌트의 상태와 불일치가 일어날 수 있게 됨. 마지막으로 상태와 관계 없이 한번만 실행되어야 하는 것이 있다면 적절한 위치로 옮길 것. ⇒ 해당 경우는 상태에 의존하고 있음에도 고의로 빈 배열을 넣는 경우.

#### ESLint 버전 충돌

eslint-config, eslint-plugin이 지원하는 ESLint 버전을 확인하고, 설치하려는 프로젝트에서 ESLint 버전을 어떻게 지원하는 지 살펴봐야 함.

## 2. 리액트 팀이 권장하는 리액트 테스트 라이브러리

### 1. React Testing Library

DOM Testing Library를 기반으로 만들어진 테스팅 라이브러리. DOM Testing Library는 jsdom을 기반으로 하고 있음. jsdom은 순수하게 자바스크립트로 작성된 라이브러리. Node.js같은 환경에서 HTML과 DOM을 사용할 수 있게 해줌.

리액트 테스팅 라이브러리를 활용하면 실제로 리액트 컴포넌트를 렌더링 하지 않고도 리액트 컴포넌트가 원하는대로 렌더링되고 있는지 확인할 수 있음 ⇒ 복잡한 과정을 거치지 않아 간편하고 소요 시간을 단축시킬 수 있음.

### 2. 자바스크립트 테스트의 기초

```jsx
function sum(a, b) {
  return a + b;
}
```

```jsx
// 테스트 1
// 함수를 실행했을때의 실제 결과
let actual = sum(1,2)
// 함수를 실행했을 때 기대하는 결과
let expected = 3

if(expected !== actual) {
	throw new Error(`${expected} is not equal to ${actual}`
}

// 테스트 2
actual = sum(2,2)
expected = 4

if(expected !== actual) {
	throw new Error(`${exprected} is not equal to ${actual}`)
}
```

기본적인 테스트 코드를 작성하는 방식은 다음과 같은 과정을 거침

1. 테스트할 함수나 모듈 선정
2. 함수나 모듈이 반환하길 기대하는 값을 적는다.
3. 함수나 모듈의 실제 반환 값을 적는다.
4. 3번의 기대에 따라 2번의 결과가 일치하는지 확인한다
5. 기대하는 결과를 반환한다면 테스트는 성공, 기대와 다른 결과를 반환하면 에러를 던진다.

Node.js 에서는 assert라는 모듈을 제공하며, 테스트코드가 예상대로 작동 하면 테스트 통과, 작동하지 않을 경우 실패를 반환

```jsx
const assert = require("assert");

function sum(a, b) {
  return a + b;
}

assert.equal(sum(1, 2), 3);
assert.equal(sum(2, 2), 4);
assert.equal(sum(1, 2), 4); // AssertionError [ERR_ASSERTION] [ERR_ASSERTION]: 3 == 4
```

일반적으로 테스트 코드는 실제 코드와 분리해서 작성해야 함.

assertion Library: 테스트 결과를 확인할 수 있도록 도와줄 수 있는 라이브러리

* should.js, expect.js, chai…
* deepEqual: 객체 자체가 동일 한지 확인, notEqual, throws 등 다양한 메서드 제공

좋은 테스트 코드는 다양한 테스트 코드가 작성되고 통과하는 것뿐만 아니라 어떤 테스트가 무서을 테스트하는지 일목요연하게 보여주는 것도 중요함.

이러한 테스트의 기승전결을 완성해주는 것이 테스팅 프레임워크.

대표적으로 Jest, Mocha, Karma, Jasmine 등이 있음. 리액트 진영에서는 Jest가 널리 쓰이고 있으며, expect 패키지를 사용해 어설션을 수행

```jsx
function sum(a, b) {
  return a + b;
}

module.exports = {
  sum,
};
```

```jsx
const { sum } = require("./math");

test("두 인수가 덧셈이 되어야 한다.", () => {
  expect(sum(1, 2)).toBe(3);
});

test("두 인수가 덧셈이 되어야 한다.", () => {
  expect(sum(2, 2)).toBe(3);
}); // 에러
```

해당 코드에서 볼 수 있는 특별한 점은 expect, test 등의 메서드를 import require 없이 바로 사용하였으며, node가 아닌 jest(npm run test)로 실행할 수 있다는 것.

Jest를 비롯한 테스팅 프레임워크에는 글로벌이라 하여 실행 시에 전역 스코프에 기본적으로 넣어준느 값드링 있음. 그리고 Jest는 실제 테스트 직전에 미리 전역 스코프에 넣어줌.

### 3. 리액트 컴포넌트 테스트 코드 작성하기

* 컴포넌트 테스트의 과정
  1. 컴포넌트를 렌더링
  2. 필요하다면 컴포넌트에서 특정 액션을 수행
  3. 컴포넌트 렌더링과 2번의 액션을 통해 기대하는 결과와 실제 결과를 비교

#### 프로젝트 생성

책에서 사용한 CRA는 현재 더이상 사용하지 않음. RTL을 사용하려면 따로 설치가 필요

vite환경에서는 jest 대신 vitest + RTL 조합을 많이 사용한다고 함. vite 설정을 그대로 가져와서 사용할 수 있으며 설정 난이도가 낮고, Jest API와 거의 동일해 마이그레이션이 쉬움

#### 정적 컴포넌트

테스트를 원하는 컴포넌트를 렌더링한 다음. 테스트를 원하는 요소를 찾아 원하는 테스트를 수행

#### 동적 컴포넌트

*   사용자가 useState를 통해 입력을 변경하는 컴포넌트

    ```jsx
    export function InputComponent() {
      const [text, setText] = useState("");

      function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const rawValue = event.target.value;
        const value = rawValue.replace(/[^A-Za-z0-9]/gi, "");
        setText(value);
      }

      function handleButtonClick() {
        alert(text);
      }

      return (
        <>
          <label htmlFor="input">아이디를 입력하세요</label>
          <input
            aria-label="input"
            id="input"
            value={text}
            onChange={handleInputChange}
            maxLength={20}
          />
          <button onClick={handleButtonClick} disabled={text.length === 0}>
            제출하기
          </button>
        </>
      );
    }
    ```

    ```jsx
    import { fireEvent, render } from '@testing-library/react'
    import userEvent from '@testing-library/userEvent'

    import { InputComponent } from '.'

    describe('InputComponent 테스트',() => {
    	const setup = () => {
    		const screen = render(<InputComponent/>)
    		const input = screen.getByLabelText('input') as HTMLInputElement
    		const button = screen.getByText(/제출하기/i) as HTMLButtonElement
    		return {
    			input,
    			button,
    			...screen,
    		}
    	}

    	it('input의 초깃값은 빈 문자열이다.', () => {
    		const { input } = setup()
    		expect(input.value).toEqual('')
    	})

    	it('input의 최대 길이가 20자로 설정돼 있다.', () => {
    		const { input } = setup()
    		expect(input).toHaveAttribute('maxlength', '20')
    	})

    	it('영문과 숫자만 입력된다.', () => {
    		const { input } = setup()
    		const inputValue = '안녕하세요123'
    		userEvent.type(iinput, inputValue)
    		expect(input.value).toEqual('123')
    	})

    	it('아이디를 입력하지 않으면 버튼이 활성화 되지 않는다.', () => {
    		const { button, input } = setup()

    		const inputValue = 'helloworld'
    		userEvent.type(iniput, inputValue)

    		expect(input.value).toEqual(inputValue)
    		expect(button).toBeEnabled()
    	})

    	it('버튼을 클릭하면 alert가 해당 아이디로 표시된다.', () => {
    		const alertMock = jest
    			.spyOn(window, 'alert')
    			.mockImplementation((_:string)) => undefined)

    		const { button, input } = setup()
    		const inputValue = 'helloworld'

    		userEvent.type(input, inputValue)
    		fireEvent.click(button)

    		expect(alertMock).toHaveBeenCalledTimes(1)
    		expect(alertMock).ToHaveBeenCalledWith(inputValue)
    	})
    })
    ```

    * setup : 내부에서 컴포넌트를 렌더링 하고 또 테스트에 필요한 button 과 input을 반환한다.
    * userEvent.type: 사용자가 타이핑하는 것을 흉내내는 메서드. userEvent.type을 사용하면 사용자가 키보드로 타이핑하는것과 동일한 작동을 만들 수 있다. userEvent는 @testing-library/react에서 제공하는 fireEvent와 차이가 있다. userEvent는 사용자의 작동을 여러 fireEvent를 통해 좀 더 자세하게 흉내내는 모듈.
    * jest.spyOn(window, ‘alert’).mockImplementation():
    * jest.spyOn: Jest가 제공하는 spyOn은 실행과 관련된 정보만 얻고 싶을때 사용. 여기서는 (window, ‘alert’)라는 인수와 함꼐 사용되었는데, window객체의 alert메서드를 구현하지 않고 해당 메서드가 실행되었는지만 관찰하겠다는 뜻.
    * mockImplementation: 해당 메서드에 대한 모킹(mocking) 구현을 도와줌. Jest를 실행하는 환경에서는 window.alert가 없어서 해당 메서드를 모의 함수로 구현해야하는데, 이 메서드가 그 역할을 함. 함수가 실행되었는지 등의 정보는 확인할 수 있음.

#### 비동기 이벤트가 발생하는 컴포넌트

```jsx
jest.spyOn(window, 'fetch').mockImplementation(
	jest.fn(() => {
		Promise.resolve({
			ok: true,
			status: 200,
			json: () => Promise.resolve(MOCK_TODO_RESPONSE),
		}),
	) as jest.Mock // 실제로 정확하게 fetch를 구현하려면 많은 메서드를 구현해야 하지만 여기서는 간단하게 json만 구현하고 어설션으로 간단하게 처리
```

위 케이스는 모든 시나리오를 해결할 수 없음. 서버 응답에서 오류가 발생한 경우는 ok, status, json의 모든 값을 바꿔서 다시 모킹해야 함. 또한 fetch가 할 수 있는 다양한 일들을 일일이 모킹해야 해서 코드가 길어지고 유지보수가 어려워짐

* MSW(Mock Service Worker) Node.js나 브라우저에서 모두 사용할 수 있는 모킹 라이브러리. 브라우저에서는 실제 서비스 워커를 활용해 실제 네트워크 요청을 가로채는 방식으로 모킹을 구현하며, Node.js 환경에서는 https나 XMLHttpRequest의 요청을 가로채는 방식으로 작동. 네트워크 요청 수행 ⇒ MSW가 감지 ⇒ 미리 준비한 모킹 데이터 제공

### 4. 사용자 정의 훅 테스트하기

react-hooks-testing-library를 이용하면 훅을 편리하게 테스트할 수 있음.

*   예제 훅

    * 최초 컴포넌트 렌더링 시에는 호출하지 않는다
    * 이전 props를 useRef에 저장해두고, 새로운 props를 넘겨받을 때마다 이전 props와 비교해 무엇이 렌더링을 발생시켰는지 확인한다.
    * 이전 props와 신규 props의 비교는 리액트의 원리와 동일하게 Object.is를 활용해 얕은 비교를 수행한다
    * process.env.NODE\_ENV === ‘production’ 인 경우 로깅을 하지 않는다. 이는 웹팩을 빌드 도구로 사용할 경우 일반적으로 트리쉐이킹이 이뤄지는 일종의 최적화 기법. ⇒ 운영 환경에서는 해당 코드 실행 X

    ```jsx
    import { useState } from 'react'

    import useEffectDebugger from './useEffectDebugger'

    function Test(props: {a: string; b: number}) {
    	const { a, b } = props
    	useEffectDebugger('TestComponent', props)

    	return (
    		<>
    			<div>{a}</div>
    			<div>{b}</div>
    		</>
    	)
    }

    function App() {
    	const [count, setCount] = useState(0)

    	return (
    		<>
    			<button> onClick={() => setCount((count) => count + 1)}>up</button>
    			<Test a={count % 2 === 0 ? '짝수' : '홀수'} b={count}/>
    		</>
    	)
    }

    export default App

    // 출력결과
    [useEffectDebugger] TestComponent {"a":{"before": "짝수", "after": "홀수"}, "b":{"before": 0, "after": 1}}
    ```

    테스트 코드

    ```jsx
    import { renderHook } from "@testing-library/react";

    import useEffectDebugger, { CONSOLE_PREFIX } from "./useEffectDebugger";

    const consoleSpy = jest.spyOn(console, "log");
    const componentName = "TestComponent";
    ```

    먼저 jest.spyOn을 사용해 console.log의 호출여부를 확인한다. 그리고 테스트 대상 컴포넌트의 이름을 componentName에 저장

    ```jsx
    describe("useEffectDebugger", () => {
      afterAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        process.env.NODE_ENV = "development";
      });
      // ...
    });
    ```

    프로젝트가 리액트 18미만이라면 @testing-library/react 대신 @testing-library/react-hooks를 사용해야함 매번 테스트가 끝난 후에는 process.env.NODE\_ENV를 다시 development로 변경. 강제로 작성한 이유는 타입스크립트에서는 NODE\_ENV를 읽기 전용 속성으로 간주하기 때문

    ```jsx
    it("props가 없으면 호출되지 않는다.", () => {
      renderHook(() => useEffectDebugger(componentName));

      expect(consoleSpy).not.toHaveBeenCalled();
    });

    it("최초에는 호출되지 않는다.", () => {
      const props = { hello: "world" };

      renderHook(() => useEffectDebugger(componentName, props));

      expect(consoleSpy).not.toHaveBeenCalled();
    });
    ```

    훅을 렌더링 하기 위해서는 renderHook을 래핑해서 사용해야 함. 여기서 `use로 시작하는 사용자 정의 훅임에도 불구하고 훅의 규칙을 위반한다는 경고 메세지를 출력하지 않음`

    > 여기서 훅의 규칙을 위반한다는 경고 메세지를 출력하지 않는다는건… 컴포넌트도 아닌 함수에서 훅을 호출하는것 처럼 보이는데 경고 메세지를 출력하지 않는가 임 ⇒ 내부에서 TestComponent 라는 컴포넌트를 생성하고, 이 컴포넌트 내부에서 전달받은 훅을 실행하기 때문

    ```jsx
    it("props가 변경되지 않으면 호출되지 않는다.", () => {
      const props = { hello: "world" };

      const { rerender } = renderHook(() => useEffectDebugger(componentName, props));

      expect(consoleSpy).not.toHaveBeenCalled();

      rerender();

      expect(consoleSpy).no.toHaveBennCalled();
    });
    ```

    컴포넌트를 다시 렌더링해 훅 내부의 console.log가 실행되지 않는지를 확인하는 테스트 코드. renderHook 하나당 하나의 독립적인 컴포넌트가 생성되어 같은 컴포넌트에서 훅을 두번 호출하려면 renderHook이 반환하는 객체의 값중 하나인 rerender 함수를 사용해야 함. rerender 이외에도 unmount라는 함수를 반환함. 이걸 실행하면 컴포넌트를 언마운트함.

    ```jsx
    it('props가 변경되면 다시 호출한다.', () => {
    	const props = { hello: 'world' }

    	const { rerender } = renderHook(
    		({ componentName, props }) => useEffectDebugger(componentName, props),
    		{
    			initialProps: {
    				componentName,
    				props,
    			},
    		},
    	)

    	const newProps = { hello: 'world2' }

    	rerender({ componentName, props })

    	expect(consoleSpy.toHaveBeenCalled()
    })
    ```

    props 비교를 정확하게 하고 있는지 확인하기 위해 훅에 서로다른 props를 인수로 넘겨야 함. 이를 위해 renderHook에서는 함수의 초깃값인 initialProps를 지정할 수 있음.

    ```jsx
    it("process.env.NODE_ENV가 production이면 호출되지 않는다.", () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      process.env.NODE_ENV = "production";

      const props = { hello: "world" };

      const { rerender } = renderHook(
        ({ componentName, props }) => useEffectDebugger(componentName, props),
        {
          initialProps: {
            componentName,
            props,
          },
        }
      );

      const newProps = { hello: "world2" };

      rerender({ componentName, props: newProps });

      expect(consoleSpy).not.toHavebeenCalled();
    });
    ```

    process.env.NODE\_ENV = “production”을 설정하면 어떤 경우에도 consoleSpy가 호출되지 않는지 확인

### 5. 테스트를 작성하기에 앞서 고려해야 할 점

* 테스트 커버리지: 해당 소프트웨어가 얼마나 테스트 됐는지를 나타내는 지표

흔히들 테스트 커버리지가 높을수록 좋다고 하지만 테스트 커버리지는 얼마나 많은 코드가 테스트 되고 있는 지를 나타내는 지표일뿐 테스트가 잘되는지를 나타내는 것이 아님

테스트 커버리지를 100%까지 끌어올릴 수 있는 생각보다 드물며, TDD(Test Driven Development; 테스트 주도 개발)로 테스트를 우선시 하더라도 모든 상황을 커버해 테스트 하기란 불가능

따라서 테스트 코드를 작성하기 전 생각해봐야할 최우선 과제는 **`애플리케이션에서 가장 취약하거나 중요한 부분을 파악하는 것`**

### 6. 그 밖에 해볼 수 있는 여러 가지 테스트

* 유닛 테스트: 각각의 코드나 컴포넌트가 독립적으로 분리된 환경에서 의도된 대로 정확히 작동하는지 검증하는 테스트
* 통합 테스트: 유닛 테스트를 통과한 여러 컴포넌트가 묶여서 하나의 기능으로 정상적으로 작동하는지 확인하는 테스트
* 엔드 투 엔드: E2E테스트라 하며, 실제 사용자처럼 작동하는 로봇을 활용해 애플리케이션의 전체적인 기능을 확인하는 테스트

RTL은 유닛 테스트 내지는 통합 테스트를 도와주는 도구. E2E는 Cypress 같은 다른 라이브러리를 사용해야 함.
