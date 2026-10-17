const test = require('node:test');
const assert = require('node:assert/strict');
const { readEnv, credentialDaysLeft } = require('../../lib/delivery/env');

test('readEnv: 빠진 필수값을 missing에 모은다', () => {
  const e = readEnv({ WISA_API_HASH: 'h', DT_CLIENT_ID: 'i' });
  assert.deepEqual(e.missing, ['DT_CLIENT_SECRET', 'CRON_SECRET']);
  assert.equal(e.wisaBase, 'https://www.takkobebe.com');
  assert.equal(e.wisaMngId, 'takkobebe@gmail.com');
  assert.equal(e.dryRun, false);
  assert.deepEqual(e.carrierMap, {});
  assert.equal(e.maxWrites, Infinity);
});

test('readEnv: DELIVERY_MAX_WRITES', () => {
  assert.equal(readEnv({ DELIVERY_MAX_WRITES: '2' }).maxWrites, 2);
  assert.equal(readEnv({ DELIVERY_MAX_WRITES: '0' }).maxWrites, Infinity);
  assert.equal(readEnv({ DELIVERY_MAX_WRITES: 'abc' }).maxWrites, Infinity);
});

test('readEnv: 전부 있으면 missing 비고 dryRun·carrierMap 반영', () => {
  const e = readEnv({ WISA_API_HASH: 'h', DT_CLIENT_ID: 'i', DT_CLIENT_SECRET: 's', CRON_SECRET: 'c', DELIVERY_DRY_RUN: '1', WISA_CARRIER_MAP: '{"1":"kr.cjlogistics"}', DT_CREDENTIAL_EXPIRES_AT: '2026-11-03T00:00:00+09:00' });
  assert.deepEqual(e.missing, []);
  assert.equal(e.dryRun, true);
  assert.deepEqual(e.carrierMap, { '1': 'kr.cjlogistics' });
  assert.equal(e.dtExpiresAt, '2026-11-03T00:00:00+09:00');
});

test('credentialDaysLeft', () => {
  const now = Date.parse('2026-10-13T12:00:00+09:00');
  assert.equal(credentialDaysLeft('2026-11-03T00:00:00+09:00', now), 20);
  assert.equal(credentialDaysLeft('2026-10-13T13:00:00+09:00', now), 0);
  assert.equal(credentialDaysLeft('2026-10-12T00:00:00+09:00', now), -2); // 36시간 지남 → 내림이라 -2
  assert.equal(credentialDaysLeft('', now), null);
  assert.equal(credentialDaysLeft('garbage', now), null);
});
