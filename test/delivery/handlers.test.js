const test = require('node:test');
const assert = require('node:assert/strict');
const sync = require('../../api/delivery-sync');
const status = require('../../api/delivery-status');

function mockRes() {
  const r = { code: 0, body: null, headers: {} };
  r.setHeader = (k, v) => { r.headers[k] = v; };
  r.status = (c) => { r.code = c; return r; };
  r.json = (b) => { r.body = b; return r; };
  return r;
}
const okEnv = { WISA_API_HASH: 'h', DT_CLIENT_ID: 'i', DT_CLIENT_SECRET: 's', CRON_SECRET: 'sec', DT_CREDENTIAL_EXPIRES_AT: '2026-11-03T00:00:00+09:00' };
const fakeSummary = { dryRun: true, shippingOrders: 1, products: 1, invoices: 1, trackedDelivered: 0, unknownCarrier: 0, trackErrors: 0, trackerDown: false, due: 0, dueTracked: 0, dueFallback: 0, written: 0, verified: 0, failed: 0, items: [{ ono: '20990101-TEST1', orderProductNo: 1, invoice: '100000000001', carrierId: 'kr.cjlogistics', trackCode: 'IN_TRANSIT', shippedAt: '2026-10-12 10:00:00', reason: null, result: null }], errors: [] };

test('sync: CRON_SECRET 없거나 다르면 401', async () => {
  const h = sync.makeHandler({ env: okEnv, run: async () => fakeSummary, makeWisa: () => ({}), makeTracker: () => ({}) });
  const res = mockRes();
  await h({ headers: {}, query: {} }, res);
  assert.equal(res.code, 401);
});

test('sync: 맞는 비밀로 호출하면 run 결과를 돌려주고 dry=1이면 dryRun', async () => {
  let seen;
  const h = sync.makeHandler({ env: okEnv, run: async (opts) => { seen = opts; return fakeSummary; }, makeWisa: () => ({ tag: 'w' }), makeTracker: () => ({ tag: 't' }) });
  const res = mockRes();
  await h({ headers: { authorization: 'Bearer sec' }, query: { dry: '1' } }, res);
  assert.equal(res.code, 200);
  assert.equal(seen.dryRun, true);
  assert.equal(seen.wisa.tag, 'w');
  assert.equal(res.body.shippingOrders, 1);
});

test('sync: max=2면 maxWrites 2로 넘긴다', async () => {
  let seen;
  const h = sync.makeHandler({ env: okEnv, run: async (opts) => { seen = opts; return fakeSummary; }, makeWisa: () => ({}), makeTracker: () => ({}) });
  await h({ headers: { authorization: 'Bearer sec' }, query: { max: '2' } }, mockRes());
  assert.equal(seen.maxWrites, 2);
  await h({ headers: { authorization: 'Bearer sec' }, query: {} }, mockRes());
  assert.equal(seen.maxWrites, Infinity);
});

test('sync: DELIVERY_MAX_WRITES 환경변수와 ?max 중 작은 값을 쓴다', async () => {
  let seen;
  const h = sync.makeHandler({ env: { ...okEnv, DELIVERY_MAX_WRITES: '2' }, run: async (opts) => { seen = opts; return fakeSummary; }, makeWisa: () => ({}), makeTracker: () => ({}) });
  await h({ headers: { authorization: 'Bearer sec' }, query: {} }, mockRes());
  assert.equal(seen.maxWrites, 2);
  await h({ headers: { authorization: 'Bearer sec' }, query: { max: '1' } }, mockRes());
  assert.equal(seen.maxWrites, 1);
  await h({ headers: { authorization: 'Bearer sec' }, query: { max: '5' } }, mockRes());
  assert.equal(seen.maxWrites, 2);
});

test('sync: 필수 env가 빠지면 500과 missing', async () => {
  const h = sync.makeHandler({ env: { CRON_SECRET: 'sec' }, run: async () => fakeSummary, makeWisa: () => ({}), makeTracker: () => ({}) });
  const res = mockRes();
  await h({ headers: { authorization: 'Bearer sec' }, query: {} }, res);
  assert.equal(res.code, 500);
  assert.deepEqual(res.body.missing, ['WISA_API_HASH', 'DT_CLIENT_ID', 'DT_CLIENT_SECRET']);
});

test('status: 인증 없이 dryRun 요약을 가려서 준다', async () => {
  let seen;
  const h = status.makeHandler({ env: okEnv, run: async (opts) => { seen = opts; return fakeSummary; }, makeWisa: () => ({ loginCheck: async () => true }), makeTracker: () => ({}), now: () => Date.parse('2026-10-13T12:00:00+09:00') });
  const res = mockRes();
  await h({ headers: {}, query: {} }, res);
  assert.equal(res.code, 200);
  assert.equal(seen.dryRun, true);
  assert.equal(res.headers['Cache-Control'], 'no-store');
  assert.equal(res.body.credential.daysLeft, 20);
  assert.equal(res.body.credential.warn, false);
  assert.equal(res.body.wisaLogin, true);
  assert.equal(res.body.items[0].invoice, '****0001');
  assert.equal(res.body.items[0].ono, '20990101-****');
});

test('status: 기본은 택배 조회 생략(quick), full=1이면 포함', async () => {
  let seen;
  const h = status.makeHandler({ env: okEnv, run: async (opts) => { seen = opts; return fakeSummary; }, makeWisa: () => ({ loginCheck: async () => true }), makeTracker: () => ({}), now: () => Date.now() });
  const r1 = mockRes();
  await h({ headers: {}, query: {} }, r1);
  assert.equal(seen.skipTracking, true);
  assert.equal(r1.body.mode, 'quick');
  const r2 = mockRes();
  await h({ headers: {}, query: { full: '1' } }, r2);
  assert.equal(seen.skipTracking, false);
  assert.equal(r2.body.mode, 'full');
});

test('status: 오류 문구 속 송장번호도 가린다', async () => {
  const h = status.makeHandler({ env: okEnv, run: async () => ({ ...fakeSummary, errors: ['택배 조회 실패 kr.cjlogistics:100000000001: NOT_FOUND'] }), makeWisa: () => ({ loginCheck: async () => true }), makeTracker: () => ({}), now: () => Date.now() });
  const res = mockRes();
  await h({ headers: {}, query: {} }, res);
  assert.deepEqual(res.body.errors, ['택배 조회 실패 kr.cjlogistics:****0001: NOT_FOUND']);
});

test('status: run이 실패해도 200으로 오류 문구를 준다', async () => {
  const h = status.makeHandler({ env: okEnv, run: async () => { throw new Error('boom'); }, makeWisa: () => ({ loginCheck: async () => false }), makeTracker: () => ({}), now: () => Date.now() });
  const res = mockRes();
  await h({ headers: {}, query: {} }, res);
  assert.equal(res.code, 200);
  assert.match(res.body.error, /boom/);
  assert.equal(res.body.wisaLogin, false);
});
