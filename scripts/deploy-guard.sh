#!/bin/sh
# 실제 사이트(production) 배포는 GitHub main의 최신 커밋에서만 허용한다.
# vercel deploy / npx vercel 로 컴퓨터의 옛날 파일을 바로 올리면
# 다른 계정이 고친 내용이 사이트에서 사라지므로, 그런 배포는 여기서 멈춘다.
# PR 미리보기(preview) 배포는 막지 않는다.

if [ "$VERCEL_ENV" != "production" ]; then
  echo "[deploy-guard] 미리보기 배포라서 그대로 진행해요."
  exit 0
fi

stop() {
  echo ""
  echo "=================================================================="
  echo "[deploy-guard] 배포를 멈췄어요: $1"
  echo "사이트 배포는 GitHub에 PR을 올리고 main에 Merge하는 방법으로만 해 주세요."
  echo "vercel deploy / npx vercel 로 바로 올리면 다른 계정의 수정이 지워져요."
  echo "=================================================================="
  echo ""
  exit 1
}

[ -n "$VERCEL_GIT_COMMIT_SHA" ] || stop "GitHub를 거치지 않은 배포예요."
[ "$VERCEL_GIT_COMMIT_REF" = "main" ] || stop "main이 아닌 곳(${VERCEL_GIT_COMMIT_REF:-알 수 없음})에서 온 배포예요."

MAIN_SHA=$(git ls-remote https://github.com/takkobebe-star/takkobebe-link.git refs/heads/main 2>/dev/null | cut -f1)

if [ -z "$MAIN_SHA" ]; then
  echo "[deploy-guard] GitHub main을 확인하지 못했지만 GitHub 배포라서 진행해요."
  exit 0
fi

[ "$MAIN_SHA" = "$VERCEL_GIT_COMMIT_SHA" ] || stop "main 최신 내용이 아니에요. (배포 ${VERCEL_GIT_COMMIT_SHA}, main ${MAIN_SHA})"

echo "[deploy-guard] main 최신 커밋 확인 완료. 배포를 진행해요."
exit 0
