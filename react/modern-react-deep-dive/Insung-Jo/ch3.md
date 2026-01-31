# 03. 리엑트 훅 깊게 살펴보기

## 3.1 리액트의 모든 훅 파헤치기

### useState

- 함수 컴포넌트 내부에서 상태를 정의하고, 이 상태를 관리할 수 있는 훅

**예시**

```jsx
import { useState } from "react";

const [state, setState] = useState(initialState);
```

- 인수로는 state의 초기값을 넘겨줌 (값이 없을 경우 undefined)
- 첫 번째 원소는 state 값 자체를 사용
- 두 번째 원소는 setState 함수를 사용해 state 값을 변경 할 수 있다.

**사용 하지 않았을 경우**

```jsx
function Component() {
  let state = "hello";

  function handleButtonClick() {
    state = "world";
  }

  return <button onClick={handleButtonClick}>{state}</button>;
}
```

- 함수 컴포넌트는 매번 함수를 실행해 렌더링이 일어나고 내부의 값이 계속 초기화 되어 버튼의 상태가 변경되지 않음.

**useState는 어떻게 실행이 끝난 함수를 유지 할 수 있을까?**

- 리액트의 상태는 리액트 자체의 외부 관리소에 보관됨
- 또한 올바른 상태를 갱신하기 위해 클로저를 사용함

**게으른 초기화**

```jsx
import { useState } from "react";

const [state, setState] = useState(() => Number.parseInt(window.localStorage.getItem("count"));
```

- useState에 변수 변수 대신 함수를 넘기는 것을 게으른 초기화(lazy initialization)이라고 한다.
- 게으른 초기화는 useState의 초기값이 복잡하거나 무거운 연산을 포함하는데 사용(storage 접근, map, filter 같은 배열의 접근 등)
- 이후 리렌더링 발생 시 함수 실행 무시

### useEffect

- 애플리케이션 내 컴포넌트의 여러 값들을 활용해 동기적을 부수 효과

**useEffect란?**

```jsx
useEffect(() => {
  // dosomething
}, [props, state]);
```

- 첫 번째 인수로는 실행할 부수 효과가 포함된 함수 호출
- 두 번째 인수로는 의존성 배열을 전달한다.
- 의존성 배열 변경될 때마다 첫 번째 인수인 콜백을 실행(없을 경우 한 번만 실행)

**클린업 함수의 목적**

- 일반적으로는 이벤트를 등록하고 지울 때 사용
- 클린업 함수는 함수가 정의됐을 당시에 선언됐던 이전 값을 보고 실행됨.

**생명주기 매서드의 언마운트 개념과의 차이점**

- 언마운트 : 특정 컴포넌트가 DOM에서 사라진다는 것을 의미하는 클래스 컴포넌트 용어
- 클린업 함수 : 함수 컴포넌트가 리렌더링됐을 때 의존성 변화가 있을 경우 당시 이전의 값을 기준으로 실행되는 청소 개념

**의존성 배열**

- 빈 배열 : 한 번만 실행
- 배열 안에 값이 있을 경우 : 해당 값이 변경 될 때 다시 실행
- 아무런 값을 넘겨주지 않을 때 : 렌더링할 때마다 실행

**값을 넘겨주지 않을 때는 없어도 되지 않을까?**

- SSR 관점에 useEffect CSR에서 실행되는 것을 보장해준다.
- useEffect에서 window 객체 접근에 의존하는 코드를 사용해도됨.
- 사용을 안하고 작성 후 실행하면 컴포넌트가 렌더링 되는 도중에 실행 => 해당 작업은 함수 컴포넌트의 반환을 지연 = 렌더링을 방해 (성능 저하)

**useEffect의 구현**

- `Object.is` 기반으로 의존성 배열의 이전 값과 현재 값의 얕은 비교를 실행
- 변경 사항이 있을 경우 callback으로 선언한 부수 효과 실행

**useEffect 사용할 때 주의할 점**

- `eslint-disable-line react-hooks-/exhaustive-deps` 주석은 최대한 자제 : 의존성 배열에 포한돼 있지 않은 값이 있을 때 경고 발생 => 잘못 사용하면 흐름이 어긋나게 됨
- useEffect의 첫 번째 인수에 함수명을 부여하라 : 복잡해지면 파악하기 어려움 => 해당 변수가 왜 만들어졌는지 파악하기 위함
- 거대한 useEffect를 만들지 마라 : 커질 수록 애플리케이션 성능에 악영향을 미친다.
- 불필요한 외부 함수를 만들지 마라

### useMemo

```jsx
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);
```

- 비용이 큰 연산에 대한 결과를 저장(메모이제이션)해 두고, 이 저장된 값을 반환하는 훅
- 첫 번째 인수: 어떠한 값을 반환하는 생성 함수
- 두 번째 인수: 의존성 배열

**렌더링 발생 시 동작**

- 의존성 배열의 값 변경 X: 함수 재실행 X, 이전에 기억해 둔 값 반환
- 의존성 배열의 값 변경 O: 첫 번째 인수의 함수를 실행한 후에 그 값을 반환하고 해당 값 기억
- 해당 메모이제이션은 컴포넌트도 가능하다.

### useCallback

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

- 인수를 넘겨받은 콜백 자체를 기억한다.
- 특정 함수를 새로 만들지 않고 다시 재사용 한다는 의미.

**사용하지 않을 경우**

- memo를 사용해서 컴포넌트를 메모이제이션 해도 부모 컴포넌트의 자식 컴포넌트 전체가 리렌더링 되게 됨

- 이유 : state 값이 바뀌면서 부모 컴포넌트가 리렌더링 되고, 그 때마다 함수도 재생성 되기 때문

**useMemo vs useCallback**

- 메모이제이션 하는 대상이 변수냐 함수냐의 차이
  -useMemo로 useCallback을 제공할 경우 불필요하게 코드량 증가

### useRef

```jsx
// 생성
const 변수명 = useRef(초기값)
// 접근
<input ref= {변수명}/>
```

- useState와 동일하게 컴포넌트 내부에서 렌더링이 일어나도 변경 가능한 상태값을 저장한다

**useState와 차이점**

- 반환값인 객체 내부에 있는 current로 값에 접근 또는 변경 가능
- 값이 바뀌어도 렌더링 발생 x

**왜 필요한가?**

- useRef는 렌더링될 때만 실행되며, 컴포넌트 인스턴스가 여러 개여도 각각의 별개의 값을 바라봄
- 일반적으로는 DOM 접근 시 많이 사용됨

**없을 경우**

1. 만약 함수 외부에 고정된 값을 관리 할 경우 렌더링이 되지 않았음에도 해당 값이 기본적으로 존재하게 됨 = 불필요한 값이 생김
2. 컴포넌트가 여러 번 생성되면 컴포넌트에서 가르키는 값이 동일해짐

### useContext

**Context란?**

- props drilling: 만약 A~D까지의 컴포넌트가 있다고 가정했을 때 D 컴포넌트가 A의 데이터를 받고 싶을 경우 필요한 위치 까지 움직이는데 이러한 기법을 props drilling이라 부름
- 해당 현상을 해결하기 위해 등장했으며,사용 시 명시적인 props가 없어도 하위 컴포넌트에서 자유롭게 원하는 값을 사용할 수 있다.

**Context를 함수 컴포넌트에서 사용할 수 있게 해주는 useContext 훅**

- useContext: 상위 컴포넌트에서 만들어진 Context를 함수 컴포넌트에서 사용할 수 있도록 만들어진 훅
- 상위 컴포넌트에서 선언된 `<Context.Provider />`에서 제공한 값을 사용할 수 있게 된다.
- 여러 개가 있을 경우 가장 가까운 Provider의 값을 가져오게 된다.

**useContext를 사용할 때 주의할 점**

- 컴포넌트 재활용이 어려워진다. => useContext가 선언되어 있으면 Provider에 의존성을 가지고 있는 샘이 되어 재활용이 어려워짐

### useReducer

- useState의 심화버전으로, 비슷하지만 좀 더 복잡한 상태값을 미리 정의해 놓은 시나리오에 따라 관리할 수 있다.
- 복잡한 state를 사전에 정의된 dispatcher로만 수정할 수 있게 만듬

**사용되는 용어**

- 반환 값은 useState와 동일하게 2인 배열이다.
  - state: 현재 useReducer가 가지고 있는 값을 의미한다. useState와 마찬가지로 배열을 반환하는데, 동일하게 첫 번째 요소가 이 값이다.
  - dispatcher: state를 업데이트하는 함수. useReducer가 반환하는 배열의 두 번째 요소다. setState는 단순히 값을 넘겨주지만 여기서는 action을 넘겨준다는 점이 다르다. 이 action은 state를 변경할 수 있는 액션을 의미한다.
- useState의 인수와 달리 2개에서 3개의 인수를 필요로 한다.
  - reducer: useReducer의 기본 action을 정의하는 함수다. 이 reducer는 useReducer의 첫 번째 인수로 넘겨주어야 한다.
  - initialState: 두 번째 인수로, useReducer의 초깃값을 의미한다.
  - init: useState의 인수로 함수를 넘겨줄 때처럼 초깃값을 지연해서 생성시키고 싶을 때 사용하는 함수다. 이 함수는 필수값이 아니며, 만약 여기에 인수로 넘겨주는 함수가 존재한다면 useState와 동일하게 게으른 초기화가 일어나며 initialState를 인수로 init 함수가 실행된다.

### useImperativeHandle

- 실제 개발과정에서는 자주 볼 수 없는 훅

**forwardRef (현재는 props 만으로도 가능함)**

```jsx
import { forwardRef } from "react";

const MyInput = forwardRef(function MyInput(props, ref) {
  // ...
});
```

- 리액트 컴포넌트의 props인 ref에 넣어 HTMLElement에 접근하는용도로 흔히 사용

**useImperativeHandle이란?**

```
import { useImperativeHandle } from 'react';

function MyInput({ ref }) {
  useImperativeHandle(ref, () => {
    return {
      // ... your methods ...
    };
  }, []);
```

- 부모에게서 넘겨받은 ref를 원하는 대로 수정할 수 있는 훅

### useLayoutEffect

- 공식 문서에 따르면 이 함수의 시그니처는 useEffect와 동일하나, 모든 DOM의 변경 후에 동기적으로 발생한다.

**실행 순서**

1. 리액트가 DOM을 업데이트
2. useLayoutEffect를 실행
3. 브라우저에 변경 사항을 반영
4. useEffect를 실행

**언제 사용하면 좋을까?**

- DOM은 계산됐지만 이것이 화면에 반영되기 전에 하고 싶은 작업이 있을 때

### useDebugValue

```
import { useDebugValue } from 'react';

function useOnlineStatus() {
  // ...
  useDebugValue(isOnline ? 'Online' : 'Offline');
  // ...
}
```

- 리액트 애플리케이션을 개발하는 과정에서 사용됨
- 디버깅하고 싶은 정보를 해당 훅을 사용하면 개발자 도구에서 볼 수 있다.

### 훅의 규칙

1. 최상위에서만 훅을 호출해야 한다. 반복문이나 조건문, 중첩된 함수 내에서 훅을 실행할 수 없다. 이 규칙을 따라야만 컴포넌트가 렌더링될 때마다 항상 동일한 순서로 훅이 호출되는 것을 보장할 수 있다.
2. 훅을 호출할 수 있는 것은 리액트 함수 컴포넌트, 혹은 사용자 정의 훅의 두 가지 경우뿐이다. 일반 자바스크립트 함수에서는 훅을 사용할 수 없다.

## 3.2 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?

### 사용자 정의 훅

- 서로 다른 컴포넌트 내부에서 같은 로직을 공유하고자 할 때 주로 사용되는 것

**규칙**

- 이름은 반드시 `use`로 시작한다.
- 리액트의 훅을 하나 이상이라도 사용해야함.

### 고차 컴포넌트

- 컴포넌트 자체의 로직을 재사용하기 위한 방법

**React.memo란?**

- React.memo는 렌더링하기에 앞서 props를 비교해 이전과 같다면 렌더링 자체를 생략하고 이전에 기억해 둔 컴포넌트를 반환한다.
- useMemo를 사용할 경우 JSX 함수 방식이 아닌 `{}`을 사용한 할당식을 사용 => 혼선 방지를 위해 memo를 사용하는 편

**규칙**

- 고차 컴포넌트는 with로 시작해야함 (일종의 관습)

**주의점**

- 부수 효과를 최소화 해야함 : 고차 컴포넌트는 반드시 컴포넌트를 인수로 받게 되는데, 반드시 컴포넌트의 props를 임의로 수정, 추가, 삭제하는 일은 없어야 한다.
- 여러 개의 고차 컴포넌트로 컴포넌트를 감쌀 경우 복잡성이 커진다.

### 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?

**사용자 정의 훅이 필요한 경우**

- 훅으로만 공통 로직을 격리할 수 있다면 사용자 정의 훅을 사용하는 것이 좋다.
- 컴포넌트 내부에 미치는 영향을 최소화해 개발자가 원하는 방향으로 사용할 수 있는 장점이 있다.

**고차 컴포넌트를 사용해야 하는 경우**

- 렌더링의 결과물에도 영향을 미치는 공통 로직일 때 사용
- 많아질 수록 복잡성이 기하급수 적으로 증가하므로 신중하게 사용
