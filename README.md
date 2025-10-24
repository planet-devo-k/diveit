# README

이 공간은 **모던 리액트 딥다이브** 책을 기반으로 한 스터디 기록 아카이브입니다.\
모든 정리 자료와 질의 응답 및 토론 내용은 이 레포와 GitBook Space에 문서화됩니다.

***

### 📅 Study Schedule

* 기간: 2025-09-24 \~ 2025-12-04
* 매주 목요일 오후 1시
* 목표: **Chapter 1 \~ 15 완독 및 토론**

<table data-full-width="false"><thead><tr><th data-type="number">주차</th><th>날짜</th><th>범위</th><th data-type="users" data-multiple>발표자</th><th data-type="number">관련 이슈</th></tr></thead><tbody><tr><td>0</td><td>9/24</td><td>OT</td><td></td><td>null</td></tr><tr><td>1</td><td>10/2</td><td>~ 1.6</td><td><a href="https://app.gitbook.com/u/d0EnCKetE8VAJNqLHkTZk8myf4b2">Sienna</a></td><td>null</td></tr><tr><td>3</td><td>10/9 (추석)</td><td>즐거운 휴일</td><td></td><td>null</td></tr><tr><td>2</td><td>10/16</td><td>1.7 ~ Ch2</td><td></td><td>null</td></tr><tr><td>4</td><td>10/23</td><td>Ch3 ~ 4.2</td><td></td><td>null</td></tr><tr><td>5</td><td>10/30</td><td>4.3 ~ Ch5</td><td></td><td>null</td></tr><tr><td>6</td><td>11/6</td><td>Ch6 ~ 8.1</td><td></td><td>null</td></tr><tr><td>7</td><td>11/13</td><td>8.2 ~ 9.3</td><td></td><td>null</td></tr><tr><td>8</td><td>11/20</td><td>9.4 ~ Ch10</td><td></td><td>null</td></tr><tr><td>9</td><td>11/27</td><td>Ch11 ~ Ch12</td><td></td><td>null</td></tr><tr><td>10</td><td>12/4</td><td>Ch13 ~ Ch15</td><td></td><td>null</td></tr></tbody></table>

***

### 👥 Members

* 송시은 [sgoldenbird](https://github.com/sgoldenbird)
* 손수진 [pappaya109](https://github.com/pappaya109)
* 조인성 [Insung-Jo](https://github.com/Insung-Jo)
* 전유진 [yuj2n](https://github.com/yuj2n)

***

### **🪄Study Workflow**

* 발표자는 매주 한 명씩 랜덤으로돌아가며 진행
* 발표자가 아닌 팀원들은 정리한 내용 중 발표자와 중복되지 않는 내용만 발표
* 각자 공부한 챕터의 핵심을 **질문으로 변환** → 스터디에서 릴레이식으로 답변
* 공부하다 모르는 질문은 GitHub Discussions에 미리 올려서 질의응답및토론
* <mark style="background-color:yellow;">**개인 브랜치에 자기 폴더를 생성**</mark>하고 그 안에 정리한내용을 작성합니다.

***

### 🔎 GitHub ↔ GitBook 동기화 흐름

```
GitHub → GitBook

개인 브랜치에서 작업, SUMMARY.md 추가 → PR 생성 → PR 머지 → 자동으로 GitBook 에도 반영



GitBook → GitHub

GitBook 개인 Space에서 작업 → CR 제목 입력 → CR 머지 → GitHub 개인 브랜치에 반영 → PR 생성 → PR 머지
```

***

### 🪧Rules

#### 🤝 그라운드 룰

* 우리는 함께 성장한다 → 경쟁보다 협업! 서로를 존중하고 배우자.
* 매주 정한 분량만큼 책임감을 가지고 공부한다 → 꾸준함이 실력이다. 못할 경우 미리 이야기해요.
* 질문은 자유롭고, 설명은 친절하게 → 모르는 건 창피한 게 아니에요. 질문과 답변은 모두의 자산입니다.
* GitHub, GitBook도 연습이다 → 커밋 메시지, PR 제목, 등을 신경 써서 남기기!
* 지속 가능한 스터디를 위해 필요에 따라 유연하게 조정한다 → 피드백을 바탕으로 같이 가꿔나가요.

#### 🤝 브랜치 규칙

* react 브랜치 = default 브랜치
* react 브랜치를 기준으로 **각자 개인 브랜치를 생성**합니다.
*   머지 후에 개인 브랜치를 react 브랜치 기준으로 동기화 하고 싶다면 아래와 같이 합니다.

    ```
    git checkout sgoldenbird
    git pull --rebase origin react
    ```

#### 🤝 CR 규칙

* **GitBook** 작업 시 상단의 <mark style="background-color:yellow;">**CR 제목**</mark>을 작성하세요.

#### 🤝 PR 및 이슈 규칙

* 매주 수요일까지 react 브랜치로 PR, 머지합니다.
* 어려운 문제를 만났을 경우, Discussions탭의 [Q\&A](https://github.com/front-studium/solveit/discussions/categories/q-a)를 활용해 질문 및 해결 방법을 공유합니다.
* SUMMARY 관리는 react 브랜치에 머지 된 후 일괄적으로 하겠습니다.&#x20;

#### 🤝 커밋 규칙

* 정해진 분량 만큼 정리한 내용을 커밋합니다.
* 아래의 커밋 메시지 작성 규칙을 따릅니다.

<table><thead><tr><th width="117">커밋 타입</th><th width="291">설명</th><th>예시 메시지</th></tr></thead><tbody><tr><td><code>ch#-</code></td><td>챕터별 정리 추가</td><td><code>ch5-리액트와 상태 관리 라이브러리 정리</code></td></tr><tr><td><code>update-</code></td><td>기존 문서 보강/수정<br>(내용 확장, 예제 추가 등)</td><td><code>update-ch2에 컴포넌트 예시 추가</code></td></tr><tr><td><code>docs-</code></td><td>리드미 업데이트</td><td><code>docs-update README</code></td></tr><tr><td><code>chore-</code></td><td>기타 변경 사항</td><td><code>chore-update package dependencies</code></td></tr></tbody></table>
