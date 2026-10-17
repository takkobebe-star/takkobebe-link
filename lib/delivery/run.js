// 배송완료 자동 처리 전체 흐름.
// 1) 위사 배송중 주문 수집 → 2) 배송중 상품만 추림 → 3) 송장별 택배 조회(중복 제거)
// 4) 판정(decide) → 5) 오래된 발송부터 setOrderStat(5) → 6) 재조회로 확인 → 7) 요약
const { kstYmd, parseKst, DAY_MS } = require('./bizdays');
const { decide } = require('./decide');
const { carrierIdFor, carrierIdForName } = require('./tracker');

const AUTH_FAIL = new Set(['UNAUTHENTICATED', 'FORBIDDEN', 'NO_TOKEN', 'HTTP_401', 'HTTP_403']);

// 위사 목록(orderList)의 dlv_no 는 입점사마다 다른 숫자 코드라 같은 CJ도 1·14·33처럼 여러 개다.
// 숫자표(carrierMap)에 없으면 그 코드가 들어 있는 주문 하나의 상세(order)를 읽어 택배사 이름을 얻고,
// 이름으로 carrierId를 정한다. 코드당 상세 조회는 한 번만 한다.
async function resolveCarriers(wisa, targets, carrierMap, summary) {
  const nameByCode = new Map();
  for (const t of targets) {
    const code = String(t.dlvNo == null ? '' : t.dlvNo).trim();
    if (!t.invoice) continue;
    const mapped = carrierIdFor(code, carrierMap);
    if (mapped) { t.carrierId = mapped; continue; }
    if (!code) continue;
    if (!nameByCode.has(code)) {
      try {
        const d = await wisa.getOrder(t.ono);
        summary.detailLookups++;
        for (const p of (d && d.products) || []) {
          // 상세의 dlv_no 는 이름. 같은 주문 안의 다른 상품 코드도 함께 배운다.
          const sib = targets.find((x) => x.ono === t.ono && String(x.orderProductNo) === String(p.order_product_no));
          if (sib) nameByCode.set(String(sib.dlvNo == null ? '' : sib.dlvNo).trim(), String(p.dlv_no || '').trim());
        }
        if (!nameByCode.has(code)) nameByCode.set(code, '');
      } catch (e) {
        nameByCode.set(code, '');
        summary.errors.push(`주문 상세 조회 실패 ${t.ono}: ${e.code || e.message}`);
      }
    }
    t.carrierName = nameByCode.get(code) || '';
    t.carrierId = carrierIdForName(t.carrierName);
  }
}

// 작은 동시 실행기: items를 concurrency개씩 동시에 fn으로 처리
async function mapPool(items, concurrency, fn) {
  let i = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(concurrency, items.length)) }, async () => {
    while (i < items.length) { const idx = i++; await fn(items[idx], idx); }
  });
  await Promise.all(workers);
}

// 옵션:
//  concurrency  택배 조회 동시 건수(기본 6). 호출 간격은 tracker가 지킨다.
//  budgetMs     택배 조회에 쓸 시간 예산(기본 220초). 넘기면 남은 송장은 이번엔 건너뛰고(조회 실패 취급) 다음 시간에 본다.
//  skipTracking 택배 조회를 아예 하지 않음(상태 페이지 빠른 모드). 비상 규칙만 판정한다.
async function run({ wisa, tracker, carrierMap, nowMs = Date.now(), dryRun = false, lookbackDays = 60, maxWrites = Infinity, concurrency = 6, budgetMs = 220000, skipTracking = false, clock = Date.now }) {
  const startedAt = clock();
  const summary = {
    dryRun, skipTracking, nowKst: kstYmd(nowMs),
    shippingOrders: 0, products: 0, invoices: 0, tracked: 0, trackedDelivered: 0, trackSkipped: 0,
    unknownCarrier: 0, trackErrors: 0, trackerDown: false, detailLookups: 0,
    due: 0, dueTracked: 0, dueFallback: 0, written: 0, verified: 0, failed: 0,
    items: [], errors: [], elapsedMs: 0,
  };

  // 1) 배송중 주문 (API는 최근 3개월만 → 60일 창)
  const sdate1 = `${kstYmd(nowMs - lookbackDays * DAY_MS)} 00:00:00`;
  const sdate2 = `${kstYmd(nowMs)} 23:59:59`;
  const orders = await wisa.listShipping({ sdate1, sdate2 });
  summary.shippingOrders = orders.length;

  // 2) 배송중 상품만
  const targets = [];
  for (const o of orders) {
    for (const p of o.products || []) {
      if (!/배송중/.test(String(p.stat || ''))) continue;
      const invoice = String(p.dlv_code || '').replace(/\D/g, '');
      targets.push({ ono: o.ono, orderProductNo: p.order_product_no, invoice, dlvNo: p.dlv_no, carrierId: null, carrierName: '', shippedMs: parseKst(o.date4), shippedAt: o.date4 || null });
    }
  }
  summary.products = targets.length;
  targets.sort((a, b) => (a.shippedMs || 0) - (b.shippedMs || 0));

  // 2.5) 택배사 정하기 (숫자표 → 없으면 주문 상세의 이름으로)
  await resolveCarriers(wisa, targets, carrierMap, summary);

  // 3) 송장별 택배 조회 (carrierId+송장 한 번씩, 오래된 발송부터, 동시 concurrency건, 시간 예산 안에서)
  const codes = new Map(); // key → code | null(실패·생략)
  const uniq = [];
  for (const t of targets) {
    if (!t.invoice) continue;
    if (!t.carrierId) { summary.unknownCarrier++; continue; }
    const key = `${t.carrierId}:${t.invoice}`;
    if (codes.has(key)) continue;
    codes.set(key, null);
    uniq.push({ key, carrierId: t.carrierId, invoice: t.invoice });
  }
  if (!skipTracking) {
    await mapPool(uniq, concurrency, async (u) => {
      if (summary.trackerDown) return;
      if (clock() - startedAt > budgetMs) { summary.trackSkipped++; return; }
      try {
        const r = await tracker.track(u.carrierId, u.invoice);
        codes.set(u.key, r.code);
        summary.tracked++;
        if (r.code === 'DELIVERED') summary.trackedDelivered++;
      } catch (e) {
        summary.trackErrors++;
        if (AUTH_FAIL.has(e.code)) { summary.trackerDown = true; summary.errors.push(`택배 조회 인증 실패: ${e.code} ${String(e.message || '').slice(0, 160)}`); }
        else summary.errors.push(`택배 조회 실패 ${u.key}: ${e.code || e.message}`);
      }
    });
  }
  summary.invoices = codes.size;

  // 4) 판정
  const due = [];
  for (const t of targets) {
    const trackCode = t.carrierId && t.invoice ? (codes.get(`${t.carrierId}:${t.invoice}`) ?? null) : null;
    const d = decide({ invoice: t.invoice, trackCode, shippedMs: t.shippedMs, nowMs });
    const item = { ono: t.ono, orderProductNo: t.orderProductNo, invoice: t.invoice, dlvNo: t.dlvNo, carrierName: t.carrierName, carrierId: t.carrierId, trackCode, shippedAt: t.shippedAt, reason: d.reason, result: null };
    summary.items.push(item);
    if (d.done) due.push(item);
  }
  summary.due = due.length;
  summary.dueTracked = due.filter(i => i.reason === 'tracked').length;
  summary.dueFallback = due.filter(i => i.reason === 'fallback').length;

  // 5) 처리 + 6) 확인
  let writes = 0;
  for (const item of due) {
    if (dryRun) { item.result = 'dry-run'; continue; }
    if (writes >= maxWrites) { item.result = 'deferred'; continue; }
    try {
      await wisa.setDelivered(item.ono, item.orderProductNo);
      writes++;
      summary.written++;
      const detail = await wisa.getOrder(item.ono);
      const p = ((detail && detail.products) || []).find(x => String(x.order_product_no) === String(item.orderProductNo));
      const ok = !!p && (String(p.stat_str || '') === '배송완료' || String(p.stat) === '5');
      item.result = ok ? 'ok' : 'unverified';
      if (ok) summary.verified++;
    } catch (e) {
      summary.failed++;
      item.result = `error: ${e.code || e.message}`;
      summary.errors.push(`배송완료 처리 실패 ${item.ono}/${item.orderProductNo}: ${e.code || e.message}`);
    }
  }

  summary.elapsedMs = clock() - startedAt;
  return summary;
}

module.exports = { run };
