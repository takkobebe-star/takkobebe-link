// Delivery Tracker(tracker.delivery) 클라이언트.
// 인증: 요청마다 `Authorization: TRACKQL-API-KEY <client_id>:<client_secret>` 헤더 (토큰 발급 없음).
// 제한: 초당 10회 → 호출 사이 120ms 대기. Free 플랜 키는 21일마다 콘솔에서 재발급(운영 메모 참고).

const GRAPHQL_URL = 'https://apis.tracker.delivery/graphql';

const TRACK_QUERY = `query Track($carrierId: ID!, $trackingNumber: String!) {
  track(carrierId: $carrierId, trackingNumber: $trackingNumber) {
    lastEvent { time status { code } }
  }
}`;

function makeError(message, code) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function makeTracker({ clientId, clientSecret, fetchFn = fetch, sleep = (ms) => new Promise((r) => setTimeout(r, ms)), minIntervalMs = 120, now = Date.now }) {
  // 초당 10회 제한: 동시에 여러 건을 돌려도 호출 '시작' 간격이 minIntervalMs 이상 벌어지게 한다 (120ms → 약 8회/초)
  let nextSlot = 0;
  async function throttle() {
    const t = now();
    const start = Math.max(t, nextSlot);
    nextSlot = start + minIntervalMs;
    if (start > t) await sleep(start - t);
  }
  // 2024-05-13 이후 발급된 키는 토큰 발급 없이 요청마다 이 헤더를 붙인다 (문서의 권장 방식)
  const authHeader = `TRACKQL-API-KEY ${clientId}:${clientSecret}`;

  async function graphql(variables) {
    const r = await fetchFn(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({ query: TRACK_QUERY, variables }),
    });
    const text = await r.text();
    if (!r.ok) throw makeError(`tracker ${r.status}: ${text.slice(0, 200)}`, `HTTP_${r.status}`);
    return JSON.parse(text);
  }

  async function track(carrierId, trackingNumber) {
    await throttle();

    const variables = { carrierId, trackingNumber: String(trackingNumber) };
    const json = await graphql(variables);
    if (json.errors && json.errors.length) {
      const e = json.errors[0];
      const code = (e.extensions && e.extensions.code) || 'GRAPHQL_ERROR';
      throw makeError(`tracker ${carrierId}/${trackingNumber}: ${e.message}`, code);
    }
    const last = json.data && json.data.track && json.data.track.lastEvent;
    if (!last || !last.status) return { code: 'UNKNOWN', time: null };
    return { code: last.status.code || 'UNKNOWN', time: last.time || null };
  }

  return { track };
}

// 위사 dlv_no(택배사 코드) → Delivery Tracker carrierId. 표는 WISA_CARRIER_MAP(JSON)으로 넘긴다.
function parseCarrierMap(envJson) {
  if (!envJson) return {};
  try {
    const obj = JSON.parse(envJson);
    return obj && typeof obj === 'object' ? obj : {};
  } catch (e) {
    return {};
  }
}

function carrierIdFor(dlvNo, map) {
  const key = String(dlvNo == null ? '' : dlvNo).trim();
  return (key && map[key]) || null;
}

// 위사 주문 상세(order API)의 products[].dlv_no 는 숫자가 아니라 택배사 이름이다.
// 공백·'택배' 접미사를 떼고 비교한다. 새 택배사가 보이면 여기에 한 줄 더한다.
const CARRIER_BY_NAME = {
  'cj대한통운': 'kr.cjlogistics', '대한통운': 'kr.cjlogistics', 'cj택배': 'kr.cjlogistics',
  '우체국': 'kr.epost', '우체국택배': 'kr.epost',
  '롯데': 'kr.lotte', '롯데택배': 'kr.lotte', '롯데글로벌로지스': 'kr.lotte',
  '로젠': 'kr.logen', '로젠택배': 'kr.logen',
  '한진': 'kr.hanjin', '한진택배': 'kr.hanjin',
  '경동': 'kr.kdexp', '경동택배': 'kr.kdexp',
  '대신': 'kr.daesin', '대신택배': 'kr.daesin',
  '일양로지스': 'kr.ilyanglogis', '일양': 'kr.ilyanglogis',
  '합동': 'kr.hdexp', '합동택배': 'kr.hdexp',
  '천일': 'kr.chunilps', '천일택배': 'kr.chunilps',
  'cu편의점택배': 'kr.cupost', 'cu편의점': 'kr.cupost',
  'gs편의점택배': 'kr.cvsnet', 'gs25편의점택배': 'kr.cvsnet',
};

function carrierIdForName(name) {
  if (!name) return null;
  const n = String(name).toLowerCase().replace(/\s+/g, '');
  if (CARRIER_BY_NAME[n]) return CARRIER_BY_NAME[n];
  const stripped = n.replace(/택배$/, '');
  return CARRIER_BY_NAME[stripped] || null;
}

module.exports = { makeTracker, carrierIdFor, carrierIdForName, parseCarrierMap, GRAPHQL_URL, TRACK_QUERY, CARRIER_BY_NAME };
