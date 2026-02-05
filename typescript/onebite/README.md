# 한입 타입스크립트

## 📅 Study Schedule

- 기간: 2026-01-26 \~ 2026-02-22
- 매주 일요일 오후 10시
- 목표: **강의 총 60강**

<table>
  <thead>
    <tr>
      <th>주차</th>
      <th>날짜</th>
      <th>범위</th>
      <th>발표자</th>
      <th>관련 이슈</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>0</td>
      <td>1/26</td>
      <td>OT</td>
      <td></td>
      <td>null</td>
    </tr>
    <tr>
      <td>1</td>
      <td>2/1</td>
      <td>~ 3.6</td>
      <td>수진, 유진, 시은, 인성</td>
      <td>null</td>
    </tr>
    <tr>
      <td>2</td>
      <td>2/8</td>
      <td></td>
      <td></td>
      <td>null</td>
    </tr>
    <tr>
      <td>3</td>
      <td>2/15 (설날)</td>
      <td>즐거운 새해</td>
      <td></td>
      <td>null</td>
    </tr>
    <tr>
      <td>4</td>
      <td>2/22</td>
      <td></td>
      <td></td>
      <td>null</td>
    </tr>
  </tbody>
</table>

## 👥 Members

- 송시은 [sgoldenbird](https://github.com/sgoldenbird)
- 손수진 [pappaya109](https://github.com/pappaya109)
- 조인성 [Insung-Jo](https://github.com/Insung-Jo)
- 전유진 [yuj2n](https://github.com/yuj2n)

## 🪄 Study Workflow

- 브랜치 갱신 가이드

```
아래와 같은 과정을 거쳐 기존 자신의 브랜치를 삭제하고 typescript branch base로 새로운 자기 브랜치를 생성합니다.

# 로컬 브랜치 삭제
git branch -D [예전-브랜치명]

# 원격 브랜치 삭제
git push origin --delete [예전-브랜치명]

# 베이스 브랜치로 이동 및 최신화
git checkout typescript
git pull origin typescript

# 새로운 자기 브랜치 생성 및 이동
git checkout -b [새-브랜치명]

# 원격(GitHub)에 새 브랜치 등록 및 푸시
git push -u origin [새-브랜치명]

```

- 자기 폴더 안에 내용 정리 [Study Structure 참고](https://github.com/planet-devo-k/diveit/tree/main?tab=readme-ov-file#%EF%B8%8F-study-structure)
- 발표자는 매주 한 명씩 랜덤으로돌아가며 진행
- 발표자가 아닌 팀원들은 정리한 내용 중 발표자와 중복되지 않는 내용만 발표
- 질문은 GitHub Discussions [Q&A](https://github.com/planet-devo-k/diveit/discussions/categories/q-a) 활용, question label 추가

## 🔎 [GitHub ↔ GitBook 동기화 흐름](https://github.com/planet-devo-k/diveit/blob/main/README.md#-github--gitbook-%EB%8F%99%EA%B8%B0%ED%99%94-%ED%9D%90%EB%A6%84)

## 🤝 Rules

### [그라운드 룰](https://github.com/planet-devo-k/diveit/blob/main/README.md#%EA%B7%B8%EB%9D%BC%EC%9A%B4%EB%93%9C-%EB%A3%B0)

### [PR/CR 및 이슈 규칙](https://github.com/planet-devo-k/diveit/blob/main/README.md#prcr-%EB%B0%8F-%EC%9D%B4%EC%8A%88-%EA%B7%9C%EC%B9%99)

### 커밋 규칙

<table>
  <thead>
    <tr>
      <th>Type</th>
      <th>Description</th>
      <th>Example Message</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><code>ch#: </code></td>
      <td><strong>챕터별 정리 추가</strong><br />학습 내용 요약 및 결과물 업로드</td>
      <td><code>ch3.6: 타입 단언</code></td>
    </tr>
    <tr>
      <td><code>update:</code></td>
      <td><strong>기존 문서 보강/수정</strong><br />내용 확장, 예제 추가, 오타 수정</td>
      <td><code>update: ch2 컴포넌트 예시 추가</code></td>
    </tr>
    <tr>
      <td><code>docs: </code></td>
      <td><strong>문서 관리</strong><br />README 및 프로젝트 가이드 수정</td>
      <td><code>docs: update README</code></td>
    </tr>
    <tr>
      <td><code>chore: </code></td>
      <td><strong>기타 변경 사항</strong><br />파일 이동, 폴더 구조 정리, 설정 등</td>
      <td><code>chore: update dependencies</code></td>
    </tr>
  </tbody>
</table>
