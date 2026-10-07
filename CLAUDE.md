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
- PR 설명에 "무엇을 바꿨는지"를 한두 줄로 적습니다.

## 5. Merge: 점검을 통과하면 Claude가 직접 Merge

- 위 점검을 모두 통과하면 사용자 확인을 기다리지 않고 Claude가 바로 Merge합니다.
  ```
  gh api -X PUT repos/takkobebe-star/takkobebe-link/pulls/<번호>/merge -f merge_method=merge
  gh api -X DELETE repos/takkobebe-star/takkobebe-link/git/refs/heads/<브랜치>
  ```
  Claude 세션에서는 `gh pr create/merge/checks`(GraphQL)가 막혀 있어 위처럼 REST(`gh api`)로 합니다.
  PR 만들기: `gh api repos/takkobebe-star/takkobebe-link/pulls -f title=... -f head=<브랜치> -f base=main -f body=...`
  체크 확인: `gh api repos/takkobebe-star/takkobebe-link/commits/<커밋>/check-runs` 와 `.../commits/<커밋>/status`
  Merge commit 방식만 씁니다. squash·rebase 방식, `--admin`(보호 규칙 우회), main 직접 push는 쓰지 않습니다.
- Merge 직전에 한 번 더 `git fetch origin main` 합니다. 그사이 main이 바뀌었으면 rebase → diff 확인 후 다시 점검합니다.
- 아래 중 하나라도 해당하면 Merge하지 않고 PR 링크와 이유만 알립니다.
  - 충돌, 요청과 무관한 삭제, 실패한 체크
  - A/B안을 아직 고르지 않은 요청
  - `api/` 파일 수정, 파일 삭제, `vercel.json` 기존 항목 변경 (새 헤더 블록 추가만 한 경우는 Merge 가능)
  - 가격 등 확인되지 않은 값이 남아 있음
  - 사용자가 "PR만", "Merge하지 마"라고 한 경우
- Merge 후 1~2분 뒤 `https://takkobebe-link.vercel.app/<바꾼 파일>?t=<시각>`에서 바뀐 내용이 보이는지 확인해 보고합니다.
- Merge 후 화면이 깨졌다는 말을 들으면 원인을 찾기 전에 먼저 그 PR을 되돌리는 revert PR을 만들어 Merge합니다.
