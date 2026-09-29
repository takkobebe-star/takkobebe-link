// Meta Graph API로 인스타그램 해시태그별 인기 게시물을 가져온다. (keywords.html 리포트용)
// 필요 환경변수: IG_USER_ID(인스타 비즈니스 계정 ID), IG_ACCESS_TOKEN(장기 토큰, 60일 유효)
// 미설정이면 {configured:false}를 돌려주고 페이지는 섹션을 숨긴다.
// Meta 제한: 계정당 7일에 유니크 해시태그 30개까지만 조회 가능 — HASHTAGS는 넉넉히 그 아래로 유지.

const HASHTAGS = [
  "육아템",
  "육아꿀템",
  "아기용품",
  "육아소통",
  "이유식",
  "신생아",
  "육아맘",
  "공동구매",
  "살림템",
  "정리수납",
];
const V = "v21.0";

async function gget(path, params) {
  const url = new URL(`https://graph.facebook.com/${V}/${path}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 8000);
  try {
    const r = await fetch(url, { signal: ctrl.signal });
    const j = await r.json();
    if (!r.ok || (j && j.error)) throw new Error((j && j.error && j.error.message) || "HTTP " + r.status);
    return j;
  } finally {
    clearTimeout(t);
  }
}

module.exports = async (req, res) => {
  const token = process.env.IG_ACCESS_TOKEN;
  const igId = process.env.IG_USER_ID;
  if (!token || !igId) {
    res.setHeader("Cache-Control", "s-maxage=300");
    res.status(200).json({ configured: false });
    return;
  }

  try {
    const tags = await Promise.all(
      HASHTAGS.map(async (tag) => {
        try {
          const found = await gget("ig_hashtag_search", { user_id: igId, q: tag, access_token: token });
          const id = found.data && found.data[0] && found.data[0].id;
          if (!id) return { tag, posts: [] };
          const media = await gget(id + "/top_media", {
            user_id: igId,
            fields: "caption,like_count,comments_count,permalink,media_type",
            limit: "3",
            access_token: token,
          });
          const posts = (media.data || []).slice(0, 3).map((m) => ({
            caption: (m.caption || "(내용 없음)").split("\n")[0].slice(0, 60),
            likes: m.like_count || 0,
            comments: m.comments_count || 0,
            url: m.permalink || null,
          }));
          return { tag, posts };
        } catch (e) {
          return { tag, posts: [], error: String((e && e.message) || e) };
        }
      })
    );

    // 전부 실패했으면 토큰 만료/권한 문제일 가능성이 높다 → 페이지에 안내 표시용
    if (tags.every((t) => t.error)) {
      res.setHeader("Cache-Control", "s-maxage=300");
      res.status(200).json({ configured: true, authError: tags[0].error, tags: [] });
      return;
    }

    res.setHeader("Cache-Control", "s-maxage=21600, stale-while-revalidate=86400");
    res.status(200).json({ configured: true, tags });
  } catch (e) {
    res.status(502).json({ error: String((e && e.message) || e) });
  }
};
