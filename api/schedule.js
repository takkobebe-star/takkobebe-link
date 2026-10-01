// 카카오워크 장터캘린더(iCal)를 읽어 공개 가능한 공구 일정만 JSON으로 돌려준다.
// 캘린더 주소는 Vercel 환경변수 GOOGLE_ICS_URL(예전: KAKAOWORK_ICS_URL)에만 보관한다 (클라이언트 노출 금지).

// 제목에 이 단어가 들어간 일정은 아예 노출하지 않는다 (내부/미확정 일정)
const SKIP = /미정|휴가|연차|정산완료|명절판매/;
// 괄호 안에 이 단어가 들어가면 내부 메모로 보고 괄호째 지운다
const INTERNAL_NOTE = /확인|결정|샘플링|게릴라|좋으면|넣기|마감이니|예정/;

function unescapeIcs(s) {
  return s
    .replace(/\\n/gi, "\n")
    .replace(/\\,/g, ",")
    .replace(/\\;/g, ";")
    .replace(/\\\\/g, "\\");
}

// "20260903" → "2026-09-03" / "20260903T110000" → "2026-09-03 11:00"
function fmtIcsDate(v, isEnd) {
  const m = v.match(/^(\d{4})(\d{2})(\d{2})(?:T(\d{2})(\d{2}))?/);
  if (!m) return null;
  if (!m[4]) {
    // 종일 일정: iCal의 DTEND는 다음 날을 가리키므로 하루 빼서 실제 마지막 날로 맞춘다
    const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
    if (isEnd) d.setUTCDate(d.getUTCDate() - 1);
    return d.toISOString().slice(0, 10);
  }
  return `${m[1]}-${m[2]}-${m[3]} ${m[4]}:${m[5]}`;
}

// ── 캘린더 일정 '설명(메모)'란에 적은 가격·배송 문구를 읽는다 (2026-09-29) ──
// 외부 쇼핑몰(설성몰 등)로 연결되는 공구는 쇼핑몰이 가격을 읽어 올 수 없어서 배너 아래가 비었다.
// 설명란에 아래처럼 한 줄씩 적으면 그대로 배너에 나온다. 순서는 상관없고, 적은 것만 바뀐다.
//   가격: 52,200원~   (콜론은 있어도 없어도 된다)
//   정가: 98,100원
//   배송: 5만 원 이상 무료배송 · 당일·새벽배송
// 할인율은 가격과 정가로 자동 계산하므로 '할인율' 줄은 읽지 않는다.
// (구글 캘린더 설명란은 줄바꿈·링크가 HTML 로 저장되므로 태그를 걷어 낸 뒤 읽는다)
const DESC_FIELDS = [
  ["sell", "가격|판매가|특가", 30],
  ["cons", "정가|원가|소비자가", 30],
  ["ship", "배송", 40],
];
function descText(s) {
  return String(s || "")
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|li|h\d)>/gi, "\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
}
function parseDescFields(desc) {
  const out = {};
  for (const line of descText(desc).split("\n")) {
    for (const [key, names, max] of DESC_FIELDS) {
      if (out[key]) continue;
      // "가격: 18,100원~" · "가격 : 18,100원~" · "가격 18,100원~" 모두 읽는다.
      // 이름 바로 뒤가 콜론이나 띄어쓰기여야 하므로 "배송비 4,000원" 같은 다른 낱말은 걸리지 않는다.
      const m = line.match(new RegExp("^\\s*(?:" + names + ")(?:\\s*[:：]\\s*|\\s+)(.+?)\\s*$"));
      if (m) out[key] = m[1].slice(0, max);
    }
  }
  return out;
}

function parseIcs(text) {
  // 접힌 줄(다음 줄이 공백으로 시작) 펼치기
  const lines = text.replace(/\r\n/g, "\n").replace(/\n[ \t]/g, "").split("\n");
  const events = [];
  let cur = null;
  for (const line of lines) {
    if (line === "BEGIN:VEVENT") { cur = {}; continue; }
    if (line === "END:VEVENT") { if (cur) events.push(cur); cur = null; continue; }
    if (!cur) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).split(";")[0];
    const val = line.slice(idx + 1);
    if (key === "SUMMARY") cur.summary = unescapeIcs(val);
    if (key === "DTSTART") cur.start = fmtIcsDate(val, false);
    if (key === "DTEND") cur.end = fmtIcsDate(val, true);
    if (key === "DESCRIPTION") cur.desc = unescapeIcs(val);
    // 일정 메모나 URL 필드에 상품 링크가 있으면 구매 링크로 사용
    if (key === "DESCRIPTION" || key === "URL") {
      // 카카오워크 메모는 &를 &amp; 로 적어 보낸다
      const m = unescapeIcs(val).replace(/&amp;/g, "&").match(/https?:\/\/[^\s"'<>]+/);
      if (m && !cur.url) {
        let u = m[0];
        // 쇼핑몰 상품 주소는 검색·분류 꼬리(rURL, cno1 …)를 떼고 상품번호만 남긴다.
        // 검색 결과에서 복사한 링크는 상품번호가 뒤에 붙어 있기도 하다.
        const p = u.match(/takkobebe\.com\/shop\/detail\.php\?(?:[^#]*&)?pno=([A-F0-9]{16,})/i);
        if (p) u = SHOP + "/shop/detail.php?pno=" + p[1];
        cur.url = u;
      }
    }
  }
  return events;
}

// ── 진행중 상품 자동 링크: 쇼핑몰 메인의 상품 후보와 일정 제목을 매칭 ──
const SHOP = "https://m.takkobebe.com";

// 캘린더 메모에 링크가 없고 검색으로도 못 찾는 일정을 직접 이어 준다(제목에 이 글자가 들어 있으면).
// 캘린더 메모에 링크를 넣으면 그게 먼저다. 새로 이을 일정이 생기면 여기에 한 줄 추가.
const MANUAL = [
  // 인도원단 핸드메이드 로브(차수마다 같은 상품) → 쇼핑몰 '[본사몰 결제] 보헤미안 로브' (2026-09-21)
  ["인도원단 핸드메이드 로브", SHOP + "/shop/detail.php?pno=17C3433FECC21B57000DEBDF7AD5C930"],
  // 설성목장 부리또(캘린더 '설성목장 부리또 2종') → 쇼핑몰 '설성목장 한우 불고기 부리또'(관리 2287).
  // 가격이 정해질 때까지 목록·검색을 꺼 둔 상품이라 검색으로는 못 찾는다 (2026-09-22 사용자 요청)
  ["설성목장 부리또", SHOP + "/shop/detail.php?pno=5B8E4FD39D9786228649A8A8BEC4E008"],
];

async function fetchText(url) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 5000);
  try {
    // 쇼핑몰이 자동접근으로 보고 막는 일이 있어 브라우저처럼 요청한다
    const r = await fetch(url, {
      signal: ctrl.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
        "Accept-Language": "ko-KR,ko;q=0.9",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    return r.ok ? await r.text() : "";
  } catch (e) {
    return "";
  } finally {
    clearTimeout(t);
  }
}

// 쇼핑몰 검색으로 일정 제목에 맞는 상품을 찾는다.
// 진행 중이 아니어도(오픈 예정이어도) 상품이 이미 등록돼 있으면 연결해 준다.
const SEARCH_SKIP = /타코|기획전|공구|오픈|마감|차$/;
async function searchLink(events) {
  await Promise.all(events.map(async (ev) => {
    if (ev.url) return;
    // 괄호(차수 표기 등)는 빼고 낱말만 뽑는다
    const base = ev.title.replace(/\([^)]*\)/g, " ");
    const toks = (base.match(/[0-9A-Za-z가-힣]{2,}/g) || []).filter((t) => !SEARCH_SKIP.test(t));
    if (!toks.length) return;

    // 낱말마다 검색해서 후보(상품번호 → 상품명)를 모은다
    const cand = {};
    for (const tok of toks.slice(0, 3)) {
      const html = await fetchText(SHOP + "/shop/search_result.php?search_str=" + encodeURIComponent(tok));
      if (!html) continue;
      const re = /<p class="name">\s*<a[^>]*pno=([A-F0-9]{16,})[^>]*>([\s\S]*?)<\/a>/gi;
      let m;
      while ((m = re.exec(html)) !== null) {
        cand[m[1]] = m[2].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
      }
    }

    // 제목의 낱말이 가장 많이 겹치는 상품을 고른다.
    // 한 낱말만 겹치면(예: 'TKBB' 하나로 엉뚱한 필통이 걸림) 연결하지 않는다.
    let best = null, bestScore = 0;
    for (const pno of Object.keys(cand)) {
      const name = cand[pno];
      let score = 0;
      for (const t of toks) if (name.includes(t)) score++;
      if (score > bestScore) { best = pno; bestScore = score; }
    }
    if (best && bestScore >= 2) ev.url = SHOP + "/shop/detail.php?pno=" + best;
  }));
}

// 메인에 걸린 상품 중에서 찾는다.
// 상품 페이지 HTML 전체가 아니라 상품명(og:title)과 맞춰본다.
// (상세페이지에는 연관상품 등 남의 상품명도 들어 있어서, HTML 전체로 보면 엉뚱한 상품이 걸린다)
async function autoLink(events) {
  const home = await fetchText(SHOP + "/");
  const pnos = [...new Set([...home.matchAll(/detail\.php\?pno=([A-F0-9]{16,})/g)].map((m) => m[1]))].slice(0, 8);
  if (!pnos.length) return;
  const pages = await Promise.all(
    pnos.map(async (p) => {
      const html = await fetchText(SHOP + "/shop/detail.php?pno=" + p);
      const m = html.match(/<meta property="og:title" content="([^"]*)"/i);
      return { pno: p, name: m ? m[1].split("|")[0].trim() : "" };
    })
  );
  for (const ev of events) {
    const base = ev.title.replace(/\([^)]*\)/g, " ");
    const toks = (base.match(/[0-9A-Za-z가-힣]{2,}/g) || []).filter((t) => !SEARCH_SKIP.test(t));
    if (toks.length < 2) continue;
    let best = null, bestScore = 0;
    for (const pg of pages) {
      if (!pg.name) continue;
      let score = 0;
      for (const t of toks) if (pg.name.includes(t)) score++;
      if (score > bestScore) { best = pg; bestScore = score; }
    }
    // 낱말이 2개 이상 겹쳐야 인정 ('TKBB' 하나로 엉뚱한 상품이 걸리는 것을 막는다)
    if (best && bestScore >= 2) ev.url = SHOP + "/shop/detail.php?pno=" + best.pno;
  }
}

// 연결된 상품 페이지를 서버가 한 번만 읽어 대표사진·가격·배송정보를 일정에 담아 둔다.
// 이러면 손님 브라우저가 상품 페이지(한 장에 300KB쯤)를 따로 받지 않아도 되어 배너가 훨씬 빨리 뜬다.
function pick(html, re) {
  const m = html.match(re);
  return m ? m[1].replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim() : "";
}
async function enrich(events) {
  await Promise.all(events.map(async (ev) => {
    if (!ev.url) return;
    // 바깥 링크(브랜드몰·스마트스토어 등)로 파는 공구 — 그 페이지의 대표 사진만 읽어 배너·칩에 쓴다.
    // 가격·'바로구매' 여부는 쇼핑몰 구조가 달라 읽지 않는다. 버튼은 그대로 그 링크로 보낸다.
    if (!/detail\.php/.test(ev.url)) {
      const ext = (await fetchText(ev.url)) || (await fetchText(ev.url));
      if (!ext) return;
      const extImg = pick(ext, /<meta property="og:image" content="([^"]*)"/i);
      if (extImg) ev.img = extImg.replace(/&amp;/g, "&");
      ev.ext = true;
      return;
    }
    // 쇼핑몰이 느리거나(5초 초과) 잠깐 오류·빈 응답을 주면 한 번만 더 읽는다.
    // 못 읽은 채로 두면 사진·가격이 빠진 응답이 CDN 에 10분 넘게 남는다.
    const html = (await fetchText(ev.url)) || (await fetchText(ev.url));
    if (!html) return;
    const img = pick(html, /<meta property="og:image" content="([^"]*)"/i);
    if (img) ev.img = img;
    const name = pick(html, /<meta property="og:title" content="([^"]*)"/i);
    if (name) ev.name = name.split("|")[0].trim();
    const sell = pick(html, /class="sell[^"]*"[^>]*>([\s\S]{0,120}?)<\/(?:span|strong|div|p)>/i);
    if (sell) ev.sell = sell;
    const cons = pick(html, /class="consumer[^"]*"[^>]*>([\s\S]{0,120}?)<\/(?:span|strong|div|p)>/i);
    if (cons) ev.cons = cons;
    const copy = pick(html, /class="summary"[^>]*>([\s\S]{0,200}?)<\/(?:span|div|p)>/i);
    if (copy && copy.length < 60) ev.copy = copy;
    // 배송정보 행
    // 줄바꿈(<br>)은 가운뎃점으로 살려서 한 줄로 만든다 (붙어서 "무료배송9/29부터"처럼 보이지 않게)
    const ship = pick(html.replace(/<br\s*\/?>/gi, " · "), /<th[^>]*>\s*배송정보\s*<\/th>\s*<td[^>]*>([\s\S]{0,200}?)<\/td>/i).replace(/^(\s*·\s*)+|(\s*·\s*)+$/g, "");
    if (ship) ev.ship = ship.slice(0, 40);
    // '바로구매' 버튼이 있으면 지금 살 수 있는 상품
    ev.onSale = /바로구매/.test(html);
  }));
}

function cleanTitle(summary) {
  // 첫 줄만 사용 (둘째 줄부터는 내부 메모)
  let t = summary.split("\n")[0].trim();
  // 끝에 붙은 내부 메모 괄호 제거 (상품 설명 괄호는 유지)
  const m = t.match(/\(([^)]*)\)\s*$/);
  if (m && INTERNAL_NOTE.test(m[1])) t = t.slice(0, m.index).trim();
  return t;
}

// 제목 앞 번호 "1. 립 틴트" → 1, 번호가 없으면 맨 뒤로
function titleNo(title) {
  const m = title.match(/^\s*(\d+)\s*[.)]/);
  return m ? +m[1] : Infinity;
}

// 쇼핑몰(m/www.takkobebe.com)에서도 이 API를 읽을 수 있게 허용한다.
// 브라우저는 다른 도메인의 응답을 기본으로 막으므로 아래 헤더가 없으면 쇼핑몰에서 일정을 못 읽는다.
// 예전엔 요청한 도메인만 골라 허용했는데(Vary: Origin), 2026-09-21 PC 쇼핑몰도 이 API를 부르기 시작하자
// PC용('www 만 허용') 응답이 캐시에서 모바일로 넘어가 모바일 메인 배너가 통째로 안 뜬 적이 있다.
// 손님 화면에 그대로 보여 주는 공개 일정이고 쿠키도 안 쓰므로, 모든 도메인에 같은 응답('*')을 준다.
function setCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
}

module.exports = async (req, res) => {
  setCors(req, res);
  if (req.method === "OPTIONS") { res.status(204).end(); return; }

  // 2026-09-29 카카오워크 → 구글 캘린더(takkobebe.official) 전환. 구글 주소가 없으면 예전 카카오워크 주소를 읽는다.
  const url = process.env.GOOGLE_ICS_URL || process.env.KAKAOWORK_ICS_URL;
  if (!url) {
    res.status(500).json({ error: "GOOGLE_ICS_URL not configured" });
    return;
  }
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error("ics fetch failed: " + r.status);
    const text = await r.text();

    const cutoff = new Date(Date.now() - 2 * 86400000).toISOString().slice(0, 10);
    const events = parseIcs(text)
      .filter((ev) => ev.summary && ev.start && ev.end)
      .filter((ev) => !SKIP.test(ev.summary))
      .map((ev) => ({ title: cleanTitle(ev.summary), start: ev.start, end: ev.end, url: ev.url || null, memo: parseDescFields(ev.desc) }))
      .filter((ev) => ev.title && ev.end.slice(0, 10) >= cutoff)
      // 시작일 빠른 순 → 같은 날이면 제목 앞 번호("1.", "2." …) 순, 번호 없는 일정은 번호 있는 일정 뒤
      // → 그것도 같으면 캘린더 파일에 적힌 순서 유지
      .sort((a, b) => {
        if (a.start !== b.start) return a.start < b.start ? -1 : 1;
        const na = titleNo(a.title), nb = titleNo(b.title);
        return na === nb ? 0 : na < nb ? -1 : 1;
      })
      // 정렬용으로만 쓰는 제목 앞 번호("1.", "2)")는 손님 화면에 안 보이게 떼어낸다
      .map((ev) => ({ ...ev, title: ev.title.replace(/^\s*\d+\s*[.)]\s*/, "") }));

    // 메모 링크가 없으면 직접 이어 둔 표(MANUAL)부터 본다
    for (const ev of events) {
      if (ev.url) continue;
      const hit = MANUAL.find(([key]) => ev.title.includes(key));
      if (hit) ev.url = hit[1];
    }

    // 링크가 없는 일정은 먼저 쇼핑몰 검색으로 상품을 찾는다 (상품명으로 찾으므로 가장 정확)
    const noUrl = events.filter((ev) => !ev.url);
    if (noUrl.length) {
      try { await searchLink(noUrl.slice(0, 6)); } catch (e) {}
    }
    // 그래도 못 찾은 '진행중' 일정만 메인에 걸린 상품에서 한 번 더 찾아본다
    const todayKst = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 10);
    const liveNoUrl = events.filter(
      (ev) => !ev.url && ev.start.slice(0, 10) <= todayKst && todayKst <= ev.end.slice(0, 10)
    );
    if (liveNoUrl.length) {
      try { await autoLink(liveNoUrl); } catch (e) {}
    }

    // 상품 정보를 미리 담아 보낸다 (손님 브라우저가 상품 페이지를 따로 안 받아도 되게)
    try { await enrich(events.slice(0, 8)); } catch (e) {}

    // 캘린더 설명란에 직접 적은 가격·배송 문구가 있으면 그 값을 쓴다 (상품 페이지에서 읽은 값보다 우선)
    for (const ev of events) {
      Object.assign(ev, ev.memo);
      delete ev.memo;
    }

    // CDN에 1분 캐시 → 캘린더 수정 후 1~2분 안에 반영 (2026-09-29 10분 → 1분)
    // 1분이 지나면 다음 손님 한 명은 이전 결과를 받고 그동안 새로 만든다. 방문이 뜸할 때도 5분 넘게 묵은 결과는 주지 않는다.
    // 너무 줄이면 매번 쇼핑몰 상품 페이지를 10여 개씩 읽어 배너가 느려지고 쇼핑몰에도 부담이 간다.
    res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
    res.status(200).json({ events });
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
};
