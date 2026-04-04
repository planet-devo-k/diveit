# 함수 타입

함수란 기본적으로 매개변수를 받아 어떤 연산들을 함수 내부에서 걸쳐 결과값을 반환하는 것

타입스크립트에서는 어떤 타입의 매개변수를 받고 어떤 타입의 결과값을 반환하는 것.

```jsx
function func(a: number,b: number) {
	return a + b
}
```

반환값의 타입이 없다고 해도 리턴문을 기준으로 추론해줌.

## 화살표 함수의 타입 정의하기

```jsx
const add = (a: number,b: number) => return a + b
```

## 함수의 매개변수

```jsx
function introduce(name = 'Alice', tall: number) {
	console.log(`name: ${name}, tall: ${tall}`)
}
introduce('sujin', 159)
introduce('sujin') // 에러 발생. tall 변수를 선택적 매개변수로 만들어줘야 함.
```

- 주의할 점
  1. 기본값과 다른타입으로 정의하면 에러가 발생
  2. 함수 호출시 자동 추론된 타입과 다른 타입의 값을 넣으면 에러 발생

### 선택적 매개변수

- 주의할 점
  - undefined가 들어올 수 있기 때문에 타입 가드를 만들어 좁혀줘야함
  - 필수 매개변수들 앞에 오면 안됨.

### rest 파라미터

타입정의하는법

```jsx
function getSum(...rest: number[]) {
	let sum = 0;
	rest.forEach((it) => (sum += it))

	return sum
}

getSum(1,2,3) // 6
getSum(1,2,3,4,5) // 15
```

rest 파라미터의 갯수를 정하고 싶다면 튜플을 이용해 갯수를 제한할 수 있음.

# 함수 타입 표현식과 호출 시그니쳐

```jsx
// 함수 타입 표현식
type Operation = (a: number, b: number) => number

const add: Operation = (a, b): number => a + b
const sub: (a: number, b: number) => number = (a,b) => a-b;
```

## 호출 시그니쳐(콜 시그니처)

위에서와 같이 함수타입을 분리해서 적용할 수 있음. 함수의 타입을 정의하는 문법.

```jsx
type Operation2 = {
	(a: number, b: number): number;
}

const add: Operation2 = (a, b): number => a + b
```

## 하이브리드 타입

호출 시그니처를 이용할떄 객체에 프로퍼티를 추가할 수 있음. 함수도 객체이기 때문.

함수로도 사용할 수 있고 객체로도 사용할 수 있기 때문에 하이브리드 타입이라고 함.

# 함수 타입의 호환성

> 특정 함수타입을 다른 함수 타입으로 취급해도 괜찮은가를 판단하는 것.

1. 반환 값의 타입이 호환되는가

   ```jsx
   type A = () => number;
   type B = () => 10;

   let a: A = () => 10;
   let b: B = () => 10;

   a = b
   b = a // 에러 발생
   ```

   반환값 타입으로 보면 number 타입을 number 리터럴 타입으로 보겠다는 뜻(다운캐스팅) ⇒ 안됨!

   a에 b를 넣는건 업캐스팅이기 때문에 가능

2. 매개변수의 타입이 호환되는가
   1. 매개변수의 갯수가 같을 때

      ```jsx
      type C = (value: number) => void
      type D = (value: 10) => void

      let c: C = (value) => {};
      let d: D = (value) => {};

      c = d; // 오류 발생
      d = d;
      ```

      변수 c에 변수 d를 넣겠다 ⇒ d타입(number 리터럴)을 c타입(number)으로 보겠다!

      매개변수의 타입을 기준으로 호환성을 판단할 때는 업캐스팅일때 호환되지 않는다고 봄.

      ❓ 왜 업캐스팅일때 호환이 안된다고 보는걸까?

      ```jsx
      type Animal = {
      	name: string;
      }

      type Dog = {
      	name: string;
      	color: string;
      }

      let animalFunc = (animal: Animal) => {
      	console.log(animal.name)
      }

      let dogFunc = (dog: Dog) => {
      	console.log(dog.name)
      	console.log(dog.color)
      }

      animalFunc = dogFunc // 오류 발생

      let testFunc = (animal: Animal) => {
      	console.log(animal.name)
      	console.log(animal.color) // Animal 타입에는 color 프로퍼티가 존재하지 않아 오류
      }
      ```

   2. 매개변수의 갯수가 다를 때

      할당하려고 하는 쪽의 함수의 타입의 매개변수의 갯수가 더 적을 때만 호환이 됨.

      ```jsx
      type Func1 = (a: number, b: number) => void;
      type Func2 = (a: number) => void

      let func1: Func1 = (a,b) => {}
      let func2: Func2 = (a) => {}

      func1 = func2;
      func2 = func1; // 오류 발생
      ```

# 함수 오버로딩

> 함수를 매개변수의 개수나 타입에 따라 여러가지 버전으로 정의하는 방법

```c
// 매개 변수 없음
void func() {
	printf("매개변수 없음");
}

// 매개변수 1개
void func(int a){
	printf(a + 20)
}

// 매개변수 두개
void func(int i, int j){
	printf(i + j);
}
```

```c
// 함수의 구현부 없이 선언식만 작성한 것 => 오버로드 시그니쳐
function func(a: number):void;
function func(a:number, b:number, c: number): void;

// 실제 구현부 => 구현 시그니쳐
function func() {}

func() // 오류 발생
func(1)
func(1,2) // 오류 발생
func(1,2,3)
```

오버로드 시그니쳐를 만들어놓았기 때문에 실제 구현부에 정의된 매개변수의 개수나 타입에 따르지 않음.

구현 시그니처에서도 매개변수를 정의해주어야하긴 함(블록 안에서 써야하기 때문에)

# 사용자 정의 타입 가드

```c
type Dog = {
	name: string;
	isBark: boolean;
}

type Cat = {
	name: string;
	isScratch: boolean;
}

type Animal = Dog | Cat

function isDog(animal: Animal): animal is Dog {
	return (animal as Dog).isBark !== undefined

}
function warning(animal: Animal) {
	if(isDog(animal)) {
		// 강아지
	} else if('isScratch in animal) {
		// 고양이
	}
}
```

isDog 함수의 반환값의 타입이 animal is Dog라고 되어있으면 warning 함수 내부의 중괄호 안에서 animal 매개변수의 타입이 Dog로 보장된다고 생각하고 타입을 좁혀줌
