// 상품 하나를 배송완료로 바꿀지 판정하는 순수 함수.
// 1) 송장 없음 → 유지(위사 자체 N일 규칙에 맡김)
// 2) 택배 마지막 상태가 DELIVERED → 완료(tracked)
// 3) 그 외·조회 실패 → 발송일부터 평일 3일이 지났으면 완료(fallback)
const { fallbackDueMs } = require('./bizdays');

function decide({ invoice, trackCode, shippedMs, nowMs }) {
  if (!invoice) return { done: false, reason: null };
  if (trackCode === 'DELIVERED') return { done: true, reason: 'tracked' };
  if (Number.isFinite(shippedMs) && nowMs >= fallbackDueMs(shippedMs)) return { done: true, reason: 'fallback' };
  return { done: false, reason: null };
}

module.exports = { decide };
