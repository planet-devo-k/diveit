유틸리티 타입이란 타입스크립트가 자체적으로 제공하는 특수한 타입들입니다. 우리가 지금까지 배웠던 제네릭, 맵드 타입, 조건부 타입 등의 타입 조작 기능을 이용해 실무에서 자주 사용되는 유용한 타입들을 모아 놓은 것을 의미합니다.
예를 들어 다음과 같이 Readonly<T>와 같은 유틸리티 타입을 이용해 특정 객체 타입의 모든 프로퍼티를 읽기 전용 프로퍼티로 변환할 수 있습니다.

```c
interface Person {
  name : string;
  age : number;
}

const person : Readonly<Person> ={
  name : "이정환",
  age : 27
}

person.name = ''
// ❌ name은 Readonly 프로퍼티입니다.
```

또는 다음과 같이 Partial<T> 유틸리티 타입을 이용해 특정 객체 타입의 모든 프로퍼티를 선택적 프로퍼티로 변환하는 것도 가능합니다.

```c
interface Person {
  name: string;
  age: number;
}

const person: Partial<Person> = {
  name: "이정환",
};
```

타입스크립트는 굉장히 다양한 유틸리티 타입을 제공합니다. 아래의 타입스크립트 공식문서 에서 다양한 유틸리티 타입들을 확인할 수 있습니다.

https://www.typescriptlang.org/docs/handbook/utility-types.html

# Partial, Required, Readonly

## Partial

가장 처음으로 살펴볼 유틸리티 타입은 Partial<T> 타입입니다. Partial은 부분적인 또는 일부분의 라는 뜻으로 특정 객체 타입의 모든 프로퍼티를 선택적 프로퍼티로 변환합니다. 따라서 기존 객체 타입에 정의된 프로퍼티들 중 일부분만 사용할 수 있도록 도와주는 타입입니다.

## Required<T>

다음으로 살펴볼 유틸리티 타입은 Required<T> 입니다. Required는 우리말로 필수의, 필수적인 이라는 뜻으로 특정 객체 타입의 모든 프로퍼티를 필수(선택적이지 않은) 프로퍼티로 변환합니다.

## Readonly

마지막으로 살펴볼 유틸리티 타입은 Readonly<T> 입니다. Readonly는 우리말로 읽기 전용 이라는 뜻으로 특정 객체 타입의 모든 프로퍼티를 읽기 전용 프로퍼티로 변환합니다.

# Record, Pick, Omit

## Pick<T,K>

Pick은 우리말로 뽑다, 고르다 라는 뜻입니다. 따라서 특정 객체 타입으로부터 특정 프로퍼티 만을 골라내는 그런 타입입니다. 예를 들어 Pick 타입에 T가 name, age가 있는 객체 타입이고 K가 name 이라면 결과는 name만 존재하는 객체 타입이 됩니다.

## Omit<T,K>

Omit은 우리말로 생략하다, 빼다 라는 뜻입니다. 따라서 특정 객체 타입으로부터 특정 프로퍼티 만을 제거하는 타입입니다. 예를 들어 Omit 타입에 T가 name, age가 있는 객체 타입이고 K가 name 이라면 결과는 name을 제외하고 age 프로퍼티만 존재하는 객체 타입이 됩니다.

## Record<K,V>

객체 타입을 빠르게 만들 때 사용하는 유틸리티 타입

# Exclude, Extract Return Type

## Exclude<T,K>

Exclude 타입은 다음과 같이 T로부터 U를 제거하는 타입입니다.

```c
type A = Exclude<string | boolean, string>;
// boolean
```

## Extract<T,K>

Extract 타입은 다음과 같이 T로 부터 U를 추출하는 타입입니다

```c
type B = Extract<string | boolean, boolean>;
// boolean
```

## ReturnType<T>

ReturnType은 타입변수 T에 할당된 함수 타입의 반환값 타입을 추출하는 타입입니다.
