# Takeaways

## 모던 리액트 개발 도구로 개발 및 배포 환경 구축하기

### Next.js로 리액트 개발 환경 구축하기

### 깃허브 100% 활용하기

### 리액트 애플리케이션 배포하기

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
