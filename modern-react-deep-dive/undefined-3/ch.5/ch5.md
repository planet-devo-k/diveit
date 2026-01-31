# Chapter 5

## 5.1 상태 관리는 왜 필요한가?

### 1. 상태(State)의 정의와 중요성

웹 프론트엔드 개발에서 \*\*상태(State)\*\*란 \*\*"애플리케이션의 시나리오에 따라 지속적으로 변경되며, 그 결과가 UI에 즉각적으로 반영되어야 하는 값"\*\*을 의미합니다. 웹 애플리케이션이 단순한 뷰어를 넘어 복잡한 상호작용을 가진 소프트웨어로 진화하면서, 다음과 같은 다양한 상태들이 얽히게 되었습니다.

* **UI 상태:** 모달의 열림/닫힘, 다크 모드 여부, 인풋의 값
* **서버 데이터:** API 요청 결과, 로딩 중(Loading), 에러(Error) 상태
* **URL 상태:** 현재 라우트 경로, 쿼리 파라미터

이 수많은 상태를 효율적으로 관리하고 동기화하는 것이 프론트엔드 성능의 핵심입니다.

***

### 2. 리액트 상태 관리의 역사적 진화

#### ① Flux 패턴의 등장 (MVC의 한계 극복)

초기 웹 프레임워크(AngularJS 등)는 \*\*양방향 데이터 바인딩(Two-way Binding)\*\*을 사용했습니다.

* **문제점:** 모델이 뷰를 바꾸고, 뷰가 다시 모델을 바꾸는 순환 구조는 앱이 커질수록 데이터 흐름을 추적하기 불가능하게 만들었습니다. (페이스북의 '읽지 않은 메시지 배지' 버그가 대표적)
* **Flux 패턴:** 페이스북은 이를 해결하기 위해 **단방향 데이터 흐름**을 제안했습니다.
  * `Action` → `Dispatcher` → `Store` → `View`

#### ② 리덕스(Redux): 단방향 흐름의 완성

Flux 패턴에 **Elm 아키텍처**를 결합하여 등장한 리덕스는 오랫동안 시장을 지배했습니다. 리덕스는 \*\*"하나의 거대한 스토어(Single Source of Truth)"\*\*에 모든 상태를 저장하고, \*\*"순수 함수(Reducer)"\*\*를 통해서만 상태를 변경한다는 철칙을 가집니다.

하지만, 간단한 기능 하나를 구현하기 위해 작성해야 하는 코드가 너무 많다는(Boilerplate) 비판을 받았습니다.

```javascript
// Redux의 보일러플레이트 예시 (단순 카운터 증가인데도 코드가 김)
// 1. Action Type
const INCREMENT = "INCREMENT";

// 2. Action Creator
const increment = () => ({ type: INCREMENT });

// 3. Reducer (순수 함수)
const initialState = { count: 0 };
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case INCREMENT:
      return { count: state.count + 1 };
    default:
      return state;
  }
}

// 4. Store 생성
const store = createStore(counterReducer);
```

#### ③ Context API: 의존성 주입(DI) 도구

리액트 16.3에서 등장한 Context API는 `Provider`를 통해 상위 컴포넌트의 데이터를 하위 컴포넌트 어디서든 접근할 수 있게 해줍니다.

* **주의점:** Context는 상태 관리 도구가 아니라 **상태 주입 도구**입니다. `Provider`의 값이 바뀌면 이를 구독하는 **모든 하위 컴포넌트가 강제로 리렌더링**되므로, 자주 바뀌는 데이터를 넣으면 성능 이슈가 발생합니다.

#### ④ React Query & SWR: 서버 상태의 분리

Hooks(16.8) 도입 이후, \*\*"서버에서 가져온 데이터(Server State)"\*\*와 \*\*"클라이언트 내부 상태(Client State)"\*\*를 분리하는 패러다임이 대세가 되었습니다.

* API 요청, 캐싱, 로딩 처리는 `React Query`에게 맡기고, 전역 상태 관리 라이브러리는 순수 UI 상태만 관리하게 되면서 역할이 축소되었습니다.

***

## 5.2 리액트 훅으로 시작하는 상태 관리 (원리 탐구)

### 1. 지역 상태의 한계 (useState)

`useState`는 리액트가 제공하는 가장 기본적인 훅이지만, **클로저(Closure)** 내부에 갇혀 있다는 한계가 있습니다. 상태를 공유하려면 `Props Drilling`을 해야 하는데, 이는 컴포넌트 결합도를 높입니다.

### 2. 상태 관리 라이브러리는 어떻게 만들어지는가? (Deep Dive)

리액트 외부에서 전역 상태를 관리하려면 \*\*옵저버 패턴(Observer Pattern)\*\*을 사용해야 합니다. 대부분의 라이브러리(Redux, Zustand 등)는 내부적으로 아래와 같은 구조를 가집니다.

#### Step 1: 바닐라 JS로 스토어(Store) 만들기

리액트와 무관한 순수 자바스크립트 객체에 데이터를 저장하고, 변경을 감지할 수 있는 구독 시스템을 만듭니다.

```typescript
// store.ts
export function createStore<State>(initialState: State) {
  // 1. 상태는 클로저 내부에 숨겨진 변수로 존재
  let state = initialState;
  // 2. 구독자(리스너)들을 저장할 Set (중복 방지)
  const callbacks = new Set<() => void>();

  const get = () => state;

  const set = (nextState: State | ((prev: State) => State)) => {
    // 새로운 상태 설정
    state =
      typeof nextState === "function"
        ? (nextState as Function)(state)
        : nextState;

    // 3. 핵심: 상태가 변하면 등록된 모든 콜백을 실행!
    callbacks.forEach((callback) => callback());
    return state;
  };

  const subscribe = (callback: () => void) => {
    callbacks.add(callback);
    // 클린업 함수 반환
    return () => callbacks.delete(callback);
  };

  return { get, set, subscribe };
}
```

#### Step 2: 리액트 컴포넌트와 연결하기 (Custom Hook)

위에서 만든 스토어의 변경 사항을 리액트가 감지하여 **리렌더링**을 일으키도록 연결해야 합니다. 이때 `useState`나 `useReducer`가 "리렌더링 트리거" 역할을 합니다.

```typescript
// useStore.ts
export const useStore = <State>(store: Store<State>) => {
  // 스토어의 현재 값을 초기값으로 가짐
  const [state, setState] = useState(store.get());

  useEffect(() => {
    // 스토어를 구독하고, 변경 발생 시 setState를 호출해 리렌더링 유발
    const unsubscribe = store.subscribe(() => {
      setState(store.get());
    });
    // 컴포넌트 언마운트 시 구독 해제
    return unsubscribe;
  }, [store]);

  return [state, store.set] as const;
};
```

> **⚠️ TEAR (찢어짐) 현상** 리액트 18의 동시성 렌더링 중 외부 스토어 값이 변경되면 UI 불일치가 발생할 수 있습니다. 이를 해결하기 위해 리액트는 **`useSyncExternalStore`** 훅을 공식적으로 제공합니다.

***

## 5.3 현대적인 상태 관리 라이브러리 3대장

최근 트렌드는 Redux의 복잡함을 덜어내고, **"Atomic(원자)"** 패턴이나 **"간소화된 Flux"** 패턴을 따릅니다.

### 1. Recoil (Meta) - 리액트 전용 라이브러리

* **구조:** **Atom**이라는 작은 상태 조각을 만들고 조합합니다.
* **특징:** 리액트 내부 스케줄러와 완벽히 호환되며, `Selector`를 통해 파생 상태(Derived State)를 계산하고 캐싱하는 기능이 강력합니다.

```javascript
// atom 생성 (고유 key 필수)
const countState = atom({
  key: "countState",
  default: 0,
});

// 컴포넌트 사용
function Counter() {
  const [count, setCount] = useRecoilState(countState);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Jotai (Poimandres) - 더 가볍고 유연한 Atomic

* **특징:** Recoil의 경량화 버전입니다. `Key`를 입력할 필요가 없어 API가 훨씬 간결합니다.
* **Bottom-up:** 작은 단위의 상태(Atom)를 정의하고 이를 합쳐나가는 상향식 설계에 최적화되어 있습니다.

```javascript
// atom 생성 (key 불필요)
const countAtom = atom(0);

// 컴포넌트 사용
function Counter() {
  const [count, setCount] = useAtom(countAtom);
  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;
}
```

### 3. Zustand (Poimandres) - 단순함의 미학

* **구조:** 하나의 중앙 스토어를 사용하지만 Redux보다 훨씬 단순합니다.
* **특징:** `Provider`로 감쌀 필요가 없으며, **바닐라 JS**에서도 스토어에 접근할 수 있어 확장성이 매우 뛰어납니다. 현재 가장 인기 있는 라이브러리입니다.

```javascript
// store 생성 (create 함수 하나면 끝)
import { create } from "zustand";

const useCountStore = create((set) => ({
  count: 0,
  increase: () => set((state) => ({ count: state.count + 1 })),
  decrease: () => set((state) => ({ count: state.count - 1 })),
}));

// 컴포넌트 사용
function Counter() {
  // 필요한 값만 구조분해 할당 (Selector 역할)
  const { count, increase } = useCountStore();
  return <button onClick={increase}>{count}</button>;
}
```

***

### 📝 결론: 어떤 것을 선택해야 할까?

| 상황               | 추천 라이브러리                      | 이유                                                          |
| ---------------- | ----------------------------- | ----------------------------------------------------------- |
| **서버 데이터 위주**    | **React Query** + Context API | 서버 상태는 React Query가 담당하고, UI 상태는 가벼운 Context나 useState로 충분함 |
| **단순한 전역 상태**    | **Zustand**                   | 러닝 커브가 가장 낮고, 보일러플레이트가 없으며 가볍다                              |
| **복잡한 연산/파생 상태** | **Recoil** / **Jotai**        | 엑셀 시트처럼 상태 간의 의존성이 복잡할 때 Atom 구조가 유리함                       |
| **엄격한 관리/대규모**   | **Redux Toolkit**             | 강력한 미들웨어, 디버깅 툴, 예측 가능한 상태 변화가 필요한 대규모 팀 프로젝트               |
