// 상품후기 쓰기 창의 '상품선택' 목록 (로그인 안 한 손님용)
//   now    = 지금 판매 중 (메뉴 분류 목록에서 품절이 아닌 상품. 위사는 품절 상품을 목록 뒤로 보내므로 품절이 나오는 쪽까지만 읽는다)
//   recent = 작성일 기준 두 달 전(같은 날짜)까지 공구로 판매한 상품(지금도 판매 중이어도 여기) (카카오워크 공구 캘린더 /api/mycal 의 지난 두 달 공구 → 상품 연결)
//            2026-10-06 사용자 요청: 한 달 → 두 달
// 로그인한 손님의 '구매한 상품'은 손님 브라우저가 자기 주문내역에서 직접 읽는다(주문 정보는 이 서버로 오지 않는다).
// 2026-09-23 사용자 요청.

const SHOP = "https://m.takkobebe.com";
const API_BASE = "https://takkobebe-link.vercel.app";
const MONTHS = 2;   // 작성일로부터 몇 달 전까지 판매한 상품을 보여 줄지

// 메뉴의 대분류 (쇼핑몰 메뉴 기준 2026-09-23). 없는 분류는 건너뛴다.
const CATS = ["1005", "1001", "1002", "1006", "1067", "1121", "1043", "1042"];

// 캘린더 일정 중 상품 공구가 아닌 것. '[정산완료]' 는 끝나고 정산까지 마친 공구라 넣는다
// (/api/mycal 의 product 표시는 '정산'이 들어가면 false 라서 쓰지 않는다)
const NON_PRODUCT = /휴가|연차|출근|명절판매|미정/;
function isProduct(title) {
  if (NON_PRODUCT.test(title)) return false;
  return !/정산/.test(title.replace(/\[\s*정산완료\s*\]/g, ""));
}

// 캘린더 제목만으로는 상품을 못 찾는 공구 → 직접 잇는다(제목에 이 글자가 있으면). 캘린더 메모에 상품 링크를 넣으면 그게 먼저다.
const MANUAL = [
  // 성게KIT(2026-08-25~27) → 자연산 단새우니 홈마카세 KIT
  ["성게", ["11C484EA9305EA4C7BB6B2E6D570D466"]],
  // 추석선물 기획전(2026-09-14~19) → [2026 추석] 선물세트들
  ["추석선물 기획전", ["FF49CC40A8890E6A60F40FF3026D2730", "28F0B864598A1291557BED248A998D4E",
    "CD0CBCC668FE4BC58E0AF3CC7E0A653D", "6150CCC6069BEA6B5716254057A194EF"]],
  // 설성목장 부리또(검색·목록을 꺼 둔 상품이라 검색으로 못 찾는다) → 설성목장 한우 불고기 부리또 (2026-10-06)
  ["설성목장 부리또", ["5B8E4FD39D9786228649A8A8BEC4E008"]],
  // 인도원단 핸드메이드 로브(N차) → [본사몰 결제] 보헤미안 로브 (2026-10-06)
  ["인도원단 핸드메이드 로브", ["17C3433FECC21B57000DEBDF7AD5C930"]],
];

// 검색·점수 계산에서 빼는 흔한 낱말
const WEAK = /^(타코|기획전|공구|오픈|마감|할인전|할인|추석맞이|세트|kit|정산완료|차|릴스|속|제품)$/i;

const UA = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";

async function fetchText(url, ms) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms || 6000);
  try {
    const r = await fetch(url, { signal: ctrl.signal, headers: { "User-Agent": UA, "Accept-Language": "ko-KR,ko;q=0.9" } });
    return r.ok ? await r.text() : "";
  } catch (e) {
    return "";
  } finally {
    clearTimeout(t);
  }
}

function clean(s) {
  return s.replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&#039;|&#39;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}
// 목록에 보일 이름 — 짧게 (2026-09-23 사용자 요청 '제품명을 간결하게')
// ① 앞의 대괄호는 뗀다([정기배송]만 남긴다 — 같은 상품과 구별해야 해서)
// ② '면역력 업!' 처럼 앞에 붙은 홍보 문구(! 나 , 로 끊기는 짧은 말)는 뗀다
// ③ 그래도 긴 것은 아래 표에 짧은 이름을 적어 둔다(상품번호 앞 8자리)
const SHORT = {
  "0A09C884": "29금란",
  "E2EF524F": "참기름&들기름",
  "812B4BA2": "꼬소콩국물",
  "06409663": "jmt감바스 KIT",
  "02522A2B": "명인요거트",
  "57C0531E": "쌀누룩 소금&간장",
  "5E9F92A0": "김치우동KIT",
  "6C4B761A": "썬드라이드 토마토",
  "BD4C9AB7": "들깨 메밀막국수",
  "1C9AC015": "현미후레이크",
  "8613985E": "딥초코 브라우니",
  "38B3EFF8": "명이나물 장아찌",
  "3988C7F8": "[정기배송] 명인치즈&요거트",
  "0609154F": "TKBB 양쪽필통",
  "5878A7AB": "우리아이 청결제",
  "A9813E95": "엑스트라버진 올리브오일",
  "95F8D990": "고소애",
  "11C484EA": "단새우니 홈마카세 KIT",
  "0B1EC366": "테라비코스 기획전",
  "3875115B": "도산회관 주먹밥",
};
function showName(s, pno) {
  if (pno && SHORT[String(pno).slice(0, 8).toUpperCase()]) return SHORT[String(pno).slice(0, 8).toUpperCase()];
  let t = String(s).trim();
  let keep = "";
  for (;;) {
    const m = t.match(/^\s*\[([^\]]*)\]\s*/);
    if (!m) break;
    if (/정기배송/.test(m[1])) { keep = "[정기배송] "; }
    t = t.slice(m[0].length);
  }
  const m2 = t.match(/^([^!,]{1,24}[!,])\s*(.+)$/);
  if (m2 && m2[2].trim().length >= 3) t = m2[2].trim();
  t = t.replace(/\s*!+\s*$/, "").replace(/\s+/g, " ").trim();
  return (keep + t).trim();
}

// 자주 찾는 상품 차례 (2026-09-23 사용자: 계란 · 엉덩이쌀빵 · 참기름 · 치즈 순)
const PRIORITY = [/금란|계란/, /쌀빵/, /참기름/, /치즈/];
function prio(name) {
  for (let i = 0; i < PRIORITY.length; i++) if (PRIORITY[i].test(name)) return i;
  return 99;
}
function byPriority(arr) {
  return arr.map((it, i) => ({ it, i }))
    .sort((a, b) => (prio(a.it.name) - prio(b.it.name)) || (a.i - b.i))
    .map((x) => x.it);
}

// 상품 목록 HTML → [{pno, name, out}]
function parseBoxes(html) {
  const out = [];
  const re = /<div class="box ([^"]*)">([\s\S]*?)<\/li>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const p = m[2].match(/pno=([A-F0-9]{16,})/i);
    const n = m[2].match(/<p class="name">\s*<a[^>]*>([\s\S]*?)<\/a>/i);
    if (p && n) out.push({ pno: p[1].toUpperCase(), name: clean(n[1]), out: /(^|\s)out(\s|$)/.test(m[1]) });
  }
  return out;
}

// 한 분류에서 품절 전까지(판매 중) 상품
async function onSaleIn(cno) {
  const list = [];
  const first = await fetchText(`${SHOP}/shop/big_section.php?cno1=${cno}`);
  if (!first || /존재하지 않는 분류/.test(first)) return list;
  let items = parseBoxes(first);
  for (let page = 2; page <= 12; page++) {
    for (const it of items) { if (it.out) return list; list.push(it); }
    const q = new URLSearchParams({ exec_file: "skin_module/skin_ajax.php", obj_id: "prd_basic", _tmp_file_name: "shop/big_section.php",
      single_module: "prd_basic", striplayout: "1", module_page: String(page), document_url: `${SHOP}/shop/big_section.php?cno1=${cno}`, cno1: cno });
    const t = await fetchText(`${SHOP}/main/exec.php?${q}`);
    let d = null;
    try { d = JSON.parse(t); } catch (e) { return list; }
    items = parseBoxes((d && d.content) || "");
    if (!items.length) return list;
  }
  return list;
}

// 상품 페이지의 og:title 로 상품명 (없는 상품이면 빈 값)
async function nameOf(pno) {
  const html = await fetchText(`${SHOP}/shop/detail.php?pno=${pno}`);
  const m = html.match(/<meta property="og:title" content="([^"]*)"/i);
  return m ? clean(m[1].split("|")[0]) : "";
}

async function searchShop(word) {
  const html = await fetchText(`${SHOP}/shop/search_result.php?search_str=${encodeURIComponent(word)}`);
  return html ? parseBoxes(html) : [];
}

// 'YYYY-MM-DD' 의 n달 전 같은 날짜 (그 달에 없는 날이면 그 달 마지막 날 — 12/31 → 10/31, 4/30 → 2/28)
function monthsAgo(ymd, n) {
  const [y, m, d] = ymd.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1 - n, 1));
  const last = new Date(Date.UTC(t.getUTCFullYear(), t.getUTCMonth() + 1, 0)).getUTCDate();
  t.setUTCDate(Math.min(d, last));
  return t.toISOString().slice(0, 10);
}

function kstDate(offsetDays) {
  return new Date(Date.now() + 9 * 3600e3 - (offsetDays || 0) * 86400e3).toISOString().slice(0, 10);
}

// 띄어쓰기·기호를 빼고 비교한다 ('산도0.18' ↔ '산도 0.18% …')
function squash(s) {
  return String(s).replace(/[\s!?.,%&·'"()\[\]\/+-]/g, "").toLowerCase();
}

function words(title) {
  const base = title.replace(/\[[^\]]*\]/g, " ").replace(/\([^)]*\)/g, " ").replace(/^\s*\d+\s*[.)]\s*/, " ");
  return (base.match(/[0-9A-Za-z가-힣.%]{2,}/g) || []).map((w) => w.replace(/[.%]+$/, "")).filter((w) => w.length >= 2 && !WEAK.test(w));
}

// 같은 서버 인스턴스가 살아 있는 동안은 30분 동안 다시 만들지 않는다 (CDN 캐시가 비어 있을 때도 빠르게)
let MEMO = null;

async function build() {
    // ① 지금 판매 중 + ② 최근 두 달 공구(캘린더)를 동시에 읽는다
    const today = kstDate(0), from = monthsAgo(today, MONTHS);
    const DAYS = Math.round((Date.parse(today) - Date.parse(from)) / 86400e3);
    const [lists, calTxt] = await Promise.all([
      Promise.all(CATS.map(onSaleIn)),
      fetchText(`${API_BASE}/api/mycal?days=${DAYS + 2}`, 8000),
    ]);
    const nowAll = [], onSale = {};
    for (const l of lists) for (const it of l) if (!onSale[it.pno]) { onSale[it.pno] = 1; nowAll.push({ pno: it.pno, name: showName(it.name, it.pno) }); }

    let events = [];
    try { events = (JSON.parse(calTxt).events || []); } catch (e) {}
    // 두 달 전 같은 날짜 이후에 끝났거나 진행 중인 공구
    events = events.filter((ev) => isProduct(ev.title || "")
      && String(ev.start).slice(0, 10) <= today && String(ev.end).slice(0, 10) >= from)
      .sort((a, b) => (String(a.end) < String(b.end) ? 1 : -1));   // 최근에 끝난 것부터

    // 공구마다 상품 찾기 — 한꺼번에(병렬로). 같은 낱말 검색은 한 번만
    const cache = {};
    const search = (w) => (cache[w] = cache[w] || searchShop(w));
    const pickFor = async (ev) => {
      const title = ev.title || "";
      // 메모에 상품 링크가 있으면 그것들
      const links = [...String(ev.memo || "").matchAll(/pno=([A-F0-9]{16,})/gi)].map((m) => m[1].toUpperCase());
      const manual = MANUAL.find(([k]) => title.includes(k));
      const toks = words(title);
      let picked = [];
      if (links.length || manual) {
        const want = links.length ? links : manual[1];
        const names = await Promise.all(want.map(nameOf));
        want.forEach((p, i) => { if (names[i]) picked.push({ pno: p, name: names[i] }); });
      } else if (toks.length) {
        // 가장 긴 낱말부터 검색해 제목 낱말이 가장 많이 겹치는 상품
        const order = toks.slice().sort((a, b) => b.length - a.length).slice(0, 2);
        const cand = {};
        for (const res of await Promise.all(order.map(search))) for (const c of res) cand[c.pno] = c;
        // 점수 = 띄어쓰기 빼고 겹친 낱말 수, 같으면 띄어쓰기까지 그대로 겹친 낱말이 많은 쪽
        // ('아이스망고' → '트로피코 아이스망고' 가 '설빙 아이스 망고바' 보다 앞)
        let best = [], bestSq = 0, bestLit = -1;
        for (const c of Object.values(cand)) {
          const nm = squash(c.name);
          const sq = toks.filter((t) => nm.includes(squash(t))).length;
          const lit = toks.filter((t) => c.name.includes(t)).length;
          if (sq > bestSq || (sq === bestSq && sq > 0 && lit > bestLit)) { best = [c]; bestSq = sq; bestLit = lit; }
          else if (sq === bestSq && sq > 0 && lit === bestLit) best.push(c);
        }
        // 낱말이 하나뿐인 제목(예: '아이스망고')은 1개로 인정, 여러 개면 2개 이상 겹쳐야
        if (bestSq >= Math.min(2, toks.length) && best.length <= 2) picked = best;
      }
      return picked;
    };
    const picks = await Promise.all(events.map((ev) => pickFor(ev).catch(() => [])));

    // ③ 묶음 (2026-10-06 사용자 요청: '최근 두 달 판매' → '지금 판매 중' 차례)
    //   recent = 두 달 안에 공구로 판 상품 (지금도 판매 중이어도 여기). 최근에 끝난 공구부터
    //   now    = 나머지 판매 중 상품 — 지금 공구 중 → 자주 찾는 상품(계란·쌀빵·참기름·치즈) → 나머지
    const recent = [], inRecent = {}, liveSet = {};
    events.forEach((ev, i) => {
      const s0 = String(ev.start).slice(0, 10), e0 = String(ev.end).slice(0, 10);
      const evLive = s0 <= today && today <= e0;
      for (const c of picks[i]) {
        const pno = c.pno.toUpperCase();
        if (evLive) liveSet[pno] = 1;
        if (!(s0 < today)) continue;           // 오늘 시작해 아직 안 판 공구는 '최근 판매'에 넣지 않는다
        if (inRecent[pno]) continue;
        inRecent[pno] = 1;
        recent.push({ pno, name: showName(c.name, pno), end: e0 });
      }
    });
    const rest = nowAll.filter((it) => !inRecent[it.pno]);
    const isTop = (it) => prio(it.name) < 99;
    const now = rest.filter((it) => liveSet[it.pno])
      .concat(byPriority(rest.filter((it) => !liveSet[it.pno] && isTop(it))))
      .concat(rest.filter((it) => !liveSet[it.pno] && !isTop(it)));
    // live·top 은 예전 화면 코드와 맞추려고 빈 칸으로 남긴다
    return { recent, now, live: [], top: [], from, today, complete: nowAll.length > 0 };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  if (req.method === "OPTIONS") { res.status(204).end(); return; }
  try {
    let d = MEMO && Date.now() - MEMO.t < 30 * 60e3 && MEMO.d.today === kstDate(0) ? MEMO.d : null;
    if (!d) { d = await build(); if (d.complete) MEMO = { t: Date.now(), d }; }
    const { complete, ...body } = d;
    // CDN 1시간 캐시 + 지난 결과를 먼저 주고 뒤에서 새로 만들기(하루). Vercel 전용 헤더도 같이 둔다
    const cc = complete ? "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400" : "public, max-age=0, s-maxage=60";
    res.setHeader("Cache-Control", cc);
    res.setHeader("CDN-Cache-Control", complete ? "max-age=3600, stale-while-revalidate=86400" : "max-age=60");
    res.setHeader("Vercel-CDN-Cache-Control", complete ? "max-age=3600, stale-while-revalidate=86400" : "max-age=60");
    res.status(200).json(body);
  } catch (e) {
    res.setHeader("Cache-Control", "s-maxage=60");
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
