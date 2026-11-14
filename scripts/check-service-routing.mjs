import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'catalog.json'), 'utf8'));
const snapshots = JSON.parse(fs.readFileSync(path.join(root, 'upstream-snapshots.json'), 'utf8'));
for (const [file, spec] of Object.entries(snapshots.files)) {
  const digest = createHash('sha256').update(fs.readFileSync(path.join(root, 'clash', file))).digest('hex');
  assert.equal(digest, spec.sha256, `Snapshot/local additions hash is stale: ${file}`);
}
function source(name) {
  return Bun.YAML.parse(fs.readFileSync(path.join(root, catalog[name].file), 'utf8')).payload;
}
const suffix = (host, domain) => host === domain || host.endsWith('.' + domain);
function matches(name, host) {
  return source(name).some(item => {
    if (catalog[name].behavior === 'domain') {
      if (item.startsWith('+.')) return suffix(host, item.slice(2));
      if (item.includes('*')) return new RegExp('^' + item.split('*').map(part => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('[^.]*') + '$').test(host);
      return host === item;
    }
    const [type, value] = item.split(',');
    if (type === 'DOMAIN') return host === value;
    if (type === 'DOMAIN-SUFFIX') return suffix(host, value);
    if (['PROCESS-NAME', 'IP-CIDR', 'IP-CIDR6'].includes(type)) return false;
    throw Error(`Unexpected non-domain service rule: ${item}`);
  });
}
function generatedMatches(name, host) {
  const { rules } = JSON.parse(fs.readFileSync(path.join(root, 'sing-box', name + '.json'), 'utf8'));
  return rules.some(rule => rule.domain?.includes(host) || rule.domain_suffix?.some(domain => suffix(host, domain))
    || rule.domain_regex?.some(pattern => new RegExp(pattern).test(host)));
}

const announced = new Set(JSON.parse(fs.readFileSync(path.join(root, 'asn-prefixes.json'), 'utf8')).prefixes['399358']);
const claudePrefixes = source('claude').filter(rule => /^IP-CIDR6?,/.test(rule)).map(rule => rule.split(',')[1]);
assert(claudePrefixes.length > 0);
for (const prefix of claudePrefixes) assert(announced.has(prefix), 'Claude prefix is outside the recorded RIPE announcement: ' + prefix);
const generatedClaude = JSON.parse(fs.readFileSync(path.join(root, 'sing-box/claude.json'), 'utf8'));
assert.deepEqual(generatedClaude.rules.flatMap(rule => rule.ip_cidr || []), claudePrefixes);

const crypto = new Set(source('crypto'));
for (const rule of source('crypto-regional')) assert(crypto.has(rule), `Regional rule missing from compatibility aggregate: ${rule}`);
for (const name of ['crypto', 'crypto-regional', 'download-mirrors', 'twitter-domain', 'google-domain', 'gits-domain', 'apple-cdn', 'steam-download', 'claude']) {
  const rules = source(name);
  assert.equal(new Set(rules).size, rules.length, `Duplicate source entry: ${name}`);
}
const cases = {
  'claude': {
    yes: ['anthropic.com', 'api.anthropic.com', 'cdn.anthropic.com', 'mcp.anthropic.com', 'claude.ai', 'claude.com',
      'platform.claude.com', 'sso.claude.com', 'clau.de', 'claudemcpclient.com', 'widget.claudemcpcontent.com',
      'bridge.claudeusercontent.com', 'servd-anthropic-website.b-cdn.net', 'anthropic.com.cdn.cloudflare.net',
      'anthropic.auth0.com', 'anthropic-com.ghost.io', 'o33249.ingest.sentry.io', 'events.statsigapi.net',
      'browser-intake-us5-datadoghq.com', 'http-intake.logs.us5.datadoghq.com', 'api.sift.com', 'widget.intercom.io',
      'js.intercomcdn.com', 'cdn.usefathom.com', 'inquiry.withpersona.com'],
    no: ['anthropic.com.example.org', 'notanthropic.com', 'datadog.example.org', 'sentry.example.org',
      'sift.example.org', 'challenges.cloudflare.com', 'maps.googleapis.com', 'frompersona.com',
      'pool.ntp.org', 'time.windows.com'],
  },
  'apple-cdn': {
    yes: ['is1-ssl.mzstatic.com', 'is6-ssl.mzstatic.com', 'a100.mzstatic.com', 'apps.mzstatic.com', 'iosapps.itunes.apple.com',
      'osxapps.itunes.apple.com', 'iosapps.itunes.g.aaplimg.com', 'osxapps.itunes.g.aaplimg.com', 'appldnld.apple.com',
      'appldnld.apple.com.edgesuite.net', 'appldnld.g.aaplimg.com', 'oscdn.apple.com', 'oscdn.origin-apple.com.akadns.net',
      'swcdn.apple.com', 'swcdn.g.aaplimg.com', 'swdownload.apple.com', 'updates.cdn-apple.com', 'updates-http.cdn-apple.com',
      'updates-http.cdn-apple.com.akadns.net', 'adcdownload.apple.com', 'adcdownload.apple.com.akadns.net',
      'download.developer.apple.com', 'devimages-cdn.apple.com', 'audiocontentdownload.apple.com',
      'playground-assets-cdn.apple.com', 'playground-cdn.apple.com', 'sylvan.apple.com'],
    no: ['apple.com', 'appleid.apple.com', 'account.apple.com', 'appleid.cdn-apple.com', 'icloud.com', 'gateway.icloud.com',
      'mask.icloud.com', 'apps.apple.com', 'itunes.apple.com', 'music.apple.com', 'tv.apple.com', 'cdn-apple.com',
      'aaplimg.com', 'akadns.net', 'edgesuite.net', 'other.akamaized.net', 'unrelated.apple.com.edgesuite.net',
      'mzstatic.com.example.org', 'notmzstatic.com', 'appldnld.apple.com.example.org'],
  },
  'steam-download': {
    yes: ['cache1-fra1.steamcontent.com', 'alibaba.cdn.steampipe.steamcontent.com', 'google2.cdn.steampipe.steamcontent.com',
      'fastly.cdn.steampipe.steamcontent.com', 'edgenext.cdn.steampipe.steamcontent.com', 'steampipe.akamaized.net',
      'steampipe-kr.akamaized.net', 'steampipe-partner.akamaized.net', 'dl.steam.clngaa.com', 'dl.steam.ksyna.com',
      'steampipe.steamcontent.tnkjmec.com', 'cdn-ali.content.steamchina.com', 'cdn-qc.content.steamchina.com',
      'cdn-ws.content.steamchina.com', 'st.dl.bscstorage.net', 'st.dl.eccdnx.com', 'st.dl.pinyuncloud.com'],
    no: ['store.steampowered.com', 'steamcommunity.com', 'avatars.steamstatic.com', 'steamusercontent.com',
      'steamcdn-a.akamaihd.net', 'steambroadcast.akamaized.net', 'cm.steampowered.com', 'other.akamaized.net',
      'akamaized.net', 'akamaihd.net', 'ksyna.com', 'tnkjmec.com', 'steamcontent.com.example.org', 'notsteamcontent.com'],
  },
  'download-mirrors': {
    yes: ['hf-mirror.com', 'registry.npmmirror.com', 'cdn.npmmirror.com', 'gh-proxy.com', 'hk.gh-proxy.com', 'ghproxy.net',
      'ghfast.top', 'github.akams.cn', 'gh.llkk.cc', 'cdn.jsdelivr.net', 'testingcf.jsdelivr.net', 'gcore.jsdelivr.net',
      'mirrors.tuna.tsinghua.edu.cn', 'mirrors4.tuna.tsinghua.edu.cn', 'pypi.tuna.tsinghua.edu.cn', 'mirrors.ustc.edu.cn',
      'mirror.sjtu.edu.cn', 'mirrors.sjtug.sjtu.edu.cn', 'mirrors.bfsu.edu.cn', 'mirrors.nju.edu.cn', 'mirrors.pku.edu.cn',
      'mirrors.zju.edu.cn', 'mirrors.hit.edu.cn', 'mirrors.hust.edu.cn', 'mirrors.aliyun.com', 'maven.aliyun.com',
      'mirrors.tencent.com', 'mirrors.cloud.tencent.com', 'repo.huaweicloud.com', 'rsproxy.cn', 'lf3-static.rsproxy.cn',
      'goproxy.cn', 'goproxy.io', 'goproxy.bj.bcebos.com', 'docker.m.daocloud.io', 'docker.1ms.run',
      'gh.h233.eu.org', 'gh.api.99988866.xyz', 'ghproxy.1888866.xyz', 'gh.ddlc.top', 'dl.ghpig.top', 'slink.ltd',
      'cors.isteed.cc', 'ghproxy.it', 'github.boki.moe', 'gh-proxy.net', 'ghdd.862510.xyz', 'wget.la', 'gitclone.com',
      'kkgithub.com', 'githubfast.com', 'github.moeyy.xyz', 'ssh.fastgit.org', 'git.zhlh6.cn', 'raw.kkgithub.com',
      'jsd.proxy.aks.moe', 'fastly.jsdelivr.net', 'jsdelivr.pai233.top', 'raw.cachefly.998111.xyz'],
    no: ['github.com', 'raw.githubusercontent.com', 'release-assets.githubusercontent.com', 'huggingface.co', 'hf.co',
      'cas-bridge.xethub.hf.co', 'registry.npmjs.org', 'pypi.org', 'files.pythonhosted.org', 'deb.debian.org',
      'archive.ubuntu.com', 'registry-1.docker.io', 'ghcr.io', 'amazonaws.com', 'bucket.s3.amazonaws.com',
      'example.workers.dev', 'example.cloudflarestorage.com', 'tencent.com', 'tsinghua.edu.cn', 'pku.edu.cn',
      'example.bcebos.com', 'example.jsdelivr.net', 'hf-mirror.com.example.org', 'notgh-proxy.com',
      'other.h233.eu.org', 'api.99988866.xyz', 'other.1888866.xyz', 'ddlc.top', 'ghpig.top', 'isteed.cc', 'boki.moe',
      '862510.xyz', 'moeyy.xyz', 'fastgit.org', 'zhlh6.cn', 'aks.moe', 'pai233.top', '998111.xyz', 'ww19.gh-proxy.net'],
  },
  'crypto-regional': {
    yes: ['www.binance.com', 'api.binance.com', 'stream.binance.com', 'bin.bnbstatic.com', 'app.hyperliquid.xyz',
      'api.hyperliquid.xyz', 'rpc.hyperliquid.xyz', 'api.hyperunit.xyz', 'www.okx.com', 'ws.okx.com', 'eea.okx.com',
      'www.bybit.com', 'api.bybit.com', 'api.gateio.ws', 'www.bitget.com', 'www.mexc.com', 'clob.polymarket.com',
      'gamma-api.polymarket.com', 'ws-subscriptions-clob.polymarket.com', 'combos-rfq-api.polymarket.sh',
      'polymarket-next-assets.s3.amazonaws.com', 'api.predict.fun', 'ws.predict.fun', 'app.opinion.trade',
      'pump.fun', 'frontend-api-v3.pump.fun', 'gmgn.ai', 'api.gmgn.ai', 'asia.debot.ai', 'sgws.debot.ai', 'axiom.trade',
      'api.axiom.trade', 'mainnet.zklighter.elliot.ai', 'fapi.asterdex.com', 'static2.asterdexfx.com', 's3.edgex.exchange',
      'api.starknet.extended.exchange', 'omni-client-api.prod.ap-northeast-1.variational.io', 'auth.privy.io'],
    no: ['binance.us', 'www.binance.us', 'polymarket.us', 'static.polymarket.us', 'coingecko.com', 'coinmarketcap.com',
      'kraken.com', 'walletconnect.org', 'example.privy.io', 'other.s3.amazonaws.com', 'elliot.ai', 'x.com',
      'hf-mirror.com', 'evilbinance.com', 'binance.com.example.org', 'predict.fun.example.org'],
  },
  'twitter-domain': {
    yes: ['x.com', 'api.x.com', 'twitter.com', 'api.twitter.com', 'upload.twitter.com', 'pbs.twimg.com', 'video.twimg.com',
      'abs.twimg.com', 't.co', 'tweetdeck.com', 'pscp.tv', 'prod-fastly-us-west-2.video.pscp.tv', 'twvid.com'],
    no: ['ads-twitter.com', 'tellapart.com', 'x.com.example.org', 'myx.com', 'twitter.com.example.org', 'fastly.net'],
  },
  'google-domain': {
    yes: ['www.google.com', 'accounts.google.com', 'mail.google.com', 'drive.google.com', 'docs.google.com',
      'oauth2.googleapis.com', 'www.gstatic.com', 'lh3.googleusercontent.com', 'recaptcha.net', 'fonts.googleapis.cn'],
    no: ['google.com.example.org', 'mygoogle.com'],
  },
  'gits-domain': {
    yes: ['github.com', 'api.github.com', 'ssh.github.com', 'raw.githubusercontent.com', 'objects.githubusercontent.com',
      'release-assets.githubusercontent.com', 'user-images.githubusercontent.com', 'github.githubassets.com', 'ghcr.io',
      'pkg.actions.githubusercontent.com', 'github-cloud.s3.amazonaws.com', 'copilot-proxy.githubusercontent.com',
      'production-copilot-host-westus.webpubsub.azure.com', 'production-copilot-host-eastasia.webpubsub.azure.com',
      'production-copilot-host-centralus.webpubsub.azure.com', 'production-copilot-host-centralus-02.webpubsub.azure.com',
      'production-copilot-host-austriaeast.webpubsub.azure.com', 'production-copilot-host-westus3.webpubsub.azure.com',
      'production-copilot-host.webpubsub.azure.com', 'default.exp-tas.com', 'copilot-reports-region1.b01.azurefd.net',
      'usagereportsregion1.blob.core.windows.net'],
    no: ['github.com.example.org', 'mygithub.com', 'other.s3.amazonaws.com', 'gh-proxy.com', 'github.akams.cn',
      'other.webpubsub.azure.com', 'other.blob.core.windows.net', 'other.b01.azurefd.net',
      'copilot-reports-x.y.b01.azurefd.net', 'evilcopilot-reports-x.b01.azurefd.net',
      'production-copilot-host-westus.webpubsub.azure.com.example.org'],
  },
};
let checked = 0;
for (const [name, { yes, no }] of Object.entries(cases)) {
  for (const [hosts, expected] of [[yes, true], [no, false]]) {
    for (const host of hosts) {
      assert.equal(matches(name, host), expected, `${name}: ${host}`);
      assert.equal(generatedMatches(name, host), expected, `Sing-Box ${name}: ${host}`);
      checked++;
    }
  }
}
console.log(`Checked ${checked} service/mirror boundaries in both formats; regional rules are contained in crypto.`);
