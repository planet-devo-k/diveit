# 1. Next.js로 리액트 개발 환경 구축하기

## 1. create-react-app 없이 하나씩 구축하기

- package.json 작성하기
  npm init을 실행하면 package.json을 만드는 CLI실행.
- Next.js를 실행하는데 필요한 react, react-dom, next 설치하기
- devDependencies에 필요한 패키지 설치하기
  - typescript, @types/react, @types/react-dom, @types/node, eslint, eslint-config-next

## 2. tsconfig.json 작성하기

npm 설정을 package.json에서 하는 것처럼 타입스크립트 설정은 tsconfig.json에 기록.

- 작성법
  ```jsx
  {
  	"$schema": "https://json.schemastore.org/tsconfig.json"
  }
  ```
  tsconfig.json을 작성하기전에 JSON 최상단에 $schema키와 위와 같은 값을 넣어야 해당 JSON파일이 무엇을 의미할 수 있는지, 어떤 키와 값이 들어갈 수 있는지 알려 줄 수 있음. 올바른 값이 선언되어 있다면 IDE에서 자동완성이 가능해짐
- 옵션들
  - compilerOptions: 타입스크립트 ⇒ 자바스크립트로 컴파일 할떄 사용하는 옵션
    - target : 타입스크립트가 변환을 목표로 하는 언어의 버전
    - lib : target보다 최신버전으로 설정해도 신규 기능에 대한 API정보를 확인할 수 있게 되어 에러가 발생하지 않음.
    - allowJs : 타입스크립트가 자바스크립트 파일 또한 컴파일할 지를 결정. js 와 ts 파일이 혼재됐을때 사용하는 옵션
    - skipLibCheck : 라이브러리에서 제공하는 d.ts에 대한 검사 여부를 결정. d.ts는 타입스크립트에서 제공하는 타입에 대한 정보를 담고있는 파일
    - strict: 타입스크립트 컴파일러의 엄격 모드를 제어함. 이 모드가 켜지면 다음 옵션도 true로 설정되는 것과 같음
      - alwaysStrict : 모든 자바스크립트 파일에 use strict를 추가한다
      - strictNullCheck : 엄격한 널 검사를 활성화. 이 옵션을 켜면 null과 undefined를 명확하게 구분해 사용할 수 있게 됨. 런타임 에러를 미연에 방지하므로 켜는 것을 권장
      - strictBindCallApply : 함수에 대해 사용할 수 있는 call, bind, apply에 대해 정확한 인수를 요구하는 옵션
      - strictFunctionTypes : 함수의 타입에 대해 엄격함을 유지
      - strictPropertyInitialization : 클래스 내부의 프로퍼티에 값을 할당할 때 값이 올바르지 않다면 에러발생
      - noImplicitAny : 타입을 명시하지 않은 변수가 있다면 any를 자동으로 할당하는 기능. 켜두면 any를 변수에 넣지 않고 에러 발생
      - noImplicitThis : this를 추론할 수 없는 상황에서 any를 자동으로 할당하는 기능. 켜두면 any를 할당하지 않고 에러 발생
      - useUnknownInCatchVariables : catch 구문에서 잡은 변수에 대해서는 기본적으로 any 할당. 4.0부터는 unknown을 할당.
    - forceConsistentCasingInFileNames : 이 옵션을 켜면 파일 이름의 대소문자를 구분하도록 강제. 이 옵션이 켜져 있으면 Signup과 SignUp은 다른 파일로 간주
    - noEmit : 컴파일을 하지 않고 타입 체크만 진행. Next.js는 swc가 타입스크립트 파일을 컴파일 하므로 굳이 타입스크립트가 자바스크립트로 컴파일 할 필요가 없음.
    - esModuleInterop: CommonJS 방식으로 보낸 모듈을 ES 모듈 방식의 import로 가져올 수 있게 해줌
      - CommonJS: module.exports…
    - module : 모듈 시스템 설정. 대표적으로 commonjs와 esnext가 존재. commonjs는 require를 사용하고 esnext는 import를 사용
    - moduleResolution: 모듈을 해석하는 방식을 설정. node는 node_module을 기준으로 모듈을 해석하고 classic은 tsconfig.json이 있는 디렉터리를 기준으로 모듈을 해석, node는 module이 CommonJS일 때만 사용할 수 있음.
    - resolveJsonModule : JSON파일을 import할 수 있게 해줌. 이 옵션을 켜두면 allowJs 옵션도 자동으로 켜짐
    - isolateModules : 타입스크립트 컴파일러는 파일에 import 나 export 가 없으면 단순 스크립트 파일로 인식해 이러한 파일이 생성되지 않도록 막음. 다른 모듈 시스템과 연계되지 않고 단독으로 있는 파일의 생성을 막기 위한 옵션
    - jsx : .tsx 파일 내부에 있는 JSX를 어떻게 컴파일할지 설정. 옵션별로 다음과 같이 파일이 변환
      - react : 기본값. React.createElement로 변환. 리액트 16까지 기본적인 변환 방식
      - react-jsx : 리액트 17에서 새롭게 등장한 방식. react/jsx-runtime을 사용해 변환하며, import React from ‘react’를 작성하지 않아도 됨
      - react-jsxdev : react-jsx와 동일하지만 디버깅 정보가 추가
      - preserve : 변환하지 않고 그대로 유지
      - react-native : 리액트 네이티브에서 사용하는 방식. 변환하지 않음
    - increamental : 이 옵션이 활성화 되면 타입스크립트는 마지막 컴파일 정보를 .tsbuildinfo 파일 형태로 만들어 디스크에 저장
    - baseUrl : 모듈을 찾을 때 기준이 되는 디렉터리를 지정. path와 함께 사용
    - paths : 경로에 별칭을 지정할 수 있음. 이 별칭은 보통 #이나 $같은 특수문자 접두사와 함꼐 자주 사용됨. @의 사용은 자제하는 것이 좋은데, @angular, @types와 같이 스코프 패키지에 널리 사용되기 떄문
    - include : 타입스크립트 컴파일 대상에서 포함시킬 파일 목록
    - exclude : 타입스크립트 컴파일 대상에서 제외시킬 파일 목록

## 3. next.config.js 작성하기

next.config.js가 제공하는 설정 파일은 버전별로 조금씩 다르며, 사용 가능한 옵션은 깃헙에서 확인 가능.

- reactStrictMode: 리액트의 엄격 모드를 활성화
- poweredByHeader : 일반적으로 보안 취약점으로 취급되는 X-Powered-By 헤더를 제거
- eslint.ignoreDuringBuilds : 빌드 시에 ESLint를 무시

## 4. ESLint와 Prettier 설정하기

eslint와 eslint-config-next를 설치하는 것만으로는 부족하다. 코드에 있는 잠재적인 문제를 확인할 뿐 띄어쓰기나 줄바꿈과 같이 코드의 스타일링은 정의해주지 않음.

## 5. 스타일 설정하기

## 6. 애플리케이션 코드 작성

## 7. 정리

- 템플릿 레포지토리 만들기
  1. 보일러 플레이트 프로젝트 생성
  2. 깃헙에서 Template repository 옵션 체크
  3. 레포지토리 생성 시 템플릿으로 지정해 놓은 레포를 선택
- 나만의 create-000-app 만들기
  create-next-app 내부의 코드 : create-next-app의 소스코드를 살펴보면 하나의 템플릿을 미리 만들어둔 다음, CLI로 사용자의 입력을 받아 커스터마이징
  - Creating a CLI tool with Node.js : npm을 기반으로 CLI 패키지를 만드는 방법을 상세하게 설명하고 있음.

# 2. 깃허브 활용하기

## 1. 깃허브 액션으로 CI 환경 구축하기

- CI(Continuous Intergration) : 여러 기여자가 기여한 코드를 지속적으로 빌드하고 테스트해 코드의 정합성을 확인하는 과정을 말함
- 젠킨스: CI환경을 구축하기 위해 가장 자주 쓰이던 솔루션.
- 깃허브 액션 : 젠킨스의 대안. 깃허브에서 출시한 SaaS. 원래 목적은 깃헙 저장소를 기반으로 깃헙에서 발생하는 다양한 이벤트를 트리거 삼아 다양한 작업을 할 수 있게 도와주는 것
  - 깃헙의 어떤 브랜치에 푸시가 발생하면 빌드를 수행
  - 깃헙의 특정 브랜치가 메인 브랜치를 대상으로 PR이 열리면 빌드, 테스트, 정적 분석을 수행
  - 장점
    - 저장소에 있는 코드만으로 테스트, 빌드, 빌드, 정적 분석 등 CI에 필요한 대부분의 기능을 손쉽게 구현할 수 있음 ⇒ 하나의 저장소에서 빠르고 다양한 CI환경 구축 가능

### 깃헙 액션의 기본 개념

- 러너 : 파일로 작성된 깃헙 액션이 실행되는 서버. 특별히 지정하지 않으면 공용 깃헙 액션 서버를 이용. 별도의 러너를 구축해 자체적으로 운영할 수 도 있음
- 액션 : 러너에서 실행되는 하나의 작업 단위. yaml파일로 작성된 내용을 하나의 액션으로 볼 수 있음
- 이벤트 : 깃헙 액션의 실행을 일으키는 이벤트.
  - pull_request: PR과 관련된 이벤트(열림, 닫힘, 수정, 할당, 리뷰 요청 등)
  - issues : 이슈와 관련된 이벤트(열림, 닫힘, 삭제, 할당)
  - push : 커밋이나 태그가 푸시 될때 발생하는 이벤트
  - schedule : 저장소에서 발생하는 이벤트와 별개로 특정 시간에 실행되는 이벤트. 여기서 말하는 시간은 cron에서 사용되는 시간.
  - 잡 : 하나의 러너에서 실행되는 여러 스텝의 모음. 하나의 액션에서 여러 잡을 생성할 수 있으며, 특별히 선언한게 없다면 내부 가상머신에서 각 잡은 병렬로 실행
  - 스텝 : 잡 내부에서 일어나는 하나하나의 작업. 셸 명령어나 다른 액션을 실행할 수 도 있으며, 병렬로 일어나지 않음.
- 스텝들을 엮어서 잡을 만들고, 병렬로 실행되며 이러한 잡을 하나 이상 모아둔 것이 액션

### 깃헙 액션 작성하기

.github/workflow 폴더를 생성하고 내부에 파일을 작성하면 됨.

```jsx
name: chapter7 build
run-name: ${{ github, actor }} has beend added new commit.

on:
	push:
		branches-ignore:
			- 'main'

jobs:
	build:
		runs-on: ubuntu-latest
		steps:
			- uses: actions/checkout@v3
			- uses: actions/setup-node@v3
			with:
				node-version: 16
			- name: 'install dependencies'
			working-directory: ./chapter7/my-app
			run: npm ci
			- name: 'build'
				working-directory: ./chapter7/my-app
				run: npm run build
```

- name
  액션의 이름
- run-name
  액션이 실행될 때 구별할 수 있는 타이틀명. 필수 값은 아님.
- on
  필수 값. 언제 이 액션을 실행할 지를 정의함. 이 예제에서는 원격 저장소의 푸시가 발생했을떄 실행하도록 하였으며, main브랜치에 푸시가 발생했을 경우에는 무시하도록 되어있음.
- jobs
  필수 값. 해당 액션에서 수행할 잡을 의미. 한 개 이상 설정할 수 있으며, 여러 개를 지정할 경우 병렬로 수행
  - jobs.build: build는 임의로 지정한 이름. name과 같은 역할. jobs의 하위 항목으로 무조건 들여쓰기 해야함.
  - jobs.build.runs-on : 어느 환경에서 해당 작업이 실행될 지를 결정. 디폴트로 하려면 ubuntu-latest를 하면 되고, 커스텀 러너를 쓰고 싶다면 저장소의 Settings → Actions → Runners에서 추가할 수 있음.
  - jobs.build.steps: 해당 잡에서 순차적으로 수행할 작업을 정의
    - uses: actions/checkout@v3: 해당 스텝에서 작업을 actions/checkout@v3를 사용해서 작업하겠다는 것을 의미.
      actions/checkout@v3 : 깃허브에서 제공하는 기본액션, 별도 파라미터를 제공하지 않으면 해당 브랜치의 마지막 커밋을 기준으로 체크아웃. 최신 코드를 기준으로 작동해야 하는 CI액션에서는 필수적으로 사용.
      - uses: actions/setup-node@v3 : 해당 스텝에서 actions/setup-node@v3를 사용해서 작업하겠다는 것을 의미. 이것 또한 깃허브에서 제공하는 기본 액션. 타 LTS버전도 설치 가능하므로 프로젝트에 맞춰 작성하면 됨
    - name: ‘install dependencies’: 해당 스텝의 명칭을 지정.
      - working-directory : 터미널의 cd명령과 비슷한. 역할. 뒤이어 수행할 작업을 해당 디렉토리애서 수행하겠다는 뜻. 루트에서 실행해도 된다면 따로 지정할 필요 없음.
      - run : 수행할 작업 명시
    - name: ‘build’ : CI를 위한 작업. git checkout, Node.js설치, 의존성 설치까지 마무리했으므로 마지막 작업으로 npm run build를 실행해 넥스트 프로젝트를 빌드
- 액션 작성
  기본적인 빌드 CI부터 일정 시간마다 특정한 작업 수행, 배포 서비스와 연동해 자동으로 배포를 실행, 저장소 내부에 이미지가 추가될 때마다 이미지를 최적화할 수도 있음.
- 브랜치 보호 규칙
  머지하기 전 꼭 성공해야 하는 액션이 있다면 별도로 저장소에 브랜치 보호 규칙을 추가할 수 있음
  1. Settings → Code and automation → Branches 이동하기
  2. Add branch protection rule

## 2. 직접 작성하지 않고 유용한 액션과 깃허브 앱 가져다 쓰기

- 깃헙에서 제공하는 서비스인 MarketPlace에서 여러 사용자가 만들어 놓은 액션을 손쉽게 가져다 사용할 수 있음.

### 깃헙에서 제공하는 기본 액션

- actions/checkout : 깃헙 저장소를 체크아웃 하는 액션
- actions/setup-node : Node.js를 설치하는 액션
- actions/github-script : GitHub API가 제공하는 기능을 사용할 수 있도록 도와주는 액션
- actions/stale : 오래된 이슈나 PR을 자동으로 닫거나 더이상 커뮤니케이션 하지 못하도록 닫는다
- actions/dependency-review-action : 의존성 그래프에 대한 변경, 즉 package.json, package-lock.json, pmpn-lock.yaml 등의 내용이 변경됐을 떄 실행되는 액션
- github/codeql-action : 깃허브의 코드 분석 솔루션인 code-ql을 활용해 저장소 내 코드의 취약점을 분석해줌

### calibreapp/image-actions

저장소에 포함돼 있는 이미지를 최적화하는 액션. 이 액션은 PR로 올라온 이미지(jpg, jpeg, png 등)을 sharp 패키지를 이용해 거의 무손실로 압축해서 다시 커밋해 줌.

### lirantal/is-website-vulnerable

특정 웹사이트를 방문해 해당 웹사이트에 라이브러리 취약점이 존재하는 지 확인하는 깃헙 액션. Snyk라는 솔루션을 기반으로 작동하며, 앞서 소개한 액션과 다르게 실제로 웹사이트를 방문해서 웹사이트에 노출되고 있는 라이브러리를 분석한 결과를 알려준다는 차이점이 있음.

### Lighthouse CI

구글에서 제공하는 액션, 웹 성능 지표인 라이트하우스를 CI를 기반으로 실행할 수 있도록 도와주는 도구. 이 깃헙 액션을 활용하면 프로젝트의 URL을 방문해 라이트 하우스 검사를 실행.

설정을 통해 라이트하우스 실행결과가 일정 점수 미만이 되면 테스트 코드의 assert와 비슷하게 에러를 발생시키거나 라이트 하우스 분석 서버를 만들어 별도 프로세스를 실행할 수 있다 .

## 3. 깃허브 Dependabot으로 보안 취약점 해결하기

의존성에 문제가 있다면 이에 대해 문제를 알려주고 해결할 수 있는 풀 리퀘스트까지 열어 줄 수있음.

### package.json의 dependencies 이해하기

- 버전
  - 유의식 버전(semantic versioning)
    - 주 버전 올리기: 기존 버전과 호환되지 않게 API가 바뀌는 경우
    - 부 버전 올리기: 기존 버전과 호환되면서 새로운 기능 추가
    - 수 버전 올리기: 기존 버전과 호환되면서 버그 수정
  - 참고할 내용
    - 특정 버전으로 패키지를 배포하고 나면 그 버전의 내용은 절대 변경하지 말것.
    - 주 버전0(0.y.z)은 초기 개발을 위해 씀. 아무때나 마음대로 바꿀 수 있으며 이 공개 API는 안정판으로 보지 않음. 그러므로 주의를 기울여야 함
    - 수 버전 Z(x.y.Z | x > 0)는 반드시 그 이전 버전 API와 호환되는 버그 수정의 경우에만 올림. 버그 수정이 API 스펙 변경을 동반한다면 반드시 주 버전을 올려야 함. 주 버전을 올리는 것이 껄끄럽다면 해당 API를 지원 중다능로 처리하고 새로운 API를 만들어 부 버전을 올리는 것이 좋음
  - npm 정의하는 버전 규칙
    - react@16.0.0 : 버전 앞에아무런 특수 기호가 없다면 정확히 해당 버전에 대해서만 의존하고 있다는 뜻
    - react@^16.0.0 : 16.0.0과 호환되는 버전을 의미한다. ⇒ 0보다 높은 부 버전에 대해서는 호횐된다는 가정하에 상위버전을 설치할 수 있다는 것을 뜻함.

# 3. 리액트 애플리케이션 배포하기

## 1. Netlify

## 2. Vercel

## 3. DigitalOcean
