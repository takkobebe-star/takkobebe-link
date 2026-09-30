// 고객용: "오픈 알림 받기" — 공구 오픈 시각을 휴대폰 캘린더에 추가하는 .ics 파일을 만든다.
// 아이폰 Safari 는 text/calendar 응답을 열면 바로 "캘린더에 추가" 화면을 띄운다.
// 사용: /api/ics?t=상품명&d=2026-10-05&h=10&u=https://m.takkobebe.com/shop/detail.php?pno=...
// 서버 저장·비용 없음. 알림은 하루 전 + 10분 전 두 번.

function icsText(s) {
  return String(s || "")
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

// iCal 한 줄은 75바이트를 넘기지 않도록 접는다 (한글이 깨지지 않게 글자 단위로)
function fold(line) {
  const out = [];
  let cur = "", bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch);
    if (bytes + b > 73) { out.push(cur); cur = " "; bytes = 1; }
    cur += ch; bytes += b;
  }
  out.push(cur);
  return out.join("\r\n");
}

function pad(n) { return String(n).padStart(2, "0"); }
function utcStamp(d) {
  return d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) +
    "T" + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + "00Z";
}

module.exports = (req, res) => {
  const q = req.query || {};
  const d = String(q.d || "");
  const m = d.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) { res.status(400).send("bad date"); return; }
  let h = parseInt(q.h, 10);
  if (!(h >= 0 && h <= 23)) h = 10;
  const title = String(q.t || "공동구매").slice(0, 80);

  // 상품 링크는 타코베베 주소만 허용
  let url = "";
  try {
    const u = new URL(String(q.u || ""));
    if (/(^|\.)takkobebe\.(com|mywisa\.com)$/.test(u.hostname) && /^https?:$/.test(u.protocol)) url = u.href;
  } catch (e) {}
  if (!url) url = "https://m.takkobebe.com/";

  // 한국시간(UTC+9) 오픈 시각 → UTC
  const start = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], h - 9, 0));
  const end = new Date(start.getTime() + 30 * 60 * 1000);
  const uid = `tkbb-${m[1]}${m[2]}${m[3]}-${Buffer.from(title).toString("hex").slice(0, 24)}@takkobebe`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//takkobebe//open-alarm//KO",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + uid,
    "DTSTAMP:" + utcStamp(new Date()),
    "DTSTART:" + utcStamp(start),
    "DTEND:" + utcStamp(end),
    "SUMMARY:" + icsText("[타코베베] " + title + " 오픈"),
    "DESCRIPTION:" + icsText("오전 " + h + "시 공구 오픈!\n" + url),
    "URL:" + url,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + icsText("내일 오전 " + h + "시 " + title + " 오픈"),
    "TRIGGER:-P1D",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "DESCRIPTION:" + icsText("10분 뒤 " + title + " 오픈"),
    "TRIGGER:-PT10M",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  res.setHeader("Content-Type", "text/calendar; charset=utf-8");
  res.setHeader("Content-Disposition", 'inline; filename="takkobebe-open.ics"');
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(lines.map(fold).join("\r\n") + "\r\n");
};
