"""상세설명 점검: 태그 짝, 사진 파일 존재, 공구가 클래스 이름, vercel.json 등록, 금지 표현.
사용: python3 .claude/skills/tacobebe-detail-html/check.py salad-desc.txt
"""
import html.parser, json, os, re, sys

VOID = {"img", "br", "hr", "input", "meta", "link", "path", "source", "wbr"}
BANNED = ["100% 안전", "부작용 없", "국내 최고", "최저가", "무조건", "면역력", "아토피", "피부병",
          "다이어트 효과", "독소 배출", "완치", "특효"]


class Tags(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack, self.errors = [], []

    def handle_starttag(self, tag, attrs):
        if tag not in VOID:
            self.stack.append(tag)

    def handle_endtag(self, tag):
        if tag in VOID:
            return
        if self.stack and self.stack[-1] == tag:
            self.stack.pop()
        else:
            self.errors.append(f"</{tag}> 줄 {self.getpos()[0]}")


def main(path):
    txt = open(path, encoding="utf-8").read()
    ok = True

    p = Tags(); p.feed(txt)
    if p.errors or p.stack:
        ok = False
        print("✗ 태그 짝:", p.errors[:3], "닫히지 않음:", p.stack[-3:])
    else:
        print("✓ 태그 짝")

    imgs = re.findall(r"takkobebe-link\.vercel\.app/(img/[^\"'\s)]+)", txt)
    miss = [i for i in imgs if not os.path.exists(i)]
    print(("✗ 없는 사진: " + ", ".join(miss)) if miss else f"✓ 사진 {len(imgs)}개 모두 있음")
    ok &= not miss

    m = re.search(r'class="tkbb-([a-z]+)"', txt)
    px = m.group(1) if m else None
    if "공구가" in txt and not re.search(r'class="[a-z]+-price-(ttl|list)"', txt):
        ok = False
        print("✗ '공구가'가 있는데 -price-ttl / -price-list 클래스가 없음 (마감 뒤 숨김이 안 됨)")
    if px:
        stray = sorted({c for c in re.findall(r'class="([a-z]+)-', txt) if c != "tkbb" and c != px and not (len(c) == 2 and c[0] == px[0])})
        if stray:
            print("! 접두어가 다른 클래스:", stray)

    name = "/" + os.path.basename(path)
    sources = [h.get("source") for h in json.load(open("vercel.json")).get("headers", [])]
    print(("✓ vercel.json 등록 " + name) if name in sources else ("✗ vercel.json 에 " + name + " 없음"))
    ok &= name in sources

    body = re.sub(r"<style>.*?</style>", "", txt, flags=re.S)
    hits = [w for w in BANNED if w in body]
    if hits:
        print("! 표현 확인 필요 (문맥 보고 판단):", hits)

    for w in ["[확인 필요]", "담당자 확인 필요"]:
        if w in body:
            print(f"! '{w}' {body.count(w)}곳 남아 있음")
    return ok


if __name__ == "__main__":
    sys.exit(0 if all([main(a) for a in sys.argv[1:]]) else 1)
