// 환경변수 읽기와 키 만료 계산. 비밀값은 여기서만 꺼내고 로그에 찍지 않는다.
const { parseCarrierMap } = require('./tracker');

const REQUIRED = ['WISA_API_HASH', 'DT_CLIENT_ID', 'DT_CLIENT_SECRET', 'CRON_SECRET'];

function readEnv(env = process.env) {
  const missing = REQUIRED.filter((k) => !env[k]);
  return {
    wisaBase: env.WISA_API_BASE || 'https://www.takkobebe.com',
    wisaHash: env.WISA_API_HASH || '',
    wisaMngId: env.WISA_MNG_ID || 'takkobebe@gmail.com',
    dtClientId: env.DT_CLIENT_ID || '',
    dtClientSecret: env.DT_CLIENT_SECRET || '',
    dtExpiresAt: env.DT_CREDENTIAL_EXPIRES_AT || '',
    cronSecret: env.CRON_SECRET || '',
    dryRun: env.DELIVERY_DRY_RUN === '1',
    // 한 번 실행에서 배송완료 처리할 최대 건수. 첫 실처리 때 1~2로 두고 확인한 뒤 지운다.
    maxWrites: env.DELIVERY_MAX_WRITES && Number(env.DELIVERY_MAX_WRITES) > 0 ? Number(env.DELIVERY_MAX_WRITES) : Infinity,
    carrierMap: parseCarrierMap(env.WISA_CARRIER_MAP),
    missing,
  };
}

// 만료 시각까지 남은 일수(내림). 모르면 null.
function credentialDaysLeft(expiresAtIso, nowMs = Date.now()) {
  if (!expiresAtIso) return null;
  const t = Date.parse(expiresAtIso);
  if (Number.isNaN(t)) return null;
  return Math.floor((t - nowMs) / 86400e3);
}

module.exports = { readEnv, credentialDaysLeft, REQUIRED };
