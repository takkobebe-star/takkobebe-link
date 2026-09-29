// 네이버 데이터랩 쇼핑인사이트에서 여성 30~40대의 주간 인기 검색어를 가져와
// 지난주 대비 순위 변동과 함께 JSON으로 돌려준다. (keywords.html 내부 리포트용)

const CATEGORIES = [
  { cid: "50000005", name: "출산/육아" },
  { cid: "50000008", name: "생활/건강" },
];

const DATALAB = "https://datalab.naver.com/shoppingInsight/getCategoryKeywordRank.naver";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0 Safari/537.36",
  Referer: "https://datalab.naver.com/shoppingInsight/sCategory.naver",
  Origin: "https://datalab.naver.com",
  "Content-Type": "application/x-www-form-urlencoded",
};

function ymd(d) {
  return d.toISOString().slice(0, 10);
}

// KST 기준, offset주 전의 월~일 범위 (offset=1 → 지난주)
function weekRange(offset) {
  const now = new Date(Date.now() + 9 * 3600e3);
  const sinceMon = (now.getUTCDay() + 6) % 7;
  const mon = new Date(now);
  mon.setUTCDate(now.getUTCDate() - sinceMon - 7 * offset);
  const sun = new Date(mon);
  sun.setUTCDate(mon.getUTCDate() + 6);
  return { start: ymd(mon), end: ymd(sun) };
}

async function fetchRankPage(cid, week, page) {
  const body = new URLSearchParams({
    cid,
    timeUnit: "week",
    startDate: week.start,
    endDate: week.end,
    age: "30,40",
    gender: "f",
    device: "",
    page: String(page),
    count: "20",
  });
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(DATALAB, { method: "POST", headers: HEADERS, body, signal: ctrl.signal });
    if (!r.ok) return [];
    const j = await r.json();
    return (j && j.ranks) || [];
  } catch (e) {
    return [];
  } finally {
    clearTimeout(t);
  }
}

// 한 페이지 20개 고정이라 여러 페이지를 이어붙인다
async function fetchTop(cid, week, pages) {
  const lists = await Promise.all(
    Array.from({ length: pages }, (_, i) => fetchRankPage(cid, week, i + 1))
  );
  return lists.flat();
}

module.exports = async (req, res) => {
  try {
    let week, prevWeek, raw;
    // 월요일 아침엔 어제 끝난 주가 데이터랩에 아직 없을 수 있어 한 주 뒤로 물러난다
    for (let off = 1; off <= 2; off++) {
      week = weekRange(off);
      prevWeek = weekRange(off + 1);
      raw = await Promise.all(
        CATEGORIES.map(async (c) => {
          const [cur, before] = await Promise.all([
            fetchTop(c.cid, week, 1), // 이번 리포트 주 TOP 20
            fetchTop(c.cid, prevWeek, 3), // 그 전주 TOP 60 (신규 진입 판별용)
          ]);
          return { ...c, cur, before };
        })
      );
      if (raw.some((c) => c.cur.length)) break;
    }

    const categories = raw.map((c) => {
      const prevRankOf = new Map(c.before.map((r) => [r.keyword, r.rank]));
      const items = c.cur.map((r) => {
        const prevRank = prevRankOf.get(r.keyword) || null;
        return {
          rank: r.rank,
          keyword: r.keyword,
          prevRank,
          delta: prevRank ? prevRank - r.rank : null, // 양수 = 상승
          isNew: !prevRank, // 지난주 TOP 60 밖에서 진입
        };
      });
      return { cid: c.cid, name: c.name, items };
    });

    // 데이터는 주 단위로만 바뀌므로 CDN 1시간 캐시면 충분 (월요일 아침 갱신도 놓치지 않음)
    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({
      week,
      prevWeek,
      filters: "네이버쇼핑 · 여성 · 30~40대 · 주간",
      categories,
    });
  } catch (e) {
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
