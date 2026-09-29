# takkobebe-link

타코베베 쇼핑몰(m.takkobebe.com) 메인 화면과 공구 일정을 움직이는 코드입니다.
`https://takkobebe-link.vercel.app` 으로 배포되며, 위사 스킨이 이 주소의 스크립트와 API를 불러옵니다.

> 2026-09-29: Vercel 운영 배포(`dpl_3P9feZzLK`, 2026-09-28)의 소스를 그대로 백업한 첫 커밋입니다.

## 구성

| 경로 | 역할 |
|---|---|
| `api/schedule.js` | 손님용 공구 일정 JSON (쇼핑몰 메인 배너·칩·"곧 열려요") |
| `api/mycal.js` | 사장님 전용: 캘린더 모든 일정 (내부 메모 포함) |
| `tkbb-main.js` | 쇼핑몰 메인을 그리는 스크립트 (위사 스킨이 불러옴) |
| `month.html` | 공구 달력 페이지 |
| `calendar.html` | 운영용 캘린더 |
| `index.html`, `keywords.html` | 기타 페이지 |
| `api/instagram.js`, `api/youtube.js`, `api/keywords.js`, `api/review-products.js` | 보조 API |
| `*-desc.txt`, `*-desc.js`, `img/` | 상품 상세 설명·이미지 |
| `qm/` | 메인 퀵메뉴 아이콘 |

## 일정 연동

`api/schedule.js`, `api/mycal.js` 는 Vercel 환경변수 `KAKAOWORK_ICS_URL` 에 넣어 둔
캘린더 iCal 주소를 읽습니다. 주소는 비밀 주소라 코드에 넣지 않고 환경변수에만 둡니다.
캘린더 수정 후 최대 10분 안에 쇼핑몰에 반영됩니다.

## 주의

- 이 폴더의 파일이 곧 운영 화면입니다. 파일을 지우거나 통째로 바꾸면 쇼핑몰 메인이 깨집니다.
- 수정은 브랜치 → Pull Request → 확인 후 `main` 병합 순서로 진행하세요.
