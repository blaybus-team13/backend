# Blaybus #13

## 실행 방법
* npm install로 express 실행에 필요한 패키지 설치
* docker를 사용함 - 개발 환경을 통일하기 위해
* docker desktop이 필요함
* 현재 디렉토리에서 `docker-compose up -d` // 혹은 `docker compose up -d` 를 실행
* 터미널에서 `docker ps`를 입력했을 때 mysql이라는 컨테이너가 Up 이면 정상 실행된 것
* mysql 컨테이너가 잘 실행 되었다면 `npm run dev`로 개발 환경 시작
* 브라우저 localhost:3000으로 접근했을 때 Hello world가 뜬다면 DB와 연결된 Express 서버가 실행 된 것