# 타입 좁히기

> 조건문 등을 이용해서 넓은 타입에서 좁은 타입으로 타입을 상황에 따라 좁히는 방법

```jsx
function func(value: number | string | Date) {
	if(typeof value === 'number') {
			console.log(value.toFixed());
		} else if(typeof value === 'string') {
			console.log(value.toUpperCase())
		} else if (typeof value === 'object') { // ==> 옳지 않은 방법.
			console.log(value.getTime())
		}
}
```

어떤 변수가 특정 조건문 내부에서 더 좁은 타입임을 보장할 수 있을 때는 타입스크립트는 자동으로 더 좁은 타입으로 추론해줌.

- 타입 가드 : typeof과 같이 조건문과 함께 활용해서 타입을 좁힐 수 있는 것.

## 여러가지 타입 가드 연산자

### instanceof

위에서와 같이 Date 연산자를 typeof로 조건을 거는건 좋지 않음. typeof연산자는 null값에 typeof를 해도 object 를 반환하기 때문.

```jsx
function func(value: number | string | Date | null) {
	if(typeof value === 'number') {
			console.log(value.toFixed());
		} else if(typeof value === 'string') {
			console.log(value.toUpperCase())
		} else if (instanceof Date) { ==> 옳지 않은 방법.
			console.log(value.getTime())
		}
}
```

```jsx
type Person = {
	name: string;
	age: number;
	}

function func(value: number | string | Date | null | Person) {
	if(typeof value === 'number') {
			console.log(value.toFixed());
		} else if(typeof value === 'string') {
			console.log(value.toUpperCase())
		} else if (instanceof Date) {
			console.log(value.getTime())
		} else if (instanceof Person) { // 오류 발생

		}
}
```

instanceof 라는 연산자는 우측에 있는 항에 타입이 들어와서는 안됨. 왼쪽에 오는 이 값이 오른쪽의 값의 인스턴스인지 확인하는 것. 이러한 상황에서는 in 연산자를 사용하면 됨 .

### in

```jsx
function func(value: number | string | Date | null | Person) {
	if(typeof value === 'number') {
			console.log(value.toFixed());
		} else if(typeof value === 'string') {
			console.log(value.toUpperCase())
		} else if (instanceof Date) {
			console.log(value.getTime())
		} else if (value && "age" in value) {
		}
}
```

# 서로소 유니온 타입

> 교집합이 없는 타입들로만 만든 유니온 타입 ⇒ 두 타입 간 공통적으로 포함된 값이 없다는 것.

## 언제 사용할까?

```jsx
type Admin = {
	name: string;
	kickCount: number;
}

type Member = {
	name: string;
	point: number;
}

type Guest = {
	name: string;
	visitCount: number;
}

type User = Admin | Member | Guest;

function login(user: User) {
		if('kickCount' in user) {

		} else if('point' in user){

		} else {
			//guest 타입
		}
}
```

문제는 다른 누군가가 이 코드를 보았을 때 조건문만으로 타입을 판단하기 어려움.

이럴때 서로소 유니온을 이용하면 좋음.

```jsx
type Admin = {
	tag: 'ADMIN';
	name: string;
	kickCount: number;
}

type Member = {
	tag: 'MEMBER';
	name: string;
	point: number;
}

type Guest = {
	tag: 'GUEST';
	name: string;
	visitCount: number;
}

type User = Admin | Member | Guest;

```

위와 같이 tag라는 스트링 리터럴 타입으로 정의해주면 세 타입은 서로소 관계가 됨.
