// 매시간 cron이 부르는 진입점. Vercel이 CRON_SECRET을 Authorization 헤더로 붙여 준다.
// 수동 실행: curl -H "Authorization: Bearer $CRON_SECRET" "https://takkobebe-link.vercel.app/api/delivery-sync?dry=1"
//   ?dry=1  → 쓰기 없이 판정만 (DELIVERY_DRY_RUN=1 환경변수와 같음)
//   ?max=N  → 이번 호출에서 최대 N건만 배송완료 처리 (첫 실제 처리 때 1~2건 시험용)
const { readEnv } = require('../lib/delivery/env');
const { run } = require('../lib/delivery/run');
const { makeWisa } = require('../lib/delivery/wisa');
const { makeTracker } = require('../lib/delivery/tracker');

function makeHandler(deps = {}) {
  const d = { env: process.env, run, makeWisa, makeTracker, ...deps };
  return async (req, res) => {
    const env = readEnv(d.env);
    const auth = (req.headers && (req.headers.authorization || req.headers.Authorization)) || '';
    if (!env.cronSecret || auth !== `Bearer ${env.cronSecret}`) {
      return res.status(401).json({ error: 'unauthorized' });
    }
    if (env.missing.length) {
      return res.status(500).json({ error: '환경변수 누락', missing: env.missing });
    }
    const q = req.query || {};
    const dryRun = env.dryRun || q.dry === '1';
    const queryMax = q.max && Number(q.max) > 0 ? Number(q.max) : Infinity;
    const maxWrites = Math.min(queryMax, env.maxWrites);
    try {
      const wisa = d.makeWisa({ base: env.wisaBase, hash: env.wisaHash });
      const tracker = d.makeTracker({ clientId: env.dtClientId, clientSecret: env.dtClientSecret });
      const summary = await d.run({ wisa, tracker, carrierMap: env.carrierMap, dryRun, maxWrites });
      console.log(JSON.stringify({ at: new Date().toISOString(), ...summary, items: undefined }));
      return res.status(200).json(summary);
    } catch (e) {
      console.error('delivery-sync 실패', e);
      return res.status(502).json({ error: String((e && e.message) || e) });
    }
  };
}

module.exports = makeHandler();
module.exports.makeHandler = makeHandler;
