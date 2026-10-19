# Rule Sources and Maintenance

此文件记录来源、筛选理由和各轮维护快照；配置用法见 [README](../README.md)。

## 腾讯、网易应用与游戏深入补充（2026-10-19）

在下方腾讯自定义规则合并快照的基础上，再核对官方网络清单、网页及 SDK，并交叉参考独立规则集合：

| 文件 | 本轮前 → 本轮后 | 变化 |
|------|----------------:|------|
| cn-apps.yaml | 239 → 297 | 新增 60 条，移除 2 条被网易根域覆盖的音乐子域 |
| cn-games.yaml | 123 → 183 | 新增 60 条，原有规则及 6 条用户游戏进程保留 |
| direct.list | 786 → 823 | 合并尚未覆盖的 37 条，其余已被历史域名或关键字规则覆盖 |

应用新增腾讯 40 条、网易 20 条。腾讯会议依据[官方网络要求](https://meeting.tencent.com/support/topic/1929/)及[官方机读清单](https://cdn.meeting.tencent.com/upload/firewall/domain_ip.json)（2026-07-10，v1.14）补 36 条，涉及信令、SSO、IM、录制、会记、布局资源与更新下载。共享云仅使用列明的主机或桶域，没有向 `cn-apps` 加入整个 `myqcloud.com` 或 `qcloud.com`。网易补邮箱、账号、附件资源、LOFTER、有道及音乐端点；实际查看 [LOFTER](https://www.lofter.com/)、[严选](https://you.163.com/)、[邮箱大师](https://dashi.163.com/) 和[有道云笔记](https://note.youdao.com/) 的资源或下载引用。`hz.netease.com`、`mam.netease.com`、`netease.ugcvideoss.ourdvs.com` 依据独立音乐规则补入，未宣称经过实时客户端流量验证。

游戏新增 8 个游戏域及 52 个账号、SDK、启动器、下载、补丁和资源端点。腾讯依据[官方 Milo SDK](https://game.gtimg.cn/images/js/milo-next/latest/milo.min.js)、[正式环境 MSDK 接口](https://wiki.ssl.msdk.qq.com/Router/server.html)、[DNF 下载](https://dnf.qq.com/web2015/down.shtml)、[CF 下载](https://cf.qq.com/cp/a20241115down/)和[飞车下载](https://speed.qq.com/web202204/download.shtml)，补 QQ / 微信登录、Rail API、安全服务及下载主机。网易依据[梦幻补丁页](https://xyq.163.com/download/patch.html)、[UniSDK](https://xyq.res.netease.com/js/sdk/unisdk2.3.32.js)、[MPay SDK](https://mpay-web.netease.com/h5/p4.2.16/static/js/netease-h5-mpay-sdk.umd.js)、[永劫下载](https://www.yjwujian.cn/download/)、[逆水寒下载](https://n.163.com/download/)及各游戏官网，补 MPay / UniSDK、国内 Loading Bay 启动器及精确资源主机。[第五人格官网](https://id5.163.com/)给出的下载接口通过 HEAD 确认跳转到 `a50.gdl.netease.com` 的安装器；未执行安装器。未扩展为整个 `gdl.netease.com` 或全球游戏 CDN。

独立集合使用 [blackmatrix7 固定提交](https://github.com/blackmatrix7/ios_rule_script/tree/7dd06b44f5093dd5404e1e5f3bca5452d97146ef/rule/Clash)（仓库提交时间 2026-10-17 20:04:20 UTC），实际对比 WeChat、TencentVideo、NetEaseMusic、Tencent、NetEase、GameDownloadCN、TencentLoLMobile。仓库更新不代表这些分类同样新：WeChat / TencentVideo / NetEaseMusic / TencentLoLMobile 文件头日期为 2025-06-06，Tencent 为 2025-10-20，NetEase 为 2025-12-10，GameDownloadCN 为 2024-01-08。结合 [v2fly 固定数据](https://github.com/v2fly/domain-list-community/tree/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data)和 [MetaCubeX 网易分类](https://github.com/MetaCubeX/meta-rules-dat/blob/7c782352439ce9ccaba53519ec816f82f52b6285/geo/geosite/netease.yaml)筛选，没有照搬旧 IP / ASN、全球 Riot 域名、海外 VooV、UU 加速器或整组云服务范围。

用户提供的 17 条腾讯例外在分类并集和直连总表中仍全部有效。下文为各轮历史快照，条数和当时的筛选策略不代表当前文件；尤其腾讯自定义例外已经覆盖前一轮对 WeTV / WeChat 的默认限制。`direct.list` 仍保留较宽的历史偏好，例如网易根域，范围大于独立的国服游戏分类。

验证：YAML / 文本解析、重复项、文件命名、README provider 路径及 17 条用户例外覆盖检查通过。Mihomo v1.19.32 在隔离目录实际加载 README 中 19 个 provider，条数一致；使用本机已有 ASN 数据副本满足特殊规则的加载依赖。27 个路由样例通过，顺序为广告拦截、游戏、应用、总直连、兜底，覆盖新登录 / 下载 / 会议主机、腾讯自定义整域例外和海外域名边界。所有样例使用本地 REJECT 出站，没有访问目标服务；未测试真实登录、游戏对局、语音、UDP 或下载速度。本轮未改写用户的 Claude、浏览器和腾讯特殊规则源文件。

## 合并用户腾讯直连例外（2026-10-19）

按用户提供的 `tencent-direct.yaml` 原意合并，不再对其中腾讯整域规则施加国内范围限制：微信的 3 个进程和 8 个域名规则纳入 `cn-apps.yaml`，英雄联盟 / WeGame 的 6 个进程纳入 `cn-games.yaml`；全部 17 条语义同步到 `direct.list`。

QQ 恢复整个 `qq.com` 直连，取消前轮的 WeTV 排除；恢复 `wechat.com` / `tencent-cloud.net` 并补 `weixinbridge.com`。这属于用户明确指定的路由偏好，覆盖前轮默认筛选边界。清理被新根域覆盖的冗余子域后，`cn-apps` 为 239 条、`cn-games` 为 123 条、`direct` 为 786 条。

原 `tencent-direct.yaml` 保留以兼容已有引用；`browser-udp.yaml` 和 `claude.yaml` 未修改。腾讯直连分类应位于浏览器 / AI UDP 限制前，进程规则依赖有效的进程识别。

## 国内软件与国服游戏补充（2026-10-19）

- 新增 `cn-apps.yaml`，254 条，覆盖 QQ / 微信 / 企业微信、腾讯会议文档、钉钉飞书、国内影音音乐、网盘、购物和生活软件。仅使用精确域名和服务后缀，不加入共享云 IP 或进程兜底。
- 新增 `cn-games.yaml`，117 条，覆盖腾讯 / WeGame、网易及暴雪国服、米哈游、库洛、西山居、完美世界、B站游戏和其他已确认国服服务。游戏官网、登录和更新域名不等同于完整的游戏会话、UDP 或纯 IP 连接覆盖。
- 将其中尚未被旧规则覆盖的 111 条软件规则和 51 条游戏规则合并进 `direct.list`。删除 8 条过宽的历史规则后，`direct.list` 从上一轮的 620 条变为 774 条。
- 移除 `battle.net`、`battlenet.com`、`blizzard.com` 的全球整域直连，以国服域名替代；移除 `wechat.com`、共享云根域 `myqcloud.com` / `tencent-cloud.net` 以及泛 `bilibili` / `alipay` 关键词。
- 为保留未知 QQ 客户端通信子域，`direct.list` 使用 AND / NOT 排除已确认的海外入口 `wetv.qq.com`，同时保留其余 `qq.com` 范围。`cn-apps.yaml` 本身只收录明确国内子域；其他未审查的历史直连偏好仍保留，不能把 `direct.list` 当作地理中国白名单。

软件域名主要核对 [v2fly 固定数据目录](https://github.com/v2fly/domain-list-community/tree/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data)，实际展开各服务 include，并与 [MetaCubeX 固定 geosite 目录](https://github.com/MetaCubeX/meta-rules-dat/tree/7c782352439ce9ccaba53519ec816f82f52b6285/geo/geosite) 的 Tencent、Feishu、DingTalk、Bilibili、Aliyun Drive、Douyin 分类比对。辅助资料包括 [飞书网络要求](https://www.feishu.cn/hc/en-US/articles/921458789503-ensure-feishu-rooms-runs-smoothly-on-the-company-intranet)、[钉钉网络要求](https://opensource.dingtalk.com/developerpedia/docs/learn/stream/faq/) 和 [腾讯业务域名说明](https://security.tencent.com/index.php/blog/msg/176?from_tab=announcement)。

游戏域名核对 [v2fly category-games-cn](https://github.com/v2fly/domain-list-community/blob/daeeda75932087a3ab3b70f5649414761af10d6f/data/category-games-cn) 及相应服务子表（新提交时间 2026-10-19 04:44 UTC；较前一快照仅变更 Bitrix / 俄语分类，所用游戏表内容相同）。官方补充依据包括 [网易游戏](https://game.163.com/)、[WeGame](https://www.wegame.com.cn/)、[三角洲国服](https://df.qq.com/)、[鸣潮国服](https://mc.kurogames.com/)、[西山居](https://www.xoyo.com/)、[完美世界](https://www.wanmei.com/) 和 [暴雪国服网易账号公告](https://wow.blizzard.cn/news/20250623/40565_1242492.html)。

未整组导入上游企业或游戏分类：软件排除 WeTV、WeChat 国际入口、B站国际、Lark、TikTok、Rednote 等明确海外端点；游戏排除 Riot、全球 Battle.net / Steam、HoYoverse、Gameloop、Proxima Beta、Midasbuy、库洛海外分类及西山居全球厂商域名。归属不明或共享基础设施不作为新增国内服务兜底。

新文件沿用 [MIT 来源许可](../licenses/v2fly-mit.txt)。已静态检查无重复、无父域冗余，并抽查核心登录域名与广告规则之间的冲突。Mihomo v1.19.32 已加载 README 列出的 16 个 provider，条数一致；通过 22 个隔离路由样例，验证国内登录 / 游戏域名、QQ 的 NOT 例外和海外端点的分流边界。样例请求均在本地拒绝，未发送到服务网站，未开展真实客户端登录、对局或下载测速。

## 更新与比对（2026-10-19）

本次以仓库原版本 `79f5b30` 为基线，搜索并比对上游现有数据，再合并本地优化。所有文件都是静态快照，不会自动同步上游；条数减少可能来自去重或收窄匹配，不代表覆盖退步。

| 文件 | 原条数 → 当前条数 | 更新与本地差异 |
|------|------------------:|----------------|
| ai.yaml | 75 → 172 | 补充现代 AI 服务、编码工具与专用网络端点，去掉通用 CDN / API / WebView 匹配 |
| crypto.yaml | 235 → 395 | 覆盖本次 MetaCubeX Crypto 的全部 235 条，并保留本地历史覆盖、补充官方钱包和 RPC 域名 |
| reject.yaml | 152842 → 195302 | 更新 Loyalsoldier 完整 domain 快照，随上游新增和移除旧条目 |
| ad.list | 614 → 575 | 保留本地精确域名，删除全部关键词、共享推送 / CDN / 正常业务误杀项并去重 |
| cloudflare.yaml | 68 → 95 | 合并新域名；按官方 IP 表将旧 `104.16.0.0/12` 收窄为 `/13` 和 `104.24.0.0/14` |
| telegram.list | 12 → 32 | 18 个服务域名与官方 14 个网段，替换过宽 `91.108.0.0/16`；不混入 TON / Fragment |
| steam.yaml | 4 → 28 | 补商店、社区及静态资源；保留与游戏下载分开的分类 |
| steam-download.yaml | 4 → 21 | 补专用下载 CDN，移除关键词；`steamcdn-a.akamaihd.net` 移至 Steam 静态资源 |
| lan.yaml | 19 → 16 | 补 localhost / home.arpa 与精确多播；去掉文档、基准、废弃及保留地址 |
| download.list | 20 → 20 | 移除不支持的 URL-REGEX 和泛关键词，补 qBittorrent / IDM 等精确进程名 |
| direct.list | 627 → 620 | 保留本地直连意图，移除共享 DNS / Crashlytics / `-cn` / 泛 BT 关键词，修正 CIDR 并去重 |
| cn-ip.list | 221 → 221 | 保留历史公司网段，明确不是地理 CN 数据；未将未经核对的新网段并入 |
| analysis.yaml | 1 → 1 | 保留 `googleapis.cn` 本地绕行例外，不冒充通用分析服务分类 |
| cn-analysis.yaml | 6 → 2 | 仅保留 GrowingIO / 神策，移除全球广告归因服务与石墨协作文档 |

命名迁移：`cn_ip.list` → `cn-ip.list`、`LAN.yaml` → `lan.yaml`，provider `cn_ip` → `cn-ip`。发布后，已有订阅需同步修改 URL、缓存路径及对应 `RULE-SET` 名称；GitHub 文件路径区分大小写。

### AI / Crypto 筛选策略

- **AI**：补充 Claude Code / MCP、Cursor、Windsurf、Gemini Code Assist、NotebookLM、Jules、Antigravity、OpenRouter、Manus 等服务及专用 API / CDN 域名。
- **Crypto**：补充交易所 API / CDN、Gate 新域名、HTX、Hyperliquid、Lighter、Polymarket、MetaMask、WalletConnect、OneKey、Base、RPC 和链上数据服务。
- 去掉 AI 中的通用 WebView 进程、整个 Google API / Azure / Cloudflare CDN、通用统计和广告域名匹配；保留可归属到具体服务的域名。共享登录、验证码、支付和语音中继仍由其他规则处理，需要在客户端连接日志中确认出口是否合适。
- Crypto 使用明确域名代替 `binance`、`okx`、`metamask` 等全域名关键词，去掉 `appsflayer.com` 和与分类无关的 `crunchbase.com`，并去重。新镜像域名需要后续补充。
- 保留原有 Crypto 专用客户端进程规则及未逐一复核的历史域名；旧站点或清算入口仍可能需要访问。AI 中原有 Claude IP 段也暂时保留，未重新确认其归属。规则收录不代表对网站安全性或业务状态的背书。
- AI 未照搬上游的通用客服 / 素材平台、共享 LiveKit 中继、广告问卷，以及本轮无法确认归属的 `chatgpt.site`、`crixet.com`、`oystermercury.top` 等域名；用现有 AND 规则覆盖服务专用 Azure 主机，不重复添加上游单个实例。

### 来源与后续维护

| 来源 | 用途 |
|------|------|
| [v2fly AI 分类及服务子表](https://github.com/v2fly/domain-list-community/blob/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data/category-ai-!cn) | 本次 AI 域名的主要来源，按服务筛选并转换为 classical 格式 |
| [v2fly Crypto 分类及服务子表](https://github.com/v2fly/domain-list-community/blob/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data/category-cryptocurrency) | 本次 Crypto 增量的主要来源，与本仓库历史覆盖合并 |
| [MetaCubeX AI](https://github.com/MetaCubeX/meta-rules-dat/blob/7c782352439ce9ccaba53519ec816f82f52b6285/geo/geosite/classical/category-ai-!cn.yaml) / [Crypto](https://github.com/MetaCubeX/meta-rules-dat/blob/7c782352439ce9ccaba53519ec816f82f52b6285/geo/geosite/classical/category-cryptocurrency.yaml) | 交叉核对分类结果；提供便于 Clash / Mihomo 订阅的格式 |
| [blackmatrix7 Crypto](https://github.com/blackmatrix7/ios_rule_script/blob/master/rule/Clash/Crypto/Crypto.yaml) | 对照旧规则；本次获取的文件标注更新于 2025-06-06，不能仅靠重新下载它完成更新 |

v2fly 使用 MIT 许可证，原文保留在 [licenses/v2fly-mit.txt](../licenses/v2fly-mit.txt)。来源链接固定到本次核对的提交，后续更新时应检查最新提交及分类中的 `include:` 子表，不能只复制分类文件本身。

另外根据官方资料补充了 [DEX Screener](https://docs.dexscreener.com/api/reference)、[Dune](https://docs.dune.com/api-reference/overview/introduction)、[Jupiter](https://developers.jup.ag/docs/portal/setup)、[Base 浏览器](https://docs.base.org/get-started/connect-to-base) 和 [Helius RPC](https://www.helius.dev/blog/introducing-gettransfersbyaddress) 域名。

第二轮补充参考 [OpenAI 网络要求](https://help.openai.com/en/articles/9247338-network-recommendations-for-chatgpt-errors-on-web-and-apps)、[GitHub Copilot allowlist](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)、[Gate API](https://www.gate.com/docs/developers/apiv4/en/)、[Rabby](https://rabby.io/)、[Solscan](https://docs.solscan.io/)、[Alchemy RPC](https://www.alchemy.com/docs/reference/batch-requests)、[Ankr RPC](https://www.ankr.com/infrastructure/build-on-ethereum/) 和 [QuickNode](https://www.quicknode.com/docs/welcome)，补齐专用服务域名及 API 主机。

其他分类的来源与边界：

- 广告主库：[Loyalsoldier 固定快照](https://github.com/Loyalsoldier/clash-rules/blob/4006d222fa41c7b3321f162d6a513568b5717141/reject.txt)，提交时间 2026-10-18 22:36 UTC。许可依据[主分支固定版本](https://github.com/Loyalsoldier/clash-rules/blob/ab21f1c70d263c683990a0aed446ad3bf09a2961/LICENSE)，保留在 [licenses/loyalsoldier-gpl-3.0.txt](../licenses/loyalsoldier-gpl-3.0.txt)。该许可归属适用于对应上游内容。
- 服务域名：[v2fly Cloudflare](https://github.com/v2fly/domain-list-community/blob/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data/cloudflare)、[Steam](https://github.com/v2fly/domain-list-community/blob/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data/steam)、[Telegram](https://github.com/v2fly/domain-list-community/blob/c16efa599b12a9e4b327949b3ed3f8ffff4b33c3/data/telegram)，按本地用途筛选，未直接合并整组关联服务。
- 网络范围：[Cloudflare IPv4](https://www.cloudflare.com/ips-v4/) / [IPv6](https://www.cloudflare.com/ips-v6/)、[Telegram CIDR](https://core.telegram.org/resources/cidr.txt)、[IANA 特殊 IPv4 地址](https://www.iana.org/assignments/iana-ipv4-special-registry/)、[home.arpa RFC 8375](https://www.rfc-editor.org/rfc/rfc8375)。Cloudflare IP 是共享边缘地址，可能覆盖其他客户网站，应排在具体服务规则后。
- `cn-ip.list` 保留历史公司分配，包含境外机房；不应替代 `GEOIP,CN`。`direct.list`、`ad.list` 的历史域名并未全部重新审查所有权或可用性。`analysis.yaml` / `cn-analysis.yaml` 是本地策略例外，没有统一上游分类。
- 已实际下载并比对 [ZJU-Rule 原始上游](https://github.com/lizhist/ZJU-Rule/tree/74be46ff89743e73ce673e366785712b06e11b30/Clash)：该仓库最新提交停在 **2022-02-21**。原 `cn-ip` 与 `ChinaCompanyIp.list` 的 221 条、原 `ad` 与 `BanAD.list` 的 613 条、原 `direct` 与 `Apple.list` / `ChinaDomain.list` 并集的 626 条、原 `download` 的 20 条唯一规则完全相同；没有新的上游增量可同步。本次对这些文件做的是本地修正，尤其 `cn-ip` 不能视作 2026 年新网段数据。
- LAN 规则不接管 `198.18.0.0/15`；fake-IP 应由客户端处理。进程规则依赖平台及客户端的进程识别能力。

如果希望省去手动维护，可以直接订阅 MetaCubeX 的最新 [AI classical YAML](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/classical/category-ai-!cn.yaml) 和 [Crypto classical YAML](https://raw.githubusercontent.com/MetaCubeX/meta-rules-dat/meta/geo/geosite/classical/category-cryptocurrency.yaml)，继续使用 `behavior: classical`。上游与本仓库的筛选范围不同，替换后不会保留本仓库的全部自定义规则。`interval` 只会定时重新下载指定 URL，不会自动把上游变更合并到本仓库。


### Framework migration and Claude review (2026-10-19)

The migrated Claude baseline includes VPSDance material under the [retained MIT license](../licenses/vpsdance-mit.txt).

- Crypto: 395 to 450 unique rules. Of the framework's 30 inline rules, 5 were present and 25 were missing; another 30 exact rules preserve the active QuixoticHeart baseline. Broad keywords and Crunchbase remain excluded. Cloudflare: removed two unexpanded include: pseudo-domains (95 to 93).
- Claude: migrated the existing 60-rule policy, then added 7 exact Artifact font/library hosts from the [official network requirements](https://code.claude.com/docs/en/network-config#third-party-hosts-for-artifact-fonts-and-libraries), plus 5 [Statsig SDK endpoints](https://docs.statsig.com/infrastructure/statsig_domains) as preventive coverage (72 total). Statsig documents dynamic endpoint rotation; this is not evidence that Claude contacts every endpoint.
- Compared live [VPSDance Anthropic](https://github.com/VPSDance/ai-proxy-rules/blob/main/rules/clash/anthropic.yaml) (50), [v2fly Anthropic](https://github.com/v2fly/domain-list-community/blob/master/data/anthropic) (9), and [blackmatrix7 Claude](https://github.com/blackmatrix7/ios_rule_script/blob/master/rule/Clash/Claude/Claude.list) (3). All were already covered, including v2fly's exact CDN host. blackmatrix7's file is dated 2025-06-06. The [xiaolai source and notes](https://github.com/xiaolai/anthropic-claude-surge-rules-set) describe binary/network discovery and shared-host side effects; community attribution is not an official ownership guarantee.
- Official Desktop core domains, downloads, OAuth platform, MCP proxy, content frames and Chrome extension bridge are covered by existing suffixes. The official CLI documentation specifically recommends the same egress for bridge.claudeusercontent.com, claude.ai and api.anthropic.com when using organization IP allowlists. This supports consistent routing, not claims about consumer account bans or undocumented IP detection.
- Shared Artifact hosts added: fonts.googleapis.com, fonts.gstatic.com, cdnjs.cloudflare.com, cdn.jsdelivr.net, cdn.tailwindcss.com, code.jquery.com and unpkg.com. Other sites using these hosts will also use Claude's selected node. Github, package registries and the shared cloudflare-dns.com resolver were not globally moved into Claude; CLI subprocesses and remote/WSL sessions require their own proxy configuration.
- Browser policy is the primary WebRTC control; browser-webrtc.yaml is only a two-rule supplement. Native Tencent rules contain 17 entries. Keep Claude's protected route ahead of generic direct/ad/cloud rules and use an explicit node without DIRECT fallback.

### Complete framework source migration (2026-10-19)

Imported 18 missing framework categories from MetaCubeX and QuixoticHeart. See [upstream-snapshots.json](../upstream-snapshots.json) for fixed MetaCubeX commit URLs and hashes; the QuixoticHeart social-media snapshot is identified by URL and hash. The corresponding GPL-3.0 texts are retained in licenses/metacubex-gpl-3.0.txt and licenses/quixoticheart-gpl-3.0.txt. Imported payloads are unchanged; generated Sing-Box files are converted derivatives.

All 37 categories are registered in catalog.json and generated into sing-box/. The ASN expansion records the RIPE API response's announced prefixes for AS399358. Its timestamp is in asn-prefixes.json. This is a snapshot of announced prefixes, not a claim to include every historical or future allocation.

The previous recommendation to keep VPSDance AI in the framework is superseded: the framework now uses this repository's AI policy. Claude and AI routes precede the broader advertisement lists. Geographic China routing uses cn-ipcidr, not cn-ip.list. The old embedded Claude endpoint now redirects to the owned rule file.
