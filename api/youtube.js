// 유튜브 자동완성(suggestqueries)을 육아·리빙 시드 키워드로 긁어
// 지금 유튜브에서 많이 검색되는 검색어를 점수순으로 돌려준다. (keywords.html 리포트용)
// 유튜브는 연령·성별 필터가 없어 시드 키워드로 육아맘 관심사에 수렴시킨다.

const GROUPS = [
  { name: "육아", seeds: ["육아템", "아기용품", "신생아", "이유식", "유아식", "키즈", "장난감", "육아"] },
  { name: "리빙", seeds: ["살림템", "주방템", "정리수납", "청소", "살림", "주방용품", "생활용품", "홈카페"] },
];

async function suggest(seed) {
  const url =
    "https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&hl=ko&gl=KR&oe=utf8&q=" +
    encodeURIComponent(seed);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 6000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    if (!r.ok) return [];
    const j = await r.json();
    return Array.isArray(j && j[1]) ? j[1] : [];
  } catch (e) {
    return [];
  } finally {
    clearTimeout(t);
  }
}

module.exports = async (req, res) => {
  try {
    const groups = await Promise.all(
      GROUPS.map(async (g) => {
        const lists = await Promise.all(g.seeds.map(suggest));
        // 자동완성 순서가 곧 인기 순서: 1번째 10점 → 10번째 1점, 여러 시드에 겹치면 합산
        const score = new Map();
        lists.forEach((list, li) => {
          list.forEach((kw, i) => {
            kw = kw.trim();
            if (!kw || kw === g.seeds[li]) return; // 시드 그대로인 건 제외
            score.set(kw, (score.get(kw) || 0) + (10 - i));
          });
        });
        const items = [...score.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 15)
          .map(([keyword, s], i) => ({ rank: i + 1, keyword, score: s }));
        return { name: g.name, items };
      })
    );

    res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");
    res.status(200).json({ source: "유튜브 자동완성 · 한국", groups });
  } catch (e) {
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
