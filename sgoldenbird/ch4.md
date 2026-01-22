# Takeaways

## 서버 사이드 렌더링이란?

#### SPA, CSR

| 개념                                      | 구분 기준                                                          |
| --------------------------------------- | -------------------------------------------------------------- |
| **SPA (Single Page Application)**       | 페이지를 한 번만 로드하고, 이후 화면 전환을 **JS 로직**으로 처리하는 **애플리케이션 구조(아키텍처)** |
| **CSR (Client-Side Rendering)**         | 렌더링이 **어디에서 발생하는가?** → 브라우저가 JS를 실행해 DOM을 생성하고 렌더링             |
| **서버로 데이터를 보내는 방법: AJAX**               | 페이지 이동 없이 비동기로 서버에 요청함                                         |
| **서버로 데이터를 보내는 방법: fetch/axios + JSON** | 현대 AJAX 방식 = fetch                                             |

#### MPA(Multi Page Application), SSR

| 개념                               | 기준                                               |
| -------------------------------- | ------------------------------------------------ |
| **MPA (Multi Page Application)** | 페이지 전환 시 **새 HTML을 서버에 요청**하느냐의 기준 (페이지 구조/아키텍처) |
| **SSR (Server-Side Rendering)**  | HTML을 **서버에서 렌더링**                               |
| **서버로 데이터를 보내는 방법: form POST**   | 페이지가 새로고침되며 제출됨                                  |

#### 자바스크립트의 모듈화

* 코드를 기능 단위로 쪼개고, 필요한 곳에서 불러와 쓰도록 구조화하는 것. \
  한 파일에 모든 JS를 몰아넣지 않고, 목적·기능별로 파일을 나누고 재사용 가능하게 만드는 것
* AMD(Asynchronous Module Definition)
  * 브라우저에서 모듈을 비동기로 로드하기 위한 자바스크립트 모듈 규칙(포맷). '옛날 모듈 시스템' (RequireJS 기반).
  * 브라우저가 JS 파일을 로딩하는 동안 UI가 멈추지 않게 백그라운드에서 모듈을 다운로드하고, 준비되면 실행하도록 만든 방식
  * 지금은 ESModules와 번들러로 대체됨. 번들러는 ES Module을 기반으로 최적화함
* CommonJS vs AMD vs ESM
  * CommonJS(CJS)는 레거시 생태계 때문에 레거시 호환성 역할로 여전히 남아있지만 프론트엔드에서는 사실상 사용 안 함. (Node.js는 기본 모듈 시스템이 오랫동안 CommonJS였기 때문)
  *   하지만 Node.js도 최근에는 ESM을 공식 표준으로 삼음

      <table><thead><tr><th width="138.5999755859375">특징</th><th>CommonJS</th><th>AMD</th><th>ES Module (ESM)</th></tr></thead><tbody><tr><td><strong>환경</strong></td><td>Node.js (서버)</td><td>브라우저</td><td>브라우저 &#x26; Node.js(최신)</td></tr><tr><td><strong>로딩 방식</strong></td><td>동기 로딩</td><td>비동기 로딩</td><td>정적 로딩 (빌드 타임 분석 가능)</td></tr><tr><td><strong>문법</strong></td><td><code>require()</code> / <code>module.exports</code></td><td><code>define()</code> / <code>require()</code></td><td><code>import</code> / <code>export</code></td></tr><tr><td><strong>목적</strong></td><td>서버에서 모듈 관리</td><td>브라우저에서 비동기 모듈 로드</td><td>표준 모듈 시스템 (브라우저/서버 통합)</td></tr><tr><td><strong>장점</strong></td><td>단순, Node 환경 최적화</td><td>브라우저에서 비동기 의존성 해결</td><td>표준 지원, 트리쉐이킹, 최적화 가능</td></tr><tr><td><strong>단점</strong></td><td>브라우저 비적합, 비동기 어려움</td><td>문법 복잡함, 콜백 다수</td><td>구형 브라우저 미지원(Polyfill/번들 필요)</td></tr><tr><td><strong>대표 라이브러리</strong></td><td>Node.js 기본</td><td>RequireJS</td><td>브라우저 기본 지원, 번들러와 호환</td></tr></tbody></table>

#### JAM 스택

* LAMP 스택: Linux(운영체제), Apache(서버), MySQL(데이터베이스), PHP/Python 등(웹 프레임워크)
  * 클라우드 개념이 부족했던 시대에 서버 확장 문제가 있었다.
* JAM 스택: JavaScript, API, Markup(미리 빌드된 정적 HTML)
  * 자바스크립트와 HTML, CSS를 미리 빌드해 두고 정적으로 사용자에게 제공한 후 모든 작동은 모두 클라이언트에서 실행되므로 서버 확장성 문제에서 좀 더 자유로워짐.
  * 아예 API 서버 자체도 자바스크립트로 구현하는 구조가 인기를 끌었었다.
    * MEAN(MongoDB, Express.js, AngularJS, Node.js)
    * MERN(MongoDB, Express.js, React, Node.js)
  * 요즘은 Next.js, TypeSCript, SQL 기반이 인기

### SPA(CSR)

* 렌더링과 라우팅에 필요한 대부분의 기능을 서버가 아닌 브라우저의 자바스크립트에 의존하는 방식
* 하나의 페이지에서만 렌더링을 수행
* 최초에 서버에서 최소한의 데이터를 불러온 이후에는 이미 가지고 있는 자바스크립트 리소스와 브라우저API를 기반으로 모든 작동이 이뤄진다.
  * 페이지 전환도 새로운 HTML로 페이지를 요청하는게 아니라 자바스크립트에서 다음 페이지 렌더링에 필요한 정보만 HTTP요청 등으로 가져온 다음 그 결과를 바탕으로 바디 내부에 DOM을 추가, 수정, 삭제하는 방법으로 페이지가 전환된다.
  * 페이지 전환을 위한 모든 작업이 자바스크립트와 브라우저의 history.pushState, history.replaceState로 이뤄진다.
    * history.pushState vs history.replaceState
      * 히스토리 스택을 추가하느냐, 교체하느냐 차이
      * **pushState: 기록 추가**
        * 브라우저 히스토리 스택에 새 기록 추가
        * **뒤로가기 가능**
        * React Router의 navigate('/page', { replace: false }) 와 동일한 동작
      * **replaceState: 기록 교체**
        * 브라우저 히스토리 스택의 현재 기록 교체(기록이 안쌓임)
        * **뒤로가기 불가**
        * React Router의 navigate('/page', { replace: true }) 와 동일한 동작
  * 소스보기로 HTML코드를 봤을때 내부에 아무런 내용이 없다. 사이트 렌더링에 필요한 바디 내부 내용을 모두 자바스크립트 코드로 삽입한 이후에 렌더링 하기 때문이다.
  * Gmail

#### CSR 장점

* 최초에 한번 모든 리소스를 다운로드 하고 이후 페이지를 전환 할때는 추가로 리소스 다운로드할 필요가 없어 시간이 절약된다.
* 전체 페이지를 새로 렌더링하지 않고 일부 영역만 다시 그리게 되므로 훨씬 매끄러운 UI를 보여줄 수 있다.

### MPA(SSR)

* 최초에 사용자에게 보여줄 페이지를 서버에서 렌더링해 빠르게 사용자에게 화면을 제공하는 방식
* CSR은 사용자 기기 성능에 영향을 받지만 SSR은 서버에서 제공하므로 비교적 안정적인 렌더링 가능

#### 다시 SSR의 필요성(SPA의 한계)

* 웹 애플리케이션에서 제공하는 자바스크립트 리소스의 크기와 수가 모두 증가
* 사용자의 기기와 인터넷 속도 등 웹 전반을 이루는 환경이 크게 개선됐음에도 실제 사용자들이 느끼는 웹 애플리케이션 로딩 속도는 오히려 느려짐.
  * 자바스크립트 파싱을 위해 CPU를 소비하는 시간이 크게 증가
  * 모바일에서 사용자가 상호작용 할 수 있을 때 까지 대기해야하는 시간(FID) 증가
  * 모든 콘텐츠 로딩에 소요되는 시간 증가

#### SSR 장점 (최초 페이지 렌더링을 서버에서 수행)

* <mark style="background-color:orange;">**최초 페이지 진입이 비교적 빠르다.**</mark>
  * 페이지에 유의미한 정보가 그려지는 시간(First Contentful Paint)가 빠름
  * CSR의 경우 최초에 사용자에게 보여줘야 할 화면에 표시할 정보가 외부 API 호출에 많이 의지.
    * 사용자가 웹 페이지에 진입하고, 리소스 다운, HTTP 요청 이후 응답 결과를 가지고 화면을 렌더링.
  * 서버에서 HTTP 요청을 수행하면 더 빠르다.
  * 서버에서 HTML을 문자열로 미리 그려서 내려주는 것이 클라이언트에서 기존 HTML에 삽입하는 것보다 빠르다.
  * 단, 서버가 사용자를 감당하지 못하고, 사용자에게 렌더링을 제공할 수 있을 정도의 충분한 리소스를 확보하지 못하면 오히려 SPA보다 느릴수 있다.
* <mark style="background-color:orange;">**검색 엔진과 SNS 공유 등 메타데이터 제공이 쉽다.**</mark>
  * 검색 엔진에 제공할 정보를 서버에서 가공해서 HTML응답으로 제공할 수 있으므로 검색 엔진 최적화에 유용
  * 검색 엔진이 사이트에서 필요한 정보를 가져가는 과정
    1. 검색 엔진 로봇이 페이지에 진입
    2. 페이지가 HTML 정보를 제공해 로봇이 이 HTML을 다운로드. 단, 다운로드만 하고 자바스크립트 코드는 실행하지 않는다. 로봇은 페이지를 보는 것이 아닌 페이지의 정적인 정보를 가져오는 것이 목적이므로 자바스크립트를 다운로드하거나 실행할 필요가 없다.
    3. 다운로드한 HTML 페이지 내부의 오픈그래프나 메타 태그 정보를 기반으로 페이지의 검색(공유)정보를 가져오고 이를 바탕으로 검색 엔진에 저장한다.
  * SPA는 메타 정보 또한 자바스크립트에 의존. 때문에 검색 엔진이 최초에 방문했을 때메타 정보를 제공할 수 있도록 조치를 취하지 않는다면 검색엔진이나 SNS공유 시에 불이익
* <mark style="background-color:orange;">**누적 레이아웃(CLS) 이동이 적다.**</mark>
  * CLS: 사용자에게 페이지를 보여준 이후에 뒤늦게 어떤 HTML 정보가 추가되거나 삭제되어 마치 화면이 덜컥 거리는 것과 같은 부정적인 사용자 경험
  * CLS는 렌더링 타이밍 문제가 아니라 레이아웃 공간 확보 문제
  * SPA에서는 페이지 콘텐츠가 API요청에 의존하고 API요청의 응답 속도가 제각각
  * 반면 SSR은 요청이 완전히 완료된 이후에 완성된 페이지를 제공하므로 CLS문제에서 비교적 자유로움. 하지만 완전히 자유롭진 못하다.
    * useEffect는 컴포넌트가 마운트된 이후에 실행되므로 CSR이나 SSR 모두에서 문제의 소지가 있다.
    * API 속도가 모두 달랐을 떄, SSR에서는 모든 요청이 완료되기 전까지 페이지가 렌더링되지 않을 것이므로 최초 페이지 다운로드가 많이 느려짐.
      * 그러나 리액트18 이후 등장한 스트림으로 인해 이 부분은 해결.
      * <mark style="background-color:yellow;">**스트리밍 SSR**</mark>
        * 데이터를 한 번에 보내지 않고 ‘조각(chunk)’으로 나눠서 순차적으로 전달하는 방식
        * 전체 데이터를 다 만들어야만 보내는 게 아니라, 만들어지는 즉시 바로바로 사용자에게 보낼 수 있는 구조
* <mark style="background-color:orange;">**사용자의 디바이스 성능에 비교적 자유롭다.**</mark>
  * 자바스크립트 리소스 실행은 브라우저에서 실행되지만, 그 브라우저의 실행 속도는 사용자 디바이스 성능에 의해 결정된다.
  * CSR 속도 = 브라우저 속도 = 결국 CPU 속도
  * **단, 인터넷 속도가 느리다면 SSR로도 느리다.**
    * 인터넷(네트워크) 속도 = 데이터를 다운받는 속도
    * 브라우저 속도 = 받은 데이터를 얼마나 빨리 렌더링해 보여주느냐
  * 사용자 방문이 폭증해 서버에 부담이 가중된다면, 그리고 이를 위한 적절한 처리가 수반돼 있지 않다면 SSR도 느릴 수 있다.
* <mark style="background-color:orange;">**보안에 좀 더 안전하다.**</mark>
  *   JAM스택의 문제는 애플리케이션의 모든 활동이 브라우저에 노출된다. API호출과 인증 등 사용자에게 노출되면 안되는 민감한 작업도 포함될 수 있다.

      * 인증·권한이 필요한 백엔드 API 호출을 사용자의 브라우저가 직접 한다는 점이 위험하다는 뜻

      ```
      정상적인 인증 처리 방식 (안전함)
        1. 브라우저가 로그인 API 호출 → 이메일/비밀번호 보내기
        2. 서버가 인증 수행
            → 비밀번호 검사
            → 계정 상태 체크
            → 권한 체크

        3. 서버가 토큰을 HttpOnly Cookie로 내려줌 → 브라우저 JS가 접근할 수 없어 XSS로 훔치기 불가능
        4. 이후 요청에서 쿠키를 자동으로 보내며 인증됨
            → 브라우저가 자동 처리
            → 인증 로직은 서버에서 처리됨


      위험한 로그인 방식 (보안 취약)
        ❌ 브라우저에서만 비밀번호 검증 → 누구나 억지로 통과 가능
            -> 회원가입에서 비밀번호 확인 UI는 보안 검증이 아니라 단순 문자열 비교 → 클라이언트에서 해도 전혀 문제 없음
            -> 실제 로그인 비밀번호 검증은 반드시 서버에서 해야한다.
        ❌ localStorage에 accessToken 저장 → 쉽게 털림
        ❌ client만으로 권한 체크 → admin: true 를 클라이언트에서 조작 가능
        ❌ 외부 API 비밀키를 브라우저에 둠 → 모두가 접근 가능

      ```

      * **환경변수로 숨겨도, 그 값이 클라이언트 번들에 포함되는 순간 → 모두에게 공개된 값이다.**
        * **프론트엔드 환경변수는 보안을 위해 쓰는 것이 아니다.** **빌드 시점에 “환경에 따라 다른 값”을 주입하기 위해 쓴다.** 즉, 빌드 환경을 개발, 배포 등 분리하기 위해.
        * VITE\*, NEXT\_PUBLIC\*처럼 “브라우저에 보내는 환경변수”는 절대 비밀 키로 사용할 수 없음
  * SSR은 인증 등 민감한 작업을 서버에서 수행하고 그 결과만 브라우저에 제공해 보안 위협을 피할 수 있다.

#### SSR 단점

* <mark style="background-color:blue;">**소스코드를 작성할 때 항상 서버 환경을 고려해야 한다.**</mark>
  * 가장 큰 문제는 브라우저 전역 객체인 window 또는 sessionStorage와 같이 **브라우저에만 있는 전역 객체** 등이다.
    * 소스코드나 사용중인 라이브러리에서 window를 사용하고 있고, 이 코드가 만약 서버에서 실행된다면 'window is not defined' 에러
    * 서버에서도 실행될 가능성이 있는 코드라면 window에 대한 접근을 최소화, window 사용이 불가피하다면 해당 코드가 서버 사이드에서 실행되지 않도록 처리
  * **잠재적인 위험을 가진 코드를 모두 클라이언트에서 실행하면, 클라이언트에서만 실행되는 코드가 많아지고 SSR의 장점을 잃음**
* **적절한 서버가 구축돼 있어야 한다.**
  * 사용자의 요청을 받아 렌더링을 수행할 서버가 필요
  * 사용자의 요청에 따라 적절하게 대응할수 있는 물리적인 가용량을 확보
  * 요청을 분산
  * 프로세스가 예기치 못하게 다운될 때를 대비해 **PM2** 같은 프로세스 매니저의 도움도 필요
    * PM2 = Node.js 서버가 죽지 않도록 지켜주는 관리자. 서버가 죽으면 자동으로 다시 실행(restart) 시켜주는 도구
    * Node.js 서버는 예기치 못한 에러·메모리 누수·예외로 크래시할 수 있기 때문에 PM2가 대신 감시·관리·자동 재시작을 해준다.
    * **쿠버네티스(Kubernetes)**: 컨테이너(예: Docker)를 자동으로 배포·관리·확장해주는 플랫폼
    * PM2가 Node.js 한 프로세스”를 관리한다면, 쿠버네티스는 수백\~수천 개의 서버와 컨테이너 전체를 관리하는 수준
* <mark style="background-color:$primary;">**서비스 지연에 따른 문제.**</mark>
  * SPA는 그래도 최초에 어떤 화면이라도 보여준 상태에서 느린 작업이 수행되기 때문에 로딩 중 과 같이 작업이 진행 중임을 적절히 안내한다면 사용자가 기다릴 여지가 있다.
  * 반면 SSR은 특히 최초 렌더링에 지연이 발생한다면 사용자에게 어떠한 정보도 제공할 수 없어 안좋은 UX가 될 수 있다.
* 페이지 전환이 발생할 때마다 새롭게 페이지 요청하고 HTML 페이지를 다운로드해 파싱하는 작업을 거친다.
* 페이지를 처음부터 새로 그려야 해서 일부 사용자는 페이지가 전환될 때 부자연스러운 모습을 보게 된다. 페이지 전환이 서버에서 이뤄지므로 브라우저 환경이 충분히 빠르지 못하다면 흰 화면이 잠시 노출될수 있다.

#### SPA CSR과 MPA SSR(서버에서 모든 페이지를 각각 빌드)에 대해 확실한 것

1. <mark style="background-color:yellow;">**가장 뛰어난 SPA는 가장 뛰어난 MPA보다 낫다.**</mark>

* 최초 페이지 진입 시 보여줘야 할 정보만 최적화해 요청해서 렌더링
* <mark style="background-color:orange;">**code splitting**</mark>(사용자에게 필요한 코드만 나눠서 번들링하는 기법)으로 불필요한 자바스크립트 리소스의 다운로드 및 실행 방지
* 이미지와 같은 **중요성이 떨어지는 리소스는&#x20;**<mark style="background-color:orange;">**레이지로딩**</mark>으로 렌더링에 방해되지 않도록 처리\
  **레이지 로딩(Lazy Loading)은 코드 스플리팅(Code Splitting)을 통해 얻은 결과물을 실제로 실행하는 전략**
* **라우팅이 발생하면 변경이 필요한 HTML 영역만&#x20;**<mark style="background-color:orange;">**교체**</mark>해 사용자의 피로감 최소화, 매끄러운 라우팅

2. <mark style="background-color:yellow;">**평균 SPA는 평균 MPA 보다 느리다.**</mark>

* 평균적인 노력으로 평균적인 사용자 경험을 제공한다고 가정하면, 별도의 최적화를 거쳐야하는 SPA보다 MPA가 더 나은 경험을 제공
* MPA는 매번 서버에 렌더링 요청을 하고 서버는 안정적인 리소스를 기반으로 매 요청마다 비슷한 성능의 렌더링 수행
* SPA는 사용자 기기에 따라 성능이 들쑥날쑥하고, 페이지 전환시에 필요한 리소스와 공통으로 사용하는 리소스로 분류하고 이에 따른 다운로드나 렌더링 우선순위 전략을 잘 수립해 서비스하기란 매우 어렵다.
* 최근에는 MPA에서 발생하는 라우팅으로 인한 문제를 해결하기 위한 다양한 API가 브라우저에 추가
  * Paint Holding: 같은 origin에서 라우팅이 일어날 경우 화면을 잠깐 하얗게 띄우는대신 이전 페이지의 모습을 잠깐 보여주는 기법
    * 브라우저가 기존 페이지를 잠시 그대로 붙잡아두고(paint hold) 새 문서의 first paint 준비가 끝날 때까지 유지. 그래서 화면이 흰색으로 깜빡이지 않음
    * 페인트 홀딩은 페이지 간 이동(Navigation)에서만 동작하기 때문에, 최초 진입(첫 화면)에서는 절대 적용되지 않는다.
  * back forward cache(bfcache): 브라우저 앞으로 가기, 뒤로가기 실행 시 캐시된 페이지를 보여주는 기법
  * Shared Element Transitions: 페이지 라우팅이 일어났을 때, 두 페이지에 동일 요소가 있다면 해당 콘텍스트를 유지해 부드럽게 전환되게 하는 기법

#### 현대의 SSR ➡ MPA가 아니라 SSR + SPA가 합쳐진 하이브리드 모델

옛날 SSR = MPA 였지만 현대의 SSR은 완전히 다른 의미다.

* Next.js, Remix, Nuxt 같은 현대 SSR 프레임워크는 <mark style="background-color:yellow;">**SPA 기반 기술 위에서 ‘렌더링만 서버에서’ 수행하는 구조**</mark>
* HTML은 서버에서 렌더링되지만
* 모든 페이지가 하나의 React 앱 구조 안에서 동작
* hydration, streaming 등 SPA 개념 포함
* Client-side navigation 지원
* MPA처럼 완전한 페이지 교체 없음

현대 SSR은 이렇게 동작함

1. **최초 요청 → 서버에서 React 컴포넌트를 HTML로 생성 (SSR)**
2. **HTML 전송 후 → JS가 hydrate (CSR)**
3. **이후 페이지 이동 → SPA처럼 JS 기반 네비게이션**

즉,

* **첫 렌더는 SSR**
* **이후 렌더는 CSR**
* **구조는 SPA**
* **라우팅은 클라이언트**
* **SEO/LCP는 SSR 덕분에 빠름**
* 초기 페이지 진입은 SSR로 서버에서 완성된 HTML을 제공받고, 이후 라우팅에서는 서버에서 받은 자바스크립트를 바탕으로 CSR 처럼 작동
  * SSR은 초기 페이지 진입이 빠른 반면, 라우팅이 느리다.

### 잘못된 웹페이지 설계는 성능을 헤친다.

* 눈에 띄는 성능 개선도 얻지 못하고, 서버와 클라이언트 두 군데로 관리 포인트만 늘어나는 역효과를 낳을 수도 있다.
* 웹페이지의 설계와 목적, 그리고 우선순위에 따라 적절한 렌더링 방식 설계
  * 웹페이지에서 사용자에게 제공하고 싶은 내용이 무엇인지
  * 어떤 우선순위에 따라 페이지의 내용을 보여줄지
* SPA가 제공하는 보일러플레이트나 라이브러리가 점차 완벽해지면서 잠재적인 모든 위험을 제거할 수도 있고
* MPA가 브라우저 API의 도움을 받아 SPA와 같은 끊김 없는 사용자 경험을 제공할 수도 있다.

## 서버 사이드 렌더링을 위한 리액트 API 살펴보기

* 기본적으로 리액트는 프론트엔드 라이브러리로, 브라우저 자바스크립트 환경에서 렌더링
* 하지만 리액트 애플리케이션을 서버에서 렌더링 할 수 있는 API도 제공. 이 API는 당연히 브라우저의 window환경이 아닌 Node.js와 같은 서버 환경에서만 실행할 수 있다.
* SSR을 실행할 때 사용되는 API는 리액트 저장소 react-dom/server.js 를 확인. react-dom이 서버에서 렌더링하기 위한 다양한 메서드를 제공.

#### renderToString

* SSR을 구현하는데 가장 기초적인 API. 최초의 페이지를 HTML로 먼저 렌더링하는 함수.
* 인수로 넘겨받은 리액트 컴포넌트를 렌더링해 HTML 문자열로 반환하는 함수
* 인수로 주어진 리액트 컴포넌트를 기준으로 빠르게 브라우저가 렌더링할 수 있는 HTML을 제공하는데 목적이 있는 함수.
* 클라이언트에서 실행되는 자바스크립트 코드를 포함시키거나 렌더링하는 역할까지 해주지는 않는다.
* 루트 요소에 data-reactroot와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들어서 자바스크립트를 실행하기 위한 hydrate 함수에서 루트를 식별하는 기준점으로 쓴다.

```js
// React 19 / React 18에서는 이렇게 씀
import { renderToString } from "react-dom/server";

const html = renderToString(<App />);
```

#### renderToStaticMarkup

* 루트 요소에 data-reactroot와 같은 리액트에서만 사용하는 추가적인 DOM 속성을 만들지 않는다. 리액트에서만 사용하는 속성을 제거해 결과물인 HTML의 크기를 아주 약간이라도 줄일 수 있다. hydrate을 수행하지 않는 다는 가정 하에 리액트와 관련된 코드인 data-reactroot가 사라진 완전히 순수한 HTML 문자열이 반환.
* 블로그 글, 상품의 약관 정보 등 아무런 브라우저 액션이 없는 정적인 내용만 필요한 경우 유용

#### renderToNodeStream

* 스트림: 큰 데이터를 청크로 분할해 조금씩 가져오는 방식
* renderToString과 결과물이 동일하지만 두가지 차이점 있음
  * renderToString, renderToStaticMarkup은 브라우저에서도 실행 가능(물론 브라우저에서 실행할 이유는 없지만). renderToNodeStream은 브라우저에서 사용하는 것이 완전히 불가능.
  * renderToString은 결과물이 string이다. renderToNodeStream은 결과물이 Node.js의 ReadableStream이다. 궁극적으로 브라우저가 원하는 결과물, 즉 string을 얻기 위해서는 추가 처리 필요
    * ReadableStream은 utf-8로 인코딩된 바이트 스트림으로 Node.js나 Deno, Bun같은 서버 환경에서만 사용가능
    * ReadableStream 자체는 브라우저에서도 사용할 수 있는 객체다. 그러나 ReadableStream을 만드는 과정이 브라우저에서 불가능하게 구현돼 있다.
  * renderToString으로 생성해야하는 HTML의 크기가 매우 크다면, 큰 문자열을 한번에 메모리에 올려두고 응답을 수행해야 해서 Node.js가 실행되는 서버에 큰 부담. 렌더링 시간도 많이 소요. 스트림을 활용하면 큰 크기의 데이터를 청크해 순차적으로 처리.
    * 응답으로 HTML을 여러 청크로 분리해 내림. 브라우저에 제공해야 할 큰 HTML을 작은 단위로 쪼개 연속적으로 작성함으로써 Node.js 서버의 렌더링 부담을 덜 수 있다.

#### renderToStaticNodeStream

* renderToNodeStream과 제공하는 결과물은 동일하나, 자바스크립트에 필요한 리액트 속성이 제공되지 않는다.
* 마찬가지로 hydrate할 필요 없는 순수 HTML 결과물이 필요할 때 사용

#### hydrate

* renderToString과 renderToNodeStream으로 생성된 HTML 콘텐츠에 자바스크립트 핸들러나 이벤트를 붙이는 역할
* renderToString의 결과물은 단순히 서버에서 렌더링한 HTML 결과물로 사용자에게 무언가 보여줄 수 있지만, 사용자가 페이지와 인터랙션하는 것은 불가능
* hydrate은 이처럼 정적으로 생성된 HTML에 이벤트와 핸들러를 붙여 완전한 웹페이지 결과물을 만든다.
* hydrate은 기본적으로 이미 렌더링된 HTML이 있다는 가정하에 작업이 수행되고, 이 렌더링된 HTML을 기준으로 이벤트를 붙이는 작업만 실행한다.
* hydrate으로 넘겨준 두번째 인수에는 이미 renderToString 등으로 렌더링된 정적인 HTML정보가 담겨 있어야 한다.
  * hydrate과 비슷하지만 브라우저에서만 사용되는 메서드인 render
    * render는 컴포넌트와 HTML의 요소를 인수로 받고, HTML의 요소에 해당 컴포넌트를 렌더링하며, 여기에 이벤트 핸들러를 붙이는 작업까지 모두 한번에 수행한다.
    * render는 클라이언트에서만 실행되는, 렌더링과 이벤트 핸들러 추가 등 리액트를 기반으로 한 온전한 웹페이지를 만드는 데 필요한 모든 작업을 수행.
* hydrate mismatch
  * hydrate작업은 단순히 이벤트를 추가하는 것 외에도 렌더링을 한번 수행하면서 **hydrate이 수행한 렌더링 결과물 HTML**과 **인수로 넘겨받은 HTML**의 **구조를 비교**한다. 여기서 발생한 불일치가 바로 에러의 원인.
  * 불일치가 발생하면 hydrate이 렌더링한 기준으로 웹페이지를 그린다.
  * 이렇게 렌더링 하는 것은 사실상 서버와 클라이언트에서 두 번 렌더링을 하게 되고, 결국 SSR의 장점을 포기하는 것이기 때문에 반드시 고쳐야한다.
  * 하지만 불가피하게 결과물이 다를 수 밖에 없는 경우도 있다.
    * 예를 들어 HTML 내부에서 현재 시간을 초 단위까지 기록해야 한다면, SSR과 hydrate이 아무리 빨리 끝난다 하더라도 1초 단위로 끝나지 않는 이상 불일치가 발생할 수 밖에 없으며 결국 hydrate은 에러를 발생시킨다.
    * 불가피하게 불일치가 발생할 수 있는 경우에는 해당 요소에 suppressHydrationWarning 을 추가해 경고를 끌 수 있다. 물론 필요한 곳에서만 제한적으로 사용해야 한다.
    * HTML에 정확한 시간을 기록하기 위한 목적이라면 서버에서 실행되는 것보다 차라리 useEffect를 통해 노출하는 편이 더 정확하므로 서버에서 굳이 해당 함수를 실행조차 하지 않는 것이 나을 수 있다.
  * _어차피 클라이언트에서 똑같이 렌더링을 돌릴 거라면, SSR의 이점이 뭘까?_
    * 사용자가 흰 화면을 보지 않아도 되기 때문에
    *   hydrate할때 하는 렌더링은 주로 구조를 맞추는 계산입니다. 하지만 진짜 무거운 작업은 데이터 패칭.

        * CSR: 브라우저가 JS를 실행한 '후에' 비로소 서버에 데이터를 요청합니다. (지연 발생)
        * SSR: 서버가 렌더링을 하기 '전에' 이미 DB에서 데이터를 다 가져와서 HTML에 박아버립니다.

        클라이언트에서 하이드레이션을 위해 렌더링을 한 번 더 할 때는, 이미 서버가 HTML에 심어둔 데이터를 그대로 읽어서 쓰기 때문에 추가적인 네트워크 요청(API 호출)을 하지 않습니다. 즉, 데이터를 기다리는 시간이 통째로 삭제되는 효과가 있습니다.
    * 검색 엔진
    * 💡 요즘의 해결책: **서버 컴포넌트(RSC)**
      * 여기서 더 나아가, 아예 "<mark style="background-color:yellow;">**클라이언트에서 하이드레이션 렌더링조차 안 하게 만들자**</mark>"라고 나온 것이 바로 서버 컴포넌트입니다. <mark style="background-color:yellow;">**서버 컴포넌트로 만든 부분은 JS 번들에 포함되지도 않고**</mark>, 클라이언트에서 다시 그려지지도 않습니다.

### React Server Component(RSC)

컴포넌트를 서버에서 실행해서 **HTML이 아니라 React 전용 데이터로( RSC Payload라는 특별한 데이터 포맷이 사용됨) 보내는 방식**

* 단순 SSR과 전혀 다름. RSC는 SSR을 대체하는 게 아니라 새로운 렌더링 모델

#### RSC는 SSR과 완전히 다르다

* SSR(Server-Side Rendering) → **SSR은 “HTML 전달”**
  * 서버에서 HTML을 만들어서 보내는 것
  * 그 HTML을 브라우저가 받아서 화면 렌더
  * 이후 React가 hydrate
* RSC(Server Component) → <mark style="background-color:yellow;">**RSC는 “React Component 전달”**</mark>
  * 서버에서 컴포넌트 로직을 실행하고
  * HTML이 아닌 “컴포넌트 구조 데이터”를 보내고
  * 클라이언트가 그걸 받아서 React로 다시 구성

### Suspense

**Promise(비동기)을 기다리는 동안 보여줄 UI**를 정하는 React API

```jsx
<Suspense fallback={<Loading />}>
  <UserProfile />
</Suspense>
```

### Concurrency(동시성 기능)

* React가 <mark style="background-color:yellow;">**여러 렌더링 작업**</mark>을 **동시에 준비**하고, 더 중요한 작업을 먼저 보여주는 기술
  * **비동기는 동시성을 구현하기 위한 하나의 방법**
* React의 Concurrency은 Fiber(새로운 렌더링 엔진 구조: 렌더링 작업을 잘게 쪼개고, 중단하고, 다시 이어붙일 수 있게 만든 구조) 아키텍처 위에서 동작하도록 설계된 기능

### 기타

* 소스맵(Source Map): 브라우저가 번들된 코드 → 원본 코드로 연결해주는 지도 파일. \
  컴파일, 번들된 JS/CSS를 원래 코드로 되돌려 보여주는 번역기
* webpack.config.js : entry를 선언해 시작점을 선언, 필요한 파일과 그에 맞는 loader제공, 번들링에서 제외할 내용을 선언한 뒤 output으로 내보낸다.

#### 네이티브 앱 vs 웹 앱 vs 하이브리드 앱

* 하이브리드 앱은 **앱 안에 WebView(내장 브라우저)**&#xB97C; 넣고, 그 안에서 HTML/CSS/JS로 만든 페이지가 동작하는 앱이다.  **앱처럼 설치**되지만 **내부는 웹 페이지처럼 렌더링**됨.

<table><thead><tr><th width="123.4000244140625">유형</th><th>화면이 어떻게 만들어짐?</th><th>예시</th></tr></thead><tbody><tr><td><strong>네이티브 앱</strong></td><td>Swift(Kotlin) 등 네이티브 언어로 화면을 100% 제작</td><td>카카오톡 대화 화면, 인스타그램 피드</td></tr><tr><td><strong>웹 앱</strong></td><td>브라우저에서 HTML/CSS/JS로 렌더링</td><td>모바일 웹사이트, m.naver.com</td></tr><tr><td><strong>하이브리드 앱</strong></td><td>네이티브 앱 안에 WebView를 넣고 그 안에서 HTML 페이지를 렌더링</td><td>배민·쿠팡 결제/이벤트 페이지, 앱 약관/공지 페이지</td></tr></tbody></table>

## Next.js 톺아보기 (페이지 라우터)

* Next.js: 디렉터리 구조가 곧 URL로 변환; 디렉터리 기반 라우팅. 라우팅 구조는 /pages 디렉터리를 기초로 구성. 각 페이지에 있는 default export로 내보낸 함수가 해당 페이지의 루트 컴포넌트가 된다.
* create-next-app: scaffolding tool `npx create-next-app@latest --ls`
* package.json: 프로젝트 구동에 필요한 모든 명령어 및 의존성.
  * eslint-config-next: Next.js 기반 프로젝트에서 사용하도록 만들어진 ESLint설정. \
    core web vital에 도움되는 규칙들이 내장. \
    eslint-config-airbnb와 같은 기존에 사용하던 규칙이 있다면 이에 추가로 함께 사용하는 것을 추천
* next.config.js: Next.js 프로젝트 환경 설정
  * swcMinify: SWC를 기반으로 코드 최소화 작업을 할지 여부 설정
* pages/\_app.tsx
  * pages폴더가 src 하단에 존재할수도 있고, 프로젝트 루트에 있을 수도 있다.
  * app.tsx
    * \_app.tsx와 내부에 있는 default export로 내보낸 함수는 애플리케이션 전체 페이지의 시작점.
    * 공통으로 설정해야 하는 것들을 여기에서 실행
      * 전역 에러 바운더리
      * reset.css같은 전역 CSS
      * 모든 페이지에 공통으로 사용 또는 제공해야 하는 데이터 제공
    * \_app.tsx의 render()내부의 console.log는 브라우저 콘솔창이 아닌 Next.js를 실행한 터미널에 기록된다. 만약 여기서 페이지를 전환했을때 더 이상 서버에서 로깅되지 않고 브라우저에서 로깅된다면 최초에는 SSR을, 이후에는 CSR을 한다는 것을 알 수 있다.
* pages/\_document.tsx
  * \_document.tsx는 없어도 실행에 지장은 없다.
  * 애플리케이션의 HTML을 초기화 하는 곳(\_app.tsx는 애플리케이션 페이지 전체를 초기화하는 곳)
  * 이나 에 DOM속성을 추가하고 싶을 때 \_document.tsx를 사용
  * \_document는 무조건 서버에서 실행(\_app.tsx는 렌더링이나 라우팅에 따라 서버나 클라이언트에서 실행). 따라서 이 파일에서 이벤트핸들러 추가 불가능.
  * Next.js에는 두가지 존재(next/document에서 제공하는 head, next/head에서 기본적으로 제공하는 head)하는데, next/document는 오직 \_document.tsx에서만 사용할 수 있다.
    * next/document의 내부에서는을 사용할 수 없다.
    * next/head는 페이지에서 사용할 수 있으며 SEO에 필요한 정보나 title 등을 담을 수 있다.
    * 웹 애플리케이션에 공통적인 제목이 필요하면 \_app.tsx에, 페이지별 제목이 필요하면 페이지 파일 내부에서 next/head 사용하면 된다.
  * getServerSideProps, getStaticProps 등 서버에서 사용 가능한 데이터 불러오기 함수는 \_document.tsx에서 사용할 수 없다. \_document.tsx는 Next.js가 HTML을 렌더링하기 위한 템플릿 파일일 뿐, 페이지의 데이터 흐름과는 완전히 분리된 영역이기 때문이다.
  * \_document.tsx 에서만 할 수 있는 작업으로 CSS-in-JS 스타일을 서버에서 모아 HTML로 제공하는 작업이 있다.
  * \_app.tsx vs \_document.tsx
    * \_app.tsx
      * Next.js를 초기화하는 파일
      * Next.js설정과 관련된 코드를 모아둠
      * 경우에 따라 서버와 클라이언트 모두에서 렌더링 가능
    * \_document.tsx
      * Next.js로 만드는 웹사이트의 뼈대가 되는 HTML설정과 관련된 코드를 추가하는 곳
      * 반드시 서버에서만 렌더링된다.
* pages/\_error.tsx
  * 클라이언트에서 발생하는 500에러 처리(전역 에러)
  * 개발모드에서는 이 페이지에 방물 불가(개발모드에서 에러 발생하면, Next.js가 제공하는 개발자 에러 팝업 나타남). 이 페이지 작동은 프로덕션으로 빌드해 확인해야함.
* pages/500.tsx
  * 서버에서 발생하는 에러를 핸들링하는 페이지
  * \_error.tsx와 500.tsx가 모두 있다면, 500.tsx가 우선으로 실행
* pages/index.tsx
  * pages/index.tsx: 웹사이트의 루트. localhost:3000과 같은 루트 주소
  * pages/hello.tsx: localhost:3000/hello
  * pages/hello/world.tsx: 디렉터리 깊이만큼 주소 설정. localhost:3000/hello/world
  * pages/hello/\[greeting].tsx:
    * `[]`의 의미는 여기에 어떠한 문자도 올 수 있다는 뜻.`[]`안의 내용은 변수로 처리.
    * greeting이라는 변수에 사용자가 접속한 주소명이 오게된다.
  * pages/hello/\[...props].tsx:
    * /hello 하위의 모든 주소가 여기로 온다.
    * 작동이 전개연산자와 동일. 전개 연산자로 선언한 모든 주소는 배열로 들어간다.
    * \[...props] 값은 props라는 변수에 배열로 오게 된다.
    * 예) /hello/1/2/my/name → \['1', '2', 'my', 'name'] 주소에 숫자를 입력해도 숫자로 형변환 되지 않는다.
    * 예) /hello/1 → \['1']주소에 하나만 들어가도, string 1이 아닌 string\[]\[1]이 들어간다.
* pages/api/hello.ts
  * api디렉터리는 서버의 API를 정의하는 폴더.
  * pages/api/hello.ts는 /api/hello로 호출.
  * 다른 pages 파일과 다르게 HTML요청을 하는게 아니라 단순히 서버 요청을 주고받는다.
  * 페이지와 마찬가지로 default export로 내보낸 함수가 실행
  * 이 폴더에 있는 코드는 오직 서버에서만 실행. window나 document 등 브라우저에서만 접근할 수 있는 코드를 작성하면 당연히 문제 발생
  * 서버에서 내려주는 데이터를 조합해 BFF형태로 활용하거나, 완전한 풀스택 애플리케이션을 구축하고 싶을때, 혹은 CORS(Cross-Origin Resource Sharing)문제를 우회할 때 사용

### 서버 라우팅과 클라이언트 라우팅 차이(페이지 이동)

* Next.js는 최초 페이지 렌더링이 서버에서 수행된다.
* Next.js는 서버사이드 렌더링의 장점, 즉 사용자가 빠르게 볼 수 있는 최초 페이지를 제공하면서, SPA의 장점인 자연스러운 라우팅 두가지 장점을 모두 살린다.
  * 내부 페이지 이동시 a태그 대신 Link태그를 사용
  * window.location.href 대신 router.push 사용

#### next/link vs a

* a태그
  * **페이지를 이동할 때 모든 리소스를 처음부터 다시 받는다**
  * 잠시 깜박인 후에 페이지 라우팅
  * 렌더링이 어디에서 일어났는지 판단하기 위해 console.log를 실행하면, 서버와 클라이언트 각각 동시에 기록. 즉, 서버에서 렌더링을 수행하고 클라이언트에서 hydrate하는 과정에서 한번 더 실행된다.
*   next/link

    * Next.js에서 제공하는 라우팅 컴포넌트
    * 모든 리소스가 아닌 이동한 해당 페이지에 필요한 내용만 받는다.(네트워크 탭 확인)
    * console.log가 클라이언트에 기록.
    * Next.js는 \<Link>가 화면에 보이면(또는 보이기 직전) **해당 페이지의 데이터를 미리 불러온다**(**자동 prefetch**).

    ```jsx
      <Link href="/dashboard">Go</Link>

      <Link>가 렌더링되고 뷰포트 안에 들어오거나 근처에 있게 되면
      Next.js가 백그라운드에서 자동으로 /dashboard 페이지의 코드 + 데이터 번들을 캐싱

    ```

#### router.push vs window.location.href/assign

<table><thead><tr><th width="135.4000244140625">기능</th><th>router.push</th><th>window.location.href / assign</th></tr></thead><tbody><tr><td>동작 방식</td><td><strong>클라이언트 사이드 라우팅</strong>(SPA)</td><td><strong>브라우저 전체 페이지 새로고침</strong></td></tr><tr><td>속도</td><td>빠름 (JS로 화면만 교체)</td><td>느림 (전체 페이지 리로드)</td></tr><tr><td>상태 유지</td><td>유지됨 (state, context, query client 등)</td><td>모두 초기화됨</td></tr><tr><td>Next.js 최적화</td><td>적용됨</td><td>적용 안 됨</td></tr><tr><td>사용 시점</td><td>Next.js 앱 내부 이동에 권장</td><td>외부 URL 이동, 강제 리프레시가 필요할 때</td></tr><tr><td>히스토리</td><td>push / replace 모두 가능</td><td>브라우저 기본 동작 (assign/replace로 제어 가능)</td></tr></tbody></table>

* router.push (SPA 라우팅 / React 상태 유지)

```js
import { useRouter } from "next/router";

const router = useRouter();
router.push("/dashboard");
```

* window.location.href (전체 페이지 리로드) `window.location.href = '/dashboard';`
* window.location.assign (히스토리에 추가되며 이동) `window.location.assign('/dashboard');`
* window.location.replace (히스토리 대체 후 이동) `window.location.replace('/dashboard');`

#### Link vs router.push

<table data-header-hidden><thead><tr><th width="115.39996337890625"></th><th></th><th></th></tr></thead><tbody><tr><td>기능</td><td>&#x3C;Link></td><td>router.push()</td></tr><tr><td>목적</td><td><strong>사용자 </strong><mark style="background-color:yellow;"><strong>클릭 기반</strong></mark><strong> 네비게이션</strong></td><td><strong>코드(이벤트) 기반 네비게이션</strong></td></tr><tr><td>동작 방식</td><td>SPA 이동 + <strong>자동 prefetch</strong></td><td>SPA 이동 (기본적으로 prefetch 없음)</td></tr><tr><td>UX</td><td>a 태그처럼 동작 (접근성 좋음)</td><td>프로그래밍 라우팅 (onClick 등에서 사용)</td></tr><tr><td>사용 위치</td><td><strong>JSX 안에서만</strong> 사용 가능</td><td>JS 코드 어디서든 실행 가능</td></tr><tr><td>권장 시점</td><td>화면에 링크 UI가 있을 때</td><td>조건/이벤트 기반 자동 이동이 필요할 때</td></tr><tr><td>SEO</td><td><code>&#x3C;a></code> 역할이라 검색엔진 인식 용이. <br>a태크는 HTML 네이티브 이동.</td><td>JS 라우팅이라 SEO 영향 없음(JavaScript로 실행되는 이동이기 때문에 검색엔진이 링크로 인식 못함)</td></tr></tbody></table>

#### \<Link replace> vs router.replace()

* 기능은 완전히 같다. 둘 다 현재 페이지를 히스토리에 남기지 않고 이동

### Data Fetching: SSR 지원을 위한 Next.js의 데이터 불러오기 전략들

* 이 함수는 pages/ 하위 라우팅이 되는 파일에서만 사용할 수 있다.
* 예약어로 지정되어 반드시 정해진 함수명으로 export 해야한다.
* 이를 활용하면 서버에서 미리 필요한 페이지를 만들어서 제공하거나 (SSG: Static Site Generation, getStaticProps())
* 해당 페이지에 요청이 있을 때마다 서버에서 데이터를 조회해서 미리 페이지를 만들어서 제공할 수 있다. (SSR, getServerSideProps())

#### getStaticPaths와 getStaticProps (SSG)

* CMS나 블로그, 게시판과 같이 사용자와 관계없이 정적으로 결정된 페이지를 보여줄 때 사용하는 함수
* getStaticPaths와 getStaticProps는 반드시 함께 있어야 사용 가능
* 이 두 함수를 사용하면 빌드 시점에 미리 데이터를 불러온 다음, 정적인 HTML페이지를 만들수 있다. (SSG)
  * 이 두 함수를 사용해 next build를 수행하면 ./next/server에 해당 페이지에 필요한 HTML과 JSON데이터가 모두 준비돼 있다.
*   예를 들어 /pages/post/\[id] 페이지가 있고, 해당 페이지에 두 함수를 사용했을때,

    * getStaticPaths는 해당페이지에서(/pages/post/\[id]) 접근 가능한 주소를(페이지를) 정의하는 함수다.
    * 아래 예제에서 이 페이지는 /post/1, /post/2만 접근 가능하다. 예를 들어 /post/3 등은 404를 반환한다.
    * getStaticProps는 getStaticPaths에서 정의한 페이지를 기준으로 해당 페이지로 요청이 왔을 때 제공할 props를 반환하는 함수다.
    * 아래 예제에서는 id가 각각 1과 2로 제한돼 있기 때문에(getStaticsPaths에서 해당 페이지는 id를 각각 1,2만 허용) fetchPost(1), fetchPost(2)를 기준으로 각각 함수의 응답 결과를 변수로 가져와 props의 {post}로 반환하게 된다.(getStaticProps는 1과2에 대한 데이터 요청을 수행해 props로 반환)

    ```ts
    import { GetStaticPaths, GetStaticProps } from "next";

    export const getStaticPaths: GetStaticPaths = async () => {
      return {
        paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
        fallback: false,
      };
    };

    export const getStaticProps: GetStaticProps = async ({ params }) => {
      const { id } = params;
      const post = await fetchPost(id);
      return {
        props: { post },
      };
    };

    export default function Post({ post }: { post: Post }) {
      // post함수는 앞서 getStaticProps가 반환한 post를 렌더링한다.
    }
    ```
* getStaticPaths 함수의 반환값 중 하나인 fallback옵션은 미리 빌드해야(SSG)할 페이지가 너무 많은 경우 사용.
  * paths에 미리 빌드해 둘 몇개의 페이지만 리스트로 반환하고, true나 blocking으로 값을 선언
  * 이렇게 하면 next build를 실행할 때 미리반환해 둔 paths에 기재돼 있는 페이지만 미리 빌드하고 나머지 페이지의 경우에는 다음과 같이 작동
    * true: 사용자가 미리 빌드하지 않은 페이지에 접근할 경우, 빌드되기 전까지는 fallback컴포넌트를 보여주고, 빌드가 완료된 이후에 해당 페이지를 보여주는 옵션
    * blocking: 별도의 로딩과 같은 처리를 하지 않고, 단순히 빌드가 완료될 때까지 사용자를 기다리게 하는 옵션. SSR할때까지 대기한 다음, 렌더링이 완료되면 해당 페이지 제공.
    * false vs blocking
      * false
        * getStaticPaths에서 반환한 paths만 SSG. 그 외 경로 접근 → 바로 404. 절대로 동적 생성 안 함
      * blocking
        * 정해지지 않은 경로라도 처음 요청 시 서버가 동적 생성해준다. 404가 아니라 SSR처럼 작동하면서 생성된 결과를 SSG로 캐싱한다.
        * 빌드되지 않은 경로로 접근하면 페이지가 준비될 때까지 서버에서 가로막고 기다림
        * 서버가 페이지 HTML을 생성해서 완성되면 → 그걸 바로 클라이언트에게 보내줌 → 로딩 UI 없음 (서버가 다 만들어서 주기 때문)
  * fallback이 true이거나 blocking이면 페이지 렌더링 흐름이 달라지기 때문에(클라이언트가 로딩 UI를 직접 보여줘야 하기 때문에) useRouter를 쓴다. router.isFallback은 오직 getStaticPaths의 fallback이 true일 때만 의미 있게 동작

```js
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: "1" } }], // 1번 페이지만 미리 생성
    fallback: "blocking", // or true
  };
}
```

```js
import { useRouter } from "next/router";

export default function PostPage({ post }) {
  const router = useRouter();

  if (router.isFallback) {
    return <p>Loading...</p>;
  }

  return <div>{post.title}</div>;
}
```

#### getServerSideProps (SSR)

* 서버에서만 실행되는 함수
  * API 호출 시 /api/some/path와 같이 protocol과 domain이 없는 fetch 요청은 할 수 없다. 브라우저와 다르게 서버는 자신의 호스트를 유추할 수 없기 때문. 반드시 완전한 주소를 제공해야 fetch가 가능.
* Next.js의 서버 사이드 렌더링은 getServerSideProps의 실행과 함께 이뤄진다. (v12까지)
* 이 함수가 있다면 꼭 서버에서 실행해야 하는 페이지로 분류해 빌드시 서버용 JS파일을 별도로 만든다.
* 응답값에 따라 페이지의 루트 컴포넌트에 props를 반환 또는 다른 페이지로 리다이렉트
  * 클라이언트에서는 아무리 리다이렉트를 초기화해도 JS가 어느정도 로딩된 이후에 실행할 수 밖에 없다.
  * 하지만 getServerSideProps를 사용하면 조건에 따라 사용자에게 해당 페이지를 보여주기도 전에 원하는 페이지로 보내버릴 수 있다.
* props로 내려줄 수 있는 값은 JSON으로 직렬화 할 수 있는 값으로 제한된다.

리액트 서버 사이드 렌더링

1. 서버에서 fetch 등으로 렌더링에 필요한 정보를 가져온다.
2. 가져온 정보를 기반으로 HTML 완성
3. HTML을 클라이언트(브라우저)에 제공한다.
4. 클라이언트에서 hydrate 한다.
5. hydrate로 만든 리액트 컴포넌트 트리와 서버에서 만든 HTML이 다르면 불일치 에러(suppressHydrationWarning)

#### getInitialProps

* 라우팅에 따라 서버와 클라이언트 모두에서 실행 가능한 메서드. 즉, 여기에 있는 코드는 때에 따라 서버와 클라이언트 모두에서 실행될 수 있으므로 이러한 특징을 감안해서 코드 작성
* 대부분의 경우 getStaticProps나 getServerSideProps를 사용, getInitialProps는 굉장히 제한적인 예시에서만 사용, 사용이 제한돼 있는 페이지에서만 사용하는 것이 좋다.

### 스타일 적용하기

#### 전역 스타일

* \_app.tsx 활용
  * 글로벌 스타일은 다른 페이지나 컴포넌트와 충돌할 수 있으므로 반드시 \_app.tsx에서만 제한적으로 작성
  * 브라우저에 기본으로 제공되고 있는 스타일 초기화(reset)
  * 애플리케이션 전체에 공통으로 적용하고 싶은 스타일

#### 컴포넌트 레벨 CSS

* \[name].module.css 명명 규칙 준수
* 컴포넌트 레벨 CSS는 다른 컴포넌트의 클래스명과 겹쳐서 스타일에 충돌이 일어나지 않도록 고유한 클래스명 제공

#### SASS(Syntactically Awesome Style Sheets)와 SCSS(Sassy CSS; SASS의 기능을 가진 CSS)

* `npm install --save-dev sass`
* 둘은 구문(Syntax), 즉 코드를 작성하는 방식에 차이가 있습니다.
* SASS (Original)
  * 들여쓰기 기반: 중괄호({ })와 세미콜론(;)을 사용하지 않습니다.
  * 파이썬(Python)과 유사하게 줄 바꿈과 들여쓰기로 범위를 구분합니다.
  * 코드가 매우 간결하지만, 기존 CSS와 문법이 달라 적응이 필요할 수 있습니다.
* **SCSS (Sassy CSS)**
  * CSS 친화적: CSS와 완전히 동일하게 중괄호와 세미콜론을 사용합니다.
  * 호환성: 모든 CSS 코드는 유효한 SCSS 코드입니다. 즉, 기존 CSS 파일을 확장자만 .scss로 바꿔도 바로 작동합니다.
  * 이런 편의성 덕분에 현재 실무에서는 Sass보다 SCSS가 훨씬 더 많이 사용됩니다.

#### CSS-in-JS

* **자바스크립트 내부에 스타일 시트 삽입**
* CSS-in-JS를 **Next.js**같은 **서버 사이드 렌더링 프레임워크에서 사용할 때는&#x20;**<mark style="background-color:yellow;">**반드시 초기화 과정을 서버에서 거쳐야 한다.**</mark>
  * **서버에서 스타일을 미리 모은 다음 서버사이드 렌더링 시 한꺼번에 제공**
  * 만약 이런 과정을 거치지 않는 다면 **FOUC** 발생 가능

### \_app.tsx 응용하기

* Next.js 최초 진입점
* userAgent 확인이나 사용자 정보 같은 애플리케이션 전역에 걸쳐 사용해야 하는 정보 등을 호출

### next.config.js 살펴보기

* Next.js 실행에 필요한 설정 추가
* @type 구문을 활용해 미리 선언돼 있는 설정 타입(NextConfig)의 도움을 받을 수 있다.
* 실무에서 자주 사용되는 설정
  * **basePath**
    * URL을 위한 접두사
    * basePath: "docs" → `localhost: 3000/docs`
    * 클라이언트 렌더링을 트리거하는 모든 주소에 알아서 basePath가 붙은 채로 렌더링
    * 단, 이것 또한 Next.js에서 제공하는 기능이므로, `<a>`태그를 직접 사용하거나 `window.location.push` 등으로 라우팅 할 경우에는 반드시 basePath를 직접 붙여야 한다.
  * swcMinify
    * swc로 **코드 압축**
    * 기본값 true
  * poweredByHeader
    * Next.js는 응답 헤더에 `X-Power-by: Next.js` 정보를 제공
    * 기본적으로 보안 관련 솔루션에서는 powered-by 헤더를 취약점으로 분류하므로 **false로 설정**하는 것이 좋다.
  * **redirects**
    * 특정 주소를 다른 주소로 보내고 싶을 때 사용
  * reactStrictMode
  * **assetPrefix**
    * next에서 **빌드된 결과물을 동일한 호스트가 아닌 다른 CDN 등에 업로드**하고자 한다면 이 옵션에 해당 CDN 주소를 명시
    * **정적 리소스를 별도 CDN에 업로드** 하고 싶다면 이 기능 활용.
    * assetPrefix 설정이 활성화 되면 static 리소스들은 해당 주소에 있다고 가정하고 해당 주소로 요청하게 된다.

### 기타

* getServerSideProps가 없으면 서버에서 실행하지 않아도 되는 페이지로 처리하고 typeof window의 처리를 모두 object로 바꾼 다음 빌드 시점에 미리 트리쉐이킹을 해버린다.
* SWC
  * 번들링과 컴파일을 더욱 빠르게 수행. 바벨의 대안. 특별한 이유가 없다면 SWC 쓰는것 권장
  * 바벨보다 빠른 이유
    * 자바스크립트 기반의 바벨과는 다르게 러스트라는 언어로 작성(Rust는 C/C++과 동등한 수준의 빠른 속도)
    * 병렬로 작업 처리
* 언더스코어(\_) 의미: 이건 일반 페이지가 아니라 시스템 파일이야
  * 언더스코어(\_)는 "이 파일은 페이지가 아니라 Next.js가 내부적으로 특정 역할을 위해 자동으로 불러오는 특별한 파일"
* **CMS(Contents Management System)**
  *   프로그래밍 없이도 콘텐츠(글·이미지·페이지·상품 등)를 만들고 관리할 수 있게 해주는 시스템

      <table><thead><tr><th width="253.20001220703125">종류</th><th width="345.99993896484375">설명</th></tr></thead><tbody><tr><td>WordPress</td><td>전 세계 1위 CMS. 웹사이트 + 블로그 관리 최강</td></tr><tr><td>Wix / Squarespace</td><td>페이지 빌더 겸 CMS</td></tr><tr><td>Notion (CMS처럼 활용)</td><td>문서 관리 + 데이터 관리</td></tr><tr><td>Contentful / Strapi / Sanity</td><td>Headless CMS (API로 데이터 제공)</td></tr><tr><td>Shopify</td><td>전자상거래 전용 CMS</td></tr></tbody></table>
