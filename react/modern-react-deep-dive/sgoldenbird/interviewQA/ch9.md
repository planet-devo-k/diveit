#### CI와 CD가 각각 무엇인지, 왜 필요한지 설명해 주세요.

- CI(Continuous Integration, 지속적 통합):
  자동화된 빌드와 테스트를 실행하여 코드의 결함을 조기에 발견하는 과정입니다.

- CD(Continuous Deployment/Delivery, 지속적 제공/배포):
  CI를 통과한 코드를 실제 프로덕션 환경에 자동으로 배포하거나 배포 가능한 상태로 유지하는 것을 말합니다.

- 필요성: 수동 배포의 실수를 줄이고, 개발자가 기능 구현에만 집중할 수 있는 환경을 만들어 제품의 업데이트 주기를 획기적으로 단축시킵니다.

<!--
#### Continuous Delivery와 Continuous Deployment의 차이는 무엇인가요?

- Continuous Delivery:
파이프라인의 마지막 단계가 '배포 가능한 상태'를 만드는 것이며, 실제 배포는 사람이 수동으로 버튼을 눌러 승인합니다.

- Continuous Deployment:
사람이 개입하지 않고, 모든 테스트를 통과하면 자동으로 실운영 환경에 배포가 완료되는 수준을 의미합니다.
-->

#### CI 파이프라인에서 프론트엔드 개발자가 주로 자동화하는 작업은 무엇인가요?

- Linting & Formatting
- Unit & Integration Tests: Jest나 Vitest를 실행하여 새로운 코드가 기존 기능을 망가뜨리지 않았는지 검증합니다.
- Build Check: Webpack이나 Vite를 통해 실제 배포용 번들이 에러 없이 생성되는지 확인합니다. (타입스크립트의 경우 타입 체크도 포함됩니다.)

#### 유의적 버전(semantic versioning; SemVer)

주(Major Version), 부(Minor), 수(Patch)

- 주 버전: 기존 버전과 호환되지 않게 API 변경
- 부 버전: 기존 버전과 호환되면서 새로운 기능 추가
- 수 버전: 기존 버전과 호환되면서 버그 수정
