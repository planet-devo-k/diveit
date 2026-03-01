# 인터페이스

> 타입에 이름을 지어주는 또 다른 문법. 객체 타입을 정의하는데 특화됨(상속, 합침 등의 특수한 기능 제공)

```c
interface A {
	a: string;
	b: number;
	c: () => void;
	sayHi() : void; // 이렇게 호출 시그니처를 통해 메서드 정의 가능
}
```

선택적 프로퍼티, readonly로 읽기전용 프로퍼티 설정 가능. 프로퍼티에 저장된 값이 함수인것(메서드) 역시 인터페이스에서 정의 가능.

함수 오버로딩을 sayHi에 구현하고 싶을때는 꼭 호출 시그니처를 이용해야함.

```c
interface B {
	sayHi() : void;
	sayHi(a: number, b: number): void;
}
```

인터페이스는 인터섹션, 유니온을 사용하려면 타입 별칭을 별개로 사용해야함.

# 인터페이스 확장

```c
interface Animal {
	name: string;
	color: string;
}

interface Dog {
	name: string;
	color: string;
	isBark: boolean;
}

interface Cat {
	name: string;
	color: string;
	isScratch: boolean;
}

interface Chicken {
	name: string;
	color: string;
	isFly: boolean;
}
```

해당 코드는 중복되는 프로퍼티가 너무 많음. 이 방식은 비효율적이고 불편함. 이럴 때 인터페이스의 확장을 사용하면 좋음.

```c
interface Animal {
	name: string;
	color: string;
}

interface Dog extends Animal {
	isBark: boolean;
}

interface Cat extends Animal {
	isScratch: boolean;
}

interface Chicken extends Animal {
	isFly: boolean;
}
```

extend 사용시 동일한 프로퍼티의 타입을 재정의 할때는 원본 프로퍼티의 서브 타입이 되도록 해야함.

⇒ 원본 프로퍼티 타입의 서브 타입으로만 정의해야겠다!

### 다중 확장

여러가지 인터페이스를 확장하는 다중 확장도 가능함

```c
interface DogCat extends Dog, Cat {

}

const dogCat: DogCat = {
	name: "",
	color: "",
	isBark: true,
	isScratch: true,
}
```

# 인터페이스 선언 합치기

인터페이스는 동일한 이름으로 두번 선언해도 문제가 되지 않음 ⇒ 결국 다 합쳐지기 때문(선언합침)

```c
interface Person {
	name: string;
}

interface Person {
	age: number;
}

const person: Person = {
	name: "",
	age: 29,
};

```

인터페이스 선언 합침에서 충돌은 허용하지 않음 .

### 언제 사용할까?

모듈 보강할 때 사용됨.

```c
interface Lib {
	a: number;
	b: number;
}

interface Lib {
	c: string;
}

const lib: Lib = {
	a: 1,
	b: 2,
	c: "",
};
```
