# 地区服务与验证记录（2026-11-14）

本轮目标是让地区敏感服务默认使用**非美国出口**，避免进入美国版本或美国的产品范围。`crypto-regional` 是出口偏好分类，不是“美国不可用”或“其余地区均可用”的分类。平台还会根据账号、注册主体、产品、用户所在地和 IP 判断可用功能。

## 规则与分组

| 分类 | 覆盖 | 框架默认策略 |
|---|---|---|
| `crypto-regional` | Binance 全球站、OKX、Hyperliquid/Unit、Bybit、Gate、HTX、KuCoin、Bitget、MEXC、Deribit、Lighter、预测市场和交易终端 | Clash `非美服务`；Sing-Box `non-us` |
| `crypto` | 上述域名的兼容总表，以及钱包、RPC、行情、新闻和历史入口 | 原 `加密货币` / `crypto` 策略 |
| `twitter-domain` | X/Twitter 网页、API、图片、视频、Spaces、短链 | 主 Clash `Twitter`；Builtin 主选择器；Sing-Box `proxy` |
| `download-mirrors` | 镜像服务实际连接主机，包括用户指定的 GitHub 镜像 | `DIRECT`，优先于服务和进程规则 |

`crypto-regional` 必须位于 `crypto`、广告、Cloudflare、地理 IP 和通用代理规则之前。总表继续包含子表的全部规则，单独引用旧 `crypto` 的订阅不会失去覆盖。

框架的非美组仅使用能从名称识别为 HK、JP、SG、TW、KR、DE 的具体节点，排除任何同时含美国标记的节点及未知地区节点。它不包含 `DIRECT`、全局自动组、地区自动组或嵌套选择器；无候选时拒绝连接。订阅里的名称只是元数据，实际出口需用所选节点核对。已有客户端选择缓存也需要检查。

`binance.us` 与 `polymarket.us` 是单独的美国服务域名，保留在总表，未加入非美子表。OKX 在同一个 `www.okx.com` 下使用不同路径；域名规则无法区分 `/en-us`、`/en-eu` 等路径，也不会改写账号或 API 配置。

## 官方服务范围核对

以下为 2026-11-14 取得的官网快照，列的是与选出口相关的摘要；完整范围以所链接页面为准，未列出的国家不代表已确认支持。

| 平台 | 官方资料与日期 | 核对结果 |
|---|---|---|
| Hyperliquid | [客户端 Terms](https://app.hyperliquid.xyz/terms)，正文由当时加载的 [TermsOfUse 模块](https://app.hyperliquid.xyz/assets/TermsOfUse-Y2hcnm5W.js)提供；正文更新于 2026-06-15 | §1.6 列美国、加拿大 Ontario 及受制裁地区；§1.7–1.8 对 outcome markets 另设限制。因此产品范围也需分别判断。`hyperliquid.xyz/terms` 返回 403，不能把那个地址当作成功读取条款的证据。 |
| Binance | [Binance.US](https://www.binance.us/)；[全球站条款](https://www.binance.com/en/terms) | 美国站与全球站分开。美国站首页 200；全球条款本轮 202 空响应，未重新确认完整国家清单。全球 API `/api/v3/time` 返回有效时间数据。 |
| OKX | [Terms of Service](https://www.okx.com/help/terms-of-service)，正文更新于 2026-10-29；[API 文档](https://www.okx.com/docs-v5/en/) | 条款明确列出 OKX US、EU、Singapore 等不同实体，不能称为“美国不可用”。API 文档要求在 `app.okx.com` 注册的美国／澳洲用户使用 `us.okx.com`，在 `my.okx.com` 注册的 EU 用户使用 `eea.okx.com`；规则不会替用户改写这些地址。 |
| Polymarket 国际站 | [Geographic Restrictions](https://docs.polymarket.com/api-reference/geoblock)；[Terms](https://polymarket.com/tos)，生效于 2026-08-11 | 官方区分完全封禁、前端与 API 仅平仓、仅前端仅平仓。美国、德国、新加坡、台湾等在前端与 API 仅平仓名单；日本、韩国、荷兰、爱尔兰等另有前端限制。`GET /api/geoblock` 本轮返回 `country=DE, region=SN, blocked=true`。不能把非美组当作“可交易地区”组。 |
| Predict.fun | [官网链接的条款](https://docs.predict.fun/terms-of-service)，正文标注 2025-11-18；[开发文档](https://dev.predict.fun/) | 当前官网仍链接这版条款，并非本轮只检索旧文章。摘要列美国、英国、法国、Ontario、新加坡、波兰、泰国、澳大利亚、比利时、台湾等限制；首页 200，公共开发 API 无 Key 返回 401。 |
| Bybit | [Service Restricted Countries](https://www.bybit.com/en/help-center/article/Service-Restricted-Countries)，页面标注 2026-10-16 | 当前清单还列中国大陆、香港、新加坡等地区，表明不能给所有平台指定同一个“通用可用国家”。 |
| Lighter | [Terms](https://lighter.xyz/terms)；[API 文档](https://docs.lighter.xyz/) | 正文列美国、加拿大、英国、中国等限制；订单簿公开 API 可读只说明接口连通。 |
| Variational | [Restricted Persons](https://docs.variational.io/legal/restricted-persons)，正文标注 2026-04-20 | 列美国、加拿大、台湾、部分美国关联地区及受制裁地区；公开行情统计 API 200。 |
| Extended | [Restricted Regions](https://docs.extended.exchange/extended-resources/legal/restricted-countries) | 当前页按 Interface 永续与 Spot 分别指向条款；不再将页面解释成一张统一国家表。公开 markets API 200。 |
| DeBot | [官网](https://debot.ai/)、[Terms](https://docs.debot.ai/legal/terms-of-use)，正文修订于 2026-06-08 | 官网及条款可读。前端实际引用 `asia.debot.ai`、`sgws.debot.ai` 等主机，由专用后缀覆盖。没有把用户写的 `ddebot` 推测成一个新域名。 |

GMGN 的[官方文档](https://docs.gmgn.ai/index)及[交易 API 文档](https://docs.gmgn.ai/index/cooperation-api-integrate-gmgn-solana-trading-api)可读，主页在本机返回 403；不能据此判断是地区限制还是 WAF。Pump.fun 主页及条款返回 403，未宣称重新确认其服务地区。Axiom 的 `axiom.trade` 和 `docs.axiom.trade` 本轮均返回 404，保留已有域名规则作为历史覆盖。用户写的 `axios.trade` 无法解析，且未取得官网归属证据，本轮未加入；它不能与 `axiom.trade` 混为一谈。

Aster、edgeX、Opinion 已分别取得[官网](https://www.asterdex.com/)、[官网](https://www.edgex.exchange/)、[官网](https://opinion.trade/)和对应官方文档链接，纳入非美出口偏好；未声称完成它们的全部地区条款审计。Aster 的 `static2.asterdexfx.com` 来自官网资源引用；Polymarket 的 `.sh` API、两个 S3 桶和精确视频 CDN 主机来自官网响应的 CSP。没有加入整个 AWS、Cloudflare、GitBook、Privy 或 jsDelivr 后缀作为交易规则。

## 新平台发现与资料新鲜度

本轮先查了 [Google News 最近 60 天的 Hyperliquid/Lighter 新闻](https://news.google.com/rss/search?q=Hyperliquid%20Lighter%20perpetual%20exchange%20when%3A60d&hl=en-US&gl=US&ceid=US%3Aen)和 [Predict.fun 最近 180 天新闻](https://news.google.com/rss/search?q=%22predict.fun%22%20when%3A180d&hl=en-US&gl=US&ceid=US%3Aen)。检索结果包含 TokenPost 2026-11-09 的永续 DEX 周成交量报道、CryptoTicker 2026-11-08 的 DEX 比较，以及 2026-11 月的 Predict.fun 报道。这些用作发现线索；没有把搜索摘要里的成交量当作本仓库验证的排行榜，也没有用新闻替代官方服务范围。

通用域名另与 v2fly 最新提交 [`777d056afe68b2643c1ef15f80e7bde3dfa149b1`](https://github.com/v2fly/domain-list-community/tree/777d056afe68b2643c1ef15f80e7bde3dfa149b1)（2026-11-12 22:04:38 UTC）比对。Twitter 拆成独立分类；现有 Google 表已覆盖该提交 `data/google` 的直接域名条目，本轮未发现需要盲目追加的直接条目。GitHub 核对了[官方网络要求](https://docs.github.com/en/get-started/using-github/allowing-access-to-githubs-services-from-a-restricted-network)和当前 [Meta API](https://api.github.com/meta)，保留 API、SSH over 443、Raw、Release、LFS、静态资源与 GHCR，并按[官方 Copilot allowlist](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)补充会话与报告端点。Google 另从 MetaCubeX 当前快照补充 3 个专用 AI 主机；社区增量和冲突见 [复核记录](community-review-2026-11-14.md)，未导入共享云服务商 IP。

## 连通性测试边界

请求在当前环境执行，禁用显式 HTTP 代理；唯一取得的地区证据是 Polymarket 自己判定的德国出口。**这不是中国大陆或用户所有订阅节点的实测结果。** HTTP 200、API 返回数据、地区 eligibility 与账号交易成功是不同的验证层次；本轮未登录、签名、下单、转账或执行大文件测速。

| 探测 | 结果 |
|---|---|
| Hyperliquid `POST /info`，只读请求 `{"type":"meta"}` | 200，返回 `universe` / `marginTables` |
| Binance `GET /api/v3/time` | 200，返回 `serverTime` |
| OKX `GET /api/v5/public/time` | 200，业务 `code=0` |
| Polymarket `GET /api/geoblock` | 200，但 `blocked=true`；记录中不保存出口 IP |
| Predict `GET /v1/categories?first=1` | 401，明确要求鉴权 |
| Lighter `GET /api/v1/orderBooks` | 200，返回公开订单簿目录 |
| Aster `GET /fapi/v1/ping` | 200，返回 `{}` |
| Extended `GET /api/v1/info/markets` | 200，返回市场数据 |
| Variational `GET /metadata/stats` | 200，返回统计数据 |

镜像当前探测及用户清单的完整结果见 [镜像记录](mirror-probes-2026-11-14.md)。选好具体节点后，应通过实际客户端再请求平台的公开检查接口；需要鉴权的接口只能在用户自己的账号环境中验证。
