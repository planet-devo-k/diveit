# 제네릭이란

함수나 인터페이스, 타입 별칭, 클래스 등을 다양한 타입과 함꼐 동작하도록 만들어주는 기능

```c
function func(value: any) {
	return value;
}

let num = func(10);
// any 타입

let str = func("string")
// any 타입

```

위의 func 함수는 다양한 타입의 매개변수를 받고 해당 매개변수를 그대로 반환하는 함수.

따라서 변수 num에는 10이 저장되고 변수 str에는 "string” 이라는 값이 저장되지만 타입은 any타입.

func 함수의 반환값 타입이 return 문을 기준으로 추론되었기 때문

### any 타입으로 추론시 발생되는 문제

타입과 맞지 않는 메서드 호출로 인한 런타임오류 발생

## unknown타입으로 정의해보기

```c
function func(value: unknown) {
	return value;
}

let num = func(10);
// unknown 타입

let str = func("string")
// unknown 타입

num.toUpperCase() // x
npm.toFixed() // x
```

unknown으로 타입을 지정하면 toUpperCase 같은 메서드 호출은 방지할 수 있으나 toFixed같은 Number 타입의 메서드 호출도 함께 오류로 판단하게 됨

⇒ 이 값을 사용하려면 비효율적으로 타입 좁히기를 해야함

이렇게 Number 타입 값 전달 ⇒ 반환값도 Number, String 타입 값 전달 ⇒ 반환값도 String 타입

이 되게 하려면 제네릭을 사용하면 간단히 해결할 수 있음.

```c
function func<T>(value: T): T {
	return value;
}

let num = func(10)
// number 타입
```

여기서 T에 어떤 타입이 할당될 지는 함수가 호출될 때 결정.

```c
function func<T>(value: T) {
	return value;
}

let arr = func<[number, number, number]>([1,2,3])
```

위 코드의 흐름은 다음과 같음

1. T에 [Number, Number, Number] 튜플 타입이 할당됨
2. 매개변수 value와 반환값 타입이 모두 튜플 타입이 됨

이렇게 타입 변수에 할당하고 싶은 특정 타입이 존재한다면 함수 호출과 함께 꺽쇠를 열고 직접 명시해주면 됨. 그렇지 않은 대다수의 상황에서는 알아서 추론하기 때문에 굳이 타입 변수를 설정할 필요는 없음

# 타입 변수 응용하기

‘

## case 1 - 2개의 타입 변수가 필요한 상황

```c
function swap<T, U>(a: T. b: U) {
	return [b, a]
}

const [a, b] = swap("1", 2);
// T => String, U => Number
```

## case 2 - 다양한 배열 타입을 인수로 받는 제네릭

```c

function returnFirstValue<T>(data: T[]) {
	return data[0]
}

let num = returnFirstValue([0,1,2])
// number

let str = returnFirstValue([1, "hello", "mynameis"])
// number | string
```

함수 매개변수 data의 타입을 T[]로 설정했기 때문에 배열이 아닌 값은 인수로 전달할 수 없게 됩니다. 배열을 인수로 전달하면 T는 배열의 요소 타입으로 할당됩니다.

첫번째 호출에서는 인수로 Number[] 타입의 값을 전달했으므로 이때의 T는 Number 타입으로 추론됩니다. 이때의 함수 반환값 타입은 Number 타입이 됩니다.

두번째 호출에서는 인수로 (String | Number)[] 타입의 값을 전달했으므로 이때의 T는 String | Number 타입으로 추론됩니다. 이때의 함수 반환값 타입은 String | Number 타입이 됩니다.

## case 3 - 반환값의 타입을 배열의 첫번째 요소의 타입이 되도록 하기

```c
function returnFirstValue<T>(data: [T, ...unknown[]]) {
  return data[0];
}

let str = returnFirstValue([1, "hello", "mynameis"]);
// number
```

다음과 같이 튜플 타입과 나머지 파라미터를 이용하면 됩니다.

함수 매개변수의 타입을 정의할 때 튜플 타입을 이용해 첫번째 요소의 타입은 T 그리고 나머지 요소의 타입은 …unknown[] 으로 길이도 타입도 상관 없도록 정의합니다.
함수를 호출하고 [1, “hello”, “mynameis”] 같은 배열 타입의 값을 인수로 전달하면 T는 첫번째 요소의 타입인 Number 타입이 됩니다. 따라서 함수 반환값 타입또한 Number 타입이 됩니다.

## case 4 - 타입 변수를 제한하기

```c
function getLength<T extends { length: number }>(data: T) {
  return data.length;
}

getLength("123");            // ✅

getLength([1, 2, 3]);        // ✅

getLength({ length: 1 });    // ✅

getLength(undefined);        // ❌

getLength(null);             // ❌
```

타입 변수를 제한할 때에는 확장(extends)을 이용합니다.

위와 같이 T extends { length : number } 라고 정의하면 T는 이제 { length : number } 객체 타입의 서브 타입이 됩니다. 바꿔말하면 이제 T는 무조건 Number 타입의 프로퍼티 length 를 가지고 있는 타입이 되어야 한다는 것 입니다. 따라서 이렇게 extends를 이용해 타입 변수를 제한하면 아래와 같은 결과가 나타납니다.

- 1번 호출은 인수로 length 프로퍼티가 존재하는 String 타입의 값을 전달 했으므로 허용됩니다.
- 2번 호출은 인수로 length 프로퍼티가 존재하는 Number[] 타입의 값을 전달 했으므로 허용됩니다.
- 3번 호출은 인수로 length 프로퍼티가 존재하는 객체 타입의 값을 전달 했으므로 허용됩니다.
- 4번 호출은 인수로 undefined을 전달했으므로 오류가 발생합니다.
- 5번 호출은 인수로 null을 전달했으므로 오류가 발생합니다.

# map, forEach() 메서드 타입 정의하기

## 배열 메서드 map

원본 배열의 각 요소에 콜백 함수를 수행하고 반환된 값들을 모아 새로운 배열로 만들어 반환

```c
const arr = [1, 2, 3]
const newArr = arr.map((it) => it * 2}
// [2, 4, 6]
```

```c
function map(arr: unknown[], callback: (item: unknown) => unknown): unknown[] {}
```

위 코드는 map 메서드를 함수로 직접 구현하고 타입도 정의한 것.

### 이 함수에 타입 변수를 선언하여 제네릭 함수로 만들기

```c
const arr = [1, 2, 3];

function map<T>(arr: T[], callback: (item: T) => T): T[] {
  let result = [];
  for (let i = 0; i < arr.length; i++) {
    result.push(callback(arr[i]));
  }
  return result;
}

map(arr, (it) => it * 2);
// number[] 타입의 배열을 반환
// 결과 : [2, 4, 6]
```

위와 같이 함수를 호출하면 매개변수 arr에 number[] 타입의 배열을 제공하자 타입변수 T가 number로 추론되고 반환값의 타입도 숫자배열이 됨.

```c
const arr = [1, 2, 3];

function map<T>(arr: T[], callback: (item: T) => T): T[] {
  (...)
}

map(arr, (it) => it.toString()); // ❌
```

함수 호출을 다음과 같이 수정하면 오류가 발생. 첫번째 인수로 arr을 전달했을때 타입변수 T에는 number 타입이 할당되었기 때문에 콜백 함수의 반환값 타입도 number타입이 되어야 하기 때문.

```c
const arr = [1, 2, 3];

function map<T, U>(arr: T[], callback: (item: T) => U): U[] {
  (...)
}

map(arr, (it) => it.toString());
// string[] 타입의 배열을 반환
// 결과 : ["1", "2", "3"]
```

## forEach 구현하기

```c
function forEach<T>(arr: T[], callback: (item: T) => void) {
  for (let i = 0; i < arr.length; i++) {
    callback(arr[i]);
  }
}
```

# 제네릭 인터페이스, 제네릭 타입 별칭

## 제네릭 인터페이스

제네릭은 인터페이스에도 적용할 수 있음. 인터페이스에 타입 변수를 선언해 사용하면 됨

```c
interface KeyPair<K, V> {
  key: K;
  value: V;
}
```

```c
let keyPair: KeyPair<string, number> = {
  key: "key",
  value: 0,
};

let keyPair2: KeyPair<boolean, string[]> = {
  key: true,
  value: ["1"],
};
```

### 주의할점

제네릭 인터페이스는 제네릭 함수와는 달리 변수의 타입으로 정의할때 반드시 꺽쇠와 함께 타입 변수에 할당할 타입을 명시해주어야 함

이유는 제네릭 함수는 매개변수에 제공되는 값의 타입을 기준으로 타입 변수의 타입을 추론할 수 있지만 인터페이스는 마땅히 추론할 수 있는 값이 없기 때문

### 인덱스 시그니처와 함께 사용하기

인덱스 시그니쳐와 함께 사용하면 기존보다 훨씬 더 유연한 객체 타입을 정의할 수 있음

```c
interface Map<V> {
  [key: string]: V;
}

let stringMap: Map<string> = {
  key: "value",
};

let booleanMap: Map<boolean> = {
  key: true,
};
```

## 제네릭 타입 별칭

```c
type Map2<V> = {
  [key: string]: V;
};

let stringMap2: Map2<string> = {
  key: "string",
};
```

# 제네릭 클래스

```c
class NumberList {
  constructor(private list: number[]) {}

	push(data: number) {
    this.list.push(data);
  }

  pop() {
    return this.list.pop();
  }

  print() {
    console.log(this.list);
  }
}

const numberList = new NumberList([1, 2, 3]);
```

제네릭 없이는 다음과 같이 어쩔수 없이 새로운 클래스를 하나 더 만들어줘야 함.

```c
class NumberList {
  constructor(private list: number[]) {}
	(...)
}

class StringList {
  constructor(private list: string[]) {}

	push(data: string) {
    this.list.push(data);
  }

  pop() {
    return this.list.pop();
  }

  print() {
    console.log(this.list);
  }
}

const numberList = new NumberList([1, 2, 3]);
const numberList = new StringList(["1", "2", "3"]);
```

이럴때 다음과 같이 제네릭 클래스를 사용해 여러 타입의 리스트를 생성할 수 있는 범용적인 클래스를 정의하면 됨.

```c
class List<T> {
  constructor(private list: T[]) {}

  push(data: T) {
    this.list.push(data);
  }

  pop() {
    return this.list.pop();
  }

  print() {
    console.log(this.list);
  }
}

const numberList = new List([1, 2, 3]);
const stringList = new List(["1", "2"]);

```

타입변수의 타입을 직접 설정하고 싶다면 다음과 같이 하면 됨

```c
class List<T> {
  constructor(private list: T[]) {}

  (...)
}

const numberList = new List<number>([1, 2, 3]);
const stringList = new List<string>(["1", "2"]);
```

# 프로미스와 제네릭

## 프로미스 사용하기

Promise는 제네릭 클래스로 구현되어 있습니다. 따라서 새로운 Promise를 생성할 때 다음과 같이 타입 변수에 할당할 타입을 직접 설정해 주면 해당 타입이 바로 resolve 결과값의 타입이 됩니다.

```c
**const promise = new Promise<number>((resolve, reject) => {
  setTimeout(() => {
    // 결과값 : 20
    resolve(20);
  }, 3000);
});

promise.then((response) => {
  // response는 number 타입
  console.log(response);
});

promise.catch((error) => {
  if (typeof error === "string") {
    console.log(error);
  }
});**
```

아쉽게도 reject 함수에 인수로 전달하는 값 즉 실패의 결과값 타입은 정의할 수 없습니다. 그냥 unknown 타입으로 고정되어 있기 때문에 catch 메서드에서 사용하려면 타입 좁히기를 통해 안전하게 사용하는걸 권장합니다.
만약 어떤 함수가 Promise 객체를 반환한다면 함수의 반환값 타입을 위해 다음과 같이 할 수 있습니다.

```c
function fetchPost() {
  return new Promise<Post>((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        title: "게시글 제목",
        content: "게시글 본문",
      });
    }, 3000);
  });
}
```

또는 더 직관적으로 다음과 같이 반환값 타입을 직접 명시해도 됩니다.

```c
function fetchPost(): Promise<Post> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({
        id: 1,
        title: "게시글 제목",
        content: "게시글 본문",
      });
    }, 3000);
  });
}
```
