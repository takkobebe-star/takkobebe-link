타코베베 메인 퀵메뉴 아이콘 폴더

메인 퀵메뉴 7칸에 그대로 들어간다. 파일이 없으면
tkbb-main.js 의 onerror 가 기존 상품사진으로 대신 채운다.

  1.jpg  공구진행    → 메인 '지금 진행 중'
  2.jpg  상시판매    → 먹거리 (cno1=1005)
  3.jpg  영양제      → 영양제 (cno1=1067)
  4.jpg  화장품      → 화장품 (cno1=1002)
  5.jpg  학용품      → 키즈 학용품 (cno1=1001)
  6.jpg  후기        → 상품후기 전체
  7.jpg  공구달력    → takkobebe-link.vercel.app

원형 47px 로 잘려 보이므로 정사각 320x320, 피사체가 가운데.
흰 배경 그림(화장품·후기)은 배경을 옅은 베이지로 갈아끼웠다.
원본은 takkobebe-shop/backup/퀵메뉴원본/ 에 있다.
저장 후 배포: npx vercel deploy --prod --yes --scope takko
