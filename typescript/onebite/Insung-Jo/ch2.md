## 기본 타입 (Basic Types)

기본적으로 제공하는 타입으로, 자바스크립트의 원시 타입과 대응됩니다.

### 원시 타입 (Primitive Types)

하나의 값만 저장하는 타입입니다. (number, string, boolean, null, undefined)

### ① Number (숫자)

```tsx
let num1: number = 123;
let num2: number = -123;
let num3: number = 0.123;
let num4: number = -0.123;
// 특이사항: Infinity, NaN도 Number로 취급됩니다.
let num5: number = Infinity;
let num6: number = NaN;
```

> Note: : 타입을 붙이는 것을 **타입 주석(Type Annotation)**이라고 합니다.

### ② String (문자열)

```tsx
let str1: string = "hello";
let str2: string = "hello";
let str3: string = `hello`; // 템플릿 리터럴 가능
```

### ③ Boolean (불리언)

```tsx
let bool1: boolean = true;
let bool2: boolean = false;
```

- **Q. Truthy / Falsy 값은 어떻게 되나요?**
  - **A.** 아쉽게도 `boolean` 타입에서는 `true`와 `false` 밖에 사용되지 않습니다.
  - 하지만 `if`문 등의 조건식에서는 JS 런타임 방식으로 동작하여 Truthy/Falsy 값으로 취급받을 수 있습니다.

### ④ Null & Undefined

```tsx
let null1: null = null;
let undefiend1: undefined = undefined;
```

### 리터럴 타입 (Literal Types)

값 자체가 타입이 되는 타입입니다.

```tsx
let numA: 10 = 10;
// numA = 12; // Error
```

- **활용:** 개인적인 의견으로는 아마 타입을 생성하고 그 타입을 명시할 때(유니언 타입 등) 사용하는 것 같습니다.

---

# 배열과 튜플

## 1. 배열 (Array)

같은 타입의 요소들을 모아놓은 자료구조입니다.

### 1.1 선언 방법

두 가지 방식을 지원합니다.

1. **기본 방식:** `타입[]` (가장 많이 사용)
2. **제네릭 방식:** `Array<타입>`

### 1.2 다양한 배열 타입 정의

- **유니언 배열:** 배열 안에 여러 타입이 섞여 있을 경우 `|` (Union) 연산자를 사용합니다.
- **다차원 배열:** `[][]`와 같이 대괄호를 연달아 작성하여 정의합니다.

### 1.3 예시 코드

```tsx
// 1. 기본 타입 배열
let numArr: number[] = [1, 2, 3];
let strArr: string[] = ["a", "b"];

// 2. 제네릭 방식 (커스텀 타입과 활용하기 좋음)
let boolArr: Array<boolean> = [true, false, true];

// 3. 유니언 배열 (숫자 또는 문자열 혼합)
let arr1: (number | string)[] = [1, 2, 3, "a"];

// 4. 다차원 배열 (2차원)
let doubleArr: number[][] = [
  [1, 2, 3],
  [4, 5],
];
```

## 2. 튜플 (Tuple)

타입스크립트에만 존재하는 특별한 타입으로, **길이와 각 요소의 타입이 고정된 배열**입니다.

### 2.1 특징

- 각 인덱스(순서)마다 들어가야 할 타입이 미리 정의되어 있습니다.
- 선언된 타입과 다르거나, 길이가 다르면 오류가 발생합니다.

### 2.2 예시 코드

```tsx
// 길이가 2이며, 두 요소 모두 number여야 함
let tup1: [number, number] = [1, 2];

// 길이가 3이며, 순서대로 number, string, boolean이어야 함
let tup2: [number, string, boolean] = [1, "2", true];
```

### 2.3 사용처

- **순서가 중요한 데이터**를 표현할 때 유용합니다.
- 예: 좌표 데이터, API 응답의 고정된 구조 등

### 2.4 주의사항

- **배열 메서드 제한 미적용:** `push`나 `pop` 같은 배열 메서드를 사용할 때는 튜플의 길이 제한이 강제되지 않습니다. 따라서 의도치 않게 값이 추가되거나 삭제될 수 있으므로 사용 시 주의가 필요합니다.

---

# 객체

## 1. 개요

타입스크립트에서 단순히 `object`라고만 타입을 지정하는 것은 권장되지 않습니다.

- **이유:** 해당 값이 객체라는 사실만 알려줄 뿐, 내부에 어떤 프로퍼티가 있는지에 대한 정보는 제공하지 않습니다.
- **결과:** `user.id`와 같이 객체 내부 속성에 접근하려고 하면 오류가 발생합니다.
- **해결:** 객체의 구조(프로퍼티와 타입)를 명확하게 정의해야 합니다.

## 2. 객체 리터럴 타입 (Object Literal Types)

객체의 속성과 타입을 `{}` 형태로 정의하는 방식을 말합니다. 단순히 타입 이름만 적는 것이 아니라, **구조를 명시**하여 타입을 선언하는 방식입니다.

### 2.1 기본 선언 예시

```tsx
let user: {
  id: number;
  name: string;
} = {
  id: 1,
  name: "이정환",
};
```

## 3. 프로퍼티 제어자 (Property Modifiers)

객체의 속성을 정의할 때, 상황에 맞춰 유연하게 타입을 제어할 수 있는 기능들입니다.

### 3.1 옵셔널 프로퍼티 (Optional Properties)

특정 속성이 있어도 되고 없어도 되는 경우에 사용합니다.

- **문법:** 속성명 뒤에 `?`를 붙입니다.
- **예시:**

```tsx
let user: {
  id?: number; // id는 선택적 속성
  name: string;
} = {
  id: 1,
  name: "이정환",
};

// id가 없어도 오류가 발생하지 않음
user = {
  name: "길동",
};
```

### 3.2 읽기 전용 프로퍼티 (Readonly Properties)

변수가 생성된 이후에는 값을 절대 변경할 수 없도록 할 때 사용합니다.

- **문법:** 속성명 앞에 `readonly`를 붙입니다.
- **예시:**

```tsx
let config: {
  readonly apiKey: string;
} = {
  apiKey: "MY API KEY",
};

// config.apiKey = "NEW KEY"; // 오류 발생: 읽기 전용 속성임
```

---

# **타입 별칭과 인덱스 시그니쳐**

## 1. 개요

객체 타입을 정의할 때 매번 `{ id: number, name: string ... }`과 같이 긴 구조를 반복해서 작성하면 코드가 길어지고 유지보수가 어려워집니다. 이를 해결하기 위해 타입스크립트는 **타입 별칭**과 **인덱스 시그니처**라는 기능을 제공합니다.

## 2. 타입 별칭 (Type Alias)

복잡한 객체 타입에 **이름(별칭)**을 붙여 재사용하는 기능입니다.

### 2.1 특징

- **`type` 키워드 사용:** 타입을 변수처럼 정의하여 사용합니다.
- **장점:** 중복 코드를 제거하여 가독성과 유지보수성을 높여줍니다.
- **스코프 규칙:** 같은 스코프 내에서는 동일한 이름의 타입 별칭을 중복해서 선언할 수 없습니다.

### 2.2 사용 예시

```tsx
// 1. 타입을 정의하고 'User'라는 이름을 붙임
type User = {
  id: number;
  name: string;
  nickname: string;
  birth: string;
  bio: string;
  location: string;
};

// 2. 정의된 별칭을 사용하여 변수 선언
let user: User = {
  id: 1,
  name: "이정환",
  nickname: "dsa",
  birth: "1994.12.23",
  bio: "dasd",
  location: "땅",
};
```

## 3. 인덱스 시그니처 (Index Signature)

객체의 키(Key)와 값(Value)의 타입을 동적으로 정의해야 할 때 사용합니다. 키의 이름은 모르지만, 키와 값의 타입은 알고 있을 때 유용합니다.

### 3.1 기본 문법

`[key: 타입]: 타입` 형태를 사용하여 정의합니다.

```tsx
type CountryCodes = {
  [key: string]: string; // 키는 string, 값도 string이어야 함
};

let countryCodes: CountryCodes = {
  Korea: "ko",
  UnitedState: "us",
  UnitedKingdom: "uk",
};
```

### 3.2 필수 프로퍼티와 혼합 사용

인덱스 시그니처를 사용하면서 동시에 특정 키를 필수(Required)로 지정할 수 있습니다.

```tsx
type CountryNumberCodes = {
  [key: string]: number;
  Korea: number; // Korea라는 키는 반드시 있어야 하며, 값은 number여야 함
};
```

### 3.3 ⚠️ 주의사항

인덱스 시그니처와 개별 프로퍼티를 함께 사용할 때, **개별 프로퍼티의 타입은 반드시 인덱스 시그니처의 타입과 일치하거나 그 하위 타입**이어야 합니다.

```tsx
type WarningExample = {
  [key: string]: number; // 모든 문자열 키의 값은 number여야 한다고 선언

  // Korea: string; // 오류 발생
  // 이유: 인덱스 시그니처가 number를 강제하므로 string 타입은 올 수 없음
};
```

---

# 열거형 타입 (Enum)

## 1. 개요

- **Enum(열거형)**은 여러 가지 값들에 이름을 부여하여 열거해 두고 사용하는 타입입니다.
- **독자적 기능:** 자바스크립트에는 없는, 타입스크립트만의 고유한 기능입니다.
- **목적:** 코드의 가독성을 높이고, 실수를 줄여 유지보수성을 향상시킵니다.

### 1.1 사용 전후 비교

- **사용 전:** 숫자가 무엇을 의미하는지 알기 어렵습니다.
  ```tsx
  const user = { name: "정환", role: 0 }; // 0이 Admin인지 User인지 알 수 없음
  ```
- **사용 후:** 의미 있는 이름으로 값을 관리할 수 있습니다.
  ```tsx
  const user = { name: "정환", role: Role.ADMIN }; // 명확함
  ```

## 2. 숫자형 Enum (Numeric Enum)

값으로 숫자를 할당하는 가장 기본적인 형태입니다.

### 2.1 동작 방식 (Auto-Increment)

값을 직접 지정하지 않으면 **0부터 시작하여 1씩 자동 증가**합니다.

- **기본:** `ADMIN=0`, `USER=1`, `GUEST=2`
- **초기값 지정:** `ADMIN=10`으로 설정하면, 그 다음부터 `11`, `12`로 증가합니다.
- **중간 변경:** 중간에 값을 지정하면, 그 다음 멤버부터 다시 1씩 증가합니다.

### 2.2 예시 코드

```tsx
// 1. 기본 (0부터 시작)
enum Role {
  ADMIN, // 0
  USER, // 1
  GUEST, // 2
}

// 2. 시작값 변경 (10부터 시작)
enum RoleStart10 {
  ADMIN = 10,
  USER, // 11
  GUEST, // 12
}
```

> ⚠️ 주의사항: 값이 중복되거나 의도치 않게 계산될 수 있으므로 설계 시 주의해야 합니다.

## 3. 문자형 Enum (String Enum)

값에 의미 있는 문자열을 할당하는 형태입니다. API나 DB와 연동할 때 유용합니다.

### 3.1 특징

- **자동 증가 없음:** 숫자형과 달리 모든 멤버에 **명시적으로 값을 할당**해야 합니다.
- **장점:** 디버깅 시 숫자가 아닌 의미 있는 문자열이 출력되므로 가독성이 매우 뛰어납니다.

### 3.2 예시 코드

```tsx
enum Language {
  KOREAN = "kr",
  ENGLISH = "en",
}
```

## 4. 런타임 동작 (Runtime Behavior)

- **"컴파일하면 Enum은 사라지는가?"**에 대한 대답은 **"아니요”**입니다.

### 4.1 컴파일 결과

인터페이스나 타입 별칭(`type`)은 컴파일 시 사라지지만, **Enum은 자바스크립트 객체로 변환되어 실행 시점(Runtime)에도 남습니다.**

```tsx
// 컴파일 된 JS 코드 (IIFE 패턴으로 객체 생성)
var Role;
(function (Role) {
  Role[(Role["ADMIN"] = 0)] = "ADMIN";
  Role[(Role["USER"] = 1)] = "USER";
  Role[(Role["GUEST"] = 2)] = "GUEST";
})(Role || (Role = {}));
```

### 4.2 양방향 매핑 (Bidirectional Mapping)

숫자형 Enum은 컴파일 결과물의 특징 덕분에 **Key ↔ Value** 양방향으로 접근이 가능합니다.
_(단, 문자형 Enum은 단방향 매핑만 지원됩니다.)_

```tsx
console.log(Role.ADMIN); // 0 (Key로 접근)
console.log(Role[0]); // 'ADMIN' (Value로 접근 -> 양방향 매핑)
```

---

# Any 타입과 Unknown 타입

## 1. 개요

타입스크립트에는 모든 값을 담을 수 있는 특별한 타입이 두 가지 존재합니다. 바로 `any`와 `unknown`입니다.

- **공통점:** 어떤 타입의 값이든 할당할 수 있습니다.
- **권장사항:** 두 타입 모두 타입 안전성을 해칠 수 있으므로, **가급적 사용을 피하는 것이 원칙**입니다.

## 2. Any 타입

모든 타입의 제약을 무시하고 허용하는 **가장 강력하면서도 위험한 타입**입니다.

### 2.1 특징

- 타입스크립트의 타입 검사를 **완전히 무력화**시킵니다.
- 모든 값을 `any` 변수에 넣을 수 있고, 반대로 `any` 변수의 값을 **어디에든(다른 타입 변수에) 넣을 수 있습니다.**

### 2.2 위험성 (Risk)

컴파일러가 오류를 잡지 못하므로, 코드를 실행할 때(런타임) 에러가 터질 위험이 매우 큽니다.

```tsx
let anyVar: any = 10;
anyVar = "hello"; // OK

let num: number = 10;
num = anyVar; // ⚠️ 위험: string 값이 number 변수에 들어감 (런타임 에러 가능성)
```

## 3. Unknown 타입

`any`와 비슷하게 모든 값을 담을 수 있지만, **훨씬 안전하게 설계된 타입**입니다.

### 3.1 특징

- 어떤 타입도 할당할 수 있지만, **바로 다른 타입으로 할당하거나 사용할 수는 없습니다.**

```tsx
let unknownVar: unknown;
unknownVar = 10;
unknownVar = "hello"; // OK

let num: number = 20;
// num = unknownVar; // ❌ 오류 발생! (안전장치 작동)
```

### 3.2 안전하게 사용하기: 타입 정제 (Type Narrowing)

`unknown` 타입의 값을 실제로 사용하려면, **반드시 "이 값이 무슨 타입인지" 확인하는 과정(타입 정제)**을 거쳐야 합니다.

```tsx
if (typeof unknownVar === "number") {
  // 이 블록 안에서는 unknownVar가 number 타입으로 취급됨
  num = unknownVar; // ✅ 안전하게 할당 가능
}
```

<aside>
💡

항상 **unknown을 우선 고려**하고, **any는 최후의 수단으로만 사용**하는 것이 권장된다.

</aside>

---

# Void 타입과 Never 타입

## 1. 개요

`void`와 `never`는 둘 다 **"값이 없는 상태"**를 나타내지만, 그 의미와 용도에는 명확한 차이가 있습니다. 주로 함수의 반환 타입으로 사용됩니다.

## 2. Void 타입

- **"아무 값도 반환하지 않음"**을 명시할 때 사용하는 타입입니다.

### 2.1 사용 용도

- **함수:** `return` 문이 없거나, 값을 반환하지 않는 함수(예: 로그 출력)에 주로 사용됩니다.
- **변수:** 일반 변수에는 잘 사용하지 않습니다.

### 2.2 특징 및 제약

- 함수가 정상적으로 종료되지만, 돌려주는 값이 없는 상태입니다.
- `void` 타입 변수에는 오직 **`undefined`**만 할당할 수 있습니다.
  - _참고: `strictNullChecks` 옵션이 꺼져 있다면 `null`도 할당 가능합니다._

### 2.3 예시 코드

```tsx
// 반환값이 없는 함수
function func2(): void {
  console.log("asd");
}

// 변수 사용 예시 (잘 안 씀)
let a: void;
a = undefined; // 가능
// a = 1;      // 오류
// a = 'hello'; // 오류
```

## 3. Never 타입

- **"절대 반환되지 않음"** 을 의미하는 가장 엄격한 타입입니다.

### 3.1 사용 용도

함수가 **정상적으로 종료될 수 없는 상황**에 사용됩니다.

1. **무한 루프:** 함수가 끝나지 않고 계속 도는 경우
2. **에러 발생:** 실행 도중 에러를 던져서(`throw`) 프로그램이 중단되는 경우

### 3.2 특징 및 제약

- **절대적 부정:** 이 타입에는 `undefined`, `null`을 포함하여 **어떠한 값도 할당할 수 없습니다.**
- 프로그램의 흐름을 중단시키거나 영원히 지속되는 성질을 가집니다.

### 3.3 예시 코드

```tsx
// 1. 무한 루프
function func3(): never {
  while (true) {}
}

// 2. 에러 발생 (비정상 종료)
function func4(): never {
  throw new Error();
}
```

## 4. Void vs Never 차이점

| 구분          | Void                              | Never                                  |
| ------------- | --------------------------------- | -------------------------------------- |
| **의미**      | 반환 값이 **비어 있음** (Empty)   | 반환 자체가 **불가능함** (Impossible)  |
| **함수 종료** | 함수가 끝까지 실행되고 **종료됨** | 함수가 **종료되지 않거나** 강제 중단됨 |
| **변수 할당** | `undefined` 할당 가능             | 어떤 값도 할당 불가                    |
| **주요 예시** | `console.log` 함수                | `while(true)`, `throw Error`           |

💡 단순히 **"리턴값이 없다"면 void**, **"함수가 끝나지 않는다(또는 죽는다)"면 never**를 사용합니다.
