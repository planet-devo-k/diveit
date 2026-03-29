# 자바스크립트의 클래스 소개

클래스는 객체를 만들어 내는 틀이라고 생각하기

```c
let studentA = {
	name: "sujin",
	grade: "A",
	age: 29,
	study() {
		console.log('study')
}

let studentB = {
	name: "jinsu",
	grade: "A",
	age: 24,
	study() {
		console.log('study')
}

```

```c
class Student {
	// 필드 : 클래스가 만들어낼 객체의 프로퍼티
	name;
	grade;
	age;

	// 생성자 : 클래스를 호출하면 실제로 객체를 생성하는 역할
	constructor(name, grade, age){
		this.name = name;
		this.grade = grade;
		this.age = age;
		}

	// 메서드
	study() {
		console.log('study')
		}
	}

	// 클래스를 이용해서 만든 객체 => 인스턴스
	let studentC = new Student('minsu', 'A", 21);

```

### 상속 이용해서 클래스 만들기

```c

	class StudentDeveloper {
		name;
		grade;
		age;
		favoriteSkill;

		constructor(favoriteSkill) {
			this.name = name
			this.grade = grade
			this.age = age
			this.favoriteSkill = favoriteSkill
		}

		study() {
			console.log('study')
		}


		// 위의 Student class와 겹치는 항목이 많음. 이럴 경우 상속을 이용하면 됨.
		class StudentDeveloper extends Student {
		favoriteSkill;

		constructor(name, grade, age, favoriteSkill) {
			super(name, grade, age); // super함수를 호출하면 부모 함수의 생성자가 호출됨
			this.favoriteSkill = favoriteSkill
		}
}

```

# 타입스크립트의 클래스

```c
class Employee {
	// 필드
	name;
	age;
	position;

}
// 필드만 정의시 any 타입으로 임시적으로 포함될 수 있기 때문에 타입 지정필요

```

```c
class Employee {
	// 필드
	name: string;
	age: number;
	position: string;

	// 생성자
	constructor(name: string, age: number, poisition: string) {
		this.name = name;
		this.age = age;
		this.position = position;
	}

	// 메서드
	work() {
		console.log("일함")
	}
}
```

> 타입스크립트에서의 클래스는 자바스크립트의 클래스로도 취급되지만 하나의 타입으로도 취급될 수 있음.

이게 가능한 이유는 타스는 구조적 타입 시스템을 따르고 있기 때문

```c
const empolyee: Employee = {
	name: "",
	age: 0,
	position: "",
	work() {},
}
```

타입스크립트에서는 super 호출을 포함해야함.

```c
// 상속을 이용해서 클래스 생성하기

class ExcutiveOfficer extends Employee {
	// 필드
	officeNumber: number;

	// 생성자
	constructor(
		name: string,
		age: number,
		position: string,
		officeNumber: number
	) {
		super(name, age, position);
		this.officeNumber = officeNumber;
	}
}
```

# 접근 제어자

파일을 만들때 특정 필드나 메서드에 접근할 수 있는 범위를 설정하는 문법. 객체 지향 프로그래밍 시 중요한 문법. 객체 지향에서는 은닉화가 일반적이기 때문.

- public : 명시하지 않았을 때 기본값. 자유롭게 인스턴스의 프로퍼티에 접근 가능. 아무런 제약이 없음
- private: 클래스 외부에서는 접근불가. 클래스 내부 메서드 안에서만 사용 가능. 파생 클래스 내부에서도 private로 정의된 필드를 사용할 수 없음.
- protected: 외부에서는 접근을 막고, 파생클래스 내부에서 접근할 수 있음.

생성자에 접근 제어자를 달면 자동으로 그 필드를 만들기 때문에 필드에 정의하는 건 안해도 됨.

필드의 값 초기화도 자동으로 하기 때문에 블록 안에서 할당하는 부분을 빼도 됨.

```c
class Person {
	constructor(
		private name: string,
		protected age: number,
		public hobby: string) {}

// 메서드
work() {
	console.log('work')
	}

}
```

# 인터페이스와 클래스

```c
interface CharacterInterface {
	name: string;
	moveSpeed: number,
	move(): void;
}

// 인터페이스로 정의한 타입의 객체를 클래스를 사용해 생성하도록 정의할 수 있음.
class Character implements CharacterInterface {

	constructor(
		public name: string,
		public moveSpeed: number
	) {}

	move(): void {
		console.log(`${this.moveSpeed}`)
		}

}
```

여기서 인터페이스로 정의 하는 필드들은 무조건 public. 보통 클래스를 만들때 인터페이스로 먼저 설계도를 구현하는 일은 별로 없음.
