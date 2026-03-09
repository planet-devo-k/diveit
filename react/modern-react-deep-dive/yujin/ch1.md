# Chapter 1

## 1장. 동등비교

✅ 기본값

- undefined: 선언됐지만 값이 없음
- null: 명시적으로 ‘비어있음’을 의미
- Symbol: 중복 불가한 고유 값 (Symbol(), Symbol.for())

✅ 템플릿 리터럴

- 백틱(```)
- 줄바꿈, ${표현식} 삽입 가능

✅ 객체 타입

- 배열, 함수, 정규식, 클래스 등
- 참조형 (값이 아닌 주소 복사)
- 변경 가능 (mutable)

✅ Object.is vs ===

- 비교 === Object.is
- -0, +0 true false
- NaN false true

-> React는 Object.is 기반의 shallowEqual로 얕은 비교(1 depth)

✅ 호환성 도구

- Polyfill: 지원 안 되는 기능을 흉내내는 코드
- Transpiler (Babel): 최신 JS → 구형 JS 변환

## 2장. 함수

✅ 함수의 특징

- 표현식: 값을 반환하는 구문
- 일급 객체: 변수 할당, 인수 전달, 반환 가능
- 런타임: 코드 실행 환경 (V8 + Web API + 이벤트 루프 등)

✅ 선언문 vs 표현식

- 선언문: 호이스팅 O
- 표현식: 변수 호이스팅만 (TDZ 적용)

✅ 화살표 함수

- this / arguments / 생성자 없음
- 상위 스코프의 this를 그대로 상속
- 디버깅 시 이름 표시 안 됨 (익명함수 취급)

✅ this 바인딩

- 호출 방식 this
- 전역 호출 전역 객체
- 메서드 호출 해당 객체
- new 새 인스턴스
- 화살표 함수 상위 스코프
- 명시적 bind, call, apply

✅ 즉시 실행 함수 (IIFE)

- 정의 후 바로 실행
- 한 번만 실행됨, 전역 스코프 오염 방지

✅ 고차 컴포넌트 (HOC)

- 컴포넌트를 인수로 받아 새 컴포넌트 반환
- 공통 로직 재사용 용도

⚙️ 함수의 순수성

- 순수 함수: 외부에 영향 없음, 동일 입력 → 동일 출력
- 부수 효과: 외부 상태 변경(fetch, DOM 조작, setTimeout 등)
- React는 함수형 설계를 추구 → 부수 효과는 useEffect에서만 처리

## 3장. 클래스

### 클래스

- 객체 생성용 템플릿
- 프로토타입 기반
- 정적 메서드는 인스턴스가 아닌 클래스에 속함

→ 전역 유틸 함수로 활용

## 4장. 클로저

### 클로저

- 함수가 선언된 환경(Lexical Scope)을 기억
- 외부 변수 은닉 및 제어
- React의 useState, useEffect 등 내부 원리 기반

단점: 메모리 점유 증가 (적절한 사용 필요)

### 이벤트 루프 & 비동기

✅ 싱글 스레드

- JS는 한 번에 하나의 작업만 수행

✅ 비동기 실행 원리

- JS 엔진이 setTimeout → 브라우저 Web API로 위임
- 완료 후 태스크 큐로 콜백 전달
- 이벤트 루프가 콜스택이 비면 실행

✅ 큐의 종류

- 마이크로태스크 큐: Promise, queueMicrotask()
  → 태스크 큐보다 우선 실행

- 태스크 큐: setTimeout, 이벤트 등

- 실행 순서 → 동기 → microtask → 렌더링 → macrotask

### requestAnimationFrame (rAF)

- 브라우저 프레임(16.7ms, 60fps) 단위로 콜백 실행
- 애니메이션 최적화 / 백그라운드 중단 / 성능 효율 ↑
- setTimeout보다 렌더링 타이밍이 정확

### 자주 쓰는 문법

✅ 구조 분해 할당

- 배열: const [a, b] = arr
- 객체: const {name, age} = user
- 기본값, 별칭, computed key 가능

✅ 전개 연산자 (...)

- 배열/객체 복사 및 병합
- 뒤쪽에 오는 값이 우선됨

✅ 객체 단축 표현

- 키와 변수명이 같으면 축약 가능: {a} = {a: a}

✅ 배열 메서드

- 메서드 설명 반환
- map 각 요소 변환 새 배열
- filter 조건 통과 요소만 새 배열
- reduce 누적 계산 단일 값
- forEach 단순 반복 undefined (중단 불가)
