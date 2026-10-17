const test = require('node:test');
const assert = require('node:assert/strict');
const { run } = require('../../lib/delivery/run');

const NOW = Date.parse('2026-10-22T09:00:00+09:00'); // 목요일 아침
const MAP = { '1': 'kr.cjlogistics', '6': 'kr.lotte' };

function order(ono, date4, products) { return { ono, date4, stat: '배송중', products }; }
function prod(no, dlvNo, invoice, stat = '배송중') { return { order_product_no: no, pno: 1, name: '상품', dlv_no: dlvNo, dlv_code: invoice, stat }; }

// NAMES: 숫자 코드 → 상세 API가 돌려주는 택배사 이름 (상세의 products[].dlv_no 는 이름이다)
function fakeWisa(orders, detailStat = '배송완료', NAMES = { 1: 'CJ대한통운', 6: '롯데택배' }) {
  const calls = { set: [], get: [] };
  return {
    calls,
    listShipping: async () => orders,
    setDelivered: async (ono, no) => { calls.set.push([ono, no]); },
    getOrder: async (ono) => {
      calls.get.push(ono);
      const o = orders.find(x => x.ono === ono);
      return { ono, products: o.products.map(p => ({ order_product_no: p.order_product_no, stat: detailStat === '배송완료' ? 5 : 4, stat_str: detailStat, dlv_no: NAMES[p.dlv_no] || '', dlv_code: p.dlv_code })) };
    },
  };
}
function fakeTracker(table, { failWith } = {}) {
  const asked = [];
  return {
    asked,
    track: async (carrierId, invoice) => {
      asked.push(`${carrierId}:${invoice}`);
      if (failWith) { const e = new Error('x'); e.code = failWith; throw e; }
      const code = table[invoice];
      if (code === undefined) { const e = new Error('nf'); e.code = 'NOT_FOUND'; throw e; }
      return { code, time: null };
    },
  };
}

test('도착한 상품만 배송완료 처리하고 재조회로 확인한다', async () => {
  const orders = [
    order('O1', '2026-10-21 10:00:00', [prod(11, 1, '600820908970'), prod(12, 1, '600820908971')]), // 수요일 발송, 비상 규칙 아직
    order('O2', '2026-10-21 11:00:00', [prod(21, 6, '260176992213')]),
  ];
  const wisa = fakeWisa(orders);
  const tracker = fakeTracker({ '600820908970': 'DELIVERED', '600820908971': 'IN_TRANSIT', '260176992213': 'OUT_FOR_DELIVERY' });
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW });
  assert.equal(s.shippingOrders, 2);
  assert.equal(s.products, 3);
  assert.equal(s.invoices, 3);
  assert.equal(s.trackedDelivered, 1);
  assert.equal(s.due, 1);
  assert.deepEqual(wisa.calls.set, [['O1', 11]]);
  assert.equal(s.written, 1);
  assert.equal(s.verified, 1);
  assert.equal(s.items.find(i => i.orderProductNo === 11).result, 'ok');
  assert.equal(s.items.find(i => i.orderProductNo === 12).reason, null);
});

test('같은 송장이 여러 상품에 걸리면 한 번만 조회한다', async () => {
  const orders = [order('O1', '2026-10-21 10:00:00', [prod(11, 1, '111'), prod(12, 1, '111')])];
  const wisa = fakeWisa(orders);
  const tracker = fakeTracker({ '111': 'DELIVERED' });
  await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW });
  assert.deepEqual(tracker.asked, ['kr.cjlogistics:111']);
  assert.deepEqual(wisa.calls.set, [['O1', 11], ['O1', 12]]);
});

test('dryRun이면 아무것도 쓰지 않는다', async () => {
  const orders = [order('O1', '2026-10-21 10:00:00', [prod(11, 1, '111')])];
  const wisa = fakeWisa(orders);
  const s = await run({ wisa, tracker: fakeTracker({ '111': 'DELIVERED' }), carrierMap: MAP, nowMs: NOW, dryRun: true });
  assert.equal(s.due, 1);
  assert.equal(s.written, 0);
  assert.deepEqual(wisa.calls.set, []);
  assert.equal(s.items[0].result, 'dry-run');
});

test('평일 3일이 지난 상품은 조회 실패여도 fallback으로 완료한다', async () => {
  const orders = [order('O1', '2026-10-16 15:00:00', [prod(11, 1, '111')])]; // 금요일 발송 → 목요일 0시부터
  const wisa = fakeWisa(orders);
  const s = await run({ wisa, tracker: fakeTracker({}), carrierMap: MAP, nowMs: NOW });
  assert.equal(s.trackErrors, 1);
  assert.equal(s.dueFallback, 1);
  assert.deepEqual(wisa.calls.set, [['O1', 11]]);
});

test('택배사 코드를 모르면 주문 상세에서 이름을 읽어 정한다 (코드당 한 번)', async () => {
  const orders = [
    order('O1', '2026-10-21 10:00:00', [prod(11, 77, '111'), prod(12, 77, '112')]),
    order('O2', '2026-10-21 10:00:00', [prod(21, 77, '113')]),
  ];
  const wisa = fakeWisa(orders, '배송완료', { 77: '우체국택배' });
  const tracker = fakeTracker({ '111': 'DELIVERED', '112': 'IN_TRANSIT', '113': 'IN_TRANSIT' });
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW });
  assert.deepEqual(wisa.calls.get.slice(0, 1), ['O1'], '코드 77은 상세를 한 번만 읽는다');
  assert.equal(s.detailLookups, 1);
  assert.deepEqual(tracker.asked, ['kr.epost:111', 'kr.epost:112', 'kr.epost:113']);
  assert.equal(s.unknownCarrier, 0);
  assert.deepEqual(wisa.calls.set, [['O1', 11]]);
});

test('상세에서도 모르는 택배사 이름이면 조회하지 않고 센다 (비상 규칙은 적용)', async () => {
  const orders = [order('O1', '2026-10-21 10:00:00', [prod(11, 99, '111')])];
  const wisa = fakeWisa(orders, '배송완료', { 99: '듣보택배' });
  const tracker = fakeTracker({ '111': 'DELIVERED' });
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW });
  assert.equal(s.unknownCarrier, 1);
  assert.deepEqual(tracker.asked, []);
  assert.equal(s.due, 0);
  assert.equal(s.items[0].carrierName, '듣보택배');
});

test('토큰·인증 실패면 택배 조회를 통째로 건너뛰고 trackerDown', async () => {
  const orders = [order('O1', '2026-10-16 15:00:00', [prod(11, 1, '111')]), order('O2', '2026-10-21 10:00:00', [prod(21, 6, '222')])];
  const wisa = fakeWisa(orders);
  const tracker = fakeTracker({}, { failWith: 'UNAUTHENTICATED' });
  // 동시 조회면 첫 실패를 알아채기 전에 몇 건이 같이 나갈 수 있으므로 여기서는 1건씩 돌려 '멈춤'을 확인한다
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW, concurrency: 1 });
  assert.equal(s.trackerDown, true);
  assert.equal(tracker.asked.length, 1, '첫 실패 후 멈춘다');
  assert.deepEqual(wisa.calls.set, [['O1', 11]], '비상 규칙 대상만 처리');
});

test('송장 없는 상품과 배송중이 아닌 상품은 대상에서 뺀다', async () => {
  const orders = [order('O1', '2026-10-16 15:00:00', [prod(11, 1, ''), prod(12, 1, '111', '배송완료')])];
  const wisa = fakeWisa(orders);
  const s = await run({ wisa, tracker: fakeTracker({ '111': 'DELIVERED' }), carrierMap: MAP, nowMs: NOW });
  assert.equal(s.products, 1);
  assert.equal(s.invoices, 0);
  assert.deepEqual(wisa.calls.set, []);
});

test('재조회에서 아직 배송중이면 unverified로 센다', async () => {
  const orders = [order('O1', '2026-10-21 10:00:00', [prod(11, 1, '111')])];
  const wisa = fakeWisa(orders, '배송중');
  const s = await run({ wisa, tracker: fakeTracker({ '111': 'DELIVERED' }), carrierMap: MAP, nowMs: NOW });
  assert.equal(s.written, 1);
  assert.equal(s.verified, 0);
  assert.equal(s.items[0].result, 'unverified');
});

test('maxWrites로 한 번에 처리할 수를 제한한다 (오래된 발송부터)', async () => {
  const orders = [order('NEW', '2026-10-21 10:00:00', [prod(1, 1, '1')]), order('OLD', '2026-10-19 10:00:00', [prod(2, 1, '2')])];
  const wisa = fakeWisa(orders);
  const s = await run({ wisa, tracker: fakeTracker({ '1': 'DELIVERED', '2': 'DELIVERED' }), carrierMap: MAP, nowMs: NOW, maxWrites: 1 });
  assert.deepEqual(wisa.calls.set, [['OLD', 2]]);
  assert.equal(s.due, 2);
  assert.equal(s.written, 1);
});

test('동시 조회를 해도 결과는 같고 송장마다 한 번만 묻는다', async () => {
  const orders = Array.from({ length: 12 }, (_, k) => order(`O${k}`, '2026-10-21 10:00:00', [prod(100 + k, 1, String(1000 + k))]));
  const table = Object.fromEntries(orders.map((o, k) => [String(1000 + k), k % 3 === 0 ? 'DELIVERED' : 'IN_TRANSIT']));
  const wisa = fakeWisa(orders);
  const tracker = fakeTracker(table);
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW, concurrency: 4 });
  assert.equal(tracker.asked.length, 12);
  assert.equal(new Set(tracker.asked).size, 12);
  assert.equal(s.tracked, 12);
  assert.equal(s.trackedDelivered, 4);
  assert.equal(s.written, 4);
});

test('시간 예산을 넘기면 남은 송장은 건너뛰고 비상 규칙만 적용한다', async () => {
  const orders = [order('O1', '2026-10-21 10:00:00', [prod(11, 1, '111')]), order('O2', '2026-10-21 11:00:00', [prod(21, 1, '222')])];
  const wisa = fakeWisa(orders);
  const tracker = fakeTracker({ '111': 'DELIVERED', '222': 'DELIVERED' });
  let t = 0;
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW, concurrency: 1, budgetMs: 100, clock: () => { t += 80; return t; } });
  assert.equal(s.tracked, 1);
  assert.equal(s.trackSkipped, 1);
  assert.deepEqual(wisa.calls.set, [['O1', 11]]);
});

test('skipTracking이면 택배 조회 없이 비상 규칙만 판정한다', async () => {
  const orders = [order('O1', '2026-10-16 15:00:00', [prod(11, 1, '111')]), order('O2', '2026-10-21 10:00:00', [prod(21, 1, '222')])];
  const wisa = fakeWisa(orders);
  const tracker = fakeTracker({ '111': 'DELIVERED', '222': 'DELIVERED' });
  const s = await run({ wisa, tracker, carrierMap: MAP, nowMs: NOW, skipTracking: true, dryRun: true });
  assert.deepEqual(tracker.asked, []);
  assert.equal(s.invoices, 2);
  assert.equal(s.dueFallback, 1);
  assert.equal(s.dueTracked, 0);
});
