const test = require('node:test');
const assert = require('node:assert/strict');
const { kstYmd, parseKst, isBusinessDay, addBusinessDays, fallbackDueMs } = require('../../lib/delivery/bizdays');

test('kstYmd: UTC 자정 직전은 한국에서 다음 날', () => {
  // 2026-10-12 23:30 UTC = 2026-10-13 08:30 KST
  assert.equal(kstYmd(Date.UTC(2026, 9, 12, 23, 30)), '2026-10-13');
});

test('parseKst: 위사 날짜 문자열을 KST로 읽는다', () => {
  assert.equal(parseKst('2026-10-12 09:08:59'), Date.parse('2026-10-12T09:08:59+09:00'));
  assert.ok(Number.isNaN(parseKst('')));
  assert.ok(Number.isNaN(parseKst('0000-00-00 00:00:00')));
});

test('isBusinessDay: 주말과 공휴일은 평일이 아니다', () => {
  assert.equal(isBusinessDay('2026-10-12'), true);   // 월
  assert.equal(isBusinessDay('2026-10-10'), false);  // 토
  assert.equal(isBusinessDay('2026-10-11'), false);  // 일
  assert.equal(isBusinessDay('2026-10-09'), false);  // 한글날(금)
  assert.equal(isBusinessDay('2026-10-05'), false);  // 개천절 대체공휴일(월)
});

test('addBusinessDays: 금요일 + 3평일 = 수요일', () => {
  assert.equal(addBusinessDays('2026-10-16', 3), '2026-10-21');
});

test('addBusinessDays: 추석 연휴를 건너뛴다', () => {
  // 2026-09-23(수) 발송 → 24·25·26 추석 연휴, 26·27 주말 → 28(월)=1, 29(화)=2, 30(수)=3
  assert.equal(addBusinessDays('2026-09-23', 3), '2026-09-30');
});

test('fallbackDueMs: 금요일 발송은 목요일 0시(KST)부터 완료 가능', () => {
  const shipped = parseKst('2026-10-16 14:00:00'); // 금
  assert.equal(fallbackDueMs(shipped), Date.parse('2026-10-22T00:00:00+09:00')); // 목
});

test('fallbackDueMs: 월요일 발송은 금요일 0시', () => {
  const shipped = parseKst('2026-10-12 09:00:00'); // 월
  assert.equal(fallbackDueMs(shipped), Date.parse('2026-10-16T00:00:00+09:00')); // 금
});
