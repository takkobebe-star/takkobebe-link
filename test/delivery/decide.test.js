const test = require('node:test');
const assert = require('node:assert/strict');
const { decide } = require('../../lib/delivery/decide');
const { parseKst } = require('../../lib/delivery/bizdays');

const shippedFri = parseKst('2026-10-16 14:00:00'); // 금
const wedNoon = parseKst('2026-10-21 12:00:00');
const thu0001 = parseKst('2026-10-22 00:01:00');

test('송장이 없으면 건드리지 않는다', () => {
  assert.deepEqual(decide({ invoice: '', trackCode: 'DELIVERED', shippedMs: shippedFri, nowMs: thu0001 }), { done: false, reason: null });
});

test('택배가 DELIVERED면 바로 완료(tracked)', () => {
  assert.deepEqual(decide({ invoice: '123', trackCode: 'DELIVERED', shippedMs: shippedFri, nowMs: shippedFri + 3600e3 }), { done: true, reason: 'tracked' });
});

test('배송중이고 평일 3일 전이면 유지', () => {
  assert.deepEqual(decide({ invoice: '123', trackCode: 'IN_TRANSIT', shippedMs: shippedFri, nowMs: wedNoon }), { done: false, reason: null });
});

test('조회 실패(null)여도 평일 3일 지나면 완료(fallback)', () => {
  assert.deepEqual(decide({ invoice: '123', trackCode: null, shippedMs: shippedFri, nowMs: thu0001 }), { done: true, reason: 'fallback' });
});

test('발송일시를 모르면 비상 규칙을 적용하지 않는다', () => {
  assert.deepEqual(decide({ invoice: '123', trackCode: null, shippedMs: NaN, nowMs: thu0001 }), { done: false, reason: null });
});
