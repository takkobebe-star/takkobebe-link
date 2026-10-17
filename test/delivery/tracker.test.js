const test = require('node:test');
const assert = require('node:assert/strict');
const { makeTracker, carrierIdFor, parseCarrierMap, GRAPHQL_URL } = require('../../lib/delivery/tracker');
const TOKEN_URL = 'https://auth.tracker.delivery/oauth2/token'; // 더는 쓰지 않음: 호출되면 안 된다

function jsonRes(body, status = 200) {
  return { ok: status < 400, status, text: async () => JSON.stringify(body), json: async () => body };
}

test('요청마다 TRACKQL-API-KEY 헤더를 붙이고 track 결과의 마지막 상태 코드를 돌려준다', async () => {
  const calls = [];
  const fetchFn = async (url, opts) => {
    calls.push({ url: String(url), body: opts && opts.body, auth: opts && opts.headers && opts.headers.Authorization });
    return jsonRes({ data: { track: { lastEvent: { time: '2026-10-13T05:00:00+09:00', status: { code: 'DELIVERED' } } } } });
  };
  const t = makeTracker({ clientId: 'test-id', clientSecret: 'test-secret', fetchFn, sleep: async () => {} });
  const r1 = await t.track('kr.cjlogistics', '100000000001');
  const r2 = await t.track('kr.lotte', '200000000001');
  assert.deepEqual(r1, { code: 'DELIVERED', time: '2026-10-13T05:00:00+09:00' });
  assert.equal(r2.code, 'DELIVERED');
  assert.equal(calls.filter(c => c.url === TOKEN_URL).length, 0, '토큰 서버는 부르지 않는다');
  const gql = calls.filter(c => c.url === GRAPHQL_URL);
  assert.equal(gql.length, 2);
  assert.equal(gql[0].auth, 'TRACKQL-API-KEY test-id:test-secret');
  const sent = JSON.parse(gql[0].body);
  assert.deepEqual(sent.variables, { carrierId: 'kr.cjlogistics', trackingNumber: '100000000001' });
});

test('UNAUTHENTICATED/FORBIDDEN 오류는 그 코드로 던진다', async () => {
  const fetchFn = async () => jsonRes({ errors: [{ message: 'Authorization header is missing.', extensions: { code: 'FORBIDDEN' } }] });
  const t = makeTracker({ clientId: 'a', clientSecret: 'b', fetchFn, sleep: async () => {} });
  await assert.rejects(() => t.track('kr.lotte', '1'), (err) => err.code === 'FORBIDDEN');
});

test('NOT_FOUND 같은 오류는 code를 붙여 던진다', async () => {
  const fetchFn = async (url) => String(url) === TOKEN_URL
    ? jsonRes({ access_token: 'tok' })
    : jsonRes({ errors: [{ message: 'no such waybill', extensions: { code: 'NOT_FOUND' } }] });
  const t = makeTracker({ clientId: 'a', clientSecret: 'b', fetchFn, sleep: async () => {} });
  await assert.rejects(() => t.track('kr.lotte', '1'), (err) => err.code === 'NOT_FOUND');
});

test('HTTP 오류는 HTTP_<status> 코드로 던진다', async () => {
  const fetchFn = async (url) => String(url) === TOKEN_URL ? jsonRes({ access_token: 'tok' }) : jsonRes({}, 503);
  const t = makeTracker({ clientId: 'a', clientSecret: 'b', fetchFn, sleep: async () => {} });
  await assert.rejects(() => t.track('kr.lotte', '1'), (err) => err.code === 'HTTP_503');
});

test('track 데이터가 없으면(lastEvent null) code는 UNKNOWN', async () => {
  const fetchFn = async (url) => String(url) === TOKEN_URL ? jsonRes({ access_token: 'tok' }) : jsonRes({ data: { track: { lastEvent: null } } });
  const t = makeTracker({ clientId: 'a', clientSecret: 'b', fetchFn, sleep: async () => {} });
  assert.deepEqual(await t.track('kr.lotte', '1'), { code: 'UNKNOWN', time: null });
});

test('호출 시작 간격을 120ms 이상 벌린다 (동시에 불러도)', async () => {
  const slept = [];
  // 시계를 1000에 고정: 세 건이 한꺼번에 들어오면 두 번째는 120ms, 세 번째는 240ms 뒤에 시작해야 한다
  const fetchFn = async () => jsonRes({ data: { track: { lastEvent: { time: null, status: { code: 'IN_TRANSIT' } } } } });
  const t = makeTracker({ clientId: 'a', clientSecret: 'b', fetchFn, sleep: async (ms) => { slept.push(ms); }, now: () => 1000 });
  await Promise.all([t.track('kr.lotte', '1'), t.track('kr.lotte', '2'), t.track('kr.lotte', '3')]);
  assert.deepEqual(slept, [120, 240]);
});

test('carrierIdFor / parseCarrierMap', () => {
  const map = parseCarrierMap('{"1":"kr.cjlogistics","6":"kr.lotte"}');
  assert.equal(carrierIdFor(1, map), 'kr.cjlogistics');
  assert.equal(carrierIdFor('6', map), 'kr.lotte');
  assert.equal(carrierIdFor('99', map), null);
  assert.deepEqual(parseCarrierMap(''), {});
  assert.deepEqual(parseCarrierMap(undefined), {});
  assert.deepEqual(parseCarrierMap('not json'), {});
});

test('carrierIdForName: 위사 택배사 이름 → Delivery Tracker carrierId', () => {
  const { carrierIdForName } = require('../../lib/delivery/tracker');
  assert.equal(carrierIdForName('CJ대한통운'), 'kr.cjlogistics');
  assert.equal(carrierIdForName('우체국택배'), 'kr.epost');
  assert.equal(carrierIdForName('롯데택배'), 'kr.lotte');
  assert.equal(carrierIdForName('로젠'), 'kr.logen');
  assert.equal(carrierIdForName('로젠택배'), 'kr.logen');
  assert.equal(carrierIdForName('한진택배'), 'kr.hanjin');
  assert.equal(carrierIdForName(' CJ 대한통운 '), 'kr.cjlogistics');
  assert.equal(carrierIdForName('듣보택배'), null);
  assert.equal(carrierIdForName(''), null);
  assert.equal(carrierIdForName(null), null);
});
