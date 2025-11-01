# Ch1. 리액트 개발을 위해 꼭 알아야 할 자바스크립트

## 1.1 자바스크립트의 동등 비교

- React의 **DOM 비교(Reconciliation)**, **렌더링 여부 판단**, **메모이제이션(`React.memo`, `useMemo`)** 은 모두 **JS 동등 비교**를 기반으로 작동한다.

### 원시 타입 (Primitive, 불변, 값 자체 저장)

- **Boolean, null, undefined, Number, BigInt, String, Symbol**
- `undefined`: 값 미할당 시 자동 할당
- `null`: 의도적으로 “없음” 표시 (초기 설계 버그로 typeof는 object)
- `Boolean`: truthy/falsy 존재
  - falsy: `false, 0, -0, 0n, "", null, undefined, NaN`
- `Number`: 안전한 범위 ±(2^53 - 1)
- `BigInt`: 매우 큰 정수 (n 접미사)
- `String`: 텍스트, 템플릿 리터럴 지원
- `Symbol`: 유일한 값 생성 (객체 키로 자주 활용)

### 객체 타입 (Reference, 참조 저장)

- Object, Array, Function, Class 등
- 값 같아도 참조가 다르면 `false`

```jsx
const a = { x: 1 },
  b = { x: 1 };
console.log(a === b); // false
```

### 비교 종류

- **`==` (느슨한 동등 비교)**
  - 타입 변환 후 비교
  - 예: `0 == '0' // true`
- **`===` (엄격한 동등 비교)**
  - 타입 변환 없이 값과 타입 비교
  - 예: `0 === '0' // false`
- **`Object.is`**
  - `===`와 유사하지만 특수 케이스 다름
  - `NaN` → `Object.is(NaN, NaN) // true`
  - `+0` vs `0` → `Object.is(+0, -0) // false`

### 값 저장 방식 차이

- **원시 타입**: 값 자체 저장 → 값 같으면 `===` true
- **객체 타입**: 참조 주소 저장 → 주소가 같아야 true

```jsx
const obj1 = { x: 1 },
  obj2 = { x: 1 };
console.log(obj1 === obj2); // false

const obj3 = obj1;
console.log(obj1 === obj3); // true
```

### React의 비교 방식

- React는 **props 얕은 비교(1 depth)** 로 렌더링 여부 판단
- 깊은 비교는 비용이 커서 하지 않음 (불변성 유지가 전제)

### shallowEqual

```jsx
function shallowEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (
    typeof a !== "object" ||
    a === null ||
    typeof b !== "object" ||
    b === null
  )
    return false;

  const keysA = Object.keys(a),
    keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;

  for (let k of keysA) {
    if (!Object.prototype.hasOwnProperty.call(b, k) || !Object.is(a[k], b[k]))
      return false;
  }
  return true;
}
```

### React.memo

```jsx
const Item = ({ title, count }) => {
  console.log("렌더링:", title);
  return (
    <div>
      {title} - {count}
    </div>
  );
};

export default React.memo(Item);
```

- 같은 props(얕은 비교 기준) → 렌더링 스킵
- ⚠️ 객체 내부 수정 후 같은 레퍼런스 재사용 시 변경 감지 못함 → **불변 업데이트 필수**

## 1.2 함수

### 정의 방법

1. **선언문** : 호이스팅 O
2. **표현식** : 변수에 할당, 일급 객체
3. **화살표 함수** : 간결, this는 선언 시점 고정 / arguments 없음 / new 불가
4. **즉시 실행 함수(IIFE)** : 정의 즉시 실행, 스코프 분리

### 고차 함수 (Higher-Order)

- 함수를 인자로 받거나 반환하는 함수 → 콜백/조합에 활용

```jsx
function withLog(fn) {
  return (...args) => {
    console.log("시작");
    return fn(...args);
  };
}
```

### 함수를 만들 때 주의해야 할 사항

- 함수의 부수효과를 최대한 억제하라
- 가능한 함수를 작게 만들어라
- 누구나 이해할 수 있는 이름을 붙여라

## 1.3 클래스

- 객체 생성 템플릿 (프로토타입 기반)

### 구성 요소

- **constructor** : 초기화 담당 (클래스 당 하나만 존재 가능)
- **프로퍼티** : this에 값 할당
- **getter/setter** : 접근 시 특별 동작 정의
- **인스턴스 메서드** : prototype에 저장, 프로토타입 체이닝
- **정적 메서드** : 클래스 이름으로 직접 호출
- **상속(extends)** : 부모 클래스 확장, `super()` 호출

## 1.4 클로저

### 클로저

- 함수 + 선언 당시의 스코프 환경
- 외부 함수 변수를 내부 함수가 참조 가능 → **상태 유지 / 정보 은닉**
- 선언 시점에 정적으로 결정됨

```jsx
function outer() {
  let count = 0;
  return () => ++count;
}
const counter = outer();
console.log(counter()); // 1
console.log(counter()); // 2
```

### 스코프

- **전역 스코프** : 어디서든 접근 가능
- **함수 스코프(var)** : 함수 단위
- **블록 스코프(let/const)** : `{}` 단위

## 1.5 이벤트 루프와 비동기 통신의 이해

- JS는 **싱글 스레드** (DOM 충돌 방지, 단순성)
- **이벤트 루프**: 동기/비동기 코드 조율

### 이벤트 루프

**실행 순서**

1. **Call Stack** (동기)
2. **Microtask Queue** (Promise 등)
3. **Task Queue** (setTimeout 등)

```jsx
console.log("start");
Promise.resolve().then(() => console.log("promise"));
setTimeout(() => console.log("timeout"), 0);
console.log("end");

// 실행 순서: start → end → promise → timeout
```

## 1.6 리액트에서 자주 사용하는 자바스크립트 문법

### 구조 분해 할당

- 배열 또는 객체의 값을 분홰해 갭별 변수에 할당하는 것

### 배열 구조 분해 할당

- 리액트에서 대표적으로 `useState` 존재
- 기본 값은 `undefined`
- 전개 연산자(...rest)는 뒤에서만 용 가능

### 객체 구조 분해 할당

- 객체는 내부 이름으로 값을 가져옴
- [key] a문법으로도 값을 가지고 올 수 있다.

```jsx
const key = 'a'
const object = {
  a: 1,
  b: 1,
}

const {[key] : a} = object
console.log(a) // 1

const {[key]} = object // SyntaxError
```

### 전개 구문

- 배열이나 객체, 문자열 같이 순회할 수 있는 값에 대해 전개
- 객체에서의 전개 구문은 순서에 따라 전혀 다른 객체가 생성될 수 있다.

### 객체 초기자

- 객체를 선언할 대 객체에 넣고자 하는 키와 값을 가지고 있는 변수가 존재한다면 값을 간결하게 넣을 수 있는 방식

```js
const a = 1;
const b = 2;

const obj = {
  a,
  b,
};

// {a: 1, b: 2}
```

### Array 프로토타입의 메서드: map, filter, reduce, forEach

**Array.prototype.map**

- 인수로 전달받은 배열과 똑같은 길이의 새로운 배열을 반환하는 메서드

```js
const arr = [1, 2, 3, 4, 5];
const el = arr.map((item) => item * 2);
// [2,4,6,8,10]
```

**Array.prototype.filter**

- 콜백 함수를 인수로 받음
- 콜백 함수의 truthy 조건을 만족하는 경우만 해당 원소 반환
- map과 다르게 같은 길이의 배열이 나오지 않을 수 있다.

```js
const arr = [1, 2, 3, 4, 5];
const elf = arr.filter((item) => item % 2 === 0);
// [2,4]
```

**Array.prototype.reduce**

- 콜백 함수와 함께 초깃값을 추가로 인수를 받는다.
- 해당 초깃값에 따라 배열이나 객체, 또는 그 외 무언가를 반환 가능

```js
const arr = [1, 2, 3, 4, 5];
const sum = arr.reduce((acc, cur) => {
  return acc + cur;
}, 0);
// 15
```

**Array.Prototype.forEach**

- 콜백 함수를 받아 배열을 순회하면서 해당 콜백 함수를 실행하는 메서드
- 결과를 반환 하는 작업은 수행하지 않는다 (반환 값이 없음)
- 실행되는 순가 에러를 던지거나 프로세스를 종료하지 않는 이상 멈출 수 없다

```js
function run() {
  const arr = [1, 2, 3];
  arr.forEach((item) => {
    console.log(item);
    if (item === 1) {
      console.log("finished!");
      return;
    }
  });
}

run();

// 1
// finished!
// 2
// 3
```
