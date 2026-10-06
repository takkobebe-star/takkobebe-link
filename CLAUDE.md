# 타코베베 작업 규칙 (Claude 필독)

이 저장소는 세 계정(takkobebe2015@gmail.com, takkobebe@gmail.com, takkobebe@naver.com)이 번갈아 수정합니다.
다른 사람이 고친 내용이 옛날 버전으로 덮이지 않도록, 어느 계정으로 작업하든 아래 규칙을 지킵니다.

## 1. 작업 시작 전: 항상 최신 main에서 출발

- 수정 요청을 받으면 파일을 열기 전에 먼저 최신 내용을 받습니다.
  ```
  git fetch origin main
  git checkout -B <새-브랜치> origin/main
  ```
- 대화 앞부분에서 본 파일 내용, 예전 세션의 작업 폴더, 기억해 둔 코드를 기준으로 작업하지 않습니다.
  수정하기 직전에 파일을 다시 읽습니다.
- 브랜치는 매번 새로 만듭니다. 예전 브랜치를 다시 쓰지 않습니다.

## 2. 수정: 요청한 부분만

- 요청받은 부분만 고칩니다. 파일 전체를 다시 쓰거나, 관련 없는 줄을 정리·되돌리지 않습니다.
- 특히 `tkbb-main.js`는 여러 사람이 매일 고치는 큰 파일이니 필요한 줄만 Edit로 바꿉니다.

## 3. 배포: main에 Merge하는 것만이 배포

- 사이트(takkobebe-link.vercel.app)는 GitHub main에 Merge되면 자동으로 배포됩니다.
- **`vercel deploy`, `npx vercel ...` 등으로 직접 배포하지 않습니다.**
  내 컴퓨터나 세션의 파일이 옛날 버전이면, 직접 배포하는 순간 다른 계정이 고친 내용이 사이트에서 사라집니다.
  GitHub 기록에는 남아 있는데 사이트만 옛날 모습이 되는 원인이 이것입니다.
- `git push --force`(강제 푸시)를 하지 않습니다.

## 4. PR 올리기 전 점검

- PR을 만들기 직전에 다시 `git fetch origin main` 후 최신 main 위로 rebase 합니다.
- 충돌(conflict)이 나면 **직접 해결하지 말고** 사용자에게 어떤 파일의 어떤 부분이 겹치는지 먼저 알립니다.
- `git diff origin/main...HEAD`로 바뀐 내용을 확인해, 요청과 상관없는 삭제(빨간 줄)가 있으면 PR을 만들지 않고 고칩니다.
- PR 설명에 "무엇을 바꿨는지"를 한두 줄로 적습니다. 사용자는 Merge 전에 Files changed 탭에서 바뀐 줄을 확인합니다.
