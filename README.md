# Clash Rules

适用于 Mihomo（Clash Meta）的分类分流规则。文件名和 provider 名称统一使用小写短横线格式。

## 规则列表

| 文件 | 用途 | 建议策略 |
|------|------|----------|
| [cn-apps.yaml](clash/cn-apps.yaml) | 国内常用软件及腾讯自定义直连例外 | DIRECT |
| [cn-games.yaml](clash/cn-games.yaml) | 国服登录、启动器、下载与资源，以及英雄联盟、WeGame 进程 | DIRECT |
| [direct.list](clash/direct.list) | 常用直连规则，包含国内软件和游戏增量 | DIRECT |
| [ai.yaml](clash/ai.yaml) | AI 助手、模型 API、编程与创作工具 | AI |
| [crypto.yaml](clash/crypto.yaml) | 交易所、钱包、链上数据和 RPC | Crypto |
| [claude.yaml](clash/claude.yaml) | Claude 专用域名及客户端进程分流 | Claude |
| [tencent-direct.yaml](clash/tencent-direct.yaml) | Windows 微信、英雄联盟、WeGame 进程与腾讯域名 | DIRECT |
| [browser-webrtc.yaml](clash/browser-webrtc.yaml) | 浏览器常用 STUN/TURN 补充拦截，保留普通 QUIC | REJECT |
| [telegram.list](clash/telegram.list) | Telegram 域名及网络地址 | PROXY |
| [steam.yaml](clash/steam.yaml) | Steam 商店、社区和静态资源 | PROXY |
| [steam-download.yaml](clash/steam-download.yaml) | Steam 游戏与客户端下载 CDN | DIRECT |
| [download.list](clash/download.list) | 下载工具进程 | DIRECT |
| [lan.yaml](clash/lan.yaml) | 局域网、本机和链路本地地址 | DIRECT |
| [reject.yaml](clash/reject.yaml) | 广告与跟踪域名主库 | REJECT |
| [ad.list](clash/ad.list) | 补充广告拦截规则 | REJECT |
| [cloudflare.yaml](clash/cloudflare.yaml) | Cloudflare 服务域名，不含共享边缘 IP 与客户托管后缀 | 按需 |
| [analysis.yaml](clash/analysis.yaml) | Google API 绕行例外 | PROXY |
| [cn-analysis.yaml](clash/cn-analysis.yaml) | 国内分析服务直连例外 | 按需 |
| [cn-ip.list](clash/cn-ip.list) | 历史中国云服务商全球 IP 段 | 按需 |

`direct.list` 已合并国内软件和游戏规则；需要单独选择策略时，使用 `cn-apps` 和 `cn-games`。按 `cn-games`、`cn-apps`、`direct` 的顺序匹配，方便单独控制微信小游戏等重叠服务。

腾讯、网易分类覆盖 QQ、微信、企业微信、腾讯会议、网易邮箱、云音乐、LOFTER、有道，以及英雄联盟、无畏契约、三角洲、DNF、穿越火线、梦幻西游、逆水寒、永劫无间、燕云十六声、蛋仔派对、第五人格等国服服务。共享账号和下载服务可能同时用于多个应用。

## 使用方式

将需要的 provider 加入现有配置。每个文件的 `behavior` 以 [catalog.json](catalog.json) 为准：新增基础分类包含 `domain` 和 `ipcidr`，不能全部设成 `classical`；`.list` 的 `format` 为 `text`，YAML 的 `format` 为 `yaml`。

```yaml
rule-providers:
  browser-webrtc:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/browser-webrtc.yaml
    path: ./ruleset/browser-webrtc.yaml
    interval: 86400

  tencent-direct:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/tencent-direct.yaml
    path: ./ruleset/tencent-direct.yaml
    interval: 86400

  claude:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/claude.yaml
    path: ./ruleset/claude.yaml
    interval: 86400

  cn-apps:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/cn-apps.yaml
    path: ./ruleset/cn-apps.yaml
    interval: 86400

  cn-games:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/cn-games.yaml
    path: ./ruleset/cn-games.yaml
    interval: 86400

  direct:
    type: http
    behavior: classical
    format: text
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/direct.list
    path: ./ruleset/direct.list
    interval: 86400

  ai:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/ai.yaml
    path: ./ruleset/ai.yaml
    interval: 86400

  crypto:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/crypto.yaml
    path: ./ruleset/crypto.yaml
    interval: 86400

  telegram:
    type: http
    behavior: classical
    format: text
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/telegram.list
    path: ./ruleset/telegram.list
    interval: 86400

  steam:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/steam.yaml
    path: ./ruleset/steam.yaml
    interval: 86400

  steam-download:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/steam-download.yaml
    path: ./ruleset/steam-download.yaml
    interval: 86400

  download:
    type: http
    behavior: classical
    format: text
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/download.list
    path: ./ruleset/download.list
    interval: 86400

  lan:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/lan.yaml
    path: ./ruleset/lan.yaml
    interval: 86400

  reject:
    type: http
    behavior: domain
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/reject.yaml
    path: ./ruleset/reject.yaml
    interval: 86400

  ad:
    type: http
    behavior: classical
    format: text
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/ad.list
    path: ./ruleset/ad.list
    interval: 86400

  cloudflare:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/cloudflare.yaml
    path: ./ruleset/cloudflare.yaml
    interval: 86400

  analysis:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/analysis.yaml
    path: ./ruleset/analysis.yaml
    interval: 86400

  cn-analysis:
    type: http
    behavior: classical
    format: yaml
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/cn-analysis.yaml
    path: ./ruleset/cn-analysis.yaml
    interval: 86400

  cn-ip:
    type: http
    behavior: classical
    format: text
    url: https://raw.githubusercontent.com/ackness/rules/main/clash/cn-ip.list
    path: ./ruleset/cn-ip.list
    interval: 86400
```

若原始地址下载困难，可将 `https://raw.githubusercontent.com/` 替换为 `https://gh-proxy.com/raw.githubusercontent.com/`。

在 `rules` 中引用所需分类。下面的 `AI`、`Crypto`、`PROXY` 替换成已有策略组名称，其他规则按需插入，最终 `MATCH` 保持在最后。

```yaml
rules:
  - AND,((NETWORK,UDP),(RULE-SET,claude)),REJECT
  - RULE-SET,claude,Claude
  - RULE-SET,browser-webrtc,REJECT
  - RULE-SET,tencent-direct,DIRECT
  - RULE-SET,lan,DIRECT
  - RULE-SET,ai,AI
  - RULE-SET,reject,REJECT
  - RULE-SET,ad,REJECT
  - RULE-SET,cn-games,DIRECT
  - RULE-SET,cn-apps,DIRECT
  - RULE-SET,steam-download,DIRECT
  - RULE-SET,crypto,Crypto
  - RULE-SET,telegram,PROXY
  - RULE-SET,steam,PROXY
  - RULE-SET,download,DIRECT
  - RULE-SET,direct,DIRECT
  # Add other routing rules here.
  - MATCH,PROXY
```

## 使用说明

- `crypto` 已承接框架中的 30 条内联规则，并补回原运行规则集的 30 条明确域名；去重后本次为 450 条。Hyperliquid、Unit、Axiom、Privy 登录和 RPC 按服务域名分流；Privy 等共享主机也会影响其他使用它们的应用。同组不保证节点提供单一固定出口 IP。
- `claude` now contains only service-specific domains and dedicated client processes. Shared payment, generic CDN, fonts, storage, telemetry, keyword matches and unverified historical IP/ASN ranges are removed. Those requests follow ordinary service, advertising or general web policies; removal here does not force them to DIRECT. Process rules apply to all connections made by matching clients. `claude.app` is retained for Desktop live previews, as listed in the [official network requirements](https://code.claude.com/docs/en/desktop#network-access-requirements).
- Claude 组使用手动选择的具体节点，不包含 `DIRECT` 或会自动切换的嵌套组；无节点时使用 `REJECT`。Claude 规则优先于通用直连与广告规则，其 UDP 单独拒绝。节点被删除、订阅刷新或选择缓存重置后，应重新核对出口；双栈或服务端出口轮换无法仅靠规则消除。
- 隐私与性能采用分层方案：Chrome 的 `WebRtcIPHandling`、Edge 的 `WebRtcLocalhostIpHandling` 设为 `disable_non_proxied_udp`，限制未代理的 WebRTC UDP；普通网页 QUIC 不受这项策略直接限制。浏览器通话可能改走 TCP、增加延迟或失败。参见 [Chromium 策略定义](https://github.com/chromium/chromium/blob/main/components/policy/resources/templates/policy_definitions/WebRtc/WebRtcIPHandling.yaml) 和 [Edge 策略](https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies/webrtclocalhostiphandling)。
- `browser-webrtc` 仅补充拦截识别到的浏览器进程使用常见 STUN/TURN UDP 端口或含 `stun` 的域名；任意端口、未识别进程、未进入 Mihomo 的连接均不由它兜底。TUN 关闭时尤其需要浏览器策略；mDNS 隐藏局域网地址不等于隐藏公网地址。规则必须放在通用直连规则前，实际生效还应检查浏览器策略和 ICE 候选地址。
- 原生微信和国服英雄联盟保持直连，因此这些服务仍会看到本机公网出口。DNS、IPv6、浏览器扩展或其他 Chromium 客户端需分别验证；本规则集不承诺所有应用匿名或零泄露。
- 发布时先上传本仓库新增文件，再更新框架模板及已保存的 provider 配置，最后刷新客户端。框架的旧 `/rules/claude.yaml` 接口将重定向到本仓库，不再维护独立快照。

- 国内软件和游戏分类优先收录国内服务端点；腾讯域名及微信、英雄联盟、WeGame 进程按自定义偏好直连，包含相关国际入口。其他国际版、国际服按自己的策略另行分流。
- 腾讯直连例外已并入 `cn-apps`、`cn-games` 和 `direct`；原 `tencent-direct.yaml` 保留供已有配置引用。进程规则依赖客户端正确识别进程。
- `steam-download` 放在 `steam` 前；Claude 等具体服务放在 Cloudflare、通用直连和区域规则前，避免专用 CDN 主机被较宽的后缀规则提前匹配。
- `cn-analysis` 若用于放行分析服务，需要放在广告拦截规则前。`cn-ip` 含境外机房地址，不是中国地理 IP 库，建议按需启用。
- 游戏的纯 IP / UDP 连接和进程识别需结合客户端、系统及加速器验证；收录域名不代表已测试全部游戏功能。
- 规则文件为静态快照；`interval` 只负责定时下载。维护信息见 [维护记录](docs/rule-sources.md)，许可证保留在 [licenses](licenses/)。
- 原 `cn_ip.list`、`LAN.yaml` 已分别改为 `cn-ip.list`、`lan.yaml`；旧订阅需同步修改地址、缓存路径和 provider 引用。

## Framework integration and generated Sing-Box files

This repository now contains 37 categories. In addition to the curated service rules above, the framework's remaining categories are hosted here:

| Categories | Behavior | Purpose |
|---|---|---|
| youtube-domain, google-domain, gits-domain | domain | YouTube, Google and GitHub |
| socialmedia-domain | domain (text) | Social platforms |
| apple-domain, apple-cn-domain | domain | Apple services and China-specific endpoints |
| netflix-domain, disney-domain, hbo-domain, primevideo-domain, spotify-domain | domain | Streaming services |
| private-domain, proxy-domain, cn-domain | domain | Private, overseas and China domain routing |
| google-ipcidr, netflix-ipcidr, private-ipcidr, cn-ipcidr | ipcidr | Service and geographic IP routing |

The cn-ipcidr geographic list is different from the historical cn-ip.list company allocations. lan and cn-ip remain optional; using this repository does not mean enabling every category in every client.

The canonical sources are clash/ plus catalog.json. Run mise run build to regenerate all 37 sing-box/*.json files, then mise run check to detect stale generated content. Publish both directories together. Do not edit generated JSON directly. This uses Bun's built-in YAML parser and needs no package installation.

Shared challenges.cloudflare.com verification is excluded from claude.yaml: assigning it to a service-specific node can break unrelated websites. Clients should route it with their general web policy; domain rules cannot infer which website embedded a challenge. The fq-cf-workers compatibility exception also protects clients using older published snapshots.

The generated-file inventory is tracked in sing-box-generated.json. After deleting or renaming a category, build removes only obsolete files recorded in that inventory and updates it. Keep the inventory when changing the catalog and commit its generated update. Unknown JSON files are preserved and rejected by build/check; move unrelated JSON elsewhere before publishing. Check never creates or updates files.

The main framework references 35 providers, builtin mode 16, and Sing-Box 14. Existing policy choices remain in the framework. AI now adopts this repository's curated list (including the migrated devinapps.com exception); ads use reject plus ad. This is intentionally different coverage from the former third-party lists.

Sing-Box conversion expands IP-ASN using the recorded RIPE announced-prefix snapshot in asn-prefixes.json. It cannot use Mihomo's no-resolve option; anchored process-name regexes become process-path regexes. These platform differences and snapshot freshness must be considered when updating rules. See the [official source format](https://sing-box.sagernet.org/configuration/rule-set/source-format/) and [headless rules](https://sing-box.sagernet.org/configuration/rule-set/headless-rule/).

The imported 18 files have source URLs and SHA-256 hashes in upstream-snapshots.json. They are owned snapshots, not automatically synchronized upstream. Update them deliberately, preserve local edits, then rebuild Sing-Box output. Original licenses are retained under licenses/.

Cloudflare classification excludes shared edge IP ranges and customer hosting suffixes (including pages.dev, workers.dev and r2.dev). Customer websites follow their own policies instead of inheriting the Cloudflare service selector.
