# 1. 상태 관리는 왜 필요한가

## 1. 리액트 상태 관리의 역사

### Flux 패턴의 등장

리액트와 등장과 비슷한 시기에 Flux패턴과 이를 기반으로한 라이브러리인 Flux를 소개하게 됨. 페이스북 팀은 웹 애플리케이션이 비대해지고 상태도 많아지면서 작업과 상태 추적의 이해가 어려워지는 문제의 원인을 양방향 데이터 바인딩으로 보고, 단방향으로 데이터 흐름을 변경하는 것을 제안하는데, 이것이 Flux패턴의 시작.

- 용어 정리
  - 액션: 어떠한 작업을 처리할 액션과 그 액션이 발생시 함께 포함시킬 데이터를 의미. 액션 타이보가 데이터를 각각 정의해 이를 디스패처로 보낸다
  - 디스패처: 액션을 스토어에 보내는 역할을 한다. 콜백 함수 형태로 앞서 액션이 정의한 타입과 데이터를 모두 스토어에 보낸다
  - 스토어: 여기서 실제 상태에 따른 값과 상태를 변경할 수 있는 메서드를 가지고 있다. 액션의 타입에 따라 어떻게 변경할 지가 정의되어있다.
  - 뷰: 리액트의 컴포넌트에 해당하는 부분으로, 스토어에서 만들어진 데이터를 가져와 화면을 렌더링하는 역할을 한다. 또한 뷰에서도 사용자의 입력이나 행위에 따라 상태를 업데이트하고자 할 수 있을 것이다. 이 경우에는 다음 그림처럼 뷰에서 액션을 호출하는 구조로 구성된다.

사용자의 입력에 따라 데이터를 갱신하고, 화면을 어떻게 업데이트해야 하는지도 코드로 작성해야 하므로 코드의 양이 많아지지만 데이터의 흐름을 추적하기 쉽고 코드를 이해하기 수월해짐.

- 대표 라이브러리
  Flux, alt, RefluxJs, NuclearJS, Fluxible, Fluxxor

### 리덕스의 등장

Flux 구조 + Elm 아키텍쳐

- Elm: 웹페이지를 선언적으로 작성하기 위한 언어. 모델, 업데이트, 뷰로 이루어짐.
  flux와 마찬가지로 데이터흐름을 세 가지로 분류하고, 이를 단방향으로 강제해 웹 애플리케이션의 상태를 안정적으로 관리하고자 노력

리덕스는 하나의 상태객체를 스토어에 저장해두고, 이 객체를 업데이트 하는 작업을 디스패치해 업데이트를 수행. 이러한 작업은 reducer함수로 발생시킬 수 있으며, 이 함수의 실행은 웹 애플리케이션 상태에 대한 완전히 새로운 복사본을 반환한다음 애플리케이션에 이 새롭게 만들어진 상태를 전파.

- 단점
  해야할 일이 많음
  액션 타입 설정, 액션을 수행할 creator, 함수를 만들어야 하며, dispatcher와 selector도 필요함.
  보일러 플레이트가 너무 많다
  지금은 이러한 작업이 많이 간소화됨

### Context API와 useContext

props를 사용하지 않더라도 Context API를 사용하면 원하는 곳에서 Context Provider가 주입하는 상태를 사용할 수 있음.

리액트 16.3이전에도 context가 존재했으며, 이를 다루기 위한 getChildContext가 존재했었음.

그러나 3장에서 이야기한 것처럼 ContextAPI는 상태관리가 아닌 주입을 도와주는 기능이며, 렌더링을 막아주는 기능또한 존재하지 않으므로 사용 시 주의가 필요함

### 훅의 탄생, 그리고 React Query와 SWR

ContextAPI의 등장 이후 리액트 16.8에서 함수 컴포넌트에 사용할 수 있는 다양한 훅 API가 추가되고, state를 매우 손쉽게 재사용 가능하도록 만듦. 이러한 훅과 state의 등장으로 React Query나 SWR과 같은 새로운 방식의 상태관리가 등장.

두 라이브러리는 외부에서 데이터를 불러오는 fetch를 관리하는 데 특화된 라이브러리. API 호출에 대한 상태를 관리하고 있기 떄문에 HTTP 요청에 특화된 상태 관리 라이브러리라 볼 수 있음.

### Recoil, Zustand, Jotai, Valtio

훅을 활용해 작은 크기의 상태를 효율적으로 관리. 이는 기존 상태관리 라이브러리의 아쉬운 점으로 지적받던 전역 상태 관리 패러다임에서 벗어나 개발자가 원하는 만큼의 상태를 지역적으로 관리하는 것을 가능하게 만들고, 훅을 지원함으로써 함수 컴포넌트에서 손쉽게 사용할 수 있음

# 2. 리액트 훅으로 시작하는 상태 관리

## 1. 가장 기본적인 방법: useState와 useReducer

```jsx
function useCounter(initCount: number = 0) {
  const [counter, setCounter] = useState(initCount);

  function inc() {
    setCounter((prev) => prev + 1);
  }

  return { counter, inc };
}

function Counter1() {
  const { counter, inc } = useCounter();

  return (
    <>
      <h3>Counter1: {counter}</h3>
      <button onClick={inc}>+</button>
    </>
  );
}

function Counter2() {
  const { counter, inc } = useCounter();

  return (
    <>
      <h3>Counter2: {counter}</h3>
      <button onClick={inc}>+</button>
    </>
  );
}
```

useCounter를 사용하는 컴포넌트는 이 훅을 사용해 각자의 counter 변수를 관리하며, 중복되는 로직 없이 숫자를 1씩 증가시키는 기능을 손쉽게 이용할 수 있음.

useCounter라는 훅이 없었다면 각각 구현해야만 했을것. 훅 내부에서 관리해야 하는 상태가 복잡하거나 상태를 변경할 수 있는 시나리오가 다양해진다면 훅으로 코드를 격리해 제공할 수 있다는 장점이 더욱 크게 드러날 것.

useState와 비슷한 훅인 useReducer 또한 마찬가지로 지역 상태를 관리할 수 있는 훅. 하지만 useState와 useReducer가 상태 관리의 모든 필요성과 문제를 해결해 주지는 않음. 훅을 사용할 때마다 컴포넌트 별로 초기화 되므로 컴포넌트에 따라 서로 다른 상태를 가질 수 밖에 없으며, 결론적으로 컴포넌트별로 상태의 파편화를 만들어버림. 이렇게 기본적인 useState를 기반으로 한 상태를 지역상태라고 함.

## 2. 지역 상태의 한계 벗어나기: useState의 상태를 바깥으로 분리하기

만약 useState가 이 리액트 클로저가 아닌 다른 자바스크립트 실행 문맥 어디에서 관리되면 어떨까?

```jsx
//counter.ts
export type State = { counter: number }

// 상태를 아예 컴포넌트 밖에 선언.
let state: State = {
	counter: 0,
}

// getter
export function get(): State {
	return state
}

// useState와 동일하게 구현하기 위해 게으른 초기화 함수나 값을 받을 수 있게 함
type Initializer<T> = T extends any ? T | ((prev)=> T): never

// setter
export function set<T>(nextState: Initializer<T>) {
	state = typeof nextState === 'function' ? nextState(state) : nextState
}

// Counter
function Counter() {
	const state = get()

	function handleClick() {
		set((prev: State) => ({ counter: prev.counter + 1 })
	}

	return (
		<>
			<h3>{state.counter}</h3>
			<button onClick={handleClick}>+</button>
		</>
	)
}
```

위 방식은 리액트 환경에서 작동하지 않음. 컴포넌트가 리렌더링 되지 않기 때문. 리렌더링은 함수 컴포넌트의 재실행(호출), useState의 두번째 인수 호출 등 다양한 방식으로 일어나지만 위 코드에서는 어디에서도 리렌더링을 일으키는 장치가 없기 때문.

- 리렌더링을 일으키는 조건
  1. useState, useReducer의 반환값 중 두번째 인수가 어떻게든 호출된다
  2. 부모 함수(컴포넌트)가 리렌더링 되거나 해당 함수가 다시 실행되어아 한다.

```jsx
function Counter1() {
  const [count, setCount] = useState(state);

  function handleClick() {
    // 외부에서 선언한 set 함수 내부에서 다음 상태값을 영ㄴ산한 다음,
    // 그 값을 로컬 상태값에도 넣었다.
    set((prev: State) => {
      const newState = { counter: prev.counter + 1 };
      // setCount가 호출되면서 컴포넌트 리렌더링을 야기한다
      setCount(newState);
      return newState;
    });
  }

  return (
    <>
      <h3>{count.counter}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}

function Counter2() {
  const [count, setCount] = useState(state);

  // 위 컴포넌트와 동일한 작동을 추가했다.
  function handleClick() {
    set((prev: State) => {
      const newState = { counter: prev.counter + 1 };
      setCount(newState);
      return newState;
    });
  }

  return (
    <>
      <h3>{count.counter}</h3>
      <button onClick={handleClick}>+</button>
    </>
  );
}
```

위의 코드에서는 억지로 전역에 있는 상태를 참조하게 만듦. 위와 같은 방식은 일반적인 리액트 코드 작성 방식과 동일. 여기서 독특한 점은 handleClick으로 state를 업데이트 하는 방식. 기본적으로 useState의 두번쨰 인수로 업데이트 하는 것은 해당 지역 상태에만 영향을 미치기 때문에, 여기서는 외부에 선언한 set을 실행해 외부의 상태갑 또한 어데이트 하도록 수정. 이렇게 하면 리액트 컴포넌트는 렌더링 될 것이고 외부의 값을 안정적으로 참조할 수 있음.

외부에 상태가 있음에도 컴포넌트 렌더링을 위해 함수 내부에 동일한 상태를 관리하는 useState가 중복으로 존재하고, 관리하기 떄문에 비효율적인 방식이라고 볼 수 있으며, 동시에 렌더링 되지 않는 문제가 발생함.

useState로 컴포넌트의 리렌더링을 실행해 최신값을 가져오는 방법은 해당 컴포넌트 자체에서만 유효한 전략임. 반대쪽의 다른 컴포넌트에서는 리렌더링을 일으킬 무언가가 없어 클릭이벤트가 발생하지 않는 다른 쪽은 여전히 렌더링이 되지 않음.

- 함수 외부에서 상태를 참조하고 렌더링까지 자연스럽게 일어나기 위한 조건
  1. 컴포넌트 외부 어딘가에 상태를 두고 여러 컴포넌트가 같이 쓸 수 있어야 함
  2. 외부에 있는 상태를 사용하는 컴포넌트는 상태의 변화를 알아챌 수 이어야 하고, 상태가 변화할 때마다 리렌더링이 일어나 컴포넌트를 최신 상태값 기준으로 렌더링 해야함. 이 상태 감지는 변경시키는 컴포넌트 뿐만이 아니라 상태를 참조하는 모든 컴포넌트에서 동일하게 작동해야 함
  3. 상태가 원시값이 아닌 객체인 경우 그 객에게 내가 감지하지 않는 값이 변한다 해도 리렌더링이 발생해서는 안됨

```jsx
type Initializer<T> = T extends andy ? T | ((prev: T) = T) : never

type Store<State> = {
	get: () => State
	set: (action: Initializer<State>) => State
	subscribe: (callback: () => void) => () => void
}
```

```jsx
export const createStore = <Store extends unknown>(
	initialState: Initializer<State>,
	): Store<State> => {
		// useState와 마찬가지로 초깃값을 게으른 초기화를 위한 함수 또한
		// 그냥 값을 받을 수 있도록 한다.
		// state의 값은 스토어 내부에서 보관해야 하므로 변수로 선언한다.
		let state = typeof initialState !== 'function' ? initialState : initialState()

		// callbacks는 자료형에 관계없이 유일한 값을 저장할 수 있는 Set을 사용한다.
		const callbacks = new Set<()=>void>()
		// 언제든 get이 호출되면 최신값을 가져올 수 있도록 함수로 만든다
		const get = () => state
		const set = (nextState: State | ((prev: State) => State)) > {
			// 인수가 함수라면 함수를 실행해 새로운 값을 받고,
			// 아니라면 새로운 값을 그대로 사용한다.
			state =
				typeof nextState === 'function'
					? (nextState as (prev: State) => State)(state)
					: nextState

			// 값의 설정이 발생하면 콜백 목록을 순회하면서 모든 콜백을 실행한다.
			callbacks.forEach((callback) => callback())

			return state
		}

		// subscribe는 콜백을 인수로 받는다
		const subscribe = (callback: () => void) => {
			// 받은 함수를 콜백 목록에 추가한다.
		callbacks.add(callback)
		// 클린업 실행 시 이를 삭제해서 반복적으로 추가되는 것을 막는다
		return () => {
			callbacks.delete(callback)
		}
	}
	return { get, set, subscribe }
}
```

1. 먼저 store의 초깃값을 state 또는 게으르 초기화 함수를 받아 store의 기본값을 초기화할 수 있게 해뒀다.
2. 1번에서 받은 인수를 바탕으로 함수를 실행하거나 초깃값 그 자체를 할당해 state 초깃값을 할당한다
3. 컴포넌트로 넘겨받은 콜백 함수를 저장하기 위해 callbacks를 Set으로 선언한다. Set은 원시값이나 객체에 관계없이 유일한 값을 젖아할 수 있어 중복 없이 콜백함수를 저장하는 용도로 유용
4. get을 함수로 만들어 매번 최신값을 가져올 수 있게 만든다
5. set을 만들어 새로운 값을 넣을 수 있도록 만든다
6. subscribe 는 callbacks Set에 callback을 등록할 수 있는 함수. 반환 값으로는 등록된 callback을 삭제하는 함수를 반환. 클린업 함수와 동일한 역할
7. 마지막으로 get, set, subscribe를 하나의 객체로 반환해 외부에서 사용할 수 있도록 함

createstore는 자신이 관리해야 하는 상태를 내부 변수로 가진 다음, get 함수로 해당 변수의 최신 값을 제공하며, set 함수로 내부 변수를 최신화하며, 이 과정에서 등록된 콜백을 모조리 실행하는 구조를 띔

```jsx
export const useStore = <State extends unknown>(store: Store<State>) => {
	const [state, setState] = useState<State>(()=> store.get())

	useEffect(() => {
		const unsubscribe = store.subscribe(() => {
				setState(store.get())
			})
			return unsubscribe
		},[store])

		return [state, store.set] as const
}
```

1. 먼저 훅의 인수로 사용할 store를 받는다
2. 이 스토어의 값을 초깃값으로 하는 useState를 만든다. 이제 이 useState가 컴포넌트의 렌더링을 유도한다
3. useEffect는 store의 현재 값을 가져와 setState를 수행하는 함수를 store의 subscribe로 등록해 두었다. createStore 내부에서 값이 변경될 떄마다 subscribe에 등록된 함수를 실행하므로 useStore 내부에서는 store의 값이 변경될 때마다 state의 값이 변경되는 것을 보장받을 수 있다.
4. 마지막으로 useEffect의 클립업 함수로 unsubscribe를 등록해 useEffect가 끝난 후 callback에서 해당 함수를 제거해 callback이 계속해서 쌓이는 현상 방지

만드는 스토어의 구조가 원시값이라면 상관 없지만 객체인 경우, 객체의 일부값만 변경되어도 리렌더링이 일어날것임.

- 원하는 값이 변경 되었을 때만 리렌더링되도록 훅 재구성

```jsx
export const useStoreSelector = <State extends unknown, Value extends unknown>(
	store: Store<State>,
	selector: (state: State) => Value,
	) => {
		const [state, setState] = useState(() => selector(store.get()))

		useEffect(() => {
			const unsubscribe = store.subscribe(() => {
				const value = selector(store.get())
				setState(value)
			})

			return unsubscribe
		},[store, selector])

		return state
}
```

useStoreSelector에서 제공하는 두 번쨰 인수인 selector를 컴포넌트 밖에서 선언하너가, 이것이 불가능 하다면 useCallback을 사용해 참조를 고정시키기

## 3. useState와 Context를 동시에 사용해보기

1. createStore를 이용해 동일한 타입으로 스토어를 여러 개 만들기

   이 방법은 번거로움. 해당 스토어가 필요할 때마다 반복적으로 스토어를 생성해야 함. 또한 훅은 스토어에 의존적인 1:1 관계를 맺고 있으므로 스토어를 만들 때마다 훅을 동일한 개수로 생성해야 함. 마지막으로 훅의 이름이라 스토어의 이름으로 사용 가능 여부를 가늠해야 함.

⇒ context 활용하면 컴포넌트에서는 자신이 주입된 스토어에서만 접근할 수 있음.

```jsx
// Context를 생성하면 자동으로 스토어도 함께 생성
export const CounterStoreContext = createContext<Store<CounterStore>>(
	createStore<CounterStore>({ count: 0, text: 'hello' }),
)

export const CounterStoreProvider = ({
	initialState,
	children,
	}: PropsWithChildren<{
		initialState: CounterStore
	}>) => {
		const storeRef = useRef<Store<CounterStore>>()

		// 스토어를 생성한 적이 없다면 최초에 한 번 생성한다.
		if (!storeRef.current) {
			storeRef.current = createStore(initialState)
		}

		return (
			<CounterStoreContext.Provider value={storeRef.current}>
				{children}
			</CounterStoreContext.Provider>
		)
}
```

```jsx
export const useCounterContextSelector = <State extend unknown>(
	selector: (state: CounterStore) => State,
	) => {
		const store = useContext(CounterStoreContext)
		// useStoreSelector를 사용해도 동일하다
		const subscription = useSubscription(
			useMemo(
				() => ({
					getCurrentValue: () => selector(store.get()),
					subscribe: store.subscribe,
					}),
					[store, selector],
				),
			)

			return [subscription, store.set] as const
		}
```

## 4. 상태관리 라이브러리 살펴보기(Recoil, Jotai, Zustand)

Recoil과 Jotai는 Context와 Provider, 훅을 기반으로 가능한 작은 상태를 효율적으로 관리하는데 초점을 맞추고 있으며, Zustand는 리덕스와 비슷하게 하나의 큰 스토어를 기반으로 상태를 관리하는 라이브러리. Recoil, Zotai와는 다르게 이 하나의 큰 스토어는 Context가 아니라 스토어가 가지는 클로저를 기반으로 생성되며, 이 스토어의 상태가 변경되면 상태를 구독하는 컴포넌트에 전파에 리렌더링을 알리는 방식

### Recoil

페이스북에서 만든 리액트를 위한 상태 관리 라이브러리. 훅의 개념으로 상태 관리를 시작한 최초의 라이브러리 중 하나이며, 최소 상태 개념인 atom을 처음 리액트 생태계에서 선보이기도 함.

- RecoilRoot

  Recoil을 사용하기위해서는 애플리케이션의 최상단에 선언해두어야 함

  Recoil에서 생성되는 상태값을 저장하기 위한 스토어를 생성

  ```jsx
  function RecoilRoot(props: Props): React.Node {
    const { override, ...propsExceptOverride } = props;

    const ancestorStoreRef = useStoreRef();
    if (override === false && ancestorStoreRef.current !== defaultStore) {
      // If ancestorStoreRef.current !== defaultStore, it means that this
      // RecoilRoot is not nested within another.
      return props.children;
    }

    return <RecoilRoot_INTERNAL {...propsExceptOverride} />;
  }
  ```

  useStoreRef로 ancestorStoreRef의 존재를 확인 ⇒ Recoil에서 생성되는 atom과 같은 상태값을 저장하는 스토어를 의미. useStoreRef가 가리키는 것은 AppContext가 가지고 있는 스토어

  ```jsx
  const AppContext = React.createContext < StoreRef > { current: defaultStore };
  const useStoreRef = (): StoreRef => useContext(AppContext);
  ```

  RecoilRoot로 감싸지 않은 컴포넌트에서는 스토어에 접근할 수 없음

  - Recoil의 상태값은 RecoilRoot로 생성된 Context의 스토어에 저장된다
  - 스토어의 상태값에 잡근할 수 있는 함수들이 있으며, 이 함수를 활용해 상태값에 접근하거나 상태값을 변경할 수 있다
  - 값의 변경이 발생하면 이를 참조하고 있는 하위 컴포넌트에 모두 알린다

- atom
  상태를 나타내는 Recoil의 최소 상태 단위
  ```jsx
  type Statement = {
  	name: string
  	amount: number
  }

  const InitialStatements: Array<Statement> = [
  	{ name: '과자', amount: -500 },
  	{ name: '용돈', amount: 10000 },
  	{ name: '네이버페이충전', amount: -5000 },
  ]

  // Atom 선언
  const statementsAtom = atom<Array<Statement>>({
  	key: 'statements',
  	default: InitialStatements,
  })
  ```
  atom은 key 값을 필수로 가지며, 이 키는 다른 atom과 구별하는 식별자가 되는 필수 값. 애플리케이션 내부에서 유일한 값이어야 하기 때문에 atom과 selector를 만들때 주의를 기울여야 함.
  - default: atom의 초깃값
  - useRecoilValue: atom의 값을 읽어오는 훅
  - useRecoilState: useState와 유사하게 값을 가져오고 값을 변경할 수도 있는 훅

  - 정리
    <RecoilRoot/>를 선언해 하나의 스토어를 만들고, atom이라는 상태 단위를 <RecoilRoot/> 에서 만든 스토어에 등록. 컴포넌트는 Recoil에서 제공하는 훅을 통해 atom의 상태변화를 구독하고, 값이 변경되면 forceUpdate 같은 기법을 통해 리렌더링을 실행해 최신 atom값을 가져오게 됨

### Jotai

Recoil의 atom 모델에 영감을 받아 만들어진 상태 관리 라이브러리. 상향식 접근법을 취하고 있으며 리액트 Context의 문제점인 불필요한 리렌더링이 일어난다는 문제를 해결하고자 설계되어 있으며, 추가적으로 메모이제이션이나 최적화를 거치지 않아도 리렌더링이 발생되지 않도록 설계되어 있음.

### zustand

리덕스에 영감을 받아 만들어져 하나의 스토어를 중앙 집중형으로 활용해 스토어 내부에서 상태를 관리하고 있음.

- 특징
  - 많은 코드를 작성하지 않아도 빠르게 스토어를 만들고 사용할 수 있음.
  - bundlePhobia기준으로 2.9kb밖에 되지 않는 작은 번들사이즈를 가지고 있다.
  - 초보자들도 쉽게 접근할수 있을 만큼 접근성이 좋다.
  - 타입스크립트 기반으로 작성되어 별도로 @types를 설치하거나 임의로 작성된 d.ts에 대한 우려 없이 타입스크립트를 자연스럽게 쓸 수 있다.
  - 미들웨어를 지원한다
