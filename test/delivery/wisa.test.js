const test = require('node:test');
const assert = require('node:assert/strict');
const { makeWisa } = require('../../lib/delivery/wisa');

const BASE = 'https://shop.example';
function res(text, status = 200) { return { ok: status < 400, status, text: async () => text }; }

test('listShipping: stat=4로 페이지를 끝까지 모은다', async () => {
  const urls = [];
  const fetchFn = async (url) => {
    const u = new URL(String(url)); urls.push(u);
    const page = Number(u.searchParams.get('page'));
    const orders = page === 1 ? [{ ono: 'A' }, { ono: 'B' }] : [{ ono: 'C' }];
    return res(JSON.stringify({ total_rows: 3, rows: orders.length, orders }));
  };
  const w = makeWisa({ base: BASE, hash: 'test-hash', fetchFn });
  const orders = await w.listShipping({ sdate1: '2026-08-14 00:00:00', sdate2: '2026-10-13 23:59:59', pageSize: 2 });
  assert.deepEqual(orders.map(o => o.ono), ['A', 'B', 'C']);
  assert.equal(urls.length, 2);
  assert.equal(urls[0].pathname, '/api/openapi/orderList');
  assert.equal(urls[0].searchParams.get('hash'), 'test-hash');
  assert.equal(urls[0].searchParams.get('stat'), '4');
  assert.equal(urls[0].searchParams.get('page_size'), '2');
  assert.equal(urls[0].searchParams.get('sdate1'), '2026-08-14 00:00:00');
  assert.equal(urls[1].searchParams.get('page'), '2');
});

test('listShipping: orders가 없으면 빈 배열', async () => {
  const w = makeWisa({ base: BASE, hash: 'h', fetchFn: async () => res(JSON.stringify({ total_rows: 0, rows: 0 })) });
  assert.deepEqual(await w.listShipping({ sdate1: 'a', sdate2: 'b' }), []);
});

test('setDelivered: setOrderStat stat=5, 빈 응답도 성공', async () => {
  let seen;
  const w = makeWisa({ base: BASE, hash: 'h', fetchFn: async (url) => { seen = new URL(String(url)); return res(''); } });
  await w.setDelivered('20990101-TEST1', 777);
  assert.equal(seen.pathname, '/api/openapi/setOrderStat');
  assert.equal(seen.searchParams.get('ono'), '20990101-TEST1');
  assert.equal(seen.searchParams.get('order_product_no'), '777');
  assert.equal(seen.searchParams.get('stat'), '5');
});

test('getOrder / loginCheck', async () => {
  const fetchFn = async (url) => {
    const u = new URL(String(url));
    if (u.pathname.endsWith('/order')) return res(JSON.stringify({ ono: u.searchParams.get('ono'), products: [{ order_product_no: 1, stat: 5, stat_str: '배송완료' }] }));
    if (u.pathname.endsWith('/loginCheck')) return res(JSON.stringify({ status: u.searchParams.get('mng_id') === 'ok' ? 'Y' : 'N' }));
    throw new Error('unexpected ' + u.pathname);
  };
  const w = makeWisa({ base: BASE, hash: 'h', fetchFn });
  assert.equal((await w.getOrder('X')).products[0].stat_str, '배송완료');
  assert.equal(await w.loginCheck('ok'), true);
  assert.equal(await w.loginCheck('no'), false);
});

test('JSON이 아닌 응답(쇼핑몰 메인 HTML 등)은 BAD_JSON으로 던진다', async () => {
  const w = makeWisa({ base: BASE, hash: 'h', fetchFn: async () => res('<!doctype html><html>…') });
  await assert.rejects(() => w.getOrder('X'), (e) => e.code === 'BAD_JSON');
});
