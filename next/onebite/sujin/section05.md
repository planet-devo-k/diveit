# 풀 라우트 캐시

Next 서버측에서 빌드 타임에 특정 페이지의 렌더링 결과를 캐싱하는 기능

![image.png](attachment:863d31cc-55c9-4e70-ab65-09e6fe32faae:image.png)

## 분류 기준

### Dynamic Page로 설정되는 기준

특정 페이지가 접속 요청을 받을 때마다. 매번 변화가 생기거나 데이터가 달라질 경우

1. 캐시되지 않는 데이터 페칭을 사용할 경우
2. 동적함수(쿠키, 헤더, 쿼리스트링)을 사용하는 컴포넌트가 있을 때

### Static Page로 설정되는 기준

Dynamic Page가 아니면 모두 Static Page

![image.png](attachment:a58b6b82-b3ca-4b33-baf2-e83652ac9f5a:image.png)
