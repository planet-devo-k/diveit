# 앱 라우터의 데이터 페칭

![image.png](attachment:f86b3403-b2e0-41ef-9337-1b1699e78709:image.png)

![image.png](attachment:d62b50da-ef02-4de5-a55c-603be0f5ccc9:image.png)

![image.png](attachment:f44eb132-70d2-4864-8e6d-0363fefba91d:image.png)

![image.png](attachment:84b6d5d5-05c0-4601-aece-9f5a442abee9:image.png)

서버 컴포넌트는 비동기적으로 데이터 페칭이 가능함. ⇒ 기존의 getServerSideProps, getStaticProps를 대체

![image.png](attachment:6cc1c8cb-7ad0-4efa-b09a-47a7319de09a:image.png)

# 데이터 캐시

- cache: no-store
  - 데이터 페칭의 결과를 저장하지 않는 옵션
  - 캐싱을 아예 하지 않도록 설정하는 옵션임
- cache: force-cache
  - 요청의 결과를 무조건 캐싱함
  - 한번 호출 된 이후에는 다시는 호출되지 않음
- revalidate: 숫자
  - 특정 시간을 주기로 캐시를 업데이트함
  - 마치 Page Router의 ISR 방식과 유사함
- tags
  - On-Demand Revalidate
  - 요청이 들어왔을때 데이터를 최신화 함

# 리퀘스트 메모이제이션

중복된 요청을 하나의 요청으로 자동으로 합쳐주는 기능.

캐시와는 다름. 하나의 페이지를 헨더링 하는 동안에 중복된 api요청을 캐싱하기 위해 존재하며 렌더링이 종료되면 모든 캐시가 소멸됨.

서버 컴포넌트를 도입하면서 데이터를 페칭하는 패턴이 변화했기 때문
