# 타입 조작이란

기본 타입이나 별칭 또는 인터페이스로 만든 원래 존자해던 타입들을 상황에 따라 유동적으로 다른 타입으로 변환하는 타입스크립트의 강력하고 독특한 기능

제네릭도 타입을 조작하는 기능에 포함됨.

- 인텍스드 엑세스 타입
  ![](https://www.notion.so/image/https%3A%2F%2Fs3-us-west-2.amazonaws.com%2Fsecure.notion-static.com%2F56f054af-f7ff-40be-bace-ea84381588f4%2FUntitled.png?table=block&id=10634e4d-58fc-4a94-8fbb-095eb41d6b18&cache=v2)
- keyof & typeof 연산자
  ![image.png](attachment:bf583092-a789-4f07-ad71-a6ae286260cd:image.png)
- 맵드 타입
  ![image.png](attachment:018f5886-01c7-4d56-aa1f-573a14c09e28:image.png)
- 템플릿 리터럴 타입
  ![image.png](attachment:f1815d29-b32a-4014-b5a4-5bea448d80ec:image.png)

# 인덱스드 엑세스 타입

인덱스를 이용해 다른 타입 내의 특정 프로퍼티의 타입을 추출하는 타입

## 객체 프로퍼티의 타입 추출

```c
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
  };
}

const post: Post = {
  title: "게시글 제목",
  content: "게시글 본문",
  author: {
    id: 1,
    name: "이정환",
  },
};
```

```c
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number; // 추가
  };
}

function printAuthorInfo(author: { id: number; name: string, age: number }) {
	// age 프로퍼티도 추가
  console.log(`${author.id} - ${author.name}`);
}

(...)
```

만약 이때 이 게시글에서 작성자의 이름과 아이디를 붙여서 출력하는 어떤 함수가 하나 있어야 한다면 다음과 같이 해야 합니다

```c
function printAuthorInfo(author: { id: number; name: string }) {
  console.log(`${author.id} - ${author.name}`);
}
```

그런데 매개변수의 타입을 이렇게 정의하면 나중에 Post 타입의 author 프로퍼티의 타입이 다음과 같이 수정되면 매개변수의 타입도 그때 마다 계속 수정해줘야 하는 불편함이 존재합니다.

```c
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number; // 추가
  };
}

function printAuthorInfo(author: { id: number; name: string, age: number }) {
	// age 프로퍼티도 추가
  console.log(`${author.id} - ${author.name}`);
}

(...)
```

이럴 때에는 다음과 같이 인덱스드 엑세스 타입을 이용해 Post에서 author 프로퍼티의 타입을 추출해 사용하면 편리합니다.

```c
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number; // 추가
  };
}

function printAuthorInfo(author: Post["author"]) {
  console.log(`${author.id} - ${author.name}`);
}

(...)
```

`Post["author"]`는 Post 타입으로부터 author 프로퍼티의 타입을 추출합니다. 그 결과 author 매개변수의 타입은 `{id : number, name: string, age:number}`가 됩니다.

이때 대괄호 속에 들어가는 String Literal 타입인 “author” 를 인덱스 라고 부릅니다. 그래서 인덱스를 이용해 특정 타입에 접근하다고 하여 인덱스드 엑세스 타입이라 부릅니다.

주의할 점은 인덱스에는 값이 아니라 타입만 들어갈 수 있습니다. 따라서 다음과 같이 “author”를 문자열 값으로 다른 변수에 저장하고 다음과 같이 인덱스로 사용하려고 하면 오류가 발생합니다.

```c
const authorKey = "author";

function printAuthorInfo(author: Post[authorKey]) { // ❌
  console.log(`${author.id} - ${author.name}`);
}
```

주의할 점

- 인덱스에 존재하지 않는 프로퍼티 이름을 쓰면 오류가 발생

인덱스를 중첩하여 사용할 수 도있음

```c
interface Post {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number;
  };
}

function printAuthorInfo(authorId: Post["author"]["id"]) {
  console.log(authorId);
}
```

## 배열 요소의 타입 추출

인덱스드 엑세스 타입은 객체 프로퍼티의 타입 뿐만 아니라 특정 배열의 요소 타입을 추출하는데에도 이용할 수 있습니다. 실습을 위해 앞서 만든 Post 타입을 다음과 같이 PostList 배열 타입으로 수정합니다.

```c
type PostList = {
  title: string;
  content: string;
  author: {
    id: number;
    name: string;
    age: number;
  };
}[];
```

그럼 인덱스드 엑세스 타입을 이용해 다음과 같이 이 PostList 배열 타입에서 하나의 요소의 타입만 뽑아올 수 있습니다.

```c
const post: PostList[number] = {
  title: "게시글 제목",
  content: "게시글 본문",
  author: {
    id: 1,
    name: "이정환",
    age: 27,
  },
};
```

PostList[number]는 PostList 배열 타입으로부터 요소의 타입을 추출하는 인덱스드 엑세스 타입입니다. 이렇듯 배열의 요소 타입을 추출할 때에는 인덱스에 number 타입을 넣어주면 됩니다.
또 인덱스에 다음과 같이 Number Literal 타입을 넣어도 됩니다. 숫자와 관계없이 모두 Number 타입을 넣은 것과 동일하게 동작합니다.

```c
const post: PostList[0] = {
  title: "게시글 제목",
  content: "게시글 본문",
  author: {
    id: 1,
    name: "이정환",
    age: 27,
  },
};
```

## 튜플의 요소 타입 추출

마지막으로 튜플의 각 요소들의 타입또한 다음과 같이 인덱스드 엑세스 타입으로 쉽게 추출할 수 있습니다.

```c
type Tup = [number, string, boolean];

type Tup0 = Tup[0];
// number

type Tup1 = Tup[1];
// string

type Tup2 = Tup[2];
// boolean

type Tup3 = Tup[number]
// number | string | boolean
```

한가지 주의할 점은 튜플 타입에 인덱스드 엑세스 타입을 사용할 때 인덱스에 number 타입을 넣으면 마치 튜플을 배열 처럼 인식해 배열 요소의 타입을 추출하게 됩니다.

# keyof & typeof 연산자

keyof 연산자는 객체 타입으로부터 프로퍼티의 모든 key들을 String Literal Union 타입으로 추출하는 연산자입니다.
다음은 keyof 연산자를 사용하는 예시입니다.\

```c
interface Person {
  name: string;
  age: number;
}

function getPropertyKey(person: Person, key: "name" | "age") {
  return person[key];
}

const person: Person = {
  name: "이정환",
  age: 27,
};
```

Person 객체 타입을 정의하고 해당 타입을 갖는 변수를 하나 선언합니다.
그리고 getPropertyKey 함수를 만듭니다. 이 함수는 두개의 매개변수가 있으며 두번째 매개변수 key에 해당하는 프로퍼티의 값을 첫번째 매개변수 person에서 꺼내 반환합니다.
이때 key의 타입을 “name” | “age”로 정의했는데 이렇게 정의하면 다음과 같이 Person 타입에 새로운 프로퍼티가 추가되거나 수정될 때 마다 이 타입도 계속 바꿔줘야 합니다.

```c
interface Person {
  name: string;
  age: number;
  location: string; // 추가
}

function getPropertyKey(person: Person, key: "name" | "age" | "location") {
  return person[key];
}

const person: Person = {
  name: "이정환",
  age: 27,
};
```

이렇게 매번 매개변수의 타입을 바꿔줘야 하면 함수가 많아지면 많아질수록 불편해집니다. 이럴 때 다음과 같이 Keyof 연산자를 이용하면 좋습니다.

```c
interface Person {
  name: string;
  age: number;
  location: string; // 추가
}

function getPropertyKey(person: Person, key: keyof Person) {
  return person[key];
}

const person: Person = {
  name: "이정환",
  age: 27,
};
```

keyof 연산자는 위와 같이 `keyof 타입` 형태로 사용하며 `타입`의 모든 프로퍼티 key를 String Literal Union 타입으로 추출합니다. 따라서 `keyof Person`의 결과값은 `“name” | “age” | “location”`이 됩니다.

한가지 주의할 점은 keyof 연산자는 오직 타입에만 적용할 수 있는 연산자 라는 점 입니다. 따라서 다음과 같이 값과 함께 사용하려고 하면 오류가 발생합니다.

```c
(...)

function getPropertyKey(person: Person, key: keyof person) { // ❌
  return person[key];
}

const person: Person = {
  name: "이정환",
  age: 27,
};
```

## Typeof 와 함께 사용하기

typeof 연산자는 자바스크립트에서 특정 값의 타입을 문자열로 반환하는 연산자 였습니다. 그러나 다음과 같이 타입을 정의할 때 사용하면 특정 변수의 타입을 추론하는 기능도 가지고 있습니다.

```c
type Person = typeof person;
// 결과
// {name: string, age: number, location:string}

(...)
```

이런 특징을 이용하면 keyof 연산자를 다음과 같이 사용할 수 있습니다.

```c
(...)

function getPropertyKey(person: Person, key: keyof typeof person) {
  return person[key];
}

const person: Person = {
  name: "이정환",
  age: 27,
};
```

# 맵드 타입

기존의 객체 타입을 기반으로 새로운 객체 타입을 만드는 타입 조작 기능

```c
nterface User {
  id: number;
  name: string;
  age: number;
}

function fetchUser(): User {
  return {
    id: 1,
    name: "이정환",
    age: 27,
  };
}

function updateUser(user: User) {
  // ... 유저 정보 수정 기능
}

updateUser({ // ❌
  age: 25
});
```

updateUser 함수는 수정된 유저 객체를 받아 유저 정보를 수정합니다.
따라서 유저 정보를 수정 하려면 다음과 같이 이 함수를 호출하고 여러개의 정보 중 수정하고 싶은 프로퍼티만 전달 해 주면 됩니다.

그런데 updateUser 함수의 매개변수 타입이 User 타입으로 되어 있어서 수정하고 싶은 프로퍼티만 골라서 보낼 수 없는 상황입니다.
따라서 어쩔 수 없이 다음과 같이 새로운 타입을 만들어 주어야 합니다.

```c
interface User {
  id: number;
  name: string;
  age: number;
}

type PartialUser = {
  id?: number;
  name?: string;
  age?: number;
}

(...)

function updateUser(user: PartialUser) {
  // ... 유저 정보 수정 기능
}

updateUser({ // ✅
  age: 25
});
```

그럼 이제 수정하길 원하는 프로퍼티만 전달할 수 있도록 기능을 수정했습니다.
그런데 User 타입과 PartialUser 타입이 지금 서로 중복된 프로퍼티를 정의하고 있습니다. 중복은 언제나 좋지 않습니다. 따라서 이럴 때 바로 맵드 타입을 이용하면 좋습니다.

```c
interface User {
  id: number;
  name: string;
  age: number;
}

type PartialUser = {
  [key in "id" | "name" | "age"]?: User[key];
};

(...)
```

PartialUser 타입을 맵드 타입을 이용해 아까와 동일한 타입으로 정의했습니다.

문법을 자세히 살펴보면 다음과 같습니다

`[key in “id” | “name” | “age”]` 는 이 객체 타입은 key가 한번은 id, 한번은 name, 한번은 age가 된다는 뜻 입니다. 따라서 다음과 같이 3개의 프로퍼티를 갖는 객체 타입으로 정의됩니다.

- key가 “id” 일 때 → `id : User[id]` → `id : number`
- key가 “name”일 때 → `name : User[user]` → `name : string`
- key가 “age”일 때 → `age : User[age]` → `age : number`

여기에 대 괄호 뒤에 선택적 프로퍼티를 의미하는 물음표(?) 키워드가 붙어있으므로 모든 프로퍼티가 선택적 프로퍼티가 되어 결론적으로 이 타입은 다음과 같은 타입이 됩니다.

```c
{
  id?: number;
  name?: string;
  age?: number;
}
```

이렇듯 맵드 타입을 이용하면 간단한 한줄의 코드 만으로 중복 없이 기존 타입을 변환할 수 있습니다.

# 템플릿 리터럴 타입

템플릿 리터럴 타입은 타입 조작 기능들 중 가장 단순한 기능으로 템플릿 리터럴을 이용해 특정 패턴을 갖는 String 타입을 만드는 기능입니다.

```c
type Color = "red" | "black" | "green";
type Animal = "dog" | "cat" | "chicken";

type ColoredAnimal = `red-dog` | 'red-cat' | 'red-chicken' | 'black-dog' ... ;
```

Color와 Animal은 각각 3개의 String Literal 타입으로 이루어진 Union 타입입니다. 그리고 ColoredAnimal은 Color와 Animal을 조합해 만들 수 있는 모든 가지수의 String Literal 타입으로 이루어진 Union 타입입니다.
Color나 Animal 타입에 String Literal 타입이 추가되어 경우의 수가 많아질 수록 ColoredAnimal 타입에 추가해야하는 타입이 점점 많아지게 됩니다. 이럴 때 바로 템플릿 리터럴 타입을 이용하면 좋습니다.

```c
type ColoredAnimal = `${Color}-${Animal}`;
```
