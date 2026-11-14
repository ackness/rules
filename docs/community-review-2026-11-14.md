# 社区规则增量与冲突复核（2026-11-14）

本轮对比的是具体规则内容和固定提交，保留本仓库的自定义分流偏好。源码、SHA-256、GitHub 官方补充项见 [upstream-snapshots.json](../upstream-snapshots.json)；逐类条数及采纳状态见 [机器可读对比记录](upstream-review-2026-11-14.json)。规则文件仍是可审查的静态快照，社区项目的定时发布不会自动覆盖本仓库。

## 核对来源

| 来源 | 本轮固定版本／时间 | 用法 |
|---|---|---|
| [MetaCubeX/meta-rules-dat](https://github.com/MetaCubeX/meta-rules-dat/tree/1127bb69cd31beba3d8fd851a9dba92e66eead42) | `1127bb69cd31beba3d8fd851a9dba92e66eead42`，2026-11-14 02:36:30 UTC | 对比 Google、GitHub、Apple、流媒体、国内／代理兜底、地理 IP 等 17 类；另比较 AI 和 Crypto classical 分类 |
| [v2fly/domain-list-community](https://github.com/v2fly/domain-list-community/tree/777d056afe68b2643c1ef15f80e7bde3dfa149b1) | `777d056afe68b2643c1ef15f80e7bde3dfa149b1`，2026-11-12 22:04:38 UTC | 服务域名、AI include 子类及 Twitter／Telegram／Steam／Cloudflare 的维护边界 |
| [Loyalsoldier/clash-rules](https://github.com/Loyalsoldier/clash-rules/tree/f67179385329f4c2c859ce56924f8a92fa7785a8) | `f67179385329f4c2c859ce56924f8a92fa7785a8`，2026-11-13 22:34:37 UTC | 广告 `reject` 主库更新 |
| [QuixoticHeart/rule-set](https://github.com/QuixoticHeart/rule-set/tree/6864f3e1116f3f0dc1be8456911017fc9f73d98a) | `6864f3e1116f3f0dc1be8456911017fc9f73d98a`，2026-11-14 03:28:46 UTC | 社交媒体对照；779 条正文与本地相同，未制造内容增量 |
| [blackmatrix7/ios_rule_script](https://github.com/blackmatrix7/ios_rule_script/tree/master/rule/Clash) | 本轮文件头：Crypto 2025-06-06、Telegram 2025-09-10、Steam 2026-10-24 | 交叉参考；没有把仓库最近活跃等同于所有分类都更新到今天 |

原有 MIT / GPL 许可继续保留于 `licenses/`。GitHub 文件在 MetaCubeX 快照之外增加官方 allowlist，记录了 `upstreamSha256`、最终文件 `sha256` 和 `localAdditions`，以后不能直接用上游文件覆盖这些补充。

## 采纳的增量

| 分类 | 原条数 → 当前条数 | 变化 |
|---|---:|---|
| AI | 173 → 193 | Google 3 个专用 API、Copilot 7 个 WebSocket 主机、实验端点与 2 个限定存储/CDN 通配规则；Context7、Cline、Command Code、Plannotator、TypeSafe、Nous Research、Artificial Analysis |
| GitHub | 65 → 75 | 社区新增 West US 会话主机；再按官方 allowlist 补其他 6 个精确主机、实验端点、报告 CDN／存储通配规则 |
| Google | 1075 → 1078 | `appsgenaiserver-pa.clients.google.com`、`appsgenaiserver-pa.clients6.google.com`、`appsgenaiserver-pa.googleapis.com` |
| Google IP | 8552 → 7979 | 更新上游网段与聚合；条数减少不等于覆盖减少 |
| 中国 IP | 10009 → 9640 | 更新地理快照；继续区别于历史云厂商全球地址 `cn-ip.list` |
| 中国域名 | 110446 → 110177 | 上游新增 35、移除 304 项 |
| 代理兜底 | 27213 → 27308 | 上游新增 139、移除 44 项；具体服务策略仍优先 |
| 广告主库 | 195302 → 200344 | 新增 20376、移除 15334 项；未覆盖本地 `ad.list` |
| Apple | 1792 → 1794 | 新增 3、移除 `+.icloud.cn`；源文件已有的 2 条重复项在 Sing-Box 生成时去重 |
| Netflix / Spotify | 24 → 24 / 28 → 28 | 将各自的专用 `*.com.edgesuite.net` 从精确主机扩展为相应后缀，未匹配整个 `edgesuite.net` |
| Crypto | 450 → 464 | 地区／新平台更新见 [地区记录](service-regions.md)；另采纳已取得现站响应的 `cryptoid.info`、`kurs.expert` |

新的 AI 工具均实际取得网站响应并检查了页面用途。Copilot 额外依据 [GitHub 官方 allowlist](https://docs.github.com/en/copilot/reference/copilot-allowlist-reference)，包括 `production-copilot-host-*` 的具体地区主机、`copilot-reports-*.b01.azurefd.net` 和 `usagereports*.blob.core.windows.net`。通配只在一个 DNS 标签内生效，不会将所有 Azure、Blob 或 Web PubSub 归入 AI。

Telegram 当前官方 [14 个 CIDR](https://core.telegram.org/resources/cidr.txt)与本地一致。Steam 官方 [GetServersForSteamPipe](https://api.steampowered.com/IContentServerDirectoryService/GetServersForSteamPipe/v1/?cell_id=0&max_servers=100)本轮返回 104 个服务记录，主机均由现有 `steam-download` 覆盖；没有为制造增量而导入社区列表中的商店关键词、捆绑商店或共享 CDN。Cloudflare 继续排除共享客户托管后缀与边缘 IP。RIPE 的 AS399358 当前返回的 3 个前缀与本地 ASN 快照一致。

## 未直接合并的内容

- 新版 `private-ipcidr` 新增的 NAT64、IANA 特殊用途及文档网段，不统一解释为局域网直连；保留当前 18 条快照，记录本轮审核原因。
- AI 上游中的 `themeforest.net` 等素材市场、共享 LiveKit / 日志 / 客服服务，以及缺少本轮官方归属证据的新增 Claude 品牌域名，未纳入专用 AI 分类。通用代理兜底有自己的覆盖，并不表示已核实所有域名的品牌归属。
- `comfyregistry.org` 本轮跳转到 `findakey.net` 并返回 401，未纳入 AI；`blockchair.net` 证书主机名不匹配，`delets.cash` 返回 403，未采纳为新增 Crypto 条目。这些探测结果不构成网站安全性判断。
- `direct.list`、腾讯自定义直连、Claude、浏览器规则和下载进程规则均保留本地策略，没有用社区分类整组替换。

## 冲突与验证

全量检查同时加载本地所有分类，按最终生成配置的**首条命中**顺序评估 TCP/443 域名流量；不根据域名猜测进程或目的 IP。231 个样例在主 Clash、Builtin 和 Sing-Box 中均符合预期，重点包括：

| 重叠 | 最终结果 |
|---|---|
| `download-mirrors` 与 Claude 的 `cdn.jsdelivr.net` | 镜像规则在前，`DIRECT` |
| `crypto-regional` 与总表、广告、CN／通用代理 | `非美服务` / `non-us` 优先 |
| `grok.x.com` 与 Twitter 的 `x.com` | AI 优先，普通 `x.com` 走 Twitter／主选择器 |
| Copilot WebSocket 与 GitHub 分类 | AI 优先，普通 GitHub / Raw / Release 仍走 GitHub 策略 |
| `copilot-telemetry.githubusercontent.com` 与新版广告库 | 按既有 AI 优先策略走 AI；这是有意重叠，不移除广告库条目 |
| `fonts.googleapis.com` 与 Google | 保留原 Claude 专用策略 |
| `hf-mirror.com` 与 Hugging Face 原站 | 镜像直连；`huggingface.co` / Xet 仍走 AI |
| `binance.us` / `polymarket.us` 与非美分类 | 不被非美子表匹配 |
| 微信与国内通用规则 | 继续直连 |
| Steam 商店与专用下载主机 | 主 Clash 商店走 Steam、下载走 Steam下载；其他输出按已有直连策略处理 |

另外，217 个源规则／生成 JSON 正反样例通过，包括防止镜像匹配父域、Azure 通配越过标签、品牌域名后附恶意后缀等边界。Worker 类型检查及 123 项测试通过；Sing-Box v1.14.4 编译全部 40 个规则集并检查最终配置；Mihomo v1.19.34 检查含 40 个本地 provider 的配置，并通过 71 个本地模拟出口路由请求。原生请求不会访问这些样例的真实网站。

可复查命令：规则仓库 `mise run build`、`mise run check`；工作区中的 Worker 仓库 `npm run check`、`npm run check:rules`。后者依赖同级 `rules` 目录，会验证引用和最终策略冲突。真实中国大陆可达性、UDP、进程识别、WebSocket 业务会话和账号能力仍需要用用户实际节点验证。
