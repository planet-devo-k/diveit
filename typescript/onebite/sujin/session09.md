# 조건부 타입

조건부 타입은 extends와 삼항 연산자를 이용해 조건에 따라 각각 다른 타입을 정의하도록 돕는 문법

```c
type A = number extends string ? number : string;
```

조건부 타입은 위 코드 처럼 `number extends string ?` 과 같은 조건식이 있고 이 조건이 참이라면 `?` 우측의 타입인 `Number` 타입이 결과가 되고 아니라면 `:` 우측의 타입인 `String` 타입이 결과가 됩니다.

위 조건부 타입의 조건식 `number extends string`은 number 타입이 string 타입의 서브타입이 아니기 때문에 거짓이 되고 그 결과 타입 A는 string 타입이 됩니다.

연습겸 이번엔 조건식에 객체 타입을 사용해 보겠습니다.

```c
type ObjA = {
  a: number;
};

type ObjB = {
  a: number;
  b: number;
};

type B = ObjB extends ObjA ? number : string;
```

## 제네릭 조건부 타입

조건부 타입은 제네릭과 함께 사용할 때 그 위력이 극대화 됩니다.
다음은 타입변수에 Number 타입이 할당되면 String 타입을 반환하고 그렇지 않다면 Number 타입을 반환하는 조건부 타입입니다.

```c
type StringNumberSwitch<T> = T extends number ? string : number;

let varA: StringNumberSwitch<number>;
// string

let varB: StringNumberSwitch<string>;
// number
```

- varA는 T에 number 타입을 할당합니다. 그 결과 조건식이 참이 되어 string 타입이 됩니다.
- varB는 T에 string 타입을 할당합니다. 그 결과 조건식이 거짓이 되어 number 타입이 됩니다.

이번에는 실용적인 예제를 살펴보겠습니다. 다음은 매개변수로 String 타입의 값을 제공받아 공백을 제거한 다음 반환하는 함수입니다.

```c
function removeSpaces(text: string) {
  return text.replaceAll(" ", "");
}

let result = removeSpaces("hi im winterlood");
```

이때 이 removeSpaces 함수의 매개변수에 undefined이나 null 타입의 값들도 제공될 수 있다고 가정하겠습니다. 그럼 매개변수의 타입을 다음과 같이 수정해야 합니다.

```c
function removeSpaces(text: string | undefined | null) {
  return text.replaceAll(" ", ""); // ❌ text가 string이 아닐 수 있음
}

let result = removeSpaces("hi im winterlood");
```

이때 함수 내부에서 text의 타입은 String이 아닐 수 있기 때문에 오류가 발생합니다.
따라서 이런 경우 다음과 같이 타입을 좁혀 사용해야 합니다.

```c
function removeSpaces(text: string | undefined | null) {
  if (typeof text === "string") {
    return text.replaceAll(" ", "");
  } else {
    return undefined;
  }
}

let result = removeSpaces("hi im winterlood");
// string | undefined
```

문제가 모두 해결된 것 같습니다. 그런데 한가지 문제가 있습니다. 변수 result의 타입이 아까와는 달리 string | undefined 타입으로 추론됩니다.
이럴 때에는 조건부 타입을 이용해 인수로 전달된 값의 타입이 String이면 반환값 타입도 String이고 아니라면 반환값 타입을 undefined 으로 만들어 주면 됩니다.

```c
function removeSpaces<T>(text: T): T extends string ? string : undefined {
  if (typeof text === "string") {
    return text.replaceAll(" ", ""); // ❌
  } else {
    return undefined; // ❌
  }
}

let result = removeSpaces("hi im winterlood");
// string

let result2 = removeSpaces(undefined);
// undefined
```

타입변수 T를 추가하고 매개변수의 타입을 T로 정의한 다음 반환값의 타입을 `T extends string ? string : undefined` 으로 수정합니다.

이제 변수 result 처럼 인수로 String 타입의 값을 전달하면 조건부 타입에 따라 반환값의 타입이 String이 됩니다. 또 result2 처럼 인수로 undefined을 전달하면 반환값의 타입이 undefined이 됩니다.

그런데 이렇게 수정하니 2개의 return문 모두 오류가 발생하고 있습니다. 이것은 조건부 타입의 결과를 함수 내부에서 알 수 없기 때문입니다. 따라서 다음과 같이 타입 단언을 이용해 반환값의 타입을 any 타입으로 단언합니다.

```c
function removeSpaces<T>(text: T): T extends string ? string : undefined {
  if (typeof text === "string") {
    return text.replaceAll(" ", "") as any;
  } else {
    return undefined as any;
  }
}

let result = removeSpaces("hi im winterlood");
// string

let result2 = removeSpaces(undefined);
// undefined
```

모든 오류가 해결되었습니다. 그런데 any로 단언하는것은 별로 좋지 못하다고 배운 적 있습니다. 예를 들어 다음과 같이 첫번째 return 문에서 string이 아닌 타입의 값을 반환 해도 오류를 감지하지 못합니다.

```c
function removeSpaces<T>(text: T): T extends string ? string : undefined {
  if (typeof text === "string") {
    return 0 as any; // 문제 감지 못함
  } else {
    return undefined as any;
  }
}

let result = removeSpaces("hi im winterlood");
// string

let result2 = removeSpaces(undefined);
// undefined
```

따라서 이럴 때에는 타입 단언보다는 함수 오버로딩을 이용하는게 더 좋습니다. 오버로드 시그니쳐의 조건부 타입은 구현 시그니쳐 내부에서 추론이 가능합니다. 따라서 다음과 같이 오버로드 시그니쳐를 추가해 함수 오버로딩을 구현합니다.

```c
function removeSpaces<T>(text: T): T extends string ? string : undefined;
function removeSpaces(text: any) {
  if (typeof text === "string") {
    return text.replaceAll(" ", "");
  } else {
    return undefined;
  }
}

let result = removeSpaces("hi im winterlood");
// string

let result2 = removeSpaces(undefined);
// undefined
```

# 분산적인 조건부 타입

```c
type StringNumberSwitch<T> = T extends number ? string : number;

let a: StringNumberSwitch<number>;

let b: StringNumberSwitch<string>;
```

변수 a의 타입은 조건식이 참이되어 `string`으로 정의되고 변수 b의 타입은 조건식이 거짓이 되어 `number` 타입으로 정의됩니다.

그럼 이번에는 타입 변수에 Union 타입을 할당해 보겠습니다.

```c
type StringNumberSwitch<T> = T extends number ? string : number;

(...)

let c: StringNumberSwitch<number | string>;
// string | number
```

지금까지 배운 조건부 타입 문법에 따라 변수 c의 타입은 `number | string`은 `number`의 서브타입이 아니므로 조건식이 거짓이 되어 `number`가 될거라고 예상할 수 있습니다.

그러나 변수 c는 `string | number` 타입으로 정의됩니다. 왜 이렇게 되는 걸까요?

그 이유는 조건부 타입의 타입 변수에 Union 타입을 할당하면 **분산적인 조건부 타입**으로 조건부 타입이 업그레이드 되기 때문입니다.

분산적인 조건부 타입은 다음과 같이 동작합니다.

타입 변수에 할당한 Union 타입 내부의 모든 타입이 분리됩니다. 따라서 StringNuberSwitch<number | string> 타입은 다음과 같이 분산됩니다.

- StringNumberSwitch<number>
- StringNumberSwitch<string>

그리고 다음으로 분산된 각 타입의 결과를 모아 다시 Union 타입으로 묶습니다.

- 결과 : number | string

# infer

infer는 조건부 타입 내에서 특정 타입을 추론하는 문법입니다.
infer는 다음과 같이 특정 함수 타입에서 반환값의 타입만 추출하는 특수한 조건부 타입인 ReturnType을 만들 때 이용할 수 있습니다.

```c
type ReturnType<T> = T extends () => infer R ? R : never;

type FuncA = () => string;

type FuncB = () => number;

type A = ReturnType<FuncA>;
// string

type B = ReturnType<FuncB>;
// number
```

조건식 `T extends () => infer R`에서 `infer R`은 이 조건식을 참이 되도록 만들 수 있는 최적의 R 타입을 추론하라는 의미입니다.

따라서 A 타입을 계산할 때의 위 코드의 흐름은 다음과 같습니다.

1. 타입 변수 T에 함수 타입 FuncA가 할당됩니다.
2. T는 () ⇒ string 이 됩니다.
3. 조건부 타입의 조건식은 다음 형태가 됩니다 `() ⇒ string extends () ⇒ infer R ? R : never`
4. 조건식을 참으로 만드는 R 타입을 추론 합니다 그 결과 R은 string이 됩니다.
5. 추론이 가능하면 이 조건식을 참으로 판단합니다 따라서 결과는 string이 됩니다.

만약 다음과 같이 추론이 불가능하다면 조건식을 거짓으로 판단합니다.

```c
type ReturnType<T> = T extends () => infer R ? R : never;

type FuncA = () => string;

type FuncB = () => number;

type A = ReturnType<FuncA>;
// string

type B = ReturnType<FuncB>;
// number

type C = ReturnType<number>;
// 조건식을 만족하는 R추론 불가능
// never
```
