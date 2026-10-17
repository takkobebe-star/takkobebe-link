// 한국 시간(KST, UTC+9) 기준 날짜·평일 계산.
// 평일 = 월~금 중 아래 공휴일이 아닌 날. 공휴일 표는 해마다 연말에 다음 해 분을 추가한다.

const KST_OFFSET_MS = 9 * 3600e3;
const DAY_MS = 86400e3;

// 관공서의 공휴일에 관한 규정 기준. 대체공휴일 포함. 선거일은 확정되면 추가.
const HOLIDAYS = new Set([
  // 2026
  '2026-01-01',
  '2026-02-16', '2026-02-17', '2026-02-18', // 설 연휴
  '2026-03-01', '2026-03-02',               // 삼일절(일) + 대체
  '2026-05-05',                             // 어린이날
  '2026-05-24', '2026-05-25',               // 부처님오신날(일) + 대체
  '2026-06-03',                             // 지방선거
  '2026-06-06',                             // 현충일(토, 대체 없음)
  '2026-08-15', '2026-08-17',               // 광복절(토) + 대체
  '2026-09-24', '2026-09-25', '2026-09-26', // 추석 연휴(토 겹침은 대체 없음)
  '2026-10-03', '2026-10-05',               // 개천절(토) + 대체
  '2026-10-09',                             // 한글날
  '2026-12-25',                             // 성탄절
  // 2027
  '2027-01-01',
  '2027-02-06', '2027-02-07', '2027-02-08', '2027-02-09', // 설 연휴(일 겹침) + 대체
  '2027-03-01',
  '2027-05-05',
  '2027-05-13',                             // 부처님오신날
  '2027-06-06',                             // 현충일(일, 대체 없음)
  '2027-08-15', '2027-08-16',               // 광복절(일) + 대체
  '2027-09-14', '2027-09-15', '2027-09-16', // 추석 연휴
  '2027-10-03', '2027-10-04',               // 개천절(일) + 대체
  '2027-10-09', '2027-10-11',               // 한글날(토) + 대체
  '2027-12-25', '2027-12-27',               // 성탄절(토) + 대체
]);

// epoch ms → KST 날짜 'YYYY-MM-DD'
function kstYmd(ms) {
  return new Date(ms + KST_OFFSET_MS).toISOString().slice(0, 10);
}

// 위사가 주는 'YYYY-mm-dd HH:ii:ss'(KST)를 epoch ms로. 비었거나 0000-00-00 이면 NaN.
function parseKst(s) {
  if (!s || /^0000/.test(s)) return NaN;
  const m = String(s).match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2}:\d{2})/);
  if (!m) return NaN;
  return Date.parse(`${m[1]}T${m[2]}+09:00`);
}

function isBusinessDay(ymd) {
  const dow = new Date(`${ymd}T00:00:00Z`).getUTCDay(); // 0=일, 6=토
  return dow !== 0 && dow !== 6 && !HOLIDAYS.has(ymd);
}

// ymd의 다음 날부터 평일을 n일 센 날짜
function addBusinessDays(ymd, n) {
  let ms = Date.parse(`${ymd}T00:00:00Z`);
  let count = 0;
  while (count < n) {
    ms += DAY_MS;
    if (isBusinessDay(new Date(ms).toISOString().slice(0, 10))) count++;
  }
  return new Date(ms).toISOString().slice(0, 10);
}

// 발송 시각 → 비상 완료가 가능해지는 시각.
// 발송일 다음 날부터 평일 days일을 센 날의 다음 날 KST 0시. (금요일 발송 → 월·화·수 → 목요일 0시)
function fallbackDueMs(shippedMs, days = 3) {
  const lastBiz = addBusinessDays(kstYmd(shippedMs), days);
  return Date.parse(`${lastBiz}T00:00:00+09:00`) + DAY_MS;
}

module.exports = { HOLIDAYS, kstYmd, parseKst, isBusinessDay, addBusinessDays, fallbackDueMs, DAY_MS };
