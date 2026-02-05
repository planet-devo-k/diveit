# 🪐 DIVEIT: 깊게 파고들고, 넓게 공유하라

이 공간은 개발 기술을 깊이 탐구하는 Diveit 스터디 기록 아카이브입니다.
<br/>모든 정리 자료와 질의 응답 및 토론 내용은 이 레포와 GitBook Space [Dive it Docs](https://planet-devo-k.gitbook.io/diveit)에 문서화됩니다.

## 👥 Members

- 송시은 [sgoldenbird](https://github.com/sgoldenbird)
- 손수진 [pappaya109](https://github.com/pappaya109)
- 조인성 [Insung-Jo](https://github.com/Insung-Jo)
- 전유진 [yuj2n](https://github.com/yuj2n)

## 📚 Study Tracks

<table>
  <thead>
    <tr>
      <th>Track</th>
      <th>Period</th>
      <th>Domain</th>
      <th>Description</th>
      <th>Document</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Modern React Deep Dive</strong></td>
      <td>2025.12 ~ 2026.01</td>
      <td><code>react</code></td>
      <td>리액트 핵심 원리, 성능 최적화, SSR 탐구</td>
      <td><a href="./react/modern-react-deep-dive/README.md">View Link</a></td>
    </tr>
    <tr>
      <td><strong>한입 TypeScript</strong></td>
      <td>2026.01 ~ <strong>진행 중</strong></td>
      <td><code>typescript</code></td>
      <td>정적 타이핑을 통한 안정적인 웹 개발 학습</td>
      <td><a href="./typescript/onebite/README.md">View Link</a></td>
    </tr>
  </tbody>
</table>

## ➿ Study Structure

본 저장소는 다음과 같은 구조를 유지합니다.

- Domain별로 브랜치를 나누어 학습하고, 최종 결과물은 `main` 브랜치에 통합합니다.
- 폴더 구조

```
[domain]/[topic]/[member]/[content.md]
e.g.typescript/sgoldenbird/ch01-introduction.md
```

- 브랜치 갱신 가이드

```
아래와 같은 과정을 거쳐 기존 자신의 브랜치를 삭제하고 현재 base branch로 새로운 자기 브랜치를 생성합니다.

# 로컬 브랜치 삭제
git branch -D [예전-브랜치명]

# 원격 브랜치 삭제
git push origin --delete [예전-브랜치명]

# 베이스 브랜치로 이동 및 최신화
git checkout [새 도메인 브랜치(새 베이스 브랜치)]
git pull origin [새 도메인 브랜치(새 베이스 브랜치)]

# 새로운 자기 브랜치 생성 및 이동
git checkout -b [새-브랜치명]

# 원격(GitHub)에 새 브랜치 등록 및 푸시
git push -u origin [새-브랜치명]

```

## 🔎 GitHub ↔ GitBook 동기화 흐름

```
[GitHub → GitBook]

개인 브랜치에서 작업, SUMMARY.md 추가 → PR 생성 → PR 머지 → 자동으로 GitBook 에도 반영


[GitBook → GitHub]

GitBook 개인 Space에서 작업 → CR 제목 입력 → CR 머지 → GitHub 개인 브랜치에 반영 → PR 생성 → PR 머지
```

## 🤝 Rules

### 그라운드 룰

- 공유를 통한 동반 성장: 아는 것은 나누고 모르는 것은 질문합니다. 지식의 선순환이 우리 모두의 실력을 만듭니다.
- 질문은 자유롭고, 설명은 친절하게: 모르는 것은 창피한 것이 아닙니다. 모든 Q&A는 우리의 자산입니다.
- 함께 성장하기: 경쟁보다 협업! 서로를 존중하며 배우는 문화를 지향합니다.
- 책임감 있는 학습: 매주 정한 분량은 꾸준히. 사정이 생기면 미리 공유합니다.
- 프로페셔널한 연습: 커밋 메시지, PR 제목 등 협업 도구 사용도 실전처럼 연습합니다.
- 지속 가능한 스터디를 위해 필요에 따라 유연하게 조정합니다. 피드백을 바탕으로 같이 가꿔나가요.

### PR/CR 및 이슈 규칙

- Discussions탭의 [Q&A](https://github.com/planet-devo-k/diveit/discussions/categories/q-a)를 활용해 질문 및 답변을 공유합니다.
- **GitBook**에서 작업 시 상단의 <mark style="background-color:yellow;">**CR 제목**</mark>을 작성하세요.
- 깃북의 목차와 구조를 결정하는 SUMMARY.md를 작성합니다.

### 커밋 규칙

- 정해진 분량 만큼 정리한 내용을 커밋합니다.
- 각 스터디별 커밋 메시지 작성 규칙을 따릅니다. 아래는 예시입니다.

<table>
  <thead>
    <tr>
      <th >Type</th>
      <th >Description</th>
      <th>Example Message</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ch#: </code></td>
      <td><strong>챕터별 정리 추가</strong><br />신규 학습 내용 업로드</td>
      <td><code>ch3.6: 타입 단언</code></td>
    </tr>
    <tr>
      <td><code>update: </code></td>
      <td><strong>정리 보강/수정</strong><br />내용 확장, 예제 추가, 오타 수정</td>
      <td><code>update: ch2 예시 추가</code></td>
    </tr>
    <tr>
      <td><code>docs: </code></td>
      <td><strong>메인 문서 관리</strong><br />README 및 가이드라인 수정</td>
      <td><code>docs: update README</code></td>
    </tr>
    <tr>
      <td><code>chore: </code></td>
      <td><strong>기타 변경 사항</strong><br />파일 이동, 폴더 구조 정리 등</td>
      <td><code>chore: move assets</code></td>
    </tr>
  </tbody>
</table>
