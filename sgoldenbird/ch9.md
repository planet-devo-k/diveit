# Takeaways

## 모던 리액트 개발 도구로 개발 및 배포 환경 구축하기

### Next.js로 리액트 개발 환경 구축하기

#### create-next-app 없이 하나씩 구축하기

1. package.json ← npm init
2. react, react-dom, next 설치
3. devDependencies 에 필요한 패키지 설치

- typescript, 타입스크립트 내부에서 리액트 타입 지원에 필요한 @types/react, @types/react-dom, Node.js의 타입을 사용하기 위한 @types/node, ESLint 사용에 필요한 eslint, eslint-config-next 설치

#### tsconfig.json 작성하기

- 타입스크립트 설정
- 먼저 JSON 최상단에 $schema 키와 값을 넣자. `"$schema": "http://json.schemastore.org/tsconfig.json"`
  - $schema는 schemaStore에서 제공해주는 정보로, 해당 JSON파일이 무엇을 의미하는지 또 어떤 키와 어떤 값이 들어갈 수 있는지 알려주는 도구
  - $schema와 올바른 값이 선언돼 있다면 VS code나 웹스톰(WebStorm) 같은 IDE에서 자동 완성이 가능해진다.
- .eslintrc, .prettierrc와 같이 JSON방식으로 설정을 작성하는 라이브러리가 schemastore에 해당 내용을 제공하고 있다면 더욱 편리하게 JSON설정을 작성할 수 있다.
- tsconfig.json 옵션 (www.typescriptlang.org/tsconfig)
  - include: 타입스크립트 컴파일 대상에 포함시킬 파일 목록
  - exclude: 타입스크립트 컴파일 대상에서 제외시킬 파일 목록 (node_modules 등)
  - compilerOptions: 타입스크립트를 자바스크립트로 컴파일할 때 사용하는 옵션
    - target
      - 타입스크립트가 변환을 목표로 하는 언어의 버전.
      - 폴리필까지는 지원하지 않기 때문에 Promise와 같이 별도의 폴리필이 필요한 경우까지 모두 도와주진 않는다.
    - lib
      - 예를 들어 프로젝트가 es5지원을 목표로 하고 있고 Promise나 Map같은 객체들도 폴리필을 붙여서 지원할 환경을 준비했다고 가정하자.
      - 그러나 여전히 타입스크립트는 Promise나 Map의 존재에 대해 모를 것이다.
      - 이경우 가장 최신 버전을 의미하는 esnext를 추가하면 target은 es5라 할지라도 신규 기능에 대한 API 정보를 확인할 수 있게 되어 에러가 발생하지 않는다.
      - dom을 추가하면 타입스크립트 환경에서 window.document 등 브라우저 위주의 API에 대한 명세를 사용할수 있다.
    - allowJs
      - 타입스크립트가 자바스크립트 파일 또한 컴파일 할지 결정. 주로 자바스크립트를 타입스크립트로 전환하는 과정에서 .js와 .ts가 혼재됐을때 사용
    - skipLibCheck
      - 라이브러리에서 제공하는 d.ts에 대한 검사 스킵
      - d.ts는 타입스크립트에서 제공하는 타입에 대한 정보를 담고 있는 파일
    - strict
      - 타입스크립트 컴파일러의 엄격모드 제어
      - alwaysStrict: 모든 자바스크립트 파일에 use strict 추가
      - strictNullChecks: 엄격한 null검사 활성화. null과 undefined를 명확히 구분
        - undefined나 null가능성이 있는 모든 코드에 대해 undefined, null을 반환한다.
        - 런타임 에러를 미연에 방지하는 좋은 옵션이므로 꼭 켜두기를 권장
      - strictBindCallApply: call, bind, apply에 대해 정확한 인수를 요구하는 옵션
        - 자바스크립트에서는 인수의 수가 많을 경우 이후 인수를 무시해 크게 문제되지 않지만 향후에 발생할 수 있는 런타임 에러 방지를 위해 꼭 켜두기를 권장
      - strictFunctionTypes: 함수의 타입에 대해 엄격함 유지. 역시 키는 것 권장
      - strictPropertyInitialization: 클래스 내부 프로퍼티에 값을 할당할 때 타입이 올바르지 않다면 에러 발생
      - noImplicitAny: 타입을 명시하지 않은 변수가 있다면 any를 자동으로 할당하는 기능이 있는데 이 옵션을 켜두면 타입을 명시하지 않은 변수에 any대신 에러가 발생.
      - noImplicitThis: this를 추론할 수 없는 상황에서 any를 자동으로 할당하는 기능이 있는데 이 옵션을 켜두면 any를 할당하지 않고 에러 발생
      - useUnknownInCatchVariables: catch 구문에서 잡은 변수에 대해 기본적으로 any를 할당하는데 이 옵션으로 4.0부터는 unknown 할당. 왜냐하면 try catch 구문에서 잡히는 것이 꼭 에러라는 법은 없기 때문. 진짜 에러를 잡고 싶다면 가드 문 사용. `if (e instanceof Error) {}`
    - forceConsistentCasingInFileNames: 파일 이름 대소문자 구분
    - noEmit: 컴파일을 하지 않고 타입 체크만 한다.
      - 타입스크립트 사용하는데 이 옵션을 켜두는 것이 의아할 수 있는데 Next.js는 swc가 타입스크립트 파일을 컴파일하므로 굳이 타입스크립트가 자바스크립트로 컴파일할 필요 없다.
      - 이 옵션이 켜져있으면 타입스크립트는 단순히 타입 검사만 한다.
      - swc는 러스트 기반 컴파일러.
    - esModuleInterop
      - CommonJS 방식으로 보낸 모듈을 ES 모듈 방식의 import로 가져올수 있게 해준다.
      - 과거 자바스크립트에는 여러 모듈 옵션이 존재했는데 대표적인게 CommonJS와 AMD방식이다.
      - 현재는 ES모듈방식이 대세지만 Node.js만 하더라도 module.exports의 CommonJS방식으로 export돼 있다. → 재 Node.js는 CommonJS(CJS)와 ES Modules(ESM)를 모두 지원하는 '듀얼 모듈' 생태계
    - module: 모듈 시스템을 설정
      - 대표적으로 commonjs와 esnext가 있다.
      - commonjs는 require를 사용하고 esnext는 import 사용
    - moduleResolution: 모듈을 해석하는 방식을 설정
      - node는 node_modules를 기준으로 모듈을 해석하고
      - classic은 tsconfig.json이 있는 디렉터리를 기준으로 모듈을 해석.
    - resolveJsonModule: JSON파일을 import할수 있게 해준다. 이 옵션을 켜면 allowJS옵션도 자동으로 켜진다.
    - isolateModules
      - 타입스크립트 컴파일러는 파일에 import나 export가 없으면 단순 스크립트 파일로 인식해 이러한 파일이 생성되지 않도록 막는다. 즉, 단순히 다른 모듈 시스템과 연계되지 않고 단독으로 있는 파일의 생성을 막기 위한 옵션.
    - jsx: .tsx 파일 내부에 있는 JSX를 어떻게 컴파일 할지 설정
      - react: React.createElement로 변환
      - react-jsx: react/jsx-runtime을 사용해 변환. createElement를 사용하지 않아 import React from 'react'를 안적어도 된다.
      - react-jsxdev: react-jsx와 동일하지만 디버깅 정보 추가
      - preserve: 변환하지 않고 그대로 유지. swc를 쓰면 preserve사용. → swc가 JSX 또한 변환해주기 때문
      - react-native: 리액트 네이티브에서 사용하는 방식으로 마찬가지로 변환하지 않는다.
    - incremental
      - 타입스크립트는 마지막 컴파일 정보를 .tsbuildinfo 파일 형태로 만들어 디스크에 저장한다.
      - 이후 컴파일러가 호출 됐을 때 해당 정보를 활용해 컴파일 수행. 컴파일이 빨라짐
    - baseUrl: 모듈을 찾을 때 기준이 되는 디렉터리를 지정. paths와 함께 사용
    - paths
      - 상대 경로는 파일이 많아지고 구조가 복잡해질수록 중첩되면서 읽기 어려움
      - paths를 활용하면 이러한 경로에 별칭을 지정.
      - 보통 #, $ 같은 특수문자 접두사와 함께 자주 사용. @의 사용은 자제. @은 보통 @types 같이 스코프 패키지에 널리 사용되기 때문. @는 네이밍에 따라 충돌할 여지가 있다.

#### next.config.js 작성하기

- 옵션
  - poweredByHeader: 일반적으로 보안 취약점으로 취급되는 X-Powered-By 헤더 제거
  - eslint.ignoreDuringBuilds: 빌드시에 ESLint를 무시.
    - 일반적으로 Next빌드시에 ESLint도 같이 수행하는데 이 옵션을 true로 설정하면 빌드 시에 ESLint를 수행하지 않게 한다.
    - 이후에 ESLint는 CI과정에서 별도로 작동하게 만들어 빌드를 더욱 빠르게 만들 수 있다.

#### ESLint와 Prettier 설정하기

- .eslintignore, .prettierignore에 .next나 .node_modules를 추가. 두 폴더는 개발자가 작성하는 코드가 아니므로 정적 분석할 필요가 없다.

#### 스타일 설정하기

#### 애플리케이션 코드 작성

### 탬플릿 만들기

첫번째 방법: 먼저 보일러플레이트 프로젝트를 만든다음 깃헙에서 'Template repository'옵션 체크. → 다른 저장소를 생성할 때 이 내용을 모두 복사해서 생성할 수 있다.
두번째 방법: 나만의 create-\*\*\*-app을 만든다. cli패키지로 만든다면 사용자의 입력을 받아 서로 다른 패키지를 만들 수 있다. 아래 사이트 참고

- create-next-app 내부 코드: 소스코드를 살펴보면 알겠지만 일단 하나의 템플릿을 미리 만들어 둔 다음 여기에서 CLI로 사용자의 입력을 받아 커스터마이징했다.
- Creating a CLI tool with Node.js: npm을 기반으로CLI 패키지를 만드는 방법

### 깃허브 100% 활용하기

- CI/CD 와 같은 자동화, 보안 이슈 점검, 프로젝트 관리 등
- Github Packages: 패키지를 저장할 수 있는 이미지 레지스트리 서비스
- Github Projects: Jira와 같이 프로젝트를 관리할 수 있게 도와준다.
- Github Pages: 간단한 웹사이트를 운영할 수 있다.
- Github Codespaces: 인공지능 코딩 어시스턴스 서비스

#### 깃허브 액션으로 CI 환경 구축하기

- CI: 코드의 변화를 모으고 관리하는 코드 중앙 저장소에서 여러 기여자가 기여한 코드를 지속적으로 빌드하고 테스트해 코드의 정합성을 확인하는 과정
- CI의 핵심은 코드의 변화가 있을때마다 자동으로 정합성 확인 작업이(테스트, 빌드, 정적분석, 보안 취약점 분석 등) 실행돼야한다는 것.

- 과거 젠킨스 → 깃헙 액션
- 깃헙 액션

  - 깃헙에서 출시한 SaaS
  - 본래 목적은 깃헙 저장소를 기반으로 깃헙에서 발생하는 다양한 이벤트를 트리거 삼아 다양한 작업을 할 수 있게 도와주는 것 → CI/CD 서비스로 각광
    - 어떤 브랜치에 푸시가 발생하면 빌드 수행
    - 메인브랜치를 대상으로 PR열리면 빌드, 테스트, 정적분석 수행

- 깃헙 액션 기본 개념

  - ((step 모음 > job ) job모음 → 병렬로 실행 ) > 액션
  - runner: 파일로 작성된 깃헙 액션이 실행되는 서버. 특별히 지정하지 않으면 공용 깃헙 액션 서버를 이용. 별도의 러너를 구축해 자체적으로 운영할수도 있다.
  - action: 러너에서 실행되는 하나의 작업 단위. yaml 파일로 작성된 내용을 하나의 액션으로 볼 수 있다.
  - event: 깃헙 액션 실행을 일으키는 이벤트. 한개 이상의 이벤트를 지정할 수 있다. 특정 브랜치를 지정하는 이벤트도 가능하다.
    - pull_request: PR이 열리거나 닫히거나 수정되거나 할당되거나 리뷰툐청 등
    - issues: 이슈가 열리거나 닫히거나 삭제되거나 할당
    - push
    - schedule: 저장소에서 발생하는 이벤트와 별개로 특정 시간에 실행되는 이벤트. cron에서 사용되는 시간
      - cron: 유닉스 계열 운영체제에서 실행되는 시간 기반 잡 스케줄러.
      - 5 4 \* \* \* : 매일 4시 5분에 실행. 분, 시간, 일, 월, 요일 순. crontab guru 참고
  - jobs: 하나의 러너에서 실행되는 여러 스텝의 모음. 하나의 액션에서 여러 잡을 생성할 수 있으며 특별히 선언하게 없다면 내부 가상머신에서 각 잡은 병렬로 실행
  - steps: 잡 내부에서 일어나는 하나하나의 작업. 셸 명령어나 다른 액션을 실행할 수도 있다. 이 작업은 병렬로 일어나지 않는다.

- 깃헙 액션 작성하기

  - YAML(YAML Ain't Markup Language): 사람이 읽고 쓰기 아주 편하게 만들어진 데이터 직렬화(Serialization) 양식
    - 주로 프로그램의 설정 파일(Configuration)이나 데이터를 주고받는 용도로 사용
    - XML이나 JSON보다 훨씬 간결하고 사람이 직관적으로 이해하기 쉽습니다.
  - 직렬화: 메모리 속의 복잡한 데이터(객체)를 어딘가에 저장하거나 네트워크로 보내기 위해 '한 줄의 텍스트'로 변환하는 과정

  - .github/workflow/를 루트에 생성하고 내부에 yaml파일 작성
  - 저장소에 prettier가 설치돼 있다면 yaml파일도 함께 포함시켜 코드 스타일을 유지하는 것이 좋다.
  - Detail로그는 일정 시간이 지나면 사라지므로 보관하려면 별도의 조치가 필요.

- name: 액션의 이름
- run-name: 액션이 실행될 때 구별할 수 있는 타이틀명. github.actor를 활용해 어떤 사람이 해당 액션을 트리거 했는지 정도를 구별하는데 쓸 수 있다. 만약 설정돼 있지 않다면 PR 이름이나 마지막 커밋 메시지 등이 출력
- on: 언제 이 액션을 실행할지 정의
- jobs: 해당 액션에서 수행할 잡. 여러개 가능. 병렬실행

  - jobs.build
    - build는 GitHub Actions의 예약어가 아닌 임의로 지정한 이름. name과 같은 역할을 한다.
    - 이 파일에는 jobs에 1개 이상의 작업이 있는데 그 중 하나의 작업이 build라는 것.
    - jobs의 하위 항목이므로 반드시 들여쓰기
  - jobs.build.runs-on

    - 어느 환경에서 해당 작업이 실행될지 결정
    - 별도의 러너를 설정하고 싶지 않고 깃헙에서 제공하는 서버를 쓰고 싶다면 ubuntu-latest를 선언
    - 커스텀 러너를 쓰고 싶다면 해당 러너명 지정. 저장소의 Settings > Actions > Runners에서 추가할 수 있다.

  - jobs.build.steps: 해당 job에서 순차적으로 수행할 작업
    - uses: actions/checkout@v3
      - 해당 스텝에서 actions/checkout@v3를 사용해 작업하겠다는 것.
        - checkout: 코드를 내려받는(Clone/Checkout) 기능을 수행하는 도구의 이름입니다.
        - @v3: 이 도구의 버전 3을 사용하겠다는 뜻입니다.
      - actions/checkout@v3는 깃헙에서 제공하는 기본 액션. 별도 파라미터를 제공하지 않으면 해당 브랜치의 마지막 커밋을 기준으로 체크아웃한다.
    - uses: actions/setup-node@v3
      - 해당 스텝에서 actions/setup-node@v3를 사용해 작업하겠다는 것.
      - actions/setup-node@v3 역시 깃헙에서 제공하는 기본 액션. 해당 러너에 Node.js를 설치한다.
      - with.node-version.16 처럼 어떤 버전을 설치할지 지정. 해당 프로젝트가 배포되는 Node.js버전에 맞춰 작성
    - name: 'install dependencies'
      - 해당 스텝의 명칭 지정.
      - working-directory: 터미널의 cd 명령과 비슷한 역할. 뒤이어 수행할 작업을 해당 디렉터리에서 수행하겠다는 뜻. 루트에서 실행해도 된다면 따로 지정하지 않아도 된다.
      - run: 수행할 작업 명시.
    - name: 'build'
      - 빌드 작업 수행. npm run build를 실행해 프로젝트 빌드

- 액션 작성
  - npm이 아닌 yarn이나 pnpm을 쓴다면 pnpm/action-setup, borales/actions-yarn
  - 별도의 서버를 구축하고 젠킨스를 설치할 필요도 없이 저장소에 yaml 파일 하나 추가하는 것만으로 CI를 구축
  - 빌드 CI 뿐 아니라 actions/github-script를 사용해 깃헙 API를 직접 호출해 깃헙 PR에 댓글을 달거나 일정시간마다 특정한 작업을 수행, 배포 서비스와 연동해 자동으로 배포를 실행하거나 저장소 내부에 이미지가 추가될 때마다 이미지를 최적화 등
- 브랜치 보호 규칙
  - 항상(특히 main브랜치) 테스트, 빌드와 같은 CI가 성공한 코드만 푸시될 수 있어 코드의 정합성을 확보할 수 있다.
  - Require status checks to pass before merging: 우리가 정한 테스트나 자동화 검사가 성공(Pass)하지 않으면 절대 Merge(합치기) 버튼을 못 누르게 막겠다
  - status checks that are required: 꼭 실행돼야 하는 액션 파일명을 선택하고 저장하면 해당 액션이 성공하기 전까지는 머지를 막을 수 있다.
  - Do not allow bypassing the above settings: 한 규칙들을 그 누구도(심지어 관리자라도) 예외 없이 지켜야 한다

#### 직접 작성하지 않고 유용한 액션과 깃헙 앱 가져다 쓰기

- 깃헙에서 제공하는 기본 액션

  - 다른 액션을 만들 때 쓰이는 주요 액션
  - actions/checkout
    - 깃헙 저장소를 체크아웃하는 액션
    - 일반적으로는 아무런 옵션 없이 사용해 해당 액션을 트리거한 최신 커밋을 불러오지만 ref를 지정해 특정 브랜치나 커밋을 체크아웃할 수도 있다.
    - checkout: 내 소스 코드를 가상 컴퓨터(서버)로 복사해오는 작업
      - GitHub Actions가 실행될 때, GitHub은 우리에게 깨끗한 상태의 가상 컴퓨터(Runner)를 한 대 빌려줍니다. 하지만 이 가상 컴퓨터는 처음에 텅 비어 있습니다.
      - 1. GitHub 서버 어딘가에 내 소스 코드가 저장되어 있습니다. 2. 새로 빌린 가상 컴퓨터에는 아직 내 코드가 없습니다. 3. 코드가 없으니 테스트를 하거나 배포를 할 수가 없겠죠? 4. 그래서 "GitHub에 있는 내 코드를 이 가상 컴퓨터로 가져와!"라고 명령하는 것이 바로 actions/checkout입니다.
      - 만약 YAML 파일에서 checkout 단축 스텝을 빼먹는다면, 다음 단계인 setup-node에서 Node.js를 설치하더라도 정작 실행할 코드가 없어서 에러가 발생합니다.
  - actions/setup-node
    - Node.js를 설치하는 액션
  - actions/github-script
    - Github API 가 제공하는 기능을 사용할 수 있도록 도와주는 액션
    - GitHub API를 이용하면 깃헙에서 할 수 있는 대부분의 작업을 수행할 수 있으므로 한번쯤 API 문서 확인
  - actions/stale
    - 오래된 이슈나 PR을 자동으로 닫거나 더이상 커뮤니케이션 하지 못하도록 닫는다.
  - actions/dependency-review-action
    - 의존성 그래프에 대한 변경, 즉 package.json, package-lock.json, pnpm-lock.yaml 등 내용이 변경됐을 때 실행되는 액션
    - 의존성을 분석해 보안 또는 라이선스에 문제가 있다면 이를 알려준다.
  - github/codeql-action
    - 깃헙의 코드 분석 솔루션인 code-ql을 활용해 저장소 내 코드의 취약점을 분석.
    - languages에 javascript만 설정해 두면 자바스크립트와 타입스크립트를 모두 검사

- GitHub Actions는 누구나 자신이 만든 액션을 GitHub Marketplace에 공유할 수 있는 생태계를 가지고 있습니다. 그래서 actions/로 시작하지 않는 것들은 대부분 전 세계의 개인 개발자나 기업들이 만들어 올린 것들입니다.

- calibreapp/image-actions

  - 저장소에 포함돼 있는 이미지를 최적화하는 액션
  - 이미지들은 사용자에게 불편함을 주지 않는 선에서 가장 작은 파일로 관리될 필요가 있다.
  - PR로 올라온 이미지를 sharp패키지를 이용해 거의 무손실로 압축해서 다시 커밋해준다.
  - Next.js같은 경우 이미 next/image로 이미지를 최적화하고 있지만 저장소 자체의 이미지 크기를 줄인다면 pull할때 부담 또한 덜 수 있어 유용하다.

  - 마찬가지로 저장소를 checkout해서 calibreapp/image-actions라는 액션을 실행.
  - 이 액션은 이미지를 가져다가 새롭게 커밋해야 하므로 액션이 커밋을 할 수 있도록 권한을 줘야한다. 이 권한을 제공하려면 githubToken: ${{secrets.GITHUB_TOKEN}}을 추가하면 된다.
  - ignorePaths에 파일을 기재하면 해당 파일에 대해서는 압축을 건너뛸 수도 있다.
  - 액션이 실행되면 풀 리퀘스트에 clibreapp/image-actions가 수행한 작업을 요약해 댓글을 달아준다.
  - github-actions라는 봇이 커밋과 댓글을 실행

- lirantal/is-website-vulnerable

  - 특정 웹사이트를 방문해 해당 웹사이트에 라이브러리 취약점이 존재하는지 확인하는 깃헙 액션. 배포된 웹사이트를 주기적으로 스캔해 취약점이 있는지 확인할 수 있다.
  - 개발자의 컴퓨터에서 설치만 되고 실제 배포에 포함되지 않은 devDependencies나 번들링 과정에서 트리쉐이킹으로 사라진 코드는 취약점으로 진단되지 않는다.
  - npx로도 실행 가능. npx를 실행하는 액션을 만들어 사용할수도 있다.
  - 푸시가 일어났다고 반드시 배포가 실행되거나, 혹은 배포가 실행됐다고 해도 아직 배포가 끝나기 전일수도 있기때문에 배포 액션 잡 중 하나에 needs: \*\*\* 구문을 추가해 배포 잡이 끝난 이후에 실행하게 하거나 혹은 별도의 액션을 추가해 on.workflow_run으로 실행.

- Lighthouse CI p563~566
  - 구글에서 제공하는 액션. 웹 성능 지표인 라이트하우스를 CI를 기반으로 실행할 수 있도록 도와주는 도구
  - 이 깃헙 액션을 활용하면 프로젝트의 URL을 방문해 라이트하우스 검사를 실행한다.
  1. lighthouse CI 홈페이지 > Configure 에서 해당 깃헙 앱이 사용하고자 하는 저장소의 권한을 얻는다.
  2. 액션 작성
  - 저장소 checkout, Node.js설치, 설치 후 빌드
  - lhci 설치해 실행
  - LHCI_GITHUB_APP_TOKEN 이라는 환경 변수에 ${{secrets.LHCI_GITHUB_APP_TOKEN}}을 넣는다. 이렇게 토큰을 넣으면 lhci가 PR이나 액션에 권한을 얻어 사용자에게 결과를 보여줄수 있다.
  - lhci를 실행하는데 필요한 설정 파일 추가
    - numberOfRuns: 몇 차례 분석할지 설정.
    - 설정을 통해 라이트하우스 실행 결과가 일정 점수 미만이 되면 테스트 코드의 assert비슷하게 에러를 발생시키거나 혹은 자체 라이트하우스 분석 서버를 만들어 별도로 분석 프로세스를 실행할 수 있다.

#### 깃허브 Dependabot으로 보안 취약점 해결하기

- Dependabot으로 의존성에 문제가 있다면 이에 대해 문제를 알려주고 가능하다면 해결할 수 있는 풀 리퀘스트까지 열어준다.

- package.json의 dependencies 이해하기

  - 버전

    - 유의적 버전(semantic versioning; SemVer)
      - 버전은 주(Major Version), 부(Minor), 수(Patch) 로 구성돼 있다.
        - 주 버전: 기존 버전과 호환되지 않게 API 변경
        - 부 버전: 기존 버전과 호환되면서 새로운 기능 추가
        - 수 버전: 기존 버전과 호환되면서 버그 수정
    - 특정 버전으로 패키지를 배포하고 나면 그 버전의 내용은 절대 변경하지 말아야 한다. 변경사항이 있다면 반드시 새로운 버전으로 배포한다.
    - 주 버전 0(0.y.z)은 초기 개발을 위해 쓴다. 이 버전은 아무 때나 마음대로 바꿀 수 있다. 이 공개 API는 안정판으로 보지 않는게 좋다.
      0.7.0이 0.8.0으로 0으로 올라갔다면 기능 뿐 아니라 API스펙이 변경됐을 수도 있다. 시작하는 실험 버전 라이브러리는 항상 사용할 때 주의.
    - 수 버전은 반드시 그 이전 버전 API와 호환되는 버그 수정의 경우에만 올린다. 버그 수정은 잘못된 내부 기능을 구치는 것. 만약 버그 수정이 API스펙 변경을 동반한다면 반드시 주 버전을 올려야한다. 만약 주 버전을 올리는 것이 껄끄럽다면 해당 API를 지원 중단(deprecated)처리하고 새로운 API를 만들어 부 버전을 올린다.
    - npm 버전 규칙
      - react@16.0.0
        - 버전앞에 아무런 특수 기호가 없다면 정확히 해당 버전에 대해서만 의존하고 있다는 뜻
      - react@^16.0.0
        - 16.0.0과 호환되는 버전. 0보다 높은 부 버전에 대해서는 호환된다는 가정하에 상위 버전을 설치할 수 있다는 것
        - 즉, 여기서 가능한 버전은 16.0.0 이상 17.0.0 미만
        - 주 버전이 0인 경우에는 부 버전이 올라가도 API변경이 있을 수 있으므로 수 버전까지만 수용
      - react@~16.0.0
        - 패치 버전에 대해서만 호환되는 버전
        - 16.0.0 부터 16.1.0 미만
    - 한가지 염두해야할 점은 유의적 버전은 어디까지나 개발자들 간의 약속일 뿐 정말 해당 API의 버전이 유의적 버전에 맞춰 구현돼 있는지는 알 수 없다. 잦은 일은 아니라 크게 걱정할 필요는 없지만 버전을 올리거나 설정할 때는 주의를 기울여야한다.

  - 의존성
    - package.json의 dependencies
      - npm 프로젝트를 운영하는 데 필요한 자신 외의 npm 라이브러리를 정의해 둔 목록
      - JSON 형식으로 작성돼 있다.
      - dependencies
        - npm install 패키지명을 실행하면 dependencies에 추가
        - 해당 프로젝트를 실행하는데 꼭 필요한 패키지가 여기에 선언된다.
        - 예) react, react-dom, next
      - devDependencies
        - npm install 패키지명 --save-dev 을 실행하면 devDependencies에 추가
        - 해당 프로젝트를 실행하는데 필요하진 않지만 개발 단계에서 필요한 패키지
        - eslint, jest, typescript
      - peerDependencies
        - 서비스보다는 라이브러리와 패키지에서 자주 쓰이는 단위. 주로 플러그인이나 라이브러리의 확장 도구를 만들 때 사용
        - 직접적으로 해당 패키지를 require하거나 import하진 않지만 호환성으로 인해 필요한 경우를 의미
        - 내가 이 라이브러리를 쓰려면, 너(사용자)의 프로젝트에 '이 패키지'가 반드시 깔려 있어야 해!"라고 선언하는 것
        - 사용자의 환경이 peerDependencies에 선언된 버전 조건에 맞지 않으면 에러 또는 강력한 경고가 발생
    - 최근에는 애플리케이션 실행에 필요한 패키지를 구분하는 것에 의문을 제기하기도 한다.
      - 번들러의 존재
        - devDependencies로 설치한것이든 dependencies로 설치한 것이든 모두 node_modules에 동일하게 설치한다.
        - 이 중에서 실제 서비스에 배포해야하는 라이브러리인지 결정하는 것은 번들러다.
        - 번들러가 코드의 시작점에서부터 각 파일간의 종속성을 판단한 다음 필요한 파일을 빌드 과정을 거쳐 하나의 결과물로 만든다.
        - 즉, dependencies와 devDependencies 간 차이가 애플리케이션 최종 결과물에는 전혀 영향을 미치지 않는다.
      - 복잡해진 개발 파이프라인
        - dependencies와 devDependencies의 경계가 적어도 프론트엔드에서는 모호해지고 있다.

- Dependabot으로 취약점 해결하기 p573
  - 의존성에 숨어있는 잠재적인 위협을 깃헙을 통해 확인하고 조치
    - 대부분 의존성은 package.json보다는 package-lock.json에 숨어 있는 경우가 많다.
    - 패키지가 어디 설치돼 있는지 확인해보려면 ` npm ls 패키지명` (설치된 패키지가 왜 어떤 의존성 때문에 설치됐는지 확인할 수 있다)
    -
  - Dependabot은 취약점을 critical, high, moderate, low 4단계로 분류
  - 취약점 파일 경로
    - dependencies에 직접 명시한 경우 package.json이 발견
    - dependencies가 의존하고 있는 패키지에서 발견되는 경우 lock 파일이 명시
  - Review security updates 버튼
    - 취약점을 바로 수정할 수 있는 경우 표시되는 버튼
    - 단순히 패키지의 취약점을 검사해주는 것 뿐만 아니라 취약점을 수정할 수 있다면 이렇게 풀 리퀘스트도 생성해준다.
    - 풀 리퀘스트를 열어 줬다는 것은 이미 취약점을 해결한 패치가 존재한다는 것
    - dependabot이 수정 가능하다고 판단하는 경우에만 PR이 생성되면 그렇지 않은 경우에는 취약점만 알려준다.
    - dependabot이 제안하는 모든 풀 리퀘스트를 바로 머지해서는 안된다. 유의적 버전에 따라 주버전을 올리는 것은 무작정 머지해서는 안된다.
  - CVE(Common Vulnerabilities and Exposures): 공개적으로 알려진 컴퓨터 보안 결함 목록
  - 취약점이 있는 패키지가 존재해도 취약점이 발생하는 시나리오로 사용하지 않는다면 문제가 없다.
  - 패키지 내부에 선언된 의존성을 강제로 올릴 수 있는 방법은 npm이 제공하는 overrides를 활용하는 것.
    - package.json에 overrides를 선언해두면 패키지 내부의 버전을 강제로 올릴 수 있다.
    - dependabot으로 수정하기 어려운 이슈라면 npm의 overrides를 적극 활용해보자.
  - 의존성 관련 이슈를 방지하는 가장 좋은 방법은 의존성을 최소한으로 유지하는 것. 즉, dependencies의 node_modules 크기가 커질수록 위험에 노출될 확률 또한 높아진다. → 가능한 한 내재화할 수 있는 모듈은 내재화하고 의존성을 최소한으로 유지
  - 의존성을 최소화할 수 없고 내재화할 수 있는 모듈이 많지 않다면 가능한 한 널리 알려져 있고 많은 사람들이 사용하며 활발하게 유지보수되는 패키지를 사용. 아무리 사용자가 많아도 유지보수하는 주체가 엇다면 점차 의존성 문제에 당면.

### 리액트 애플리케이션 배포하기

- 인터넷 망에 배포 방법
  - 자체적인 IT 인프라가 구축돼 있어 해당 인프라 사용
  - 자체 인프라 구축하기 어려운 경우 클라우드 서비스 활용; AWS, 구글 클라우드 플랫폼, 마이크로소프트 애저(Azure) 등
  - 소규모 프로젝트는 대형 클라우트 플랫폼에서 배포 하이프라인 구축하거나 별도의 서버를 마련하지 않아도 SaaS 서비스로 배포 가능

#### Netlify

- 배포를 돕는 클라우드 컴퓨팅 서비스. 정적 웹사이트 배포 서비스
- 빌드, 배포 관련 설정
  - Base directory: 배포 명령어를 실행할 기본 디렉터리
  - Publish directory: 실제 서비스에 필요한 정적 리소스가 위치한 디렉터리
- 기본적으로 Netlify는 정적 웹사이트를 배포하고 서비스하기 위해 탄생한 반면 Next.js는 일반적으로 서버가 필요한 서버사이드 애플리케이션을 서비스하므로 Next를 배포할때는 추가 설정이 필요하다.

  - 가장 먼저 할 일은 Next.js애플리케이션 루트에 netlify.toml 파일 생성

    - TOML(Tom's Obvious, Minimal Language) 최소한의 설정 관련 내용을 작성하기 위해 만들어진 문법. YAML과 매우 유사한 구조
    - 생성한 파일에 아래 내용 기재하고 커밋

    ```
    [[plugins]]
    package = "@netlify/plugin-nextjs"

    ```

- 추가 기능
  - 알림: 배포와 관련된 알림
  - 서비스 통합: 다양한 서비스와 API가 마켓 형태로 제공된다. 오류 수집 툴인 Sentry, 가벼운 검색 도구인 Aloglia, 키-값 구조의 비정형 데이터를 저장할 수 있는 레디스 등.
  - 서버리스 함수: 별도의 서버 구축 없이 서버에서 실행될 함수를 만들 수 있다.
  - Identity: Identity서비스를 이용하면 사용자를 초대해 가입시키고 특정 API를 활용해 해당 유저에 대한 인증 처리 가능
  - 사용자 초대

#### Vercel

- framework preset에서 반드시 원하는 프레임워크 선택. 플러그인을 설치해야 했던 Netlify와 달리 vercel은 Next.js서비스를 별도 설정 없이 배포.
- 추가 기능
  - 알림: 프리뷰 배포, 실제 배포 성공 실패 여부도 볼 수 있다.
  - 서버리스 함수: 마찬가지로 서버 없이 함수를 클라우드에 구축해 실행할 수 있는데 한가지 특이한 점은 Next.js에서 제공하는 /app/api, /pages/api 내용도 이 함수로 구분되어 접근 로그나 오류 등을 확인할 수 있다는 것이다. 이는 vercel이 Next.js의 API를 별도의 서버리스함수로 인식하기 때문.
  - 다양한 탬플릿: 별도의 코드 작성 없이도 구축할 수 있는 기본적인 웹사이트를 제공
  - 이미지 최적화는 1000개로 제한
  - 서버리스함수의 총 실행시간 100GB, 10초 이내로 제한(10초 이상 걸리는 함수는 자동으로 타임아웃 처리)

#### DigitalOcean

- 미국 클라우드 컴퓨팅, 호스팅 플랫폼
- 다양한 리소스에 대해 문서화가 매우 상세.
- 추가 기능
  - 알림
  - 컨테이너에 직접 접근: 실제 서비스가 실행되고 있는 컨테이너에 직접 접근하는 기능 제공
  - 마켓플레이스: 앞선 두 서비스와 다르게 컨테이너 제공에 초점이 맞춰져 있는 앱이 많다.
- Vercel, Netlify는 정적인 웹사이트 배포에 초점을 두고 있다면 DigitalOcean은 AWS와 Google Cloud Platform과 비스하게 좀 더 다양한 클라우드 컴퓨팅 서비스 제공
  - Droplets: 리눅스 기반 가상머신을 쉽게 생성하고 운영할수 있게 해준다.
  - Functions: 서버리스 함수를 생성하고 이를 클라우드 환경에서 실행할 수 있게 해준다.
  - Kubernetes: 쿠버네티스를 이용해 클러스터를 생성하고 이를 관리할 수 있다.
  - Database와 Spaces: 데이터베이스를 생성하거나 정적 파일을 업로드할수 있는 스토리지 제공

### 리액트 애플리케이션 도커라이즈하기

- vercel 등 배포: 블로그 등 트래픽이 적은 개인용 프로젝트나 테스트용, admin페이지나 MVP 프로젝트에는 적합하지만 본격적으로 사용자에게 서비스하기 위한 웹 애플리케이션을 서비스하기에는 적절하지 않다.
  - 특정 배포 서비스에 종속적
  - 어플리케이션을 커스터마이징하는 데 제약
  - 유연하지 못한 비용 체계도 문제
- 애플리케이션을 하나의 컨테이너로 만들어서 빠르게 배포
  - 도커: 서비스 운영에 필요한 애플리케이션을 격리해 컨테이너로 만드는데 이용하는 소프트웨어
  - 어디서든 실행될 수 있는 이미지 상태로 애플리케이션을 준비해 둔다면, 도커 이미지를 실행할 수 있는 최소한의 환경이 갖춰진 상태라면 어디서든 웹 애플리케이션을 배포할 수 있다.

#### 리액트 앱을 도커라이즈 하는 방법

- 도커: 개발자가 모던 애플리케이션을 구축, 공유, 실행하는 것을 도와줄 수 있도록 설계된 플랫폼. 도커는 지루한 설정 과정을 대신해 주므로 코드를 작성하는 일에만 집중할 수 있다.
- 도커라이즈: 애플리케이션을 도커 이미지로 만드는 과정. 애플리케이션을 신속하게 구축해 배포할 수 있는 상태로 준비하는 것.
- 도커는 애플리케이션을 빠르게 배포할 수 있도록 애플리케이션을 '컨테이너'라는 단위로 패키징하고,
  이 '컨테이너' 내부에서 애플리케이션이 실행되도록 도와준다.

- 도커 용어

  - 이미지: 컨테이너를 만드는데 사용되는 템플릿. Dockerfile을 빌드하면 이미지를 만들 수 있다.
  - 컨테이너: 도커의 이미지를 실행한 상태. 이미지가 목표하는 운영체제, 파일 시스템, 각종 자원 및 네트워크 등이 할당되어 실행될 수 있는 독립된 공간 생성
  - 태그: 이미지를 식별할 수 있는 레이블 값. `이미지명:태그명` 예) `ubuntu:latest`
  - 리포지터리: 이미지를 모아두는 저장소.
  - 레지스트리: 리포지터리에 접근할 수 있게 해주는 서비스. 레지스트리에는 다양한 리포지터리가 있으며, 리포지터리에서 자신이 원하는 이미지를 내려받아 사용. 예) 도커 허브

- 자주 쓰는 도커 cli 명령어

  - docker build -t foo:bar ./
    - 현재 ./에 있는 Dockerfile을 기준으로 이미지를 빌드
    - 해당 이미지명에 foo:bar 라는 태그를 붙인다.
  - docker push sgoldenbird/foo:bar
    - 이미지나 리포지터리를 도커 레지스트리에 업로드
    - sgoldenbird 사용자 계정에 foo:bar 이미지 푸시
    - 별도 설정 되어있지 않다면 기본적으로 도커 허브에 업로드
  - docker tag 원본이미지:태그 변경할이미지:태그
    - 이미지에 태그 생성
    - 이름을 수정하는게 아니라 기존 이미지에 새로운 태그를 붙이는 것. 즉, 동일한 이미지에 두개의 태그가 생긴 것.
      하나를 삭제하더라도 동일 이미지의 다른 태그에는 영향을 미치지 않는다.
  - docker inspect {이미지명|컨테이너명}
    - 세부 정보를 원하는 이미지명이나 컨테이너명
  - docker run
    - 이미지를 기반으로 새로운 컨테이너를 생성
  - docker ps
    - 현재 가동중인 컨테이너 목록을 확인할 수 있는 명령어
    - --all과 함께 실행한다면 현재 가동 중이지 않은 멈춘 컨테이너도 확인할 수 있다.
  - docker rm {이미지명}
    - 컨테이너 삭제
    - 실행중인 컨테이너를 삭제하려면 docker stop {이미지명} 으로 해당 컨테이너를 중지시키고 삭제

- Dockerfile에서 명시된 내용을 바탕으로 이미지를 빌드하고, 컨테이너라는 가상화 환경에서 웹 애플리케이션을 제공. 이 이미지만 있다면 도커를 실행할 수 있는 모든 환경에서 동일한 애플리케이션을 실행할 수 있다.

##### create-react-app을 위한 Dockerfile 작성하기

- 도커 이미지에서 해야할 작업 → Dockerfile에 기재

  - 운영체제 설정
    - 커널(kernel): 운영체제의 핵심 프로그램으로, 하드웨어와 프로그램 사이에서 모든 걸 중재하는 관리자
    - 도커 컨테이너도 결국 리눅스(커널) 위에서 도는 프로세스
    - 도커에서 운영체제 설정이란 커널 위에서 돌아갈 user space 환경을 준비하는 일
  - Node.js 설치: npm 프로젝트를 구동하려면 Node.js필요.
  - npm ci: 프로젝트 빌드에 필요한 의존성 모듈 설치
  - npm run build
  - 실행: 실행과정은 애플리케이션 성격에 따라 조금씩 다를 수 있다.

- 프로젝트 루트에 Dockerfile 생성, 작성

```
FROM node:18.12.0-alpine3.16 as build

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

RUN npm ci

COPY . ./

RUN npm run build
```

- FROM node:18.12.0-alpine3.16 as build
  - FROM은 이 이미지가 어떤 베이스 이미지(이 이미지를 실행하는 데 필요한 이미지)에서 실행될지를 결정
    - 도커는 어떤 이미지 위에 또 다른 이미지를 생성할 수 있다.
    - 이 베이스 이미지 한 줄 만으로 운영체제를 설치하는 복잡한 과정 없이도 바로 원하는 운영체제를 사용할 수 있다.
  - alpine 3.16 버전의 운영체제 위에서 실행되는 이미지
    - alpine: 알파인 리눅스. 일반적인 리눅스와는 다르게 훨씬 가별고 깔끔한 리눅스. 일반적으로 컨테이너를 실행하기 위한 운영체제로 사용.
  - 이 이미지는 도커허브에서 다운로드해서 가져온다. 도커 허브에서 node:18.12.0-alpine3.16 이라는 이미지를 사용하겠다는 뜻
  - as build: 이 베이스 이미지를 build라고 하는 스테이지(단계)에서만 쓰겠다.
- WORKDIR /app
  - 작업을 수행하고자 하는 기본 디렉터리
- COPY package.json ./package.json
  - package.json을 ./package.json으로 복사
  - 복사 위치는 기본 디렉터리(여기서는 ./app)
- RUN npm ci
  - RUN을 실행하면 컨테이너에서 명령어를 실행할 수 있다. 여기서는 의존성 설치 명령어인 npm ci를 실행
- COPY . ./
  - 빌드를 위해서는 src, node_modules 등 대부분의 리소스가 필요하므로 COPY . ./으로 모든 리소스를 복사
- RUN npm run build
  - 빌드에 필요한 리소스를 복사했으므로 빌드 명령어를 통해 애플리케이션을 빌드
- `docker build . -t cra:test`
  - 작성한 도커 이미지 빌드
  - 해당 위치 .에서 빌드 수행
  - -t로 이름과 태그 부여
- Node:18.12.0-alpine3.16 을 만든 Dockerfile 추가, 변경
  - 빌드된 웹 애플리케이션을 NGINX가 서비스할 수 있도록 설정
  - 이미지를 실행했을때 해당 웹페이지에 접근할 수 있어야 한다.
  - 웹페이지 접근에 필요한 빌드 파일만 남겨두고 용량을 최소화한다.

```
FROM nginx:1.23.3-alpine as start

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/build /user/share/nginx/html

EXPOSE 3000

ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

- FROM nginx:1.23.3-alpine as start
  - 앞서 애플리케이션을 빌드하기 위해 Node.js18버전을 사용하기 위한 알파인리눅스를 사용했다면,
    이번에는 빌드된 정적 파일을 서비스하기 위해 최신 버전의 NGINX가 설치된 알파인 리눅스를 설치.
    NGINX만 설치된 리눅스는 훨씬 가별고 정적 파일 서비스에 필요한 것들만 포함돼 있으므로 더욱 효율적이고 빠르다.
- COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
  - 빌드한 파일을 NGINX가 서비스할 수 있도록 설정 파일 복사
- COPY --from=build /app/build /user/share/nginx/html
  - --from=build: 앞서 FROM... as build로 선언한 단계
  - build 단계에서 복사해 오는데, 여기서 /app/build만 가져온다. (필요한 리소스만 가져와 start 단계에서 사용)
  - 현재 단계인 start의 원하는 위치 /user/share/nginx/html에 복사한다.
- EXPOSE 3000
  - EXPOSE로 열어둔 포트는 나중에 도커 이미지를 실행할 때 호스트 운영체제에서 오픈된다.
  - 이미지 실행을 위해서는 먼저 EXPOSE로 명시한 포트를 열어야 한다. (포트 설정)
- ENTRYPOINT ["nginx", "-g", "daemon off;"]
  - 컨테이너가 시작됐을 땜 어떤 명령을 실행할 지 결정
  - Dockerfile 내부에서 단 한 번 실행할 수 있으며 여기서는 NGINX 데몬을 시작
- 해당 웹사이트에 접속하면 컨테이너 로그에서 접속 관련 로그가 출력된다.

##### vite를 위한 Dockerfile 작성하기

- Dockerfile 구조는 거의 동일하고, 바뀌는 건 빌드 명령과 결과 디렉터리뿐. 차이의 핵심은 build vs dist 디렉터리

```dockerfile
# =========================
# 1️. Build stage
# =========================

FROM node:18-alpine AS build
# AS는 대문자여도 되고, 소문자여도 된다.

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
# Vite는 결과물이 /app/dist 에 생성됨

# =========================
# 2️. Run stage
# =========================
FROM nginx:alpine AS start

COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]


```

3. Vite용 NGINX 설정(Vite + React는 SPA라서 반드시 필요)

```nginx

events {}

http {
  server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
      try_files $uri $uri/ /index.html;
    }
  }
}

이거 없으면
/about
/login
같은 라우트 404 터짐

```

4. 빌드 & 실행
   `docker build -t vite-app .`
   `docker run -p 3000:80 vite-app`

- -p [호스트 포트]:[컨테이너 포트]
  - 3000 → 내 컴퓨터의 포트
  - 80 → 컨테이너 안에서 열려 있는 포트
- 호스트 3000번 포트 → 컨테이너 80번 포트: 내 컴퓨터(호스트)의 3000번 포트로 들어온 요청을 컨테이너 안의 80번 포트로 전달하겠다

  - “호스트”랑 “컨테이너”는 서로 다른 세계

  ```
  [ 내 컴퓨터 (Host) ]
    └── 브라우저 (localhost:3000)

  [ Docker Container ]
    └── NGINX (80번 포트에서 대기)
  ```

- 실제 흐름: 브라우저는 호스트 포트만 보고, Docker가 그걸 컨테이너 포트로 연결해준다
  - 브라우저에서 http://localhost:3000 입력
  - 호스트 OS(내가 지금 쓰고 있는 운영체제)가 3000번 포트에서 요청 받음. 즉, 브라우저가 localhost:3000으로 HTTP 요청을 보내면
    그 요청이 먼저 내 컴퓨터(OS)에 도착한다. “3000번 포트 열려 있어? 여기로 요청 보낼게”
    - 이 순간 요청은 아직 컨테이너에 안 들어감. 그냥 OS 네트워크 스택에 도착한 상태
  - Docker가 포트 포워딩 `3000 → (Docker) → 컨테이너 80`
  - 컨테이너 안 NGINX가 응답
  - 응답이 다시 브라우저로 돌아옴

```
호스트 OS (3000)
   ↓
Docker 포트 포워딩
   ↓
컨테이너 내부 (80)
      ↓
  NGINX (80번 포트에서 대기 중) → HTML 응답

```

##### create-next-app을 위한 Dockerfile 작성하기

- Next.js 프로젝트는 대게 단순하게 빌드된 파일을 올리는 수준이 아니라 서버 실행이 필요하다.

1. 마찬가지로 먼저 프로젝트 루트에 Dockerfile 생성, 작성

```dockerfile
FROM node:18.12.0-alpine3.16 as deps
// 해당 스테이지는 deps로 명명

WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json
// 프로젝트 빌드에 필요한 package.json, package-lock.json을 설치해 node_modules 생성

RUN npm ci


```

```dockerfile
FROM node:18.12.0-alpine3.16 as build

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
// deps에서 생성한 node_modules를 복사해 사용
COPY . ./

RUN npm run build
```

2. 이렇게 빌드한 이미지를 실행하기 앞서, next.config.js에 아래 내용 추가

- output: Next.js에서 빌드를 위해 제공하는 기능. 이 옵션이 추가되면 Next.js는 프로덕션에서 실행에 필요한 파일들만 모아서 바로 실행할 수 있는 준비를 대신 해준다.

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: "standalone",
};

module.exports = nextConfig;
```

3. standalone으로 빌드

- .next/standalone에 실행에 필요한 프로젝트가 따로 꾸려지고
- server.js 생성: Next.js가 자동으로 만들어주는 최소한의 Node 서버 엔트리 포인트

```
.next/
 └─ standalone/
     ├─ server.js
     ├─ node_modules/   (실행에 필요한 것만)
     └─ .next/          (빌드 결과)

이 폴더만 있으면 Node.js로 서버를 바로 띄울 수 있는 상태

```

- 서버 구성을 살펴보면, next/dist/server/next-server 에서 NextServer를 꺼내온 다음, http.createServer로 만든 서버에 NextServer를 연동
- 이러한 점을 응용한다면 Koa나 Express같은 웹 프레임워크에 Next.js를 올려두고 실행해 별도의 Node.js 기반 서버를 운영하면서 동시에 Next.js도 서비스할 수 있을 것이다. → Next.js를 ‘독립 서버’로만 쓰지 않아도 된다는 뜻.
  Next.js standalone + Node 서버(Express/Koa)에 붙여 쓰는 구조
  - Next.js = 프론트엔드 서버 역할
  - Express/Koa = 전체 백엔드 서버 역할

4. runner 단계를 만들어서 standalone으로 만들어진 Next.js 실행

```
FROM node:18.12.0-alpine3.16 as runner

COPY --from=build /app/public ./public
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static

EXPOSE 3000

ENTRYPOINT ["node", "server.js"]
```

- 실행에 필요한 것

  - 이 Node.js 서버를 실행할 수 있는 alpine Node.js 이미지
  - /app/public 폴더에 있는 HTML을 비롯한 정적 리소스 정보
  - standalone 옵션으로 생성된 standalone 파일 내용
  - static 폴더의 정보
  - public폴더와 ./next/static 은 CDN으로 별도로 제공해도 되고, 이처럼 따로 복사해서 standalone 내부에서 찾아가도록 설정해도 된다.

- ENTRYPOINT로 node server.js를 실행해 이미지 실행 시 바로 Next.js가 실행되도록 설정

#### 도커로 만든 이미지 배포하기

- 도커로 만든 이미지를 클라우드 서비스에 업로드, 배포
- 리액트 어플리케이션을 도커라이즈하고 이를 푸시해 클라우드에서 실행
- 요즘 대부분의 기업들은 애플리케이션을 도커라이즈해서 배포하고, 각 이미지를 관리하고 보관하면서 배포관련 히스토리를 남겨두거나 빠르게 롤백하는 등의 용도로 도커를 사용

##### 도커 이미지 업로드하기

- 도커 허브에 도커 이미지 업로드(아마존 웹 서비스의 Elastic Container Registry, GCP의 Container Registry 등)

1. 저장소 생성
2. 이미지를 업로드하기 위한 로그인 정보(credential)를 얻고
3. 해당 원격 이미지 저장소의 이름에 맞게 도커 이미지 태그 변경

- 해당 이미지의 태그명이 `사용자명/저장소명:태그명` 형식으로 일치 → push to Hub

4. 이미지 push

##### 도커 이미지 실행하기

- 업로드된 이미지를 클라우드에서 실행
- Google Cloud Platform(GCP): 배포할 클라우드 플랫폼

사전 준비

1. GCP 가입
2. 프로젝트 생성

- 프로젝트: GCP에서 사용할 수 있는 분리된 가상공간(워크스페이스)

3. 사용자 기기에서 GCP를 제어할 수 있는 gcloud cli 설치
4. 계정 선택, 허용 → 로그인
5. 기본 프로젝트 지정

Google Cloud Registry에 이미지 푸시

1. 빌드된 도커 이미지 준비
2. Artifact Registry에 접속 → 저장소 만들기

- 해당 저장소의 주소가 우리가 push할 이미지 이름

3. 해당 저장소의 주소가 GCP를 향해 가야 한다는 것을 도커에 설정 (gcloud사용)

- gcloud auth configure-docker 뒤에 생성한 저장소 주소 입력

Cloud Run에서 이미지 실행

- Cloud Run: 푸시된 이미지를 클라우드 환경에서 손쉽게 실행할 수 있도록 도와주는 서비스

1. 서비스 만들기
2. Cloud Run 설정 (p647,648)

- 컨테이너 이미지 URL: 빌드할 컨테이너 이미지
- 서비스 이름
- 리전: 서비스를 배포할 지역(지역에 따라 가격차이 있음)
- CPU 할당 및 가격 책정: CPU 사용량에 따라 가격 정책이 다름
  - CPU가 요청 처리 중에만 할당
  - CPU가 항상 할당됨: 요청의 개수와 상관없이 인스턴스의 생명주기에 걸쳐 요금 부여
- 자동 확장(자동 스케일링): 요청과 처리에 따라 인스턴스 개수를 얼마나 탄력적으로 할당할지 선택
- 인그레스(Ingress): 허용할 트래픽 제어
- 인증 설정
- 컨테이너: 배포할 이미지 컨테이너에 대한 설정
- 실행환경
- 환경변수
- 보안비밀

3. 배포

- 참고로 애플의 실리콘 아키텍처(M1)를 탑재한 노트북에서 빌드한 이미지를 배포하려고 하면 배포에 실패한다.
  이는 빌드한 이미지의 플랫폼(CPU 아키텍처)이 달라서인데, 해당 이미지가 어떤 플랫폼인지 확인하려면 다음 명령어를 실행
  `docker inspect <이미지명 또는 이미지ID>`
  망약 ARchitecture가 amd64외에 다른것으로 돼 있다면(예: arm64) 해당 이미지는 Cloud Run환경에서 실행할 수 없다.
- Architecture를 amd64로 변경해 Cloud Run환경에서 실행할 수 있는 이미지로 만들기
  `docker build --platform linux/amd64 -t next:test .`

지속적 통합 설정(CI) p651

### 기타

- 도커 이미지: 실행 가능한 설계도 + 스냅샷

  - 이미지(Image): 어떤 상태를 그대로 얼려서, 언제든 다시 쓸 수 있는 것

    - 어떤 것의 모습을 그대로 떠낸 복사본
    - 상태를 고정한 결과물
    - 실행 가능한 형태의 완성본

    | 분야   | image 의미                     |
    | ------ | ------------------------------ |
    | OS     | OS image = 설치 가능한 OS 상태 |
    | VM     | VM image = 가상머신 스냅샷     |
    | Docker | 실행 환경 전체를 묶은 스냅샷   |

- GNU / Linux 정리
  - GNU (간단 설명)
    - GNU는 자유 소프트웨어로 운영체제를 만들자는 프로젝트(무료 소프트웨어가 아님)
      1. 어떤 목적이든 자유롭게 사용
      2. 소스코드를 보고 수정할 자유
      3. 복사해서 다른 사람에게 배포할 자유
      4. 수정한 버전을 다시 배포할 자유
    - 커널을 제외한 운영체제에 필요한 대부분의 기본 도구를 제공
    - 예: `bash`, `ls`, `cp`, `grep`, `gcc`

| 항목       | 설명                                                       |
| ---------- | ---------------------------------------------------------- |
| Linux 커널 | 프로세스, 메모리, 파일, 장치 등 시스템 자원을 관리         |
| GNU        | 커널 위에서 동작하는 기본 도구 모음 (bash, ls, cp, gcc 등) |
| GNU/Linux  | Linux 커널 + GNU 도구들이 결합된 완전한 운영체제           |

- Linux는 **운영체제가 아니라 커널**
- Linux 커널에 GNU 도구들이 합쳐져 **운영체제(OS)**가 만들어짐
- 엄밀히는 **GNU/Linux**가 맞지만 일상적으로는 그냥 **리눅스**라고 부른다

| 구분   | 정확한 의미                  | 설명                                                                     |
| ------ | ---------------------------- | ------------------------------------------------------------------------ |
| Linux  | 커널 (Kernel)                | 하드웨어와 프로그램 사이를 관리하는 운영체제의 핵심                      |
| Ubuntu | OS (Linux 커널 + user space) | Linux 커널 위에 GNU 도구, 라이브러리, 패키지 관리자 등을 결합한 운영체제 |
| Alpine | OS (Linux 커널 + user space) | Linux 커널 위에 경량 user space(musl, busybox 등)를 결합한 운영체제      |

- CRA vs Vite 핵심 차이 (Docker 기준)

| 구분        | CRA                | Vite                 |
| ----------- | ------------------ | -------------------- |
| 개발 서버   | webpack-dev-server | vite                 |
| 빌드 명령   | npm run build      | npm run build (같음) |
| 빌드 결과물 | `build/`           | `dist/`              |
| 배포 방식   | 정적 파일          | 정적 파일            |
| Docker 구조 | build → nginx      | build → nginx        |

- npm 레지스트리: Node.js로 만든 라이브러리를 다른 사용자들이 내려받아 설치해 사용할 수 있는 공간

- 쿠버네티스(Kubernetes): 여러 Docker 컨테이너를 자동으로 배치·관리·확장해주는 시스템

  - 쿠버네티스를 활용해 컨테이너 기반 애플리케이션을 좀 더 탄련적으로 배포하고 관리
  - Docker만 쓰면 이런 문제가 생길수 있다.
    - 컨테이너 10개 중 1개 죽음 → 누가 다시 살림?
    - 트래픽 폭증 → 컨테이너 몇 개 더 띄움?
    - 서버 3대에 컨테이너 배치 → 어디에 띄울지?
    - 배포 중 장애 → 롤백은?
  - Kubernetes가 해주는 핵심 역할 (위 문제들 자동으로 해결)
    | 기능 | 설명 |
    |------|------|
    | 컨테이너 실행 | Docker 컨테이너 실행 |
    | 자동 복구 | 컨테이너가 죽으면 자동으로 다시 실행 |
    | 스케일링 | 트래픽에 따라 컨테이너 개수 조절 |
    | 로드밸런싱 | 들어오는 요청을 여러 컨테이너로 분산 |
    | 배포 전략 | 롤링 업데이트, 롤백 지원 |

  - Kubernetes 기본 구조

  ```
  Cluster
  ├─ Node (서버)
  │   └─ Pod (컨테이너 묶음)
  │       └─ Container (Docker)


  클러스터(cluster): 여러 대의 서버를 하나의 시스템처럼 묶어 운영하는 단위
  Kubernetes 클러스터 = 컨테이너를 실행하기 위해 묶어둔 서버들의 집합
  ```

- Helm: Kubernetes용 패키지 매니저
- Helm Chart: Kubernetes 설정 묶음

  - 헬름 차트를 활용해 정적인 쿠버네티스의 템플릿을 상황에 맞게 관리할 수도 있다.

- 마이크로 서비스(Microservices, MSA): 거대한 하나의 애플리케이션을 기능별로 작게 쪼개서 만드는 개발 방식(아키텍처)

- npm: npm은 패키지를 '설치(Install)'하고 '관리'하는 도구
- npx: 패키지를 '실행(Execute)'하는 데 특화된 도구

  - 내 컴퓨터에 지저분하게 설치하지 않고 딱 한 번만 쓰고 싶을 때 유용

- ReDos(Regular Expression Denial of Service): 정규 표현식 서비스 거부 공격

  - 해커가 아주 복잡하게 설계된 문자열을 서버에 보냄으로써, 서버의 CPU 점유율을 100%로 치솟게 만들어 서비스가 마비(먹통)되게 만드는 보안 공격의 일종

- Glob 표현식: 파일 시스템에서 와일드카드 문자를 사용하여 여러 파일 이름을 한꺼번에 지정하는 패턴. \*.js
- 대역폭(Bandwidth): 주어진 시간 동안 네트워크 연결을 통해 보낼 수 있는 최대 데이터 양
