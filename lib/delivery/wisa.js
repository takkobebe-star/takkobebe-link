// 위사(WISA) 스마트윙 openAPI 클라이언트. 문서: developers.wisa.co.kr/document/24
// 호출 형식: GET {base}/api/openapi/{action}?hash=…  (hash = 관리자 API 키)
// ※ 임대형 쇼핑몰의 hash 발급 방법은 위사 고객센터 답변 대기 중(설계서 2.1). 인증 방식이 바뀌면 이 파일의 call()만 고친다.

function makeError(message, code) {
  const err = new Error(message);
  err.code = code;
  return err;
}

function makeWisa({ base, hash, fetchFn = fetch }) {
  async function call(action, params = {}) {
    const url = new URL(`/api/openapi/${action}`, base);
    url.searchParams.set('hash', hash);
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    }
    const r = await fetchFn(url, { headers: { Accept: 'application/json' } });
    const text = await r.text();
    if (!r.ok) throw makeError(`wisa ${action}: HTTP ${r.status}`, `HTTP_${r.status}`);
    if (!text.trim()) return null; // setOrderStat 처럼 리턴값이 없는 API
    try {
      return JSON.parse(text);
    } catch (e) {
      throw makeError(`wisa ${action}: 응답이 JSON이 아님 (${text.slice(0, 60).replace(/\s+/g, ' ')}…)`, 'BAD_JSON');
    }
  }

  return {
    // 보유한 hash가 아직 유효한지
    async loginCheck(mngId) {
      const j = await call('loginCheck', { mng_id: mngId });
      return !!j && j.status === 'Y';
    },

    // 배송중(stat=4) 주문을 전부 모은다. API는 최근 3개월만 조회된다.
    async listShipping({ sdate1, sdate2, pageSize = 100 }) {
      const orders = [];
      for (let page = 1; page <= 50; page++) {
        const j = await call('orderList', { stat: 4, page, page_size: pageSize, sdate1, sdate2, order_by: 4 });
        const rows = (j && j.orders) || [];
        orders.push(...rows);
        if (rows.length < pageSize) break;
      }
      return orders;
    },

    // 주문서 상세(상품별 stat / stat_str 포함)
    getOrder(ono) {
      return call('order', { ono });
    },

    // 주문 상품 하나를 배송완료(5)로. 리턴값 없음.
    async setDelivered(ono, orderProductNo) {
      await call('setOrderStat', { ono, order_product_no: orderProductNo, stat: 5 });
    },
  };
}

module.exports = { makeWisa };
