# 09 모던 리액트 개발 도구로 개발 및 배포 환경 구축하기

## 9.1 Next.js로 리액트 개발 환경 구축하기

### create-next-app 없이 하나씩 구축하기

1. package.json 만들기 (npm init)

   - 명령어 사용시 package.json을 만드는 CLI를 실행할 수 있다.

2. 핵심 라이브러리 설치 (react, react-dom, next)

3. devDependencies에 필요한 패키지 설치

### tsconfig.json 작성하기

```json
{
  "$schema": "https://json.schemastore.org/tsconfig.json"
}
```

- 해당 값을 작성해야 해당 파일이 무엇을 의미하는지 알려준다. (명시 하면 IDE에서 자동 완성 제공)

### next.config.js 작성하기

- 설정 파일은 버전별로 조금씩 다르다. (깃허브 저장소를 방문해 확인 가능)
- 본인이 사용 중인 버전의 태그를 찾아 들어가면 사용 가능한 옵션을 확인 가능

**옵션**

- reactStrictMode: 리액트의 엄격 모드를 활성화한다.
- poweredByHeader: 일반적으로 보안 취약점으로 취급되는 X-Powered-By 헤더 제거
- eslint.ignoreDuringBuilds: 빌드 시에 Eslint 무시

### ESLint와 Prettier 설정하기

- eslint와 eslint-config-next는 단순히 코드에 있을 잠재적인 문제를 확인할 뿐, 코드의 스타일링을 정의해주지 않는다.

- @titicaca/eslint-config-triple을 설치하여, 코드 스타일링 등 일반적인 ESLint 작업을 수행하게 한다.

### 애플리케이션 코드 작성

- 기본적인 폴더구조는 pages, components, hooks, types, utils 로 나눈다.

- 그러나 폴더 구조는 정답은 없고, 기본적인 컨벤션만 지키면 된다

## 9.2 깃허브 100% 활용하기

### 깃허브 액션으로 CI 구축하기

**CI(Continuous Integration)**

- 코드의 변화를 모으고 관리하는 코드 중앙 저장소에서, 여러 기여자가 기여한 코드 를 지속적으로 빌드하고 테스트해 코드의 정합성을 확인하는 과정

**젠킨스(Jenkins)**

- CI에 필요한 다양한 기능을 제공하는 솔루션
- 별도 서버 구축, 서버 내에서 젠킨스를 설치하는 등 사용하는 데 버거운 측면이 많았다.

**깃허브 액션의 기본 개념**

- 러너: 파일로 작성된 깃허브 액션이 실행되는 서버

- 액션: 러너에서 실행되는 하나의 작업 단위

- 이벤트: 깃허브 액션의 실행을 일으키는 이벤트

  - PR, issues, push, schedule 등

- 잡(jobs): 하나의 러너에서 실행되는 여러 스텝의 모음

- 스텝: 잡 내부에서 일어나는 하나하나의 작업을 의미 (병렬로 일어나지 않음)

**깃허브 액션 작성하기**

- 액션을 작성하려면 저장소의 루트에 `.github/workflows` 폴더를 생성하고 내부에 파일을 작성

- `yaml` 파일 작성을 위해 확장자는 `.yml` 또한 `.yaml`로 지정

```yaml
name: chapter7 build
run-name: ${{ github.actor }} has been added new commit.

on:
  push:
    branches-ignore:
      - "main"

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
      - name: "install dependencies"
        working-directory: ./chapter7/my-app
        run: npm ci
      - name: "build"
        working-directory: ./chapter7/my-app
        run: npm run build
```

**name (필수 X)**

- 액션의 이름

**run-name (필수 X)**

- 액션이 실행될 때 구별하는 타이틀명

**on (필수)**

- 언제 이 액션을 실행할 지 정의. 위에서는 저장소의 push가 발생할 때 실행되도록 함

**jobs (필수)**

- 해당 액션에서 수행할 잡을 의미
- 한 개 이상 설정이 가능하며, 여러 개를 지정하면 병렬로 실행

**액션 작성**

- 액션을 작성할 때 트리거를 조정하는 경우가 있다
- 젠킨스를 처음부터 구축해서 사용하는 것보다는 훨씬 손쉽게 CI를 구축할 수 있다.

**브랜치 보호 규칙**

- 머지하기 전에 곡 성공해야 하는 액션이 있다면 별도로 저장소에 브랜치 보호 규칙을 추가할 수 있다.

### 직접 작성하지 않고 유용한 액션과 깃허브 앱 가져다 쓰기

"MarketPlaces"라는 서비스를 제공해 여러 사용자가 만들어 놓은 손쉽게 가져다 쓸 수 있음

**깃허브에서 제공하는 기본 액션**

1. actions/checkout

   - 깃허브 저장소를 체크아웃하는 액션

2. actions/setup-node

   - Node.js를 설치하는 액션

3. actions/github-script

- Github API가 제공하는 기능을 사용할 수 있도록 해주는 액션

4. action/stale

   - 오래된 이슈나 PR을 자동으로 닫거나 더 이상 커뮤니케이션하지 못하도록 닫는다.

5. actions/dependency-review-action

   - package.json, package-lock.json, pnpm-lock.yaml 등의 내용이 변경됐을 때 실행되는 액션

6. github/codeql-action
   - 깃허브의 코드 분석 솔루션인 code-ql을 활용해 저장소 내 코드의 취약점을 분석하는 액션

**calibreapp/image-actions**

- CDN을 구축하지 않은 경우, 이미지를 저장소 내부에 관리하는 경우
- 이 이미지들을 압축해 최적화주는 액션이 `calibreapp/image-actions`이다.

```yaml
name: Optimize images
on: pull_request
jobs:
  build:
    name: Calibreapp/image-actions
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repo
        uses: actions/checkout@v2
      - name: Compress Images
        uses: calibreapp/image-actions@main
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          ignorePaths: "LDSpeople.jpeg"
```

- PR이 생성되면 마찬가지로 저장소를 checkout해서 calibreapp/image-actions라는 액션을 실행
- 이미지를 가져다가 새롭게 커밋해야 하므로 액션이 커밋을 할 수 있도록 권한을 주어야 한다.
  - 권한 제공은 `githubToken: ${{ secrets.GITHUB_TOKEN }}`을 사용

**lirantal/is-website-vulnerable**

- 특정 웹사이트를 방문해 해당 웹사이트 라이브러리 취약점이 존재하는 확인하는 액션

- Snyk라는 솔루션을 기반으로 작동

- 이 액션을 주기적으로 실행하여, 웹사이트의 취약점을 편리하게 확인할 수 있음

**Lighthouse CI**

- 웹 성능 지표인 라이트하우스를 CI를 기반으로 실행할 수 있도록 도와주는 도구

### 깃허브 Dependabot으로 보안 취약점 해결하기

- 의존성에 문제가 있다면 이에 대해 문제를 알려주고 가능하다면 해결할 수 있는 PR을 열어준다

**package.json의 dependencies 이해하기**

**버전**

유의적 버전의 정의는 `주.부.수`로 구성돼 있으며 각각의 정의는 다음과 같다

- 주 : 기존 버전과 호환되지 않게 API가 바뀌는 경우
- 부 : 기존 버전과 호환되면서 새로운 기능을 추가하는 경우
- 수 : 기존 버전과 호환되면서 버그를 수정한 경우

**중요한 내용**

- 특정 버전으로 패키지를 배포하면, 그 버전의 내용을 절대 변경 X (있을 경우 새러운 버전으로 배포)
- 주 버전 0는 초기 개발을 위해 사용. 해당 버전은 아무 때나 바꿀 수 있다
- 수 버전 Z는 반드시 그 이전 버전 API와 호환되는 버그 수정의 경우에만 올린다

```
유의적 버전은 어디까지나 개발자들 간의 약속일 뿐, 정말로 해당 API의 버전이 이 유의적 버전에 맞춰 구현돼 있는지는 알 수 없다
```

**의존성**

- package.json에서 dependencies란 npm 프로젝트를 운영하는 데 필요한 자신 외의 npm 라이브러리를 정의해 둔 목록이다

- 주로 dependencies와 devDependencies로 구성되어 있다
  - dependencies: package.json에서 npm install을 실행하면 설치되는 의존성
  - devDependencies: 프로젝트를 샐행하는 데는 필요하지 않지만 개발 단계에서 필요한 패키지들을 선언하는 곳
  - peerDependencies: 서비스보다는 라이브러리와 패키지에서 자주 쓰이는 단위

### Dependabot으로 취약점 해결하기

1. 프로젝트 준비
2. 개발 취약점 살펴보기
   - 취약점을 Critical, High, Moderate, Low의 단계로 분류한다.
3. 취약점 해결

## 9.3 리액트 애플리케이션 배포하기

### Netlify

- 가장 널리 알려진 정적 웹사이트 배포 서비스

**추가 기능**

- 알림: 배포와 관련된 알림을 추가할 수 있다 (배포 실패하거나 성공 등 다양한 상황)

- 도메인 연결: 기본적으로 하나의 배포마다 고정된 웹사이트 주소를 할당하고, 외부 도메인 구매하여 변경 가능

- 서비스 통합: 프로젝트와 연계할 수 있는 다양한 서비스와 API가 마켓형태로 제공

- 서버리스 함수: 별도의 서버 구축 없이도 서버에서 실행될 함수를 만들 수 있음

- Identity: 사용자를 초대해 가입시키고 특정 API를 활용해 해당 유저에 대한 인증 처리를 할 수 있음

**가격**

무료이긴 하나 몇 가지 제약사항이 있다

1. 대역폭 : 월 대역폭이 최대 100GB 제한
2. 빌드 시간 : 빌드에 소비할 수 있는 시간은 최대 300분
3. 동시 빌드 : 여러 개의 사이트를 운영하더라도 한 번에 한 곳에만 빌드할 수 있음

### Vercel

- Netlify와 비슷한 클라우드 플랫폼 서비스

**추가 기능**

- 알림: 기본적으로 타깃 브랜치에 커밋이나 PR이 발생하면 알림을 보내주는 기능

- 도메인 연결: 구매한 도메인 연결 가능

- 서버리스 함수: Netlify와는 다르게 next.js에서 제공하는 `/api`의 내용도 이곳에서 확인 가능

- 다양한 템플릿: 별도의 코드 작성 없이도 구축할 수 있는 기본적인 웹사이트를 제공

**가격**

무료이긴 하나 몇 가지 제약사항이 있다

1. 대역폭 : 월 최대 100GB

2. 이미지 최적화 : Vercel은 사이트에서 제공해 주는 이미지를 최적화 해주는데, 최대 1000개

3. 서버리스 함수 : 함수의 총 실행 용량이 100GB 제한, 실행 시간은 10초 이내

4. 동시 빌드 : 하나만 빌드 가능

5. 배포 : 배포가 하루에 100개로 제한

### DigitalOcean

앞선 두개와 비슷하게 저장소를 바탕으로 바로 배포할 수 있는 서비스 제공
GitHub Student Pack에 포함되어, 학생 계정으로 가입한 깃허브에 200달러 상당의 무료 크레딧 제공

**추가 기능**

- 알림: 앞선 두 서비스와는 다르게 깃허브로 알림을 보내는 것이 아닌, 이메일과 슬랙으로 알림을 보냄

- 컨테이너에 직접 접근: 실제 서비스가 실행되고 있는 컨테이너에 직접 접근할 수 있는 기능 제공

- 마켓플레이스: 애플리케이션에 추가로 설치할 수 있는 다양한 앱을 마켓 형태로 제공, 앞선 두 서비스와 다르게 컨테이너 제공에 초점이 맞춰져 있는 앱이 많음

- 도메인 연결: Vercel과 Netlify는 정적인 웹사이트 배포에 초점을 두고 있다면, DigitalOcean은 조금 더 다양한 클라우드 컴퓨팅 서비스를 제공

**가격**

애플리케이션을 구성하는 컨테이너의 스펙, 개수에 따라 가격이 달라짐
트래픽이 작은 서비스를 가정한다 했을 때, 앞선 두 서비스의 유료 플랜보다는 저렴하게 사용할 수 있다

## 9.4 리액트 애플리케이션 도커라이즈하기

### 도커란?

- 개발자가 모던 애플리케이션을 구축, 공유, 실행하는 것을 도와줄 수 있도록 설계된 플랫폼이다. 도커는 지루한 설정 과정을 대신해 주므로 코드를 작성하는 일에만 집중할 수 있다.

**도커 용어**

- 이미지 : 도커에서 이미지란 컨테이너를 만드는 데 사용되는 템플릿을 의미

- 컨테이너 :도커의 이미지를 실행한 상태

- Dockerfile : 어떤 이미지 파일을 만들지 정의하는 파일

- 태그 : 이미지를 식벼할 수 있는 레이블 값

- 리포지터리 : 이미지를 모아두는 저장소로, 다양한 태그로 지정된 이미지들이 모여있음

- 레지스토리 : 리포지터리에 접근할 수 있게 해주는 서비스 ex) 도커 허브

**자주 쓰이는 도커 cli 명령어**

- docker build : Dockerfile을 기준으로 이미지를 빌드하는 작업

- docker push : 이미지나 리포지터리를 도커 레지스토리에 업로드하는 과정

- docker tag : 이미지에 태그를 생성하는 명령어

- docker inspect : 이미지나 컨테이너의 세부 정보를 출력하는 명령어

- docker run : 이미지를 기반으로 새로운 컨테이너를 생성하는 명령어

- docker ps : 현재 가동 중인 컨테이너 목록을 확인할 수 있는 명령어

- docker rm : 컨테이너를 삭제하는 명령어

**create-react-app을 위한 Dockerfile 작성하기**

1. 운영체제 설정

2. Node.js 설치: npm 프로젝트를 구동하려면 Node.js가 필요, 해당 버전은 애플리케이션 개발 과정에서 정해진 버전과 일치하거나 그 이상이어야 한다.

3. npm ci: 프로젝트 빌드에 필요한 의존성 모듈을 설치한다.

4. npm run build: 프로젝트를 빌드한다.

5. 실행: 프로젝트를 실행한다.
