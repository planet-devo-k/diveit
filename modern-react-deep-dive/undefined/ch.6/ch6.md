# Takeaways

## 리액트 개발 도구로 디버깅하기

### Components 탭

* 정적인 현재 리액트 애플리케이션의 컴포넌트 트리 확인 가능.
* 컴포넌트 구조, props와 내부 hooks 등 정보

#### 컴포넌트 명

* 함수 선언식과 함수 표현식으로 생성한 컴포넌트는 함수명으로 표시
  * 함수 선언식`(function MyComponent() {})`
  * 함수 표현식`(const MyComponent = () => {})` : 화살표 함수
* 함수 선언식 또는 함수 표현식으로 선언되지 않은 컴포넌트는 아래와 같은 문제
  * 익명함수 처럼 Anonymous 처리.
  * 익명함수를 default로 export하면 내보낸 함수의 명칭을 추론할 수 없고, \_default로 표시
  * 고차 컴포넌트의 경우, 내보내는 컴포넌트가 익명이면 감싼 컴포넌트, 내보내는 컴포넌트 둘 다 Anonymous 처리.
* memo라벨을 통해 memo로 감싸진 컴포넌트임을 알 수 있다.
* 컴포넌트 자체를 익명 함수로 만드는 게 좋은 경우는 거의 없음.
* 다만 컴포넌트 안에서 사용하는 **콜백에서는 익명함수가 자연스럽고 더 간편**하다.
* 기명함수로 바꾸기 어렵다면 함수에 **displayName 속성**을 추가. 함수명과 별도로 특별한 명칭을 부여해 명시적으로 확인이 필요할때도 displayName을 사용하면 좋다. 특히 **고차컴포넌트는 일반적으로 고차컴포넌트와 일반컴포넌트의 조합으로 구성되므로 displayName을 잘 설정하면 디버깅하는데 많은 도움이 된다.**
* 개발모드가 아닌 빌드한 트리를 확인하는 경우, 기명함수로 선언해도 terser등 압축 도구 등이 컴포넌트명을 단순하게 난수화하기 때문에 확인이 어렵다. displayName도 빌드 도구가 사용하지 않는 코드로 인식해 삭제할 가능성도 있다. 그러므로 **displayName과 함수명은 개발 모드에서만 제한적으로 참고.**

```jsx
//렌더 내부에서 콜백 즉석 생성할 때. 버튼 클릭 핸들러 등 한 번 쓰고 끝나는 콜백
<button onClick={() => doSomething(id)}>삭제</button>;

// map/forEach 안에서 inline 렌더링
{
  items.map((item) => <Item key={item.id} data={item} />);
}
```

#### 컴포넌트 탭 도구(우측 상단)

* 눈 아이콘: 해당 컴포넌트가 HTML 어디에서 렌더링 됐는지 요소 탭으로 즉시 이동&#x20;
* 벌레 아이콘: 해당 컴포넌트의 정보가 콘솔에 기록(해당 컴포넌트가 받는 props, 컴포넌트 내부에서 사용하는 hooks, 해당 컴포넌트의 HTML요소인 nodes가 기록)&#x20;
* 소스코드 아이콘: 해당 컴포넌트의 소스코드 확인 `<>`.&#x20;
* 압축된 자바스크립트 소스를 읽기 쉽게 보고싶다면 하단의 `{}` 클릭(적절한 여백과 줄바꿈)

**key**

* 컴포넌트명 좌측에 표시

**props**

* 해당 컴포넌트가 받은 props. 원시값 뿐 아니라 함수도 포함.
* 특정 props의 마우스 오른쪽 버튼 → 'Copy value to clipboard'와 'Store as global variable' 버튼
  * store as global variable 은 window.$r에 해당 정보가 담긴다. 콘솔로 이동해보면 $reactTemp0 이런식으로 확인할 수 있다.
* 값이 함수인 props의 마우스 오른쪽 버튼에는 Go to definition도 있는데, 이를 클릭하면 해당 함수가 선언된 코드로 이동. 값을 더블클릭해 원하는 내용으로 수정할 수도 있다.

**hooks**

* 컴포넌트에서 사용 중인 훅 정보를 확인할 수 있다. 이때 use는 생략된다. 예를 들어 useState는 State와 같이 use가 생략된 이름으로 나타난다.
* 사용자 정의 훅도 use는 생략된다.
* 훅도 마찬가지로 훅에 넘겨주는 함수를 기명함수로 넘겨주면 해당 훅을 실행할 때 실행되는 함수 이름을 확인가능.

**rendered by**

* 해당 컴포넌트를 렌더링한 주체
* 프로덕션모드에서는 react-dom의 버전만 확인 가능
* 개발모드에서는 해당 컴포넌트를 렌더링한 부모 컴포넌트까지 확인 가능 (예 `App`, `createRoot()`)

### Profiler 탭

* 리액트가 렌더링하는 과정에서 발생하는 상황을 확인하기 위한 도구
  * 어떤 컴포넌트가 렌더링, 몇 차례 렌더링, 어떤 작업에서 오래걸렸는지 등
* 렌더링 과정에 개입해 디버깅에 필요한 내용을 기록해야하므로 프로덕션 빌드로 실행되는 애플리케이션에서는 사용 불가 . 개발 모드에서만 가능

#### 설정

* highlight updates when components render: 리렌더링된 컴포넌트를 색과 애니메이션 박스로 표시. 색의 의미가 "렌더 비용"과 관련 있음
  * 🟦 파랑 (Blue) → 가벼운 렌더 → 거의 비용이 안 든 업데이트 → state나 props 변화가 미세한 경우
  * 🟩 초록 (Green) → 중간 정도 비용의 렌더
  * 🟨 노랑 (Yellow) → 상당히 비용이 큰 렌더
  * 🟥 빨강 (Red) → 매우 무거운 렌더! 성능 최적화 필요 (보통 리스트 폭주 렌더 / Context 과사용 / 비싼 계산)

#### 프로파일링 메뉴

**Start Profiling**

**Reload and Start profiling**

* 새로고침 후 프로파일링 시작
* 중단을 원하면 적색 버튼 클릭

**Stop Profiling**

* 프로파일링된 현재 내용을 모두 지우는 버튼

**Load Profile**

**Save Profile**

* 프로파일링 결과를 저장하면 사용자의 브라우저에 해당 프로파일링 정보가 담긴 JSON파일이 다운로드된다. 이 파일을 다시 로딩해 프로파일링 정보를 불러올 수 있다.

**Flamegraph**

* 렌더커밋별로 어떤 작업이 일어났는지 나타낸다.
  * 렌더 커밋: React가 변경 사항을 실제 DOM에 적용하는 하나의 배치(batch) 단위(렌더단계 + 커밋단계) ![프로파일링 예시](../../.gitbook/assets/profiling.png)
* 렌더링이 일어난 컴포넌트의 렌더링 정보, 해당 컴포넌트가 렌더링된 이유, 전체 렌더링에서 소요된 시간 확인
* 개발자가 의도한대로 메모이제이션이 작동하고 있는지, 특정 상태 변화에 따라 렌더링이 의도한대로 제한적으로 발생하고 있는지 확인하는데 많은 도움을 얻을 수 있다.
* ① Flamegraph의 색상 = 렌더 비용(React가 직접 계산한 내부 기준값)
* ② Flamegraph의 너비 = 절대 렌더링 시간(ms)
* 렌더링 **비용이 많이 든다** = **렌더링이 한번 일어날때 React가 내부에서 더 많은 계산(diff, reconciliation, hook 실행 등)을 해야 한다** → 큰 리스트, 무거운 컴포넌트, 비싼 계산 → useMemo / virtualization 고려
  * virtualization(가상화): 실제 보이는 아이템만 렌더하고, 안 보이는 아이템은 렌더하지 않는 기술
    * 1000개의 리스트가 있어도 1000개 전부 렌더하지 않고 화면에 보이는 10개만 실제 DOM에 올린다.
    * virtualization은 직접 구현 가능하지만, 실전에서는 라이브러리를 쓰는 게 안정적이고 빠르고 버그가 없다.
    * React 생태계에서 가장 유명한 virtualization 라이브러리 3개:
      * react-window (가장 가벼움, 추천)
      * react-virtual
      * react-virtualized (구버전이지만 기능 많음)
* 예시1: 노란색인데 너비는 좁은 경우
  * props 구조가 복잡해서 React diff 비용이 높음 → React가 “이 렌더 비싸다!”라고 판단 → 노란색
  * 하지만 DOM은 작아서 실제 렌더 ms는 매우 짧음 → 폭 좁음
* 예시2: 초록색인데 너비는 넓은 경우
  * 내부 diff 비용은 낮음 → React가 “이건 가벼운 렌더”라고 판단 → 초록색
  * 그러나 자식 DOM 노드가 많고 실제 DOM 적용이 많음 → 렌더 ms는 김 → 폭 넓음
* 책에는 아래와 같이 되어있음. \
  (너비가 넓을수록 해당컴포넌트를 렌더링하는 데 오래 걸렸다는 의미. 노란색에 가까울수록 렌더링에 오래 걸린 컴포넌트. 녹색에 가까울수록 빠르게 렌더링된 컴포넌트)
* 이번 업데이트에서 렌더링되지 않은 컴포넌트는 회색. Did not render라고 표시 (did not client render) ![did not client render](../../.gitbook/assets/did_not_client_render.png)

**세로 막대 그래프**

* 세로 막대 그래프를 클릭하면 각 렌더 커밋별로 리액트 트리에서 발생한 렌더링 정보를 확인할 수 있다.
* 렌더링 횟수도 확인할 수 있어, ![세로 막대 그래프 예시](../../.gitbook/assets/vertical_graph_eg.png)

**Ranked**

* 해당 커밋에서 렌더링하는 데 오랜 시간이 걸린 컴포넌트를 순서대로 나열한 그래프(위에서부터 오래걸린 컴포넌트)
* 렌더링되지 않은 컴포넌트는 여기서 볼 수 없다.

**Timeline**

* 리액트 18이상의 환경에서만 확인할 수 있다.
* 시간이 지남에 따라 컴포넌트에서 어떤 일이 일어났는지 확인
* 프로파일링 기간동안 무엇이 렌더링됐고, 어느 시점에 렌더링됐는지, 리액트의 유휴시간(Idle time)은 어느정도 였는지 등 자세히 확인 가능
  * 유휴 시간
    * React가 CPU 사용 없이 idle(유휴)에 있었던 시간(렌더링도 안 하고, 커밋 작업도 안 하고, Effect 실행도 안 하고)
    * 유휴시간이 많다: 업데이트가 드물었고 CPU 로드가 적음 = 앱은 안정적으로 동작하고 있고 필요할 때만 렌더링을 한다
    * 유휴시간이 짧다: 계속 렌더가 일어나고 있음 = “리렌더 폭격” 상태일 가능성 = 불필요한 렌더링이 너무 많이 발생하고 있다
* 고급 성능 지표( timestamp, duration, batch duration, lanes ) ![고급 성능 지표](../../.gitbook/assets/timeline.png)
  * Timestamp
    * 이 렌더 커밋이 언제 발생했는지(프로파일링 시작 기준 + 상대적 시간) 즉, 제 발생한 업데이트인가
    * 예) Timestamp: 135.6ms
      * 프로파일러 녹화 시작 후 135.6ms 지점에서 이 커밋이 발생했다는 뜻
  * Duration
    * 이 커밋에서 실제 렌더링에 사용된 총 시간
    * React가 VDOM 계산, diff 계산, 컴포넌트 렌더링, useMemo/useCallback 평가, 자식 렌더링 등 모든걸 처리하는데 걸린 총 시간
    * 성능의 핵심 지표 → 시간이 클수록 느림
  *   Batch duration

      * 여러 업데이트를 하나의 렌더로 묶어 처리하는 데 걸린 총 시간
      * React 18부터는 여러 state update가 automatic batching되므로 React가 작업 묶음(batch)을 만들고 한 번에 처리함
      * Batch duration = `렌더 + effect + 후속 처리` 포함 전체 비용 (Duration = 순수 렌더 시간)
      * 예시

      ```
      Duration: 8ms
      Batch duration: 23ms
      ```

      → render 자체는 8ms로 빠른데 → effect cleanup, 새 effect 실행, 기타 작업들이 더 있어서 전체 커밋(batch) 비용은 23ms.

      * Batch duration > Duration 이면 effect 들이 비싼 경우
  * Lanes(React 18 Concurrency 개념)
    * 어떤 “우선순위 Lane”에서 실행된 업데이트인지를 표시
    * React 18부터는 업데이트 priority를 숫자가 아니라 lane이라는 개념으로 관리
    * React는 lane을 보고 렌더 우선순위를 정하고 급한 것 먼저 실행
  * (Sometimes) Priority

#### Profiler가 보는 세계

* React는 한 번의 업데이트 안에서 3가지 타입의 작업을 측정함(1,2,3)

1. Render time
2. Layout Effects 시간(사용자 눈에 보이기 전에 실행됨. 동기적(synchronous) 기본 useLayoutEffect)
3. Passive Effects 시간(화면이 그려지고 난 후 실행됨. 비동기적(asynchronous) useEffect)
4. Commit time
5. Idle time

* Profiler가 왜 이 둘을 따로 보여줄까? 성능 문제가 생기는 지점이 두 종류라서
  * Layout Effects 시간 ↑ ⇒ 브라우저 paint 전에 실행되므로 렌더링이 차단됨 ⇒ UI 렉 / 깜빡임 / 느린 프레임이 발생할 수 있음 ⇒ 보통 useLayoutEffect 남용 또는 DOM 측정 강제 레이아웃 때문
  * Passive Effects 시간 ↑ ⇒ 브라우저 paint에는 영향 없지만 ⇒ 앱 로직이 무거워서 effect가 오래 걸린다는 뜻 ⇒ 서버 요청이나 계산이 effect 안에서 직접 수행될 때

#### 프로파일러로 렌더링 원인 파악해서 수정해보기

예시1: 최초의 렌더링 후에 사용자가 아무런 작동을 하지 않았음에도 두번째 렌더링이 발생한 경우

* 우측 상단 그래프에서 보고 싶은 커밋을 클릭한다. (우리가 알고싶은 렌더링은 두번째. 두번째 렌더링 커밋 클릭)
* `What caused this update? App` App을 눌러 해당 컴포넌트가 렌더링된 이유를 살펴본다.
* `Why did this render? Hook 1 changed`(첫번째 훅으로(컴포넌트 코드에서 가장 먼저 선언된 훅)인해 App 렌더링이 실행된다는 것)
* 렌더링이 발생한 컴포넌트의 'hooks'에서 state를 확인한다. App hooks의 1번 State확인
* `1. State: "1000"` 프로파일링 기간에 useState에 "1000"을 넣는 코드를 찾아본다.
* 타임라인을 살펴보면 약 3000ms 경에 App state변화 발생. p426

→ 사용자가 아무 작동을 않해도 3초경에 App state를 변경시키는 코드가 있다는 사실 유추

예시2: 사용자가 인터랙션하는 과정 프로파일링

* 프로파일링 시작 버튼 누르고 아무 input에 몇글자 입력 후 중단
* 프로파일링 결과를 보면 input에 입력할 때마다 렌더링이 일어남을 확인. input은 대부분 state랑 연결돼있고, 이는 곧 렌더링으로 이어지기 때문에 큰 문제는 아니지만, 문제는 App 전체가 렌더링되는 상황 `What caused this update? App`
* 이는 App내부에 해당 input과 관련된 state가 있기 때문에 입력할 때마다 App전체가 리렌더링되는 것. → 해당 input을 별도의 컴포넌트로 분리 → App은 렌더링 발생하지 않고, 별개의 컴포넌트로 분리한 InputText만 글자를 입력할때마다 리렌더링 `What caused this update? InputText`
* state변경을 최소 컴포넌트 단위로 분리 → 렌더링이 필요한 컴포넌트만 렌더링

예시3: props가 변경되지 않아도 부모 컴포넌트가 리렌더링되면 같이 리렌더링되는 경우

* memo로 감싸면 렌더링 되지 않는다.
