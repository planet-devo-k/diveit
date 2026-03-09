# Takeaways

## 리액트의 모든 훅 파헤치기

훅은 클래스 컴포넌트에서만 가능했던 state, ref 등 리액트의 핵심적인 기능을 클래스 컴포넌트보다 간결하게 함수에서도 가능하게 만들었다.

### 훅의 규칙(rules-of-hooks)

* <mark style="background-color:yellow;">**최상위에서만 훅을 호출해야 한다.**</mark> 반복문이나 조건문, 중첩된 함수 내에서 훅을 실행할 수 없다. 이 규칙을 따라야만 **컴포넌트가 렌더링 될때마다 항상 동일한 순서로 훅이 호출되는 것을 보장할 수 있다.**
  * 훅에 대한 정보 저장은 리액트 어딘가에 있는 index와 같은 키를 기반으로 구현. (실제로는 객체 기반 링크드 리스트에 더 가깝다.) 즉, useState, useEffect 등 훅은 순서에 아주 큰 영향을 받는다.
  * 리액트 훅은 파이버 객체의 링크드 리스트의 호출 순서에 따라 저장된다. 각 훅이 파이버 객체 내에서 순서에 의존해 state나 effect의 결과에 대한 값을 저장하고 있기 때문이다.
  * 때문에 항상 훅은 실행 순서를 보장받을 수 있는 컴포넌트 최상단에 선언돼 있어야 한다.
  * 조건문이 필요하다면 반드시 훅 내부에서 수행해야 한다.
* **훅을 호출할 수 있는 것은 "리액트 함수 컴포넌트" 혹은 "사용자 정의 훅(커스텀 훅)" 두가지 경우 뿐이다.** 일반 자바스크립트 함수에서는 훅을 사용할 수 없다. 즉, <mark style="background-color:yellow;">**훅은 함수 컴포넌트 내부 또는 커스텀 훅 내부에서만 사용할 수 있다.**</mark>
* 훅의 규칙과 관련된 ESLint 규칙: react-hooks/rules-of-hooks
*   링크드 리스트(Linked List)

    * 자료구조 중 하나로 배열처럼 데이터를 “순서대로” 저장하지만, 각 데이터가 서로 ‘링크(연결)’로 이어져 있는 구조
    * 배열(Array) 은 메모리상에 연속된 공간에 데이터를 저장
    * 링크드 리스트는 메모리상에서 연속된 공간에 저장될 필요가 없다. 각 데이터(노드)는 메모리 어딘가에 흩어져 있어도 되고, 대신 “포인터(pointer)” 로 서로 연결되어 있기 때문에 순서를 유지할 수 있다.
    * 링크드 리스트는 각 노드(node) 가 자신의 다음 노드의 주소(참조) 를 저장하고 있어서 서로 사슬처럼 연결된 형태로 데이터를 관리

    ```
    [ data | next ] → [ data | next ] → [ data | next ] → null

    // next에는 “다음 노드의 위치(참조)”가 들어 있고, 마지막 노드는 더 이상 연결할 게 없어서 null로 끝

    ```

### useState

* 함수 컴포넌트 내부에서 상태를 정의하고 이 상태를 관리할 수 있게 해주는 훅
* 아무런 값을 넘겨주지 않으면 초깃값은 undefined
* useState훅의 반환값은 배열
* **클로저**(useState내부에 선언된 **setState가** useState가 호출된 이후에도, 즉 함수 실행이 종료된 이후에도 지연변수인 **state를 계속 참조 가능**)

#### 게으른 초기화(lazy initialization)

* <mark style="background-color:yellow;">**useState에 변수 대신 함수를 인수로 넘기는 것**</mark>
* 게으른 초기화 함수는 오로지 state가 처음 만들어질 때만 사용된다. 이후에 리렌더링이 발생해도 이 함수는 실행되지 않는다.
* **컴포넌트가 다시 렌더링될 때마다 초기값 계산이 재실행되는 것을 막기 위해 사용**
  * 리액트에서는 렌더링이 실행될 때마다 컴포넌트 다시 실행
  * 만약 useState인수로 자바스크립트에 많은 비용을 요구하는 작업이 들어가 있다면 이는 계속해서 실행될 위험이 존재
  * useState 내부에 함수를 넣으면 **최초 렌더링 이후에는 실행되지 않고 최초의 state값을 넣을때만 실행 됨**
* 초깃값이 복잡하거나 무거운 연산을 포함하고 있을 때 사용. localStorage, sessionStorage에 접근, map, filter, find같은 배열에 대한 접근, 초깃값 계산을 위해 함수 호출이 필요할 때 등.
*   예시

    * Number.parseInt(window.localStorage.getItem(cacheKey))와 같이 한번 실행되는데 어느 정도 비용이 드는 값을 useState의 인수로 사용하면 초깃값이 필요한 최초 렌더링과, 초깃값이 있어 더 이상 필요없는 리렌더링 시에도 동일하게 계속 해당 값에 접근해서 낭비가 발생
    * 이런 경우 함수 형태로 인수에 넘겨주는 것이 훨씬 경제적. <mark style="background-color:yellow;">**초깃값이 없다면 함수를 실행해 무거운 연산을 시도, 초깃값이 존재한다면 함수를 실행하지 않고 기존 값 사용**</mark>
    * **값이 클로저로 보존되어 있어도, 그 값을 만드는 계산은 렌더링될 때마다 다시 수행된다.**

    ```js
    // 1️⃣ 즉시 초기화 → expensiveFunction()은 컴포넌트 렌더링 시점마다 호출됩니다.
    const [value, setValue] = useState(expensiveFunction());

    // 2️⃣ 게으른 초기화 (lazy initialization) → React가 내부적으로 “한 번만 실행”하도록 보장합니다.
    const [value, setValue] = useState(() => expensiveFunction());
    ```

### useEffect

* useEffect는 애플리케이션 내 컴포넌트의 여러 값들을 활용해 **동기적으로** **부수 효과**를 만드는 메커니즘이다. 즉, useEffect는 <mark style="background-color:yellow;">컴포넌트가</mark> <mark style="background-color:yellow;"></mark><mark style="background-color:yellow;">**렌더링 된 후에**</mark> <mark style="background-color:yellow;"></mark><mark style="background-color:yellow;">어떠한 부수 효과를 일으키고 싶을 때 사용하는 훅</mark>이다.
  * state와 props의 변화 속에서 일어나는 렌더링 과정에서 실행되는 부수 효과 함수
  * effect는 컴포넌트의 사이드 이펙트, 즉 부수 효과를 의미
* 클래스 컴포넌트의 생명 주기 메서드와 비슷한 작동을 구현할 수 있다. 하지만 useEffect는 생명주기 메서드를 대체하기 위해 만들어진 훅이 아니다.
*   **최초 렌더링시에는 무조건 한번 실행**

    * **의존성 배열이 있든 없든** React는 컴포넌트가 처음 화면에 마운트 될 때 useEffect의 콜백 함수를 렌더링이 끝난 직후에 한 번 호출.

    ```
      // 최초 마운트 시
      1️⃣ 컴포넌트 렌더링
      2️⃣ DOM 반영 (화면에 그림)
      3️⃣ useEffect 콜백 실행 (cleanup 없음)

      // 의존성 변경 시
      1️⃣ 컴포넌트 리렌더링 (새 props/state로 실행)
      2️⃣ DOM 업데이트 반영
      3️⃣ ⚠️ 이전 useEffect의 cleanup 실행
      4️⃣ 새로운 useEffect 콜백 실행

      // 컴포넌트 언마운트 시
      1️⃣ 마지막으로 등록된 useEffect의 cleanup 실행
      2️⃣ 컴포넌트가 DOM에서 제거됨

    ```

#### 의존성 배열

* 두개의 인수(콜백: 실행할 부수 효과가 포함된 함수, 의존성 배열)
  * 렌더링 할때 마다 의존성 배열에 있는 값을 보면서 이 의존성의 값이 이전과 다른게 하나라도 있으면 첫번째 인수인 콜백이 실행. 즉 부수 효과를 실행.
  * 예를 들어 \[count]가 의존성 배열이면, 콜백은 최초 렌더링 시에는 무조건 한 번 실행되고, 이후에는 count 값이 변경될 때마다 다시 실행됨.
  * 의존성 배열에 **빈 배열**을 넣으면 리액트가 이 useEffect는 비교할 의존성이 없다고 판단해 **최초 렌더링(최초 마운트) 직후에 실행된 다음 부터는 더 이상 실행되지 않는다.**
  * **아무런 값도 넘겨주지 않는다면**, **렌더링 할 때마다 실행**된다. 보통 컴포넌트가 렌더링 됐는지 확인하기 위한 방법으로 사용.
    *   _의존성 배열이 없는 useEffect가 매 렌더링마다 실행된다면 그냥 useEffect 없이 써도 되는거 아닌가?_

        * SSR관점에서 **useEffect는 클라이언트 사이드에서 실행되는 것을 보장해준다.** **useEffect내부에서는 window객체의 접근에 의존하는 코드를 사용해도 된다.**
        * useEffect는 컴포넌트 렌더링이 완료된 이후에 실행된다(컴포넌트 렌더링의 부수 효과)\
          반면 **함수 내부에서의 직접 실행은** 컴포넌트가 렌더링되는 도중에 실행된다. 따라서 useEffect를 사용했을 때와 달리, SSR의 경우 서버에서도 실행된다. 그리고 이 작업은 함수 컴포넌트의 반환을 지연시키는 행위다. 즉, 화면(UI)을 그리기 전에 실행되어 **렌더링이 끝나기까지의 시간을 늘린다.** 따라서 무거운 작업일 경우 렌더링을 방해하므로 성능에 악영향.

        ```
        // 컴포넌트 본문은 "렌더링 중"에 실행되고, useEffect는 "렌더링이 끝난 뒤"에 실행

        1️⃣ 컴포넌트 함수 실행
            ├─ 여기서 state, props로부터 JSX를 계산
            ├─ 리턴값(JSX)을 React 내부 구조로 변환 (Fiber Tree)
        2️⃣ DOM 업데이트 (렌더링 완료)
        3️⃣ useEffect 실행 (렌더링 후)

        ```

#### 클린업 함수

* 클린업 함수를 반환할 수 있는데 이 클린업 함수는
  * 컴포넌트가 언마운트될 때 뿐만 아니라
  * **의존성 배열에 포함된 값이 변경되어 effect가 다시 실행되기 직전에도 실행된다.**
* useEffect는 콜백이 실행될때마다 이전의 클린업 함수가 존재한다면 그 클린업 함수를 실행한 뒤에 콜백을 실행한다.
* 단, 최초 마운트 시에는 이전 effect가 없기 때문에 클린업은 실행되지 않는다.
* **클린업 함수는 이벤트를 등록하고 지울 때 사용**. 특정 이벤트의 핸들러가 무한히 추가 되는 것을 방지.
* **클린업 함수는 이전 state를 참조해 실행된다.**
  * 비록 새로운 값을 기반으로 렌더링 뒤에 실행되지만 이 변경된 값을 읽는 것이 아니라, 함수가 정의됐을 당시에 선언됐던 이전 값을 보고 실행된다.
* 클린업 함수는 생명주기 메서드의 언마운트 개념과는 조금 차이가 있다.
  * 언마운트는 컴포넌트가 DOM에서 사라진다는 것을 의미하지만 클린업 함수는 언마운트라기 보다는 함수 컴포넌트가 리렌더링됐을 때 **이전 상태를 청소**해 주는 개념

#### useEffect의 구현

* 핵심은 의존성 배열의 이전 값과 현재 값의 얕은 비교
  * 리액트는 값을 비교할 때 Object.is를 기반으로 하는 얕은 비교를 수행.
  * 이전 의존성 배열과 현재 의존성 배열의 값에 하나라도 변경 사항이 있다면 callback으로 선언한 부수 효과를 실행.

#### useEffect를 사용할 때 주의할 점

* **eslint-disable-line react-hooks/exhaustive-deps 주석은 최대한 자제하라**
  * ESLint의 react-hooks/exhaustive-deps 룰: useEffect 인수 내부에서 사용하는 값 중 의존성 배열에 포함돼 있지 않은 값이 있을 때 경고를 발생시킴
  * useEffect는 반드시 의존성 배열로 전달한 값의 변경에 의해 실행돼야하는 훅이다.
    * 의존성 배열을 넘기지 않은 채 콜백 함수 내부에서 특정 값을 사용한다는 것은 컴포넌트의 state, props와 같은 어떤 값의 변경과 useEffect의 부수 효과가 별개로 작동하게 된다는 것이다. useEffect에서 사용한 콜백함수 실행과 내부에서 사용한 값의 실제 변경 사이에 연결 고리가 끊어져 있는 것.
    * useEffect에 빈 배열을 넘기기 전에는 정말로 useEffect의 부수 효과가 컴포넌트의 상태와 별개로 작동해야만 하는지, 혹은 여기서 호출하는게 최선인지 한번 더 검토해봐야 한다.
    * 만약 특정 값을 사용하지만 해당 값의 변경 시점을 피할 목적이라면 **메모이제이션을 적절히 활용**해 해당 값의 변화를 막거나 적당한 실행 위치를 다시 한번 고민해 보는 것이 좋다. (메모이제이션(useMemo, useCallback)을 하면 참조가 유지되므로 의존성 배열에서 값이 변했다고 판단되지 않아 useEffect가 불필요하게 실행되지 않는다.)
*   **useEffect의 첫번째 인수에 함수명을 부여하라**

    * useEffect의 코드가 복잡하고 많아질수록 무슨 일을 하는 useEffect 코드인지 파악하기 어렵다.
    * useEffect의 목적을 명확히하고 그 책임을 최소한으로 좁힌다.
    * 화살표 함수의 경우, 직접 이름을 붙일 수는 없지만 화살표 함수를 변수에 담고 그 변수명을 의미 있게 정하면 같은 효과를 얻을 수 있다.

    ```tsx
    const syncDataAndScroll = () => {
      fetchData();
      scrollToTop();
      console.log("Updated!");
    };

    useEffect(syncDataAndScroll, [id]);
    ```
* <mark style="background-color:yellow;">**거대한 useEffect를 만들지 마라**</mark>
  * useEffect가 너무 커지면 정확히 이 useEffect가 언제 발생하는지 알 수 없게 된다.
    * 의존성 배열에 불가피하게 여러 변수가 들어가야 하는 상황이라면 최대한 **useCallback과 useMemo등으로 사전에 정제한 내용들만 useEffect에 담아두는것이 좋다.** 이렇게 하면 언제 useEffect가 실행되는지 좀 더 명확하게 알 수 있다.
  * useEffect는 렌더링 시 의존성이 변경될 때마다 부수 효과를 실행한다. 이 부수 효과의 크기가 커질수록 애플리케이션 성능에 악영향.
    * useEffect가 컴포넌트의 렌더링 이후에 실행되므로 렌더링 작업에는 영향을 적게 미치지만 여전히 **자바스크립트 실행 성능**에는 영향을 미친다.
  * 부득이하게 큰 useEffect를 만들어야 한다면 적은 의존성 배열을 사용하는 **여러 개의 useEffect로 분리**
* **불필요한 외부 함수를 만들지 마라**
  * useEffect 내에서 사용할 부수 효과라면 내부에서 만들어서 정의해서 사용하는 편이 훨씬 도움된다. (useEffect 밖에서 함수를 선언하면 불필요한 코드가 많아지고 가독성이 떨어진다.)

#### useEffect의 race condition(경쟁 상태)

* **useEffect의 콜백 인수로 비동기 함수를(async 함수) 바로 넣을 수 없다.**
  * 비동기 함수 응답 속도에 따라 결과가 이상하게 나타날 수 있다.
  * 즉, state의 경쟁 상태를 야기할 수 있고 cleanup 함수의 실행순서도 보장할 수 없기 때문에 개발자의 편의를 위해 useEffect에서 비동기 함수를 인수로 받지 않는다.
*   React의 렌더링 함수는 “순수 함수(pure function)”로 유지되어야 하기 때문에, 렌더링 중에 fetch를 하면 안 된다.

    * **서버 컴포넌트**에서 async/await로 fetch를 하는 것은 순수 함수 규칙 위반이 아닙니다. 그 이유는 리액트가 "렌더링"이라는 정의를 서버 환경에 맞춰 확장했기 때문입니다.
      * 한 번의 실행: 서버 컴포넌트는 브라우저처럼 상태 변경에 따라 수십 번 리렌더링되지 않습니다. 서버에서 딱 한 번 실행되어 결과물을 만들고 끝납니다.
      * 준비된 순수성: 서버 컴포넌트는 비동기 작업을 모두 마친 뒤, 최종적인 결과값(데이터가 채워진 UI 구조)만 브라우저로 보냅니다. 브라우저 입장에서 보면, 이미 모든 계산이 끝난 '순수한 결과'를 받는 셈입니다.
      * 비순수성의 격리: 비순수한 작업(네트워크 요청)을 서버라는 안전한 울타리 안에서 끝내버림으로써, 클라이언트 리액트 엔진은 복잡한 비동기 상태를 관리할 필요가 없어집니다.
    *   **use 훅**

        *   use훅은 클라이언트 컴포넌트에서도 비동기 데이터를 다룰 수 있게 해주지만, 이 역시 렌더링 중에 fetch를 직접 실행하는 것과는 다릅니다.

            * Promise의 소비: use는 렌더링 중에 fetch를 시작하는 도구가 아닙니다. 이미 시작된 비동기 작업(Promise)의 결과를 읽어오는 도구입니다.
            * Suspense와의 협업: 만약 use(promise)를 실행했는데 데이터가 아직 도착하지 않았다면, 리액트는 해당 컴포넌트의 렌더링을 일시 중단(Suspend)합니다.
            * 재시도 메커니즘: 데이터가 도착하면 리액트는 컴포넌트를 다시 처음부터 실행합니다. 이때 use는 이미 도착한 데이터를 즉시 반환하므로, 함수는 다시 순수한 계산기로 돌아오게 됩니다.
            * 아래 코드는 질문하신 대로 렌더링 중에 직접 fetch를 하는 것이라 리액트의 원칙을 어기는 것이고, 성능상으로도 재앙입니다.&#x20;

            ```javascript
            function UserProfile() {
              // 🔴 렌더링할 때마다 새로운 fetch(Promise)를 계속 만듦 -> 무한 루프 위험
              const user = use(fetch('/api/user').then(res => res.json())); 
              return <div>{user.name}</div>;
            }
            ```
        *   "읽어만 온다"는 것을 실현하려면, Promise의 주소(Reference)를 고정시켜야 합니다. 주로 다음 두 가지 방법을 씁니다.

            *   서버 컴포넌트에서 생성 (가장 권장)

                서버에서 fetch를 시작하고, 그 약속(Promise) 자체를 클라이언트 컴포넌트에 던져줍니다.

            ```javascript
            // 서버 컴포넌트 (async 아님, 그냥 Promise만 생성해서 전달)
            function Page() {
              const userPromise = fetch('/api/user').then(res => res.json()); // 여기서 딱 한 번 생성
              return <UserProfile userPromise={userPromise} />;
            }

            // 클라이언트 컴포넌트
            function UserProfile({ userPromise }) {
              const user = use(userPromise); // 이미 생성된 약속의 '결과'만 읽음
              return <div>{user.name}</div>;
            }
            ```

            * 캐싱 라이브러리/메모이제이션 사용\
              리액트의 cache 함수나 React Query 같은 도구는 같은 요청이면 같은 Promise 객체를 돌려주는 역할을 합니다. 렌더링이 다시 일어나도 fetch가 새로 발생하는 게 아니라, 기존에 진행 중이던 그 약속을 다시 꺼내주는 것이죠.


    * useEffect의 첫 번째 인수(콜백) 자체를 async로 만들면 안되고, 대신 내부에서 async 함수를 정의하고 호출해야 한다.
    * 다만, 비동기 함수가 내부에 존재하면 useEffect 내부에서 비동기 함수가 생성되고 실행되는 것을 반복하므로 클린업 함수로 이전 비동기 함수에 대한 처리를 추가하는 것이 좋다. fetch의 경우 abortController 등으로 이전 요청을 취소하는 것이 좋다.

    ```tsx
    // ❌ 잘못된 예시
    useEffect(async () => {
      const res = await fetch("/api/data");
      const json = await res.json();
      setData(json);
    }, []);

    // 올바른 패턴: 내부에서 async 함수 정의 후 즉시 실행
    useEffect(() => {
      async function fetchData() {
        try {
          const res = await fetch("/api/data");
          const json = await res.json();
          setData(json);
        } catch (err) {
          console.error(err);
        }
      }

      fetchData(); // 내부에서 호출
    }, []);
    ```

    * **abortController**: JavaScript 내장 객체로, 진행 중인 비동기 작업(특히 fetch)을 중단(abort) 시킬 수 있게 해주는 취소 컨트롤러
      * fetch()는 비동기 요청이기 때문에, 이미 요청이 시작된 뒤에는 기본적으로 중단할 방법이 없지만 abortController를 사용하면 가능.

### useMemo

* 비용이 큰 연산에 대한 결과를 저장(메모이제이션)해 두고 이 저장된 값을 반환하는 훅
* 첫번째 인수: 어떤 값을 반환하는 생성 함수
* 두번째 인수: 해당 함수가 의존하는 값의 배열(의존성 배열)
* useMemo는 렌더링 발생 시 의존성 배열의 값이 변경되지 않았으면 함수를 재실행하지 않고 이전에 기억해둔 해당 값을 반환
* 의존성 배열의 값이 변경됐다면 첫번째 인수의 함수를 실행한 후에 그 값을 반환하고 그 값을 다시 기억
* 메모이제이션은 단순히 값 뿐 아니라 컴포넌트도 가능하다.
  * 컴포넌트의 props를 기준으로 컴포넌트 자체를 메모이제이션한다.
  * useMemo로 컴포넌트도 감쌀 수 있지만 이 경우 React.memo를 쓰는것이 좋다.

### useCallback

* **useMemo가 값을 기억했다면, useCallback은 인수로 넘겨받은 콜백 자체를 기억한다**.
* 즉, useCallback은 특정 함수를 새로 만들지 않고 다시 재사용. 함수의 메모이제이션을 위해 사용.
* 첫번째 인수: 함수
* 두번째 인수: 의존성 배열
* 의존성 배열이 변경되지 않는 한 함수를 재생성하지 않는다.
* 함수의 재생성을 막아 불필요한 리소스 또는 리렌더링 방지
* <mark style="background-color:yellow;">**useMemo와 useCallback의 유일한 차이는 메모이제이션을 하는 대상이 변수냐 함수냐 차이**</mark>.

### useRef

* useRef는 반환값인 객체 내부에 있는 current로 값에 접근 또는 변경할 수 있다.
* useRef는 <mark style="background-color:yellow;">**그 값이 변하더라도 렌더링을 발생시키지 않는다.**</mark>
  * _렌더링에 영향을 미치지 않는 고정된 값을 관리하기 위해 useRef를 사용한다면 useRef를 사용하지 않고 그냥 함수 외부에서 값을 선언해서 관리하는 것도 동일한 기능을 수행할 수도 있지 않을까?_
    * 컴포넌트가 실행되어 렌더링되지 않았음에도 값이 기본적으로 존재하게 된다. 이는 메모리에 불필요한 악영향
    * 만약 컴포넌트가 여러번 생성된다면 각 컴포넌트에서 가리키는 값이 모두 동일하다.
  * useRef는 컴포넌트가 렌더링될 때만 생성되며, <mark style="background-color:yellow;">**컴포넌트 인스턴스가 여러개라도 각각 별개의 값을 바라본다.**</mark>
* useRef의 가장 일반적인 사용 예는 DOM에 접근하고 싶을 때.
* useRef의 최초 기본값은 return문에 정의해둔 DOM이 아니고 useRef()로 넘겨받은 인수다. 때문에 아래 예시에서 useRef가 선언된 당시에는 아직 컴포넌트가 렌더링되기 전이라 return으로 컴포넌트의 DOM이 반환되기 전이므로 undefined다.

```jsx
function RefComponent() {
  const inputRef = useRef();

  // 이때는 렌더링이 실행되기 전(반환되기 전)이므로 undefined를 반환한다.
  console.log(inputRef.current); // undefined

  useEffect(() => {
    console.log(inputRef.current); // <input type="text"></input>
  }, [inputRef]);

  return <input ref={inputRef} type="text" />;
}
```

* 개발자가 원하는 시점의 값을 렌더링에 영향을 미치지 않고 보관해 두고 싶다면 useRef를 사용하는 것이 좋다.
  * 렌더링을 발생시키지 않고 원하는 상태값을 저장할 수 있다는 특징을 활용해 useState의 이전 값을 저장하는 usePrevious()같은 훅을 구현할 때 유용하다.
* 클로저 갱신 문제를 해결하기 위한 도구로도 자주 활용

### useContext

#### props drilling vs Context

* 해당 값을 사용하지 않는 컴포넌트에서도 단순히 값을 전달하기 위헤 props가 열려있어야 함
* context: 명시적인 props전달 없이도 선언한 하위 컴포넌트 모두에서 자유롭게 원하는 값을 사용할 수 있다.

#### Context를 함수 컴포넌트에서 사용할 수 있게 해주는 useContext 훅

* useContext는 상위 컴포넌트에서 만들어진 Context를 함수 컴포넌트에서 사용할 수 있도록 만들어진 훅
* 상위 컴포넌트 어딘가에서 선언된 \<Context.Provider />에서 제공한 값을 사용할 수 있게 된다. 만약 여러개의 Provider가 있다면 가장 가까운 Provider의 값을 가져오게 된다.
*   React Context를 안전하게 사용하는 패턴

    * useContext로 값을 불러올 때 **Provider가 없는 상태**(undefined) 를 미리 **감지**해서 예상치 못한 오류를 막는다.
      * useContext로 원하는 값을 얻으려고 했지만 정작 컴포넌트가 실행될 때 이 콘텍스트가 존재하지 않아 예상치 못하게 발생하는 에러를 방지하려면 useContext 내부에서 해당 콘텍스트가 존재하는 환경인지, 즉, 콘텍스트가 한번이라도 초기화 되어 값을 내려주고 있는지 확인해보면 된다.

    ```tsx
    import { createContext, useContext } from "react";

    // Context 생성
    const UserContext = createContext<{ name: string } | undefined>(undefined);

    // 안전하게 Context를 사용하는 커스텀 훅
    // 다수의 Provider와 useContext를 사용할 때, 특히 타입스크립트를 사용하고 있다면 useUserContext같이 별도 함수로 감싸서 사용하는 것이 좋다.
    // 즉, 각 Context마다 자신만의 useContext 래퍼 함수를 만들어라 → 타입 추론에도 유용하고 상위에 Provider가 없는 경우에도 사전에 쉽게 에러를 찾을 수 있다.
    export function useUserContext() {
      const context = useContext(UserContext);

      // Provider가 없으면 context는 undefined
      if (context === undefined) {
        throw new Error(
          "useUserContext는 반드시 UserProvider 내부에서 사용되어야 합니다."
        );
      }

      return context;
    }

    // Provider 정의
    export function UserProvider({ children }: { children: React.ReactNode }) {
      const user = { name: "sgoldenbird" };

      return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
    }
    ```

#### useContext를 사용할 때 주의할 점

* useContext를 함수 컴포넌트 내부에서 사용하면 컴포넌트 재활용이 어려워진다.
  * useContext가 선언돼 있으면 Provider에 의존성을 가지고 있는 셈이 되므로 아무데서나 재활용하기에는 어려운 컴포넌트가 된다.
* Context가 미치는 범위는 필요한 환경에서 최대한 좁게 만들어야 한다.
  * useContext를 사용하는 컴포넌트를 최대한 작게 하거나 재사용되지 않을 많나 컴포넌트에서 사용한다.
  * 모든 콘텍스트를 최상위 루트 컴포넌트에 넣는 것은 현명하지 않다. 해당 props를 다수의 컴포넌트에서 사용할 수 있게끔 해야하므로 불필요하게 리소스가 낭비된다.
* 콘텍스트와 useContext를 상태 관리를 위한 리액트의 API로 오해하지 말것! \
  **콘텍스트는 단순히 상태를 주입해주는 API다.**
* **상태 관리 라이브러리가 되기 위해서는 최소한 다음 두가지 조전을 만족해야한다.** 콘텍스트는 둘 중 어느 것도 하지 못한다.
  * <mark style="background-color:yellow;">**어떠한 상태를 기반으로 다른 상태를 만들어 낼 수 있어야 한다.**</mark>
  * <mark style="background-color:yellow;">**필요에 따라 이러한 상태 변화를 최적화할 수 있어야 한다.**</mark>
* useContext는 단순히 props값을 하위로 전달해 줄 뿐, useContext를 사용한다고 해서 렌더링이 최적화되지는 않는다.
  * 부모 컴포넌트가 렌더링되면, 해당 Context의 값을 구독(subscribe)하고 있는 모든 하위 컴포넌트가 전부 리렌더링되기 때문.
  * 하위 컴포넌트가 렌더링 되지 않게 막으려면 React.memo를 써야한다. memo는 props 변화가 없으면 리렌더링 되지 않고 계속헤서 같은 결과물을 반환.
* useContext로 상태 주입을 최적화 했다면 반드시 Provider의 값이 변경될 때 어떤 식으로 렌더링되는지 눈여겨봐야 한다.
* zustand의 경우 렌더링 최적화가 자동으로 이뤄진다.
  * Context처럼 전역 리렌더링을 일으키지 않고, "특정 상태를 사용 중인 컴포넌트만”, “그 상태가 바뀔 때만” 리렌더링
  * Zustand는 Context를 쓰지 않고, 내부적으로 구독(pub-sub) 기반의 store를 사용
  * Zustand는 Context처럼 전체 value 객체를 통째로 비교하지 않고, 부분 단위로 비교

#### Provider로 사용하는 \<Context>

* React 19에서는 \<Context.Provider> 대신에 \<Context> 자체가 Provider 역할을 한다.
* 앞으로의 버전에서 \<Context.Provider>를 더 이상 사용하지 않을 계획

```tsx

// 19 이전
const MyContext = createContext(defaultValue);

<MyContext.Provider value={...}>
  {children}
</MyContext.Provider>

// 19 이후
const MyContext = createContext(defaultValue);

<MyContext value={...}>
  {children}
</MyContext>

// 19 공식문서 예시
const ThemeContext = createContext("");

function App({ children }) {
  return <ThemeContext value="dark">{children}</ThemeContext>;
}
```

#### 새로운 API: use (Hook이 아니다.)

* use는 <mark style="background-color:yellow;">**Promise나 Context와 같은 데이터를 참조**</mark>하는 React API
* React **Hook과 같이** use는 **컴포넌트 또는 Hook에서만 호출**해야 한다.
* React **Hook과 달리** use는 **if와 같은 조건문과 반복문 내부에서 호출할 수 있다.**
* 매개변수: 참조하려는 데이터. 데이터는 Promise나 Context일 수 있다.
* 반환값: Promise나 Context에서 참조한 값을 반환한다.
*   use를 사용하여 Context 참조하기

    * Context가 use에 전달되면 useContext와 유사하게 작동
    * use는 전달한 Context의 Context Value를 반환한다. Context 값을 결정하기 위해 React는 컴포넌트 트리를 탐색하고 위에서 가장 가까운 Context Provider를 찾는다.
    * use는 유연하므로 useContext보다 선호된다. useContext는 컴포넌트의 최상위 수준에서 호출해야 하지만, use는 if와 같은 조건문이나 for와 같은 반복문 내부에서 호출할 수 있다.

    ```jsx
    function HorizontalRule({ show }) {
      if (show) {
        const theme = use(ThemeContext);
        return <hr className={theme} />;
      }
      return false;
    }
    ```

### useReducer

*   useState vs useReducer

    * 둘 다 클로저를 활용해 값을 가둬서 state를 관리한다.
    * useState의 심화 버전, 좀 더 복잡한 상태값을 미리 정의해 놓은 시나리오에 따라 관리할 수 있다.
    * useReducer는 상태 전이의 “규칙과 시나리오”를 명시적으로 분리해 복잡한 로직을 관리하고, 디버깅이나 유지보수를 쉽게 하기 위해 존재
    * useState = “현재 상태를 직접 지정”, useState는 값 중심 (무엇으로 바꿀까?)
    * useReducer = “상태 변화의 규칙을 미리 정의해두고, 그 규칙에 따라 상태를 바꿈”, useReducer는 의미 중심 (왜 / 어떤 액션으로 바꿀까?)

    <table><thead><tr><th width="120">구분</th><th width="252.79998779296875">useState</th><th>useReducer</th></tr></thead><tbody><tr><td>목적</td><td>단순한 상태 값 관리<br>단순한 상태 업데이트에 유리</td><td>복잡한 상태 전이(transition) 로직 관리<br>여러 상태가 엮인 복잡한 로직에 유리</td></tr><tr><td>상태 구조</td><td>보통 한두 개의 독립된 값</td><td>여러 속성이 얽힌 복합 객체</td></tr><tr><td>업데이트 방식</td><td><code>setState(newValue)</code> 직접 호출</td><td><code>dispatch(action)</code> → reducer 내부에서 상태 변경 정의</td></tr><tr><td></td><td>결과 중심: "값을 5로 바꿔라."</td><td>행위 중심: "아이템을 추가해라(Action)."</td></tr><tr><td>전달 값</td><td>새로운 상태값 (<code>nextState</code>)</td><td>액션 객체 (<code>{ type: 'ADD_ITEM', payload: ... }</code>)</td></tr><tr><td>로직 위치</td><td>컴포넌트 내부에 있음</td><td>컴포넌트 외부의 <code>reducer</code> 함수로 분리</td></tr><tr><td>적합한 상황</td><td>폼 입력, 토글, 카운트</td><td>복잡한 폼 상태, 여러 이벤트에 따른 로직 분기, 상태머신 형태</td></tr></tbody></table>

```tsx
// useState
const [count, setCount] = useState(0);
setCount(count + 1);

- 상태 변화 로직이 단순 (값 하나)
- 변경 이유(action)나 조건이 명확하지 않아도 됨

// useReducer
function reducer(state, action) {
  switch (action.type) {
    case 'increment':
      return { ...state, count: state.count + 1 };
    case 'reset':
      return { ...state, count: 0 };
    default:
      return state;
  }
}

const [state, dispatch] = useReducer(reducer, { count: 0 });
dispatch({ type: 'increment' });

- 상태 업데이트 방식(increment, reset)을 컴포넌트 외부에서 정의
- 상태 변경 시나리오가 많거나, 상태 구조가 복잡할 때 유리
- 컴포넌트는 단순히 “무엇을 할지(action)”만 전달 → “어떻게 바꿀지”는 reducer가 담당

```

* 반환값: \[state, dispatcher]
  * state: 현재 useReducer가 가지고 있는 값
  * dispatcher: state를 업데이트하는 함수. setState는 단순히 값을 넘겨주지만 여기서는 action을 넘겨준다.(state를 변경할 수 있는 action)
* 인수: (**reducer, initialState**, (init))
  * reducer: useReducer의 **기본&#x20;**<mark style="background-color:yellow;">**액션을 정의하는 함수**</mark>
  * initialState: useReducer의 **초깃값**
  * (init): useState의 인수로 함수를 넘겨줄 때처럼 초깃값을 지연해서 생성시키고 싶을 때 사용하는 함수. 게으른 초기화가 일어나며 initialState를 인수로 init함수가 실행된다. state에 대한 초기화가 필요할 때 reducer에서 이를 재사용할 수 있다.
* 목적:
  * 복잡한 형태의 state를 사전에 정의된 dispatcher로만 수정할 수 있게 만들어 줌으로써 state값에 대한 접근은 컴포넌트에서만 가능하게 하고 이를 업데이트하는 방법에 대한 상세 정의는 컴포넌트 밖에다 둔 다음, state의 업데이트를 미리 정의해 둔 dispatcher로만 제한하는 것.
  * state값을 변경하는 시나리오를 제한적으로 두고 이에 대한 변경을 빠르게 확인할 수 있게끔 하는 것.
* state하나가 가져야 할 값이 복잡하고 이를 수정하는 경우의 수가 많아질때 유용
* 여러개의 state를 관리하는 것보다 때로는 성격이 비슷한 여러 개의 state를 묶어서 useReducer로 관리하는 편이 더 효율적
* useReducer로 state를 관리하면 state를 사용하는 로직과 이를 관리하는 비즈니스 로직을 분리할 수 있어 state를 관리하기 한결 쉽다.
* payload: 전송되는 데이터 중 실제로 ‘의미 있는 내용물’(유효 데이터)

### useImperativeHandle

* **부모에게서 넘겨받은 ref를 원하는대로 수정할 수 있는 훅이다. useImperativeHandle을 사용하면 ref의 값에 원하는 값이나 동작을(액션) 추가로 정의할 수 있다.**
* 부모가 ref를 통해 자식의 특정 동작을 직접 호출할 수 있게 하는 기능
* 단순히 DOM 엘리먼트 참조를 넘겨주는 게 아니라, **자식이 ref에 ‘행동’을 정의해서 부모에게 노출**하는 방식
* 원래 ref는 {current: }와 같은 형태로 HTMLElement만 주입할 수 있는 객체지만 useImperativeHandle 훅을 사용해 전달받은 ref에 추가적인 동작을 정의할 수 있다.
* 이로써 부모는 단순히 HTMLElement 뿐만 아니라 자식 컴포넌트에서 새롭게 설정한 객체의 키와 값에 대해서도 접근할 수 있게 된다.
* useImperativeHandle은 반드시 forwardRef와 함께 써야 한다.
  * forwardRef는 부모가 전달한 ref를 자식 컴포넌트 내부로 “포워딩(전달)”해주는 훅. 이렇게 해야 부모가 보낸 ref를 자식이 받을 수 있다.
  * useImperativeHandle은 이 ref를 “커스터마이징”하기 위한 훅. forwardRef를 사용해 ref를 받을 수 있게 되면 useImperativeHandle을 사용해서 “ref.current에 들어갈 내용”을 직접 정의할 수 있다.

```tsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";

// 자식 컴포넌트
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // useImperativeHandle로 부모가 ref.current에서 접근할 수 있는 값(동작)을 정의
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
    },
    clear: () => {
      if (inputRef.current) inputRef.current.value = "";
    },
  }));

  return <input ref={inputRef} placeholder="Type something..." />;
});

// 부모 컴포넌트: DOM뿐 아니라 자식이 정의한 동작에 접근할 수 있다. inputRef.current.focus(); inputRef.current.clear();
export default function Parent() {
  const inputRef = useRef<{ focus: () => void; clear: () => void }>(null);

  return (
    <div>
      <CustomInput ref={inputRef} />

      <button onClick={() => inputRef.current?.focus()}>포커스</button>
      <button onClick={() => inputRef.current?.clear()}>지우기</button>
    </div>
  );
}
```

#### forwardRef

* React 19부터는 더 이상 forwardRef이 필요하지 않다. 이제 <mark style="background-color:yellow;">**ref를 Prop으로 직접 전달**</mark>하면 된다.
* forwardRef는 향후 릴리스에서 사용 중단Deprecated될 예정

```tsx
function MyInput({ placeholder, ref }) {
  return <input placeholder={placeholder} ref={ref} />;
}

//...
<MyInput ref={ref} />;
```

***

* ref는 useRef에서 반환한 객체로, 리액트 컴포넌트의 props인 ref에 넣어 HTMLElement에 접근하는 용도로 흔히 사용
* key와 마찬가지로 ref도 리액트에서 컴포넌트의 props로 사용할 수 있는 **예약어로서 별도로 선언돼 있지 않아도 사용할 수 있다.**
* ref를 상위 컴포넌트에서 하위 컴포넌트로 전달하고 싶다면 forwardRef 사용
  * 리액트에서 ref는 props로 쓸수 없다. 사용할경우 undefined를 반환한다. 때문에 예약어로 지정된 ref대신 다른 props로 받아야 한다.
  * ref를 전달하는데 있어 일관성을 제공하기 위해 forwardRef를 사용한다. 어떤 props명으로 전달할지 모르고 완전한 네이밍 자유가 주어진 props보다는 forwardRef를 사용하면 확실하게 ref를 전달할 것임을 예측할 수 있고 사용하는 쪽에서도 안정적으로 받아서 사용할 수 있다.
* 먼저 ref를 받고자 하는 컴포넌트를 forwardRef로 감싸고 두번째 인수로 ref를 전달받는다.
* forwardRef를 사용하면 ref를 props로 전달할수 있고 전달받은 컴포넌트에서도 ref라는 이름을 그대로 사용할 수 있다.

### useLayoutEffect

* useLayoutEffect의 시그니처는 useEffect와 동일하나(두 훅의 형태나 사용 예제가 동일)
* useLayoutEffect는 모든 DOM의 변경 후에, 즉 리액트 렌더링 후에 useLayoutEffect의 콜백 함수 실행이 **동기적**으로 발생한다.

1. <mark style="background-color:yellow;">**리액트가 DOM을 업데이트 - 리액트의 렌더링(render phase)**</mark>
2. <mark style="background-color:yellow;">**useLayoutEffect를 실행**</mark>
3. <mark style="background-color:yellow;">**브라우저에 변경 사항을 반영 - 브라우저의 렌더링(paint, 즉 화면 반영)**</mark>
4. <mark style="background-color:yellow;">**useEffect를 실행**</mark>

* useLayoutEffect가 항상 useEffect보다 먼저 실행.
  * useLayoutEffect는 브라우저에 변경 사항이 반영되기 전에 실행
  * useEffect는 브라우저에 변경 사항이 반영된 이후에 실행
* 동기적으로 발생한다는 것은 리액트는 useLayoutEffect의 실행이 종료될 때까지 기다린 다음에 화면을 그린다는 것.
  * 리액트 컴포넌트는 useLayoutEffect가 완료될 때까지 기다리기 때문에 컴포넌트가 잠시 동안 일시 중지되는 것과 같은 일 발생
  * 웹 애플리케이션 성능에 문제가 생길 수도 있다.
* **useLayoutEffect는 DOM은 계산됐지만 이것이 화면에 반영되기 전에 하고 싶은 작업이 있을때와 같이 반드시 필요할 때만 사용**
  * 특정 요소에 따라 DOM요소를 기반으로 한 애니메이션, 스크롤 위치를 제어하는 등 화면에 반영되기 전에 하고 싶은 작업

### useDebugValue

* 일반적으로 프로덕션 웹서비스에서 사용하는 훅은 아니고 개발하는 과정에서 사용.
* 사용자 정의 훅 내부의 내용에 대한 정보를 남길 수 있는 훅이다. 오직 다른 훅 내부에서만 실행할 수 있다. (컴포넌트 레벨에서 실행 불가)
* 두번째 인수로 포매팅 함수를 전달하면 이에 대한 값이 변경됐을 때만 호출되어 포매팅된 값을 노출한다. 즉, 첫번째 인수의 값이 같으면 포매팅 함수는 호출되지 않는다.
* 디버깅하고 싶은 정보를 이 훅에다 사용하면 리액트 개발자 도구에서 볼 수 있다.
* 포매팅 함수(formatting function): 데이터를 보기 좋은 형태로 변환(format) 해주는 함수
* console.log()나 console.error()도 디버깅에 쓸 수는 있지만 useDebugValue는 “React 개발자 도구(React DevTools)” 전용의 디버깅 훅. 즉, 콘솔용이 아니라 리액트 훅의 내부 상태를 시각적으로 표시하기 위한 도구
  * console.log() → 개발자 본인이 즉시 보기 위한 임시 로그
  * useDebugValue() → React DevTools에서 커스텀 훅 내부 상태를 시각적으로 디버깅하기 위한 용도

<table><thead><tr><th width="121.800048828125">구분</th><th width="301.79998779296875">console.log / console.error</th><th>useDebugValue</th></tr></thead><tbody><tr><td><strong>출력 위치</strong></td><td>브라우저 콘솔</td><td>React DevTools의 “Hooks” 탭</td></tr><tr><td><strong>목적</strong></td><td>개발자에게 로그 남기기</td><td>커스텀 훅의 상태를 시각적으로 디버깅</td></tr><tr><td><strong>사용 위치</strong></td><td>아무 데서나 가능</td><td>오직 커스텀 훅 내부</td></tr><tr><td><strong>실행 시점</strong></td><td>코드가 실행될 때마다</td><td>DevTools에서 해당 훅이 검사될 때</td></tr><tr><td><strong>영향</strong></td><td>프로덕션 빌드에서도 남을 수 있음</td><td>개발 모드 전용 (빌드 시 영향 없음)</td></tr></tbody></table>

## 사용자 정의 훅과 고차 컴포넌트 중 무엇을 써야 할까?

* 재사용 가능한 로직을 관리하기 위한 방법
* 중복된 로직을 공통화하고 별도로 분리해 컴포넌트의 크기를 줄이고 가독성을 향상

### 사용자 정의 훅(custom hook)

* <mark style="background-color:yellow;">**서로 다른 컴포넌트**</mark>**&#x20;내부에서 같은 로직을 공유**하고자 할 때 주로 사용
* 고차 컴포넌트는 리액트가 아니라도 사용할 수 있지만 커스텀 훅은 리액트에서만 사용할 수 있다.
* 이름은 use로 시작. 리액트 훅의 규칙을 따라야 하고 react-hooks/rules-of-hooks의 도움을 받기 위해.
* 반복되는 훅도 커스텀 훅 내부에 두고 중복되는 로직을 관리할 수도 있다.
* 커스텀 훅 저장소: use-Hooks, react-use, ahooks 등

### 고차 컴포넌트(HOC, Higher Order Component)

* **컴포넌트 자체 로직을 재사용** 하기 위한 방법
* 고차 함수(Higher Order Function)의 일종으로 자바스크립트의 일급 객체, 함수의 특징을 이용하므로 자바스크립트에서도 쓰일 수 있다.
* 단순히 값을 반환하거나 부수 효과를 실행하는 사용자 정의 훅과는 다르게, 고차 컴포넌트는 컴포넌트의 결과물에 영향을 미칠 수 있는 **다른 공통된 작업을 처리**할 수 있다.
* 리액트 고차 컴포넌트는 **with로 시작하는 이름**을 사용해야 한다.
  * use와 같이 ESLint 규칙등으로 강제되는 사항은 아니지만 리액트 라우터의 withRouter와 같이 리액트 커뮤니티에 널리 퍼진 일종의 관습
* 고차 컴포넌트를 사용할때 주의해야 할 점은 부수 효과를 최소화 해야 한다는 것.
  * 고차 컴포넌트는 반드시 컴포넌트를 인수로 받게 되는데, 반드시 컴포넌트의 props를 임의로 수정, 추가, 삭제하는 일은 없어야 한다.
  * 만약 컴포넌트에 무언가 추가적인 정보를 제공해 줄 목적이라면 별도 props로 내려주는 것이 좋다.
* 고차 컴포넌트는 최소한으로 사용하는 것이 좋다.

일급 객체(First-class Object): 함수를 **값(value)처럼** 다룰 수 있다는 뜻.\
아래 세 가지가 가능하면 “일급 객체”라고 부른다.

* 변수에 저장할 수 있고,
* 다른 함수의 인자로 전달할 수 있고,
* 함수가 또 다른 함수를 반환할 수도 있다.

#### React.memo

* 리액트에서 제공하는 API. 고차 컴포넌트.
* props의 변화가 없음에도 컴포넌트의 렌더링이 일어나는 것을 방지하기 위해 만들어진 고차 컴포넌트.
  * 부모 컴포넌트가 새롭게 렌더링 될때 마다 하위 컴포넌트의 props변경 여부와 관계없이 하위 컴포넌트가 렌더링된다.
* React.memo는 렌더링 하기에 앞서 props를 비교해 이전과 props가 같다면 렌더링 자체를 생략하고 이전에 기억해 둔 컴포넌트를 반환
  * 이 방식은 클래스 컴포넌트의 PureComponent와 매우 유사

#### useMemo vs React.memo

*   둘 다 불필요한 리렌더링을 줄이기 위한 도구이지만, “무엇을 메모이제이션(기억)하느냐”가 다르다.

    <table><thead><tr><th width="152">훅/함수</th><th width="172">메모이제이션 대상</th><th width="293.5999755859375">사용 위치</th></tr></thead><tbody><tr><td><strong>useMemo</strong></td><td>값 (연산 결과)</td><td>컴포넌트 내부</td></tr><tr><td><strong>React.memo</strong></td><td>컴포넌트 전체</td><td>컴포넌트 외부 (컴포넌트 정의 시)</td></tr></tbody></table>
* useMemo → 컴포넌트 안에서 비싼 계산 결과를 캐싱하고 싶을 때; 렌더링마다 비싼 계산이 반복되는 걸 막고 싶을 때
* React.memo → 컴포넌트 전체의 불필요한 리렌더링을 막고 싶을 때; 부모가 리렌더링돼도, props가 바뀌지 않은 자식은 리렌더링시키고 싶지 않을 때

```tsx
function ProductList({ products }) {
  // 무거운 연산을 캐싱
  const sortedProducts = useMemo(() => {
    console.log("정렬 중...");
    return [...products].sort((a, b) => a.price - b.price);
  }, [products]);

  return (
    <ul>
      {sortedProducts.map(p => (
        <li key={p.id}>{p.name}</li>
      ))}
    </ul>
  );
}

- products가 변경되지 않으면 정렬 연산을 다시 하지 않습니다.
- 즉, 렌더링마다 계산하지 않고 이전 결과를 재사용합니다.
- useMemo는 값(배열, 객체, 숫자, 문자열 등) 을 메모이제이션하는 훅입니다.


```

```tsx

const ProductItem = React.memo(function ProductItem({ name, price }) {
  console.log("렌더링:", name);
  return <li>{name} - {price}</li>;
});

function ProductList({ products }) {
  return (
    <ul>
      {products.map(p => (
        <ProductItem key={p.id} name={p.name} price={p.price} />
      ))}
    </ul>
  );
}

- 부모 컴포넌트가 리렌더링되더라도 props(name, price) 가 같으면 ProductItem은 다시 렌더링되지 않습니다.
- 즉, 컴포넌트 자체를 메모이제이션합니다.

```

| 구분               | useMemo                           | React.memo                  |
| ---------------- | --------------------------------- | --------------------------- |
| **메모이제이션 대상**    | 계산 결과(값)                          | 전체 컴포넌트 결과 (렌더링 결과)         |
| **사용 위치**        | 컴포넌트 내부                           | 컴포넌트 정의 시 (컴포넌트 외부)         |
| **용도**           | 비싼 연산 결과를 캐싱                      | props가 변하지 않으면 렌더링 건너뛰기     |
| **의존성 배열(deps)** | 있음 (`useMemo(() => ..., [deps])`) | 없음 (props 변화 감지 자동)         |
| **성능 효과**        | 연산 비용 절약                          | 렌더링 비용 절약                   |
| **예시**           | 리스트 정렬, 필터링, 계산                   | PureComponent 대체, 자식 렌더링 방지 |

| 자주 하는 오해                   | 실제 설명                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------- |
| “useMemo는 렌더링을 막는다”        | ❌ 아니요. `useMemo`는 값 계산만 캐싱, 렌더링은 그대로 일어남.                                             |
| “React.memo는 모든 리렌더링을 막는다” | ❌ props가 참조형 객체일 경우 shallow 비교로 다르다고 판단하면 리렌더링 됨.                                     |
| “둘 다 동시에 써야 한다”            | ⚠️ 목적이 다르므로 보통 각각 상황에 맞게 개별 사용. 단, `React.memo` 안에서 비싼 계산이 있으면 그 부분엔 `useMemo`를 써도 됨. |

#### 고차 함수를 활용해 만드는 고차 컴포넌트

* 고차 함수: 함수를 인수로 받거나 결과로 반환하는 함수

```js
function add(a) {
  return function (b) {
    return a + b;
  };
}

const result = add(1); // 반환한 함수
const result2 = result(2); // 3


- a=1이라는 정보가 담긴 클로저가 result에 포함됐고,
- result(2)를 호출하면서 이 클로저에 담긴 a=1인 정보를 활용
- useState의 원리와 비슷: useState의 실행은 함수 호출과 동시에 끝났지만 state의 값은 별도로 선언한 환경, 즉 클로저에 기억된다.
```

* 사용 예시
  * 인증된 사용자에게는 개인화된 컴포넌트를, 그렇지 않은 사용자에게는 공통 컴포넌트를 보여주는 시나리오.
  * 원래 구현하고자 하는 컴포넌트를 만들고, withLoginComponent같이 만든 고차 컴포넌트로 감싼다.
  * 로그인 여부, 로그인이 안되면 다른 컴포넌트를 렌더링하는 책임은 모두 고차 컴포넌트인 withLoginComponent에 맡길 수 있어 매우 편리하다.
  * 물론 인증처리는 서버나 NGINX같이 자바스크립트 이전 단계에서 처리하는 편이 훨씬 효율적.

NGINX

* 클라이언트의 웹 요청을 효율적으로 처리하고(요청을 받아 서버에 전달하고, 응답을 다시 돌려주는), 트래픽을 제어하는 초고성능 웹 서버이자 리버스 프록시(Reverse Proxy)서버

```
client (browser)
  ↓
NGINX
  ↓
index.html, main.js, style.css 전달

```

* `클라이언트 → NGINX → 여러 백엔드 서버` 로 트래픽을 “중간에서 관리”할 수 있다. 즉, NGINX가 입구(gatekeeper) 역할을 하면서 다양한 기능을 수행할 수 있다.

```
브라우저  →  NGINX  →  Node.js 서버
                  ↘  Python 서버
                  ↘  이미지 CDN

```

* NGINX 레벨에서 인증(Authentication) 을 걸면 → 클라이언트가 아예 백엔드(Node.js, Next.js 등)에 도달하기 전에 차단할 수 있다. → 즉, 불필요한 자바스크립트 실행이나 API 호출 낭비가 줄어든다.

#### 커스텀 훅이 필요한 경우

* 단순히 useEffect, useState와 같이 리액트에서 제공하는 훅으로만 공통 로직을 격리할 수 있을때
* 커스텀 훅 자체로는 렌더링에 영향을 미치지 못하기 때문에 사용이 제한적이므로 반환하는 값을 바탕으로 무엇을 할지는 개발자에게 달려있음. 따라서 컴포넌트 내부에 미치는 영향을 최소화해 개발자가 훅을 원하는 방향으로만 사용할 수 있다는 장점이 있다.
* 예를 들어 로그인 정보를 가지고 있는 useLogin이라는 훅이 있다면, 이 훅은 단순히 loggedIn에 대한 값만 제공할 뿐, 이에 대한 처리는 컴포넌트를 사용하는 쪽에서 원하는 대로 사용 가능하다. 따라서 부수 효과가 비교적 제한적이다.
* 반면 withLoginComponent같은 고차 컴포넌트는 고차 컴포넌트가 어떤 일을 하는지, 어떤 결과물을 반환할지에 대해 고차 컴포넌트를 직접 보거나 실행하기 전까지는 알 수 없다.
* 대부분의 고차 컴포넌트는 렌더링에 영향을 미치는 로직이 존재하므로 커스텀 훅에 비해 예측하기 어렵다.
* 따라서 **단순히 컴포넌트 전반에 걸쳐 동일한 로직으로 값을 제공하거나 특정한 훅의 작동을 취하게 하고 싶다면 사용자 정의 훅을 사용하는 것이 좋다.**

#### 고차 컴포넌트가 필요한 경우

* 함수 컴포넌트의 반환값, 즉 **렌더링의 결과물에도 영향을 미치는 공통 로직이라면 고차 컴포넌트를 사용.**

#### 구분 기준은 바로 “렌더링 결과물에 영향을 주는가?”

* 그렇다면 HOC, 아니라면 Custom Hook
* **커스텀 훅은 공통 로직을 재사용하고, HOC는 컴포넌트 자체의 렌더링 결과를 제어**
* 현재 React에서는 HOC보다 Hook을 통한 조합(composition) 방식을 더 권장
* 커스텀 훅이 필요한 경우
  * 공통 로직(상태나 효과)은 공유하지만, **렌더링은 각 컴포넌트가 스스로 결정할 때**
  * 예를 들어 로그인 여부를 체크하는 로직을 여러 컴포넌트에서 쓰고 싶다고 해봅시다.

```tsx
// useLogin.tsx
import { useState, useEffect } from "react";

export function useLogin() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoggedIn(!!token);
  }, []);

  return { loggedIn };
}


→ useLogin()은 단지 “로그인 여부”라는 값을 공유만 합니다.
→ “로그인 되어 있지 않다면 어떻게 처리할까?”는 사용하는 컴포넌트가 결정합니다.

// PageA.tsx
import { useLogin } from "./useLogin";

export default function PageA() {
  const { loggedIn } = useLogin();

  return (
    <div>
      {loggedIn ? <p>Welcome back!</p> : <p>Please log in to continue.</p>}
    </div>
  );
}

// PageB.tsx
import { useLogin } from "./useLogin";

export default function PageB() {
  const { loggedIn } = useLogin();

  return (
    <button disabled={!loggedIn}>회원 전용 기능 실행</button>
  );
}


- 커스텀 훅은 공통된 로직(상태, 효과) 을 공유
- 렌더링 결과(UI)는 사용하는 쪽이 자유롭게 결정
- 부수 효과가 제한적이라 예측 가능성이 높음

```

* 고차 컴포넌트(HOC)가 필요한 경우
  * **“렌더링 결과물 자체”를 제어하거나 바꿔야 할 때**&#x20;
  * 예를 들어 **“로그인된 사용자만 볼 수 있는 페이지”를 HOC로 감싼다.**
  * "렌더링 결과물을 제어하려면 HOC를 써야 한다"는 부분은, **현대 리액트에서는 "**<mark style="background-color:yellow;">**컴포넌트 내부에서 조건부 렌더링**</mark>**"을 하는 방식으로 대체되었습니다.**

```tsx

// withLoginComponent.tsx
export function withLoginComponent<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithLogin(props: P) {
    const token = localStorage.getItem("accessToken");
    const loggedIn = !!token;

    if (!loggedIn) {
      return <div>⚠️ 로그인 후 이용 가능합니다.</div>;
    }

    // 로그인되어 있다면 원래 컴포넌트를 렌더링
    return <WrappedComponent {...props} />;
  };
}

→ HOC는 “컴포넌트 자체를 감싸서 새로운 컴포넌트를 반환”합니다.
→ 즉, 렌더링 결과(UI)까지 제어합니다.


// Dashboard.tsx
function Dashboard() {
  return <h1>Welcome to your Dashboard</h1>;
}

// withLoginComponent로 감싸기
import { withLoginComponent } from "./withLoginComponent";
export default withLoginComponent(Dashboard);


- HOC는 “컴포넌트를 받아서 새 컴포넌트를 반환”
- 렌더링 결과물에 직접 개입 가능
- props 주입, 조건부 렌더링, 라우팅 제어 등에 유용

```
