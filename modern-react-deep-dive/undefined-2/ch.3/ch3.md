# Chapter 3

## 1. 리액트의 모든 훅 파헤치기

### 1. useState

함수 컴포넌트 내부에서 상태를 정의하고, 이 상태를 관리할 수 있게 해주는 훅

#### useState 구현 살펴보기

```jsx
function Component() {
  let state = "hello";

  function handleButtonClick() {
    state = "hi";
  }
  return (
    <>
      <h1>{state}</h1>
      <button onClick={handleButtonClick}>hi</button>
    </>
  );
}
```

위의 코드는 리렌더링을 발생시키기 위한 조건을 충족하지 못하고 있음

```jsx
function Component() {
  const [, triggerRender] = useState();

  let state = "hello";

  function handleButtonClick() {
    state = "hi";
    triggerRender();
  }

  return (
    <>
      <h1>{state}</h1>
      <button onClick={handleButtonClick}>hi</button>
    </>
  );
}
```

위의 코드가 렌더링 되지 않는 이유는 리액트의 렌더링은 함수 컴포넌트에서 반환한 결과물인 return의 값을 비교해 실행되기 때문인데, 매번 렌더링이 발생될 때마다 함수는 다시 새롭게 실행되고, 새롭게 실행되는 함수에서 state는 매번 hello로 초기화 되기 때문

*   useState 훅의 결괏값이 함수가 실행되도 그 값을 유지하고 있는 이유

    ```jsx
    function useState(initialValue) {
      let internalState = initialValue;

      function setState(newValue) {
        internalState = newValue;
      }
      return [internalState, setState];
    }

    const [value, setValue] = useState(0);
    setValue(1);
    console.log(value); // 0
    ```

    위의 코드는 원하는 대로 작동하지 않음. setValue로 값을 변경했음에도 이미 구조 분해 할당으로 state의 값(value)를 이미 할당해 놓은 상태이기 때문에 훅 내부의 setState를 호출하더라도 변경된 새로운 값을 반환하지 못한 것. 위와 같은 문제를 해결하기 위해 리액트는 클로저를 이용하였음.

    ```jsx
    function useState(initialValue) {
      let internalState = initialValue;

      function state() {
        return internalState;
      }

      function setState(newValue) {
        internalState = newValue;
      }

      return [state, setState];
    }

    const [value, setValue] = useState(0);
    setValue(1);
    console.log(value()); // 1
    ```

#### 게으른 초기화

useState에 변수 대신 함수를 넘기는 것

### 2. useEffect

첫번째 인수로 부수효과가 포함된 함수, 두번째 인수로 의존성 배열을 전달. 의존성 배열이 변경될 때마다 useEffect 의 첫번째 인수인 콜백 함수를 실행한다. useEffect가 의존성 배열이 변경된 것을 아는것은 렌더링할 때마다 의존성에 있는 값을 보면서 이 의존성의 값이 이전과 다른 게 하나라도 있으면 부수효과를 실행하는 함수.

#### 클린업 함수의 목적

이벤트를 등록하고 지울때 사용한다고 알려져 있음.

함수 컴포넌트의 useEffect는 그 콜백이 실행될 때마다 이전의 클린업 함수가 존재한다면 그 클린업 함수를 실행한 뒤에 콜백을 실행. 이렇게 함으로써 특정 이벤트 핸들러가 무한히 추가되는 것을 방지할 수 있음

클린업 함수는 생명주기 메서드의 언마운트 개념과는 조금 차이가 있음

* 언마운트 : 특정 컴포넌트가 DOM에서 사라짐
* 클린업 함수: 컴포넌트가 리렌더링 되었을 때 이전 상태를 청소해주는 개념

#### 의존성 배열

* 빈배열로 두면 최초 렌더링 직후 더이상 실행되지 않음
*   아무런 값을 넘겨주지 않을 경우 렌더링이 발생할 때마다 실행 의존성 배열이 없는 useEffect가 매 렌더링마다 실행된다면 useEffect 없이 써도 되는것이 아닌가?

    ```jsx
    // 1
    function Component() {
    	console.log('렌더링됨')
    	}

    // 2
    function Component() {
    	useEffect(() =>v{
    	console.log('렌더링됨')
    	})
    }
    ```

    1. 서버 사이드 렌더링 관점에서 useEffect는 클라이언트 사이드에서 실행되는 것을 보장. useEffect 내부에서는 window 객체의 접근에 의존하는 코드를 사용해도 됨
    2. 컴포넌트의 렌더링이 완료된 이후에 실행됨. 반면 1번과 같이 함수 내부에서의 직접 실행은 컴포넌트가 렌더링 되는 도중에 실행됨. 2번과는 달리 서버 사이드 렌더링의 경우에 서버에서도 실행되며, 이 작업은 함수 컴포넌트의 반환을 지연시키는 행위. 무거운 작업일 경우 렌더링을 방해해 성능에 악영향을 미칠 수 있다.

#### useEffect의 구현

Object.is를 기반으로 하는 얕은 비교를 기반으로 의존성 배열의 현재값과 이전 값을 비교. 하나라도 변경사항이 있다면 콜백으로 선언한 부수효과를 실행.

#### useEffect를 사용할 떄 주의할 점

* eslint-disable-line react-hooks/exhaustive-deps 주석 자제하기
* useEffect의 첫번째 인수에 함수명 부여하기
* 거대한 useEffect 만들지 않기
* 불필요한 외부 함수 만들지 않기

### 3. useMemo

비용이 큰 연산에 대한 결과를 저장해두고, 이 저장된 값을 반환하는 훅. 첫번째 인수로는 값을 반환하는 생성함수, 두번째 인수로는 해당 함수가 의존하는 값의 배열을 전달. useMemo는 렌더링 발생 시 의존성 배열의 값이 변경되지 않으면 함수를 재 실행 하지 않고 이전에 기억해둔 해당 값을 반환하고, 변경됐다면 첫번 재 인수의 함수를 실행한 후 그 값을 반환하고 기억함. 컴포넌트도 가능

### 4. useCallback

인수로 넘겨받은 콜백 자체를 기억한다. ⇒ 함수를 재사용

함수의 재생성을 막아 불필요한 리소스 또는 리렌더링을 방지하고 싶을 떄 useCallback을 사용해볼 수 있음

useMemo와 useCallback의 유일한 차이는 메모이제이션을 하는 대상이 다를 뿐이지 동일한 역할을 함.

### 5. useRef

컴포넌트 내부에서 렌더링이 일어나도 변경 가능한 상태값을 저장한다. useState와는 두가지 차이점이 있다.

* useRef는 반환값인 객체 내부에 있는 current로 값에 접근 또는 변경할 수 있다
* useRef는 그 값이 변하더라도 렌더링을 발생시키지 않는다.

useRef는 컴포넌트가 렌더링될 때만 생성되며, 컴포넌트 인스턴스가 여러개라도 각각 별개의 값을 바라봄.

### 6. useContext

#### Context란?

prop 내려주기를 극복하기 위해 등장한 개념. 콘텍스트를 사용하면 명시적인 props 전달 없이 선언한 하위컴포넌트 모두에서 자유롭게 원하는 값을 사용할 수 있음.

#### Context를 함수 컴포넌트에서 사용할 수 있게 해주는 useContext 훅

상위 컴포넌트에서 만들어진 context를 함수 컴포넌트에서 사용할 수 있도록 만들어진 훅

useContext를 사용하면 상위 컴포넌트 어딘가에서 선언된 \<Context.Provider /> 에서 제공한 값을 사용할 수 있게 됨. 여러개의 provider가 있다면 가장 가까운 provider의 값을 가져오게 됨.

컴포넌트 트리가 복잡해질 수록 컴포넌트가 실행될 떄 콘텍스트가 존재하지 않아 예상치 못한 에러가 발생할 수 있음. 이러한 에러를 방지하려면 useContext 내부에서 해당 콘텍스트가 존재하는지 확인해보면 됨.

다수의 Provider와 useContext를 사용할 떄, 특히 타입스크립트를 사용하고 있다면 위와 같이 별도 함수로 감싸서 사용하는 것이 좋음.

#### useContext를 사용할 때 주의할 점

useContext를 함수 컴포넌트 내부에서 사용할 떄는 항상 컴포넌트 재활용이 어려워짐 ⇒ provider에 의존성을 가지고 있는셈이 되기 때문

* useContext를 사용하는 컴포넌트를 최대한 작게하거나, 재사용되지 않을 만한 컴포넌트에서 사용하기
* 콘텍스트와 useContext는 상태관리를 위한 리액트의 API가 아닌 상태를 주입해 주는 API

### 7. useReducer

useState의 심화버전. useState와 비슷한 형태를 띄지만 좀더 복잡한 상태값을 미리 정의해 놓은 시나리오에 따라 관리할 수 있음.

* 반환값은 useState와 동일한 길이가 2인 배열
  * state: 현재 useReducer가 가지고 있는 값.
  * dispatcher: state를 업데이트 하는 함수. action을 넘겨줌.
* 3개의 인수를 필요로 함
  * reducer : useReducer의 기본 action을 정의하는 함수.
  * initialState: useReducer의 초깃값
  * init: useState의 인수로 함수를 넘겨줄 때처럼 초깃값을 지연해서 생성시키고 싶을 때 사용하는 함수. 이 함수는 필수 값이 아니며, 존재하면 useState와 동일하게 게으른 초기화가 일어나며 initialState를 인수로 init 함수가 실행됨
* 목적 복잡한 형태의 state를 사전에 정의된 dispatcher로만 수정할 수 있게 만들어 줌으로써 state값에 대한 접근근은 컴포넌트에서만 가능하게 하고, 이를 업데이트 하는 방법에 대한 상세 정의는 컴포넌트 밖에다 둔 다음, state의 업데이트를 미리 정의해 둔 dispatcher로만 제한하는 것. ⇒ state 값을 변경하는 시나리오를 제한적으로 두고 이에대한 변경을 빠르게 확인할 수 있게끔 하는 것.

### 8. useImperativeHandle

#### forwardRef살펴보기

ref는 useRef에서 반환한 객체로, 리액트 컴포넌트의 props인 ref에 넣어 HTMLElement에 접근하는 용도로 흔히 사용되는데, 상위 컴포넌트에서 접근하고 싶은 ref가 있지만 이를 직접 props로 넣어 사용할 수 없을때 두가지 방법으로 해결할 수 있음

1.

```jsx
function ChildComponent({ parentRef }) {
  useEffect(() => {
    // {current: undefined}
    // {current: HTMLInputElement}
    console.log(parentRef);
  }, [parerntRef]);

  return <div>안녕!</div>;
}

function ParentComponent() {
  const inputRef = useRef();

  return (
    <>
      <input ref={inputRef} />
      <ChildComponent parentRef={inputRef} />
    </>
  );
}
```

2.

```jsx
const ChildComponent = forwardRef((props,ref)=> {
	useEffect(() => {
		// {current: undefined}
		// {current: HTMLInputElement}
		console.log(ref
		},[ref])

	return <div>hi!</div>
	}

function ParentComponent() {
	const inputRef = useRef()

	return (
		<>
			<input ref={inputRef}/>
			<ChildComponent ref={inputRef}/>
		</>
		)
	}
```

ref를 받고자 하는 컴포넌트를 forwardRef로 감싸고, 두번째 인수로 ref를 전달받는다. 그리고 부모 컴포넌트에서는 동일하게 props.ref를 통해 ref를 넘겨주면 됨

#### useInperativeHandle이란

부모에게서 넘겨받은 ref를 원하대로 수정할 수 있는 훅.

### 9. useLayoutEffect

이 함수의 시그니처는 useEffect와 동일하나 모든 DOM의 변경 후에 동기적으로 발생

1. 리액트가 DOM을 업데이트
2. useLayoutEffect를 실행
3. 브라우저에 변경사항을 반영
4. useEffect를 실행

* 언제 사용하는 것이 좋을까? DOM은 계산 됐지만 이것이 화면에 반영되기 이전에 하고 싶은 작업이 있을 때

### 10. useDebugValue

리액트 애플리케이션을 개발하는 과정에서 사용. 디버깅 하고 싶은 정보를 이 훅에다 사용하면 리액트 개발자 도구에서 볼 수 있음.

### 11. 훅의 규칙

rules-of-hooks 라고도 하며 이와 관련된 ESLint 규칙인 react-hooks/rules-of-hooks도 존재함.

1. 최상위에서만 훅을 호출할것. 반복문, 조건문, 중첩된 함수 내에서 훅을 실행할 수 없다. 이 규칙을 따라야만 컴포넌트가 렌더링될떄마다 항상 동일한 순서로 훅이 호출되는 것을 보장할 수 있다.
2. 훅을 호출할 수 있는 것은 리액트 함수 컴포넌트, 혹은 사용자 정의 훅의 두가지 경우 뿐이다. 일반 자바스크립트 함수에서는 훅을 사용할 수 없다.

## 2. 사용자 정의 훅과 고차 컴포넌트 중 어떤 것을 써야할까

### 1. 사용자 정의 훅

서로 다른 컴포넌트 내부에서 같은 로직을 공유하고자 할 때 사용되는 것. 3장에서 소개한 훅을 기반으로 개발자가 필요한 훅을 만드는 기법. 훅의 이름은 use로 시작

```jsx
import { useEffect, useState } from 'react';

// HTTP 요청을 하는 사용자 정의 훅
function useFetch<T>(
	url: string,
	{ method, body}: { method: string; body?: XMLHttpRequestBodyInit },
) {
	// 응답 결과
	const [result, setResult] = useState<T | undefined>()
	// 요청중 여부
	const [isLoading, setIsLoading] = useState<boolean>(false);
	// 2xx,3xx로 정상 응답인지 여부
	const [ok, setOk] = useState<boolean | undefined>()

	// HTTP status
	const [status, setStatus] = useState<number | undefined>()

	useEffect(() => {
		const abortController = new AbortController()
		;(async ()=> {
			setIsLoading(true)

			const response = await fetch(url, {
			method,
			body,
			signal: abortController.signal,
			})

			setOk(response.ok)
			setStatus(response.status)

			if(response.ok){
				const apiResult = await response.json()
				setResult(apiResult)
				}

				setIsLoading(false)
				})()

				return () => {
				abortController.abort()
				}
	}, [url, method, body])

	return { ok, result, isLoading, status }
}

interface Todo {
	userId: number
	id: number
	title: string
	completed: boolean
}

```

사용 예시

```jsx
export default function App() {
	// 사용자 지정 훅 사용
	const { isLoading, result, status, ok } = useFetch<Array<Todo>>(
		'https://jsonplaceholder.typicode.com/todos',
		{
			method: 'GET',
		},
	)

	useEffect(() => {
		if(!isLoading){
			console.log('fetchResult >>', status)
			}
	}, [status, isLoading])

	return (
		<div>
			{ok
				? (result || []).map(({ userId, title }, index) => (
						<div> key={index}>
							<p>{userId}</p>
							<p>{title}</p>
						</div>
					))
				: null}
			</div>
		)
	}
```

### 2. 고차 컴포넌트(HOC; Higher Order Component)

컴포넌트 자체의 로직을 재사용하기 위한 방법. 고차 함수의 일종으로 자바스크립트의 일급객체, 함수의 특징을 이용하므로 굳이 리액트가 아니더라도 자바스크립트 환경에서 널리 쓰일 수 있음.

#### React.memo

props의 변화가 없음에도 컴포넌트의 렌더링을 방지하기 위해 만들어진 리액트의 고차 컴포넌트.

렌더링 하기에 앞서 props를 비교해 이전과 props가 같다면 렌더링 자체를 생략하고 이전에 기억해둔 컴포넌트를 반환.

useMemo를 사용할 경우 값을 반환받기 때문에 JSX함수 방식이 아닌 {}를 사용한 할당식을 사용한다는 차이점이 있음.

```jsx
function ParentComponent() {
	const [state, setState] = useState(1)

	function handleChange(e: ChangeEvent<HTMLInputElement>) {
		setState(Number(e.target.value))
	}

	function MemorizedChildComponent = useMemo(() => {
		return <ChildComponent value="hello"/>
		}, [])

		return (
			<>
				<input type="number" value={state} onChange={handleChange} />
				{MemorizedChildComponent}
			</>
		)
}
```

#### 고차 함수 만들어보기

*   고차 함수: 함수를 인수로 받거나 결과로 반환하는 함수 ex) Array.prototype.map

    ```jsx
    const list = [1, 2, 3];
    const doubledList = list.map((item) => item * 2);
    ```

    (item)⇒ item \* 2 라는 함수를 인수로 받고 있음.

```jsx
function add(a) {
	return function(b) {
		return a + b
		}
	}

const result = add(1) // 여기서 result는 앞서 반환한 함수를 가리킨다.
cosnt result2 = result(2) // 비로소 a와 b를 더한 3이 반환된다
```

add(1)이라는 함수를 호출하는 시점에 1이라는 정보가 a에 포함되고, 이러한 정보가 담긴 함수를 result로 반환된다. a=1이라는 정보가 담긴 클로저가 result에 포함되었고, result(2)를 호출하면서 이 클로저에 담긴 a=1인 정보를 활용해 1+2의 결과를 반환할수 있게 됨.

#### 고차함수를 활용한 리액트 고차 컴포넌트 만들어보기

고차 컴포넌트는 컴포넌트 전체를 감쌀 수 있다는 점에서 사용자 정의 훅보다 더욱 큰 영향력을 컴포넌트에 미칠 수 있다.

* 주의할 점
  * with으로 시작하는 이름을 사용할 것
  * 부수 효과를 최소화 할것
  * 여러 개의 고차 컴포넌트로 컴포넌트를 감쌀 경우 복잡성이 커짐 ⇒ 최소한으로 사용하기

### 3. 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야할까

#### 사용자 정의 훅이 필요한 경우

리액트에서 제공하는 훅으로만 공통 로직을 격리할 수 있으면 사용하는 것이 좋음

#### 고차 컴포넌트를 사용해야 하는 경우

함수 컴포넌트의 반환값(렌더링의 결과물)에도 영향을 미치는 공통 로직이라면 고차 컴포넌트를 용하기
