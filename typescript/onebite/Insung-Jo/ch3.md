# 타입은 집합이다.

## 1. 개요

타입스크립트의 타입 시스템을 이해하는 가장 좋은 방법은 **"집합(Set) 이론"**으로 바라보는 것입니다.

- 타입은 **특정 값들의 집합**입니다.
- **예시:**
  - `number` 타입: 세상의 모든 숫자 값들을 포함하는 집합
  - `"hello"` 리터럴 타입: 오직 `"hello"`라는 값 하나만 포함하는 집합

## 2. 계층 구조: 슈퍼타입과 서브타입

집합의 포함 관계(크기)에 따라 타입을 상위와 하위로 나눌 수 있습니다.

### 2.1 슈퍼타입 (Supertype)

- **정의:** 더 넓은 범위를 가지는 상위 타입 (부모 집합)
- **예시:** `number`

### 2.2 서브타입 (Subtype)

- **정의:** 더 좁은 범위를 가지는 하위 타입 (자식 집합/부분 집합)
- **예시:** `10` (숫자 리터럴 타입)

```tsx
let a: number = 23; // 슈퍼타입 (모든 숫자)
let b: 10 = 10; // 서브타입 (오직 10)
```

> 관계: 10은 number 집합에 포함되므로, 10은 number의 서브타입입니다.

## 3. 타입 호환성 (Type Compatibility)

타입스크립트에서 어떤 변수에 다른 변수의 값을 할당할 수 있는지 판단하는 규칙입니다.

### 3.1 할당 규칙

- **서브타입 → 슈퍼타입 (가능):** 작은 집합의 값을 큰 집합에 넣는 것은 항상 안전합니다.
- **슈퍼타입 → 서브타입 (불가능):** 큰 집합의 값을 작은 집합에 억지로 넣을 수 없습니다. (값의 집합 크기 차이 때문)

### 3.2 코드 예시

```tsx
let parent: number = 10;
let child: 10 = 10;

parent = child; // 가능 (서브 → 슈퍼)
// child = parent; // 오류 (슈퍼 → 서브 불가)
```

> 서브타입은 항상 슈퍼타입에 안전하게 포함될 수 있다.
> 슈퍼타입은 서브타입보다 더 많은 값을 포함하기 때문에 안전하지 않다.

## 4. 캐스팅: 업캐스팅과 다운캐스팅

타입 간의 변환 과정을 방향에 따라 두 가지로 분류합니다.

### 4.1 업캐스팅 (Upcasting)

- **방향:** 좁은 타입(서브) → 넓은 타입(슈퍼)
- **안전성:** **항상 안전**하며, 타입스크립트가 자동으로 허용합니다.

```tsx
let literal: 10 = 10;
let num: number = literal; // 업캐스팅 (OK)
```

### 4.2 다운캐스팅 (Downcasting)

- **방향:** 넓은 타입(슈퍼) → 좁은 타입(서브)
- **안전성:** **안전하지 않음.** 대부분의 경우 오류가 발생합니다.
- **강제 방법:** 꼭 필요하다면 `as` 키워드(타입 단언)를 써야 하지만, **런타임에서 안전을 보장하지 않는다.**

```tsx
let num: number = 10;
// let literal: 10 = num; // 오류 발생
let literal2 = num as 10; // 다운캐스팅 강제 (위험)
```

---

# **타입 계층도와 함께 기본타입 살펴보기**

![image.png](attachment:72d05aa6-77c1-42ac-9494-fb374c865f3d:image.png)

## 1. 개요: 타입 계층도란?

타입스크립트의 모든 타입은 **부모(슈퍼타입)**와 **자식(서브타입)** 관계를 맺으며 하나의 거대한 계층 구조를 이룹니다.

- **최상위 (Top):** `unknown` (모든 것을 포함)
- **최하위 (Bottom):** `never` (아무것도 없음)

## 2. 최상위 타입: unknown

타입 계층도의 꼭대기에 위치하며, **모든 타입의 슈퍼타입**입니다.

### 2.1 특징

- **업캐스팅 (가능):** 모든 타입의 값을 `unknown` 변수에 담을 수 있습니다.
- **다운캐스팅 (불가능):** `unknown` 타입의 값을 다른 구체적인 타입(number 등)의 변수에 넣을 수 없습니다. (안전장치)

### 2.2 예시

```tsx
let a: unknown = 1; // 업캐스팅 (OK)
let b: unknown = "hello"; // 업캐스팅 (OK)

let unknownVar: unknown;
// let num: number = unknownVar; // 다운캐스팅 (오류)
```

## 3. 최하위 타입: never

타입 계층도의 가장 바닥에 위치하며, **모든 타입의 서브타입**입니다. 수학적으로는 **공집합(Empty Set)**에 해당합니다.

### 3.1 특징

- **업캐스팅 (가능):** `never`는 모든 타입에 할당될 수 있습니다.
- **다운캐스팅 (불가능):** 그 어떤 값도 `never` 변수에 담을 수 없습니다.
- **용도:** 무한 루프나 프로그램 종료(에러)처럼 값이 반환되지 않는 상황.

### 3.2 예시

```tsx
function neverFunc(): never {
  while (true) {}
}

let num: number = neverFunc(); // 업캐스팅 (OK)
// let n: never = 10;          // 다운캐스팅 (오류: 10을 never에 넣을 수 없음)
```

## 4. 중간 타입: void

반환 값이 없는 함수의 타입으로 사용됩니다.

- **계층 위치:** `undefined`의 **슈퍼타입**입니다.
- **특징:** `void` 변수에는 `undefined`를 할당할 수 있습니다. (업캐스팅)

```tsx
let a: void;
a = undefined; // 가능 (undefined -> void)
// a = 1;      // 불가능
```

## 5. 예외 타입: any

타입 계층도를 완전히 무시하는 타입입니다.

### 5.1 특징

- 모든 타입의 슈퍼타입이면서, 동시에 모든 타입의 서브타입처럼 동작합니다. (단, `never` 제외)
- 타입 계층과 안전성을 파괴하므로 가급적 사용을 지양해야 합니다.

```tsx
let num: any;
let a: unknown = num; // any는 어디든 들어가고, 무엇이든 받음
```

## 6. 요약: 업캐스팅 & 다운캐스팅

| **From \ To** | **any** | **unknown** | **object** | **void** | **undefined** | **null** | **never** |
| ------------- | ------- | ----------- | ---------- | -------- | ------------- | -------- | --------- |
| any           | O       | O           | O          | O        | O             | O        | O         |
| unknown       | O       | O           | X          | X        | X             | X        | O         |
| object        | O       | O           | O          | X        | X             | X        | O         |
| void          | O       | O           | X          | O        | O             | O        | O         |
| undefined     | O       | O           | X          | O        | O             | O        | O         |
| null          | O       | O           | X          | O        | O             | O        | O         |
| never         | O       | O           | O          | O        | O             | O        | O         |

---

# 객체 타입의 호환

## 1. 기본 개념

객체 타입 간의 상하 관계(슈퍼/서브)를 결정하는 기준은 "**프로퍼티의 개수(조건)**"입니다.

- **슈퍼타입 (상위):** 프로퍼티가 적은 쪽 (조건이 단순함 → 더 넓은 범위를 포용)
- **서브타입 (하위):** 프로퍼티가 많은 쪽 (조건이 까다로움 → 더 구체적인 범위)

> 핵심: "조건이 더 적은 타입이 슈퍼타입이 된다."

## 2. 호환성 예시: Animal vs Dog

프로퍼티 개수에 따른 할당 가능 여부(업캐스팅/다운캐스팅)를 확인해 봅니다.

### 2.1 타입 정의

```tsx
type Animal = {
  // 슈퍼타입 (조건: 2개)
  name: string;
  color: string;
};

type Dog = {
  // 서브타입 (조건: 3개)
  name: string;
  color: string;
  breed: string; // 추가된 조건
};
```

### 2.2 할당 규칙

```tsx
let animal: Animal = { name: "기린", color: "yellow" };
let dog: Dog = { name: "뭉뭉이", color: "brown", breed: "진도" };

// 1. 업캐스팅 (서브 → 슈퍼): 가능
animal = dog;
// 이유: Dog는 Animal이 필요로 하는 name, color를 모두 가지고 있음.

// 2. 다운캐스팅 (슈퍼 → 서브): 불가능
// dog = animal;
// 이유: Animal에는 Dog가 필요로 하는 breed가 없음.
```

## 3. 초과 프로퍼티 검사 (Excess Property Check)

타입스크립트에는 객체 타입 호환성과 관련하여 한 가지 **예외적인 규칙**이 존재합니다.

### 3.1 현상

변수에 담아서 할당할 때는 허용되던 것이, **객체 리터럴을 직접 할당할 때는 오류**가 발생합니다.

```tsx
type Book = {
  name: string;
  price: number;
};

// 할당하려는 데이터 (Book보다 속성이 많음 = 서브타입)
let programmingBook = {
  name: "한 입 리액트",
  price: 33000,
  skill: "reactjs",
};

let book: Book;

// Case 1: 변수 할당 (구조적 호환성 허용)
book = programmingBook;

// Case 2: 객체 리터럴 직접 할당 (초과 프로퍼티 검사 발동)
book = {
  name: "한 입 리액트",
  price: 33000,
  //   skill: "reactjs" // 오류: 객체 리터럴은 알려진 속성만 지정할 수 있음
};
```

### 3.2 원인 및 해결

- **원인:** 객체 리터럴을 직접 할당하는 경우, 개발자가 **실수(오타 등)**를 했을 가능성이 높다고 판단하여 타입스크립트가 더 엄격하게 검사하기 때문입니다.
- **해결:** 변수를 경유하여 할당하면 구조적 서브타이핑 룰에 따라 정상적으로 업캐스팅 됩니다.

---

# 대수 타입

## 1. 개요: 대수 타입이란?

- 여러 개의 타입을 합성해서 새로운 타입을 만드는 방식이다.
- 대표적으로 **합집합 타입 (Union Type)** 과 **교집합 타입 (Intersection Type)** 이 존재한다.

## 2. 합집합 타입 (Union Type)

여러 타입 중 **"하나만 만족하면 되는"** 타입입니다. (OR 연산 `||`과 유사)

### 2.1 특징

- **기호:** `|` 사용
- **효과:** 타입의 허용 범위가 **넓어집니다.**

### 2.2 기본형 예시

```tsx
let a: string | number;
a = 1; // 가능
a = "hello"; // 가능
// a = true; // 불가능
```

### 2.3 객체 타입에서의 Union

객체 타입 간의 유니온은 동작 방식에 주의해야 합니다. **"적어도 하나의 타입 구조를 완벽하게 갖춰야"** 합니다.

```tsx
type Dog = {
  name: string;
  color: string;
};

type Person = {
  name: string;
  language: string;
};

type Union1 = Dog | Person;

// Case 1: Dog 타입 만족 (O)
let union1: Union1 = { name: "바둑이", color: "흰색" };

// Case 2: Person 타입 만족 (O)
let union2: Union1 = { name: "정환", language: "ko" };

// Case 3: 둘 다 만족 (O) - 교집합 영역
let union3: Union1 = { name: "하이브리드", color: "갈색", language: "en" };

// Case 4: 이도 저도 아님 (X) - 오류 발생!
// let union4: Union1 = { name: "누구세요" };
```

⚠️ **union4가 오류가 나는 이유?**

Dog의 필수 조건(color)도 없고, Person의 필수 조건(language)도 없기 때문입니다.
Union 타입은 **"둘 중 하나라도 완전하게 만족"**해야 성립합니다.

## 3. 교집합 타입 (Intersection Type)

여러 타입의 **"모든 속성을 다 만족해야 하는"** 타입입니다. (AND 연산 `&&`과 유사)

### 3.1 특징

- **기호:** `&` 사용
- **효과:** 타입의 제약 조건이 늘어나므로 범위가 **좁아집니다.**
- **용도:** 여러 객체 타입을 합쳐서 하나로 만들 때 주로 사용합니다.

### 3.2 예시

```tsx
type Dog = { name: string; color: string };
type Person = { name: string; language: string };

type Intersection = Dog & Person;

// 모든 속성(name, color, language)이 다 있어야 함
let intersection1: Intersection = {
  name: "멍멍이사람",
  color: "brown",
  language: "english",
};

// 하나라도 빠지면 오류 발생
// let err: Intersection = { name: "실수", color: "red" }; // ❌ language 누락
```

# 타입 추론

## 1. 개요

**타입 추론**이란, 개발자가 변수나 함수의 타입을 명시적으로 선언하지 않아도 타입스크립트가 **초기값이나 문맥을 분석하여 타입을 자동으로 유추**하는 기능입니다.

## 2. 추론이 발생하는 경우

타입스크립트는 다음과 같은 상황에서 적극적으로 타입을 추론합니다.

### 2.1 변수 초기화 (Variable Initialization)

변수를 선언함과 동시에 값을 할당하면, 그 **값의 타입**을 기준으로 변수의 타입을 결정합니다.

```tsx
let a = 10; // number로 추론
let b = "string"; // string으로 추론
let c = {
  id: 1,
  name: "이정환",
  profile: { nickname: "winterlood" },
}; // 객체 내부 구조까지 상세하게 추론함
```

### 2.2 구조 분해 할당 (Destructuring)

객체나 배열을 구조 분해할 때도 원본 데이터의 타입을 따라갑니다.

```tsx
let { id, name, profile } = c; // id는 number, name은 string...
let [one, two] = [1, "hello"]; // one은 number, two는 string
```

### 2.3 함수 반환값 & 기본값

반환 타입을 적지 않아도 `return` 문을 보고 추론하며, 매개변수 기본값이 있으면 해당 값으로 타입을 추론합니다.

```tsx
// msg는 기본값 덕분에 string으로 추론됨
// 반환값도 "hello"이므로 string으로 추론됨
function func(msg = "hello") {
  return "hello";
}
```

## 3. 주의해야 할 상황 (Pitfalls)

### 3.1 암묵적 Any (Implicit Any)

변수를 선언만 하고 **초기값을 주지 않으면**, 타입스크립트는 정보를 알 수 없어 일단 `any`로 추론합니다.

- **특징:** 이후에 값을 할당하면 타입이 계속 변하는 것처럼 동작합니다(진화).
- **권장:** `strict` 모드에서는 이를 에러로 잡습니다. 항상 타입을 명시하거나 초기값을 주는 것이 좋습니다.

```tsx
let d; // 암시적 any
d = 10; // 이 시점엔 number처럼 동작
d = "hello"; // 이 시점엔 string처럼 동작
```

## 4. 타입 넓히기 (Type Widening)

타입스크립트가 타입을 추론할 때, **변수 선언 키워드(`let` vs `const`)**에 따라 추론의 범위를 다르게 설정하는 메커니즘입니다.

### 4.1 let 선언 (일반 변수)

값의 재할당이 가능하므로, 리터럴 값보다 **더 넓은 범위의 타입(기본 타입)**으로 추론합니다.

- **이유:** 나중에 다른 값이 들어올 수 있기 때문입니다.

```tsx
let message = "hello"; // "hello"가 아니라 string으로 추론 (범용성 확보)
```

### 4.2 const 선언 (상수)

값의 재할당이 불가능하므로, **값 그 자체(리터럴 타입**)로 아주 좁게 추론합니다.

- **이유:** 값이 변할 리가 없기 때문입니다.

```tsx
const message2 = "hello"; // "hello" 리터럴 타입으로 고정
const num = 10; // 10 리터럴 타입으로 고정
```

## 5. 요약

- 타입 추론은 편리하지만 과신하면 타입 안정성이 무너질 수 있음.
- 항상 명시적인 타입 선언을 우선 고려할 것.
- **암묵적 any를 피하고, const를 활용하여 리터럴 타입 추론을 적극 활용하는 것이 안전.**
- 타입 넓히기 개념을 이해하면 추론 원리를 쉽게 파악 가능.

# 타입 단언 (Type Assertion)

## 1. 개요: 타입 단언이란?

- 타입스크립트가 추론한 타입보다 개발자가 더 정확한 타입을 알고 있다고 컴파일러에게 알려주는 방법.
- 타입 시스템의 타입 검사를 **일시적으로 무시**하고 강제할 때 사용.
- `as` 키워드를 사용하여 작성.
- 잘못 사용 시 타입 안정성을 해칠 수 있으므로 신중하게 사용해야 함.

## 2. 기본 사용법 및 규칙

### 2.1 일반적인 예시

빈 객체로 초기화한 후 나중에 값을 채워넣으려 할 때 자주 사용되지만, 초기화 실수를 컴파일러가 잡아주지 못하므로 위험할 수 있습니다.

```tsx
type Person = {
  name: string;
  age: number;
};

// 빈 객체는 Person 타입이 아니지만, 'as Person'으로 강제함
let person = {} as Person;
person.age = 123;
person.name = "asd";
```

### 2.2 단언 규칙

아무 타입이나 마음대로 단언할 수는 없습니다.

- **규칙:** `A`가 `B`의 **슈퍼타입**이거나 **서브타입**이어야 합니다. (즉, 서로 조금이라도 관계가 있어야 함)
- **예외 (다중 단언):** `unknown`을 중간에 끼워 넣으면(`A as unknown as B`) 규칙을 무시하고 변환 가능하지만, 이는 타입 시스템을 완전히 파괴하는 행위이므로 **비추천**합니다.

```tsx
let num1 = 10 as never; // 가능 (never는 모든 타입의 서브타입)
let num2 = 10 as unknown; // 가능 (unknown은 모든 타입의 슈퍼타입)

// let str = 10 as string; // 불가능 (number와 string은 겹치는게 없음)
let str = 10 as unknown as string; // 가능은 하지만 비추천
```

## 3. 잘못된 단언의 위험성

타입 단언은 "**컴파일러의 눈을 가리는 행위**"입니다.

- **초과 프로퍼티 검사 무력화:** 객체 리터럴에 존재하지 않는 속성을 넣어도, 타입 단언을 하면 오류가 사라집니다.
- **결과:** 코드는 문제없이 컴파일되지만, 실제 실행 시(런타임)에는 해당 속성이 존재하므로 의도치 않은 동작을 할 수 있습니다.

```tsx
type Dog = {
  name: string;
  color: string;
};

// breed는 Dog 타입에 없지만, 단언으로 인해 에러가 안 남
let dog = {
  name: "뽀삐",
  color: "white",
  breed: "진도", // 실제 객체엔 이 값이 들어감 -> 타입스크립트의 보호 기능이 무력화됨.
} as Dog;
```

## 4. 특수 단언

### 4.1 const 단언 (as const)

값을 변수 타입이 아닌 **리터럴 타입** 그 자체로 고정시킬 때 사용합니다.

- **객체에 사용 시:** 모든 프로퍼티가 자동으로 **`readonly`**가 됩니다.

```tsx
let num4 = 10 as const; // 타입이 number가 아닌 리터럴 10이 됨

let cat = {
  name: "야옹",
  color: "yellow",
} as const;
// cat.name = '옹야'; // 오류: 읽기 전용 속성임
```

### 4.2 Non-Null 단언 (!)

값이 `null`이나 `undefined`가 **아님을 확신할 때** 사용합니다.

- **문법:** 변수 뒤에 `!`를 붙입니다.
- 실제 값이 `null`이라면 런타임 에러가 발생합니다.

```tsx
type Post = {
  title: string;
  author?: string; // author는 없을 수도 있음 (undefined 가능)
};

let post: Post = { title: "게시글", author: "정환" };

// 컴파일러에게 author가 무조건 있다고 우김
const len: number = post.author!.length;
```
