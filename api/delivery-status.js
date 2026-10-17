// 상태 페이지용. 쓰기 없이(dryRun) 지금 판정을 계산해 개인정보 없는 요약과 키 만료 정보를 준다.
const { readEnv, credentialDaysLeft } = require('../lib/delivery/env');
const { run } = require('../lib/delivery/run');
const { makeWisa } = require('../lib/delivery/wisa');
const { makeTracker } = require('../lib/delivery/tracker');

const WARN_DAYS = 3;

function mask(item) {
  return {
    ...item,
    ono: String(item.ono || '').replace(/^(.{8}).*$/, '$1-****'),
    invoice: item.invoice ? `****${String(item.invoice).slice(-4)}` : '',
  };
}

// 주문·상품 객체에서 개인정보가 아닌 필드만 골라 모양을 보여 준다
const SAFE_ORDER = ['ono', 'stat', 'stat2', 'date1', 'date2', 'date3', 'date4', 'date5', 'channel', 'pay_type'];
const SAFE_PRODUCT = ['order_product_no', 'pno', 'stat', 'status', 'dlv_no', 'dlv_code', 'buy_ea', 'is_gift'];
async function debugShape(wisa, nowMs) {
  const { kstYmd, DAY_MS } = require('../lib/delivery/bizdays');
  const sdate1 = `${kstYmd(nowMs - 60 * DAY_MS)} 00:00:00`;
  const sdate2 = `${kstYmd(nowMs)} 23:59:59`;
  const orders = await wisa.listShipping({ sdate1, sdate2 });
  const count = (arr) => arr.reduce((m, k) => { const key = String(k); m[key] = (m[key] || 0) + 1; return m; }, {});
  const pick = (obj, keys) => Object.fromEntries(keys.filter((k) => k in (obj || {})).map((k) => [k, obj[k]]));
  const maskOrder = (o) => {
    const safe = pick(o, SAFE_ORDER);
    safe.ono = String(o.ono || '').replace(/^(.{8}).*$/, '$1-****');
    safe.products = (o.products || []).map((p) => {
      const sp = pick(p, SAFE_PRODUCT);
      if (sp.dlv_code) sp.dlv_code = `****${String(sp.dlv_code).slice(-4)}`;
      sp.keys = Object.keys(p);
      return sp;
    });
    safe.keys = Object.keys(o);
    return safe;
  };
  const products = orders.flatMap((o) => o.products || []);
  return {
    window: { sdate1, sdate2 },
    orders: orders.length,
    orderStat: count(orders.map((o) => o.stat)),
    orderDate4Missing: orders.filter((o) => !o.date4).length,
    productStat: count(products.map((p) => p.stat)),
    productStatus: count(products.map((p) => p.status)),
    productDlvNo: count(products.map((p) => p.dlv_no)),
    sample: orders.slice(0, 3).map(maskOrder),
  };
}

// 택배사 코드(dlv_no)마다 주문 하나의 상세를 읽어, 택배 관련 필드와 처리 이력 문구만 돌려준다 (송장은 뒤 4자리만)
async function debugCarriers(wisa, nowMs) {
  const { kstYmd, DAY_MS } = require('../lib/delivery/bizdays');
  const sdate1 = `${kstYmd(nowMs - 60 * DAY_MS)} 00:00:00`;
  const sdate2 = `${kstYmd(nowMs)} 23:59:59`;
  const orders = await wisa.listShipping({ sdate1, sdate2 });
  const byCode = new Map();
  for (const o of orders) for (const p of o.products || []) {
    const k = String(p.dlv_no);
    if (!byCode.has(k)) byCode.set(k, { ono: o.ono, orderProductNo: p.order_product_no, invoice: p.dlv_code });
  }
  const maskDigits = (s) => String(s == null ? '' : s).replace(/\d{9,}/g, (m) => `****${m.slice(-4)}`);
  const out = {};
  for (const [code, ref] of byCode) {
    try {
      const d = await wisa.getOrder(ref.ono);
      const p = ((d && d.products) || []).find((x) => String(x.order_product_no) === String(ref.orderProductNo)) || {};
      const dlvFields = Object.fromEntries(Object.entries(p).filter(([k]) => /dlv|deliv|trans|courier|invoice|parcel|ship/i.test(k)).map(([k, v]) => [k, maskDigits(v)]));
      const orderDlvFields = Object.fromEntries(Object.entries(d || {}).filter(([k]) => /dlv|deliv|trans|courier|invoice|parcel|ship/i.test(k) && k !== 'dlv_prc').map(([k, v]) => [k, typeof v === 'object' ? JSON.stringify(v).slice(0, 200) : maskDigits(v)]));
      const logs = ((d && d.stat_log) || []).map((l) => `${l.date} ${maskDigits(l.summary)}`).filter((s) => /배송|택배|송장/.test(s)).slice(0, 4);
      out[code] = { sampleOno: String(ref.ono).replace(/^(.{8}).*$/, '$1-****'), productKeys: Object.keys(p), dlvFields, orderDlvFields, logs };
    } catch (e) {
      out[code] = { error: e.code || e.message };
    }
  }
  return { orders: orders.length, carriers: out };
}

function makeHandler(deps = {}) {
  const d = { env: process.env, run, makeWisa, makeTracker, now: Date.now, ...deps };
  return async (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const env = readEnv(d.env);
    const nowMs = d.now();
    const daysLeft = credentialDaysLeft(env.dtExpiresAt, nowMs);
    const out = {
      checkedAt: new Date(nowMs).toISOString(),
      missing: env.missing,
      credential: { expiresAt: env.dtExpiresAt || null, daysLeft, warn: daysLeft === null || daysLeft <= WARN_DAYS },
      wisaLogin: null,
    };
    try {
      const wisa = d.makeWisa({ base: env.wisaBase, hash: env.wisaHash });
      try { out.wisaLogin = await wisa.loginCheck(env.wisaMngId); } catch (e) { out.wisaLogin = false; }
      // ?debug=1 : 위사 응답의 필드 이름과 상태값 분포만 본다 (이름·주소·연락처 등 개인정보는 내려주지 않음)
      if (req.query && req.query.debug === '1') {
        out.debug = await debugShape(wisa, nowMs);
        return res.status(200).json(out);
      }
      // ?debug=2 : 택배사 코드(dlv_no)별로 주문 하나씩 상세를 읽어 택배 관련 필드만 본다
      if (req.query && req.query.debug === '2') {
        out.debug = await debugCarriers(wisa, nowMs);
        return res.status(200).json(out);
      }
      const tracker = d.makeTracker({ clientId: env.dtClientId, clientSecret: env.dtClientSecret });
      // 기본은 빠른 모드(택배 조회 생략, 비상 규칙만). ?full=1 이면 택배 조회까지 해서 '도착했는데 미처리'를 센다(몇 분 걸릴 수 있음).
      const full = !!(req.query && req.query.full === '1');
      out.mode = full ? 'full' : 'quick';
      const s = await d.run({ wisa, tracker, carrierMap: env.carrierMap, dryRun: true, nowMs, skipTracking: !full, budgetMs: 250000 });
      const maskDigits = (str) => String(str).replace(/\d{9,}/g, (m) => `****${m.slice(-4)}`);
      Object.assign(out, s, { items: (s.items || []).slice(0, 30).map(mask), errors: (s.errors || []).slice(0, 20).map(maskDigits) });
    } catch (e) {
      out.error = String((e && e.message) || e);
    }
    return res.status(200).json(out);
  };
}

module.exports = makeHandler();
module.exports.makeHandler = makeHandler;
