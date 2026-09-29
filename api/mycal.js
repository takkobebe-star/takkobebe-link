// 사장님 전용: 카카오워크 장터캘린더의 "모든" 일정을 JSON으로 돌려준다.
// 공개용 /api/schedule과 달리 미정 일정, 내부 메모(제목 둘째 줄·설명)까지 그대로 내려준다.
// /calendar.html 운영 캘린더에서 사용. 캘린더 주소는 GOOGLE_ICS_URL(예전: KAKAOWORK_ICS_URL) 환경변수에만 보관.

const TENTATIVE = /미정/;
// 상품 공구가 아닌 내부 일정 (휴가, 출근, 정산 등) — 캘린더에는 회색으로 표시, 콘텐츠 준비 대상 아님
const NON_PRODUCT = /휴가|연차|정산|명절판매|출근/;

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

function parseIcs(text) {
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
  }
  return events;
}

module.exports = async (req, res) => {
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

    // 지난달 달력까지 그릴 수 있게 45일 전 일정부터 포함.
    // ?days=N (1~400) 을 주면 N일 전부터 — 2026-09-22 '공동구매' 분류에 지난 3개월 공구 상품을 모을 때 추가
    const q = (req.query && req.query.days) || "";
    const days = Math.min(400, Math.max(1, parseInt(q, 10) || 45));
    const cutoff = new Date(Date.now() - days * 86400000).toISOString().slice(0, 10);
    const events = parseIcs(text)
      .filter((ev) => ev.summary && ev.start && ev.end)
      .map((ev) => {
        const lines = ev.summary.split("\n").map((s) => s.trim()).filter(Boolean);
        const title = lines[0] || "";
        // 카카오워크는 DESCRIPTION에 제목을 그대로 복사해 두는 경우가 있어 중복은 버린다
        const memo = [lines.slice(1).join(" · "), (ev.desc || "").trim()]
          .filter((s) => s && s !== title && s !== ev.summary.trim())
          .join(" · ") || null;
        return {
          title,
          start: ev.start,
          end: ev.end,
          memo,
          tentative: TENTATIVE.test(title),
          product: !NON_PRODUCT.test(title),
        };
      })
      .filter((ev) => ev.title && ev.end.slice(0, 10) >= cutoff)
      .sort((a, b) => (a.start < b.start ? -1 : 1));

    // CDN에 5분 캐시 → 캘린더 수정 후 최대 5분 안에 반영
    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=3600");
    res.status(200).json({ events });
  } catch (e) {
    res.status(502).json({ error: String(e && e.message || e) });
  }
};
