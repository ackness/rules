# Steam / Apple CDN 专项（2026-11-14）

下载内容与商店、账号分别分流。独立分类只收专用主机，不将 Akamai、Cloudflare、AWS 等共享 CDN 的根域或整个 IP 网段直连。CDN 最终节点由 DNS、运营商、服务端调度与缓存共同决定；规则不能保证一定选中国机房。

| 分类 | 当前覆盖 | 主 Clash | Builtin / Sing-Box |
|---|---|---|---|
| `steam-download` | 26 条：SteamPipe、游戏下载、客户端更新和专用 CDN | `Steam下载`，默认 `DIRECT` | 显式 `DIRECT` / `direct` |
| `steam` | 商店、社区、直播及常用网页静态资源 | 原 `Steam` 策略 | 保持原主选择器／直连总表行为 |
| `apple-cdn` | 24 条：App Store 资源／下载、OS 更新与恢复、Xcode、GarageBand、Swift Playgrounds 等 | `苹果CDN`，默认 `DIRECT`，可改选节点 | 显式 `DIRECT` / `direct` |
| `apple-cn-domain` / `apple-domain` | 原国内入口、账号、商店、云服务及其余 Apple 业务 | 原策略 | 保持已有策略 |

Apple CDN 和 Steam 下载在三个输出中均优先于广告、直连总表与通用代理；主 Clash 也优先于更宽的 Apple / Steam 分类。主模板的两个下载组允许手动切换出口，以便处理特定运营商或 CDN 的直连故障。

## 主机边界与来源

Apple 主源是[官方企业网络要求](https://support.apple.com/en-us/101555)，本轮实际读取其 Software updates、Apps and additional content、Carrier updates 表格，结合已有 Apple CN 快照的专用下载别名：

- 应用资源与安装包：`mzstatic.com` 专用后缀、`iosapps.itunes.apple.com`、`osxapps.itunes.apple.com` 及对应 `aaplimg.com` 精确别名；新版编号主机如 `is6-ssl.mzstatic.com` 同样覆盖。
- 系统更新与恢复：`appldnld.apple.com`、`oscdn.apple.com`、`swcdn.apple.com`、`swdownload.apple.com`、`updates.cdn-apple.com`、`updates-http.cdn-apple.com` 及已核对的专用别名。
- 开发与附加内容：`download.developer.apple.com`、`adcdownload.apple.com`、`devimages-cdn.apple.com`、`audiocontentdownload.apple.com`、两个 Playgrounds 主机和 `sylvan.apple.com`。

没有把 `*.apple.com`、`*.cdn-apple.com`、`*.aaplimg.com`、`*.itunes.apple.com`、iCloud 或整个共享 CDN 放进该分类。例如 `appleid.cdn-apple.com` 是账号主机，不能仅凭名称含 CDN 就当下载处理；`apps.apple.com` 商店、Apple ID、CloudKit、Private Relay、Apple TV／Music 等继续按原规则处理。`mzstatic.com` 会同时分发应用及媒体图片，这一后缀上的资源统一采用 CDN 策略。

Steam 保留原来的 21 条专用下载规则，补入本地历史直连表和社区分类中的 `dl.steam.ksyna.com`、`steampipe.steamcontent.tnkjmec.com`、`cdn-ali.content.steamchina.com`、`cdn-qc.content.steamchina.com`、`cdn-ws.content.steamchina.com`。参考 [blackmatrix7 Steam](https://github.com/blackmatrix7/ios_rule_script/blob/master/rule/Clash/Steam/Steam.yaml) 和 [SteamCN](https://github.com/blackmatrix7/ios_rule_script/blob/master/rule/Clash/SteamCN/SteamCN.yaml)，但未导入整组 SteamCN：其中的连接管理、社区图片等主机与纯下载用途不同。

官方 [GetServersForSteamPipe](https://api.steampowered.com/IContentServerDirectoryService/GetServersForSteamPipe/v1/?cell_id=0&max_servers=100)上一轮返回的 104 条记录及本轮额外 `cell_id=163/25` 样本（17 / 31 条）都由现有 Steam 下载域名覆盖。参数不代表测试环境位于中国，也不能据此推断速度。`steambroadcast.akamaized.net`、商店与社区主机不属于本次新增的下载范围。

## DNS 与调度

Clash 使用模板已有的 `direct-nameserver`（腾讯／阿里公共 DNS）解析直连出口，并保持 `direct-nameserver-follow-policy`，以保留 MagicDNS 等显式策略。依据 [Mihomo DNS 文档](https://wiki.metacubex.one/en/config/dns/)，直连出口解析与全局 `nameserver` 不同；选择代理下载时仍按所选出口工作。

Sing-Box 原模板的 `route.default_domain_resolver` 是 `google`。仅增加 DIRECT 路由仍可能用默认解析器，因此本轮为两类 CDN 增加先 `resolve`、后 `route -> direct` 的配对规则：已有 `local` DNS 时，明确用该解析器取得地址。默认模板的 DNS 查询规则也将这两类交给 `local`。自定义 `local` 配置保留；模板没有 `local` 标签时不擅自添加解析器，继续使用已有 DNS 配置。原自定义路由仍有优先级。参见 [Sing-Box resolve action](https://sing-box.sagernet.org/configuration/route/rule_action/#resolve)。

## 实际验证

公网请求来自当前环境，未做中国大陆多运营商或用户节点测速：

| 请求 | 结果 |
|---|---|
| [App Store Xcode 查询](https://itunes.apple.com/lookup?id=497799835&country=cn) | 200，从返回内容取得真实 `is1-ssl.mzstatic.com` 图片地址 |
| 上述图片 HEAD | 200，`image/png`，`Content-Length: 121956` |
| [macOS 恢复清单](https://mesu.apple.com/assets/macos/com_apple_macOSIPSW/com_apple_macOSIPSW.xml) | 200，解析出的 3 个不同恢复地址均使用 `updates.cdn-apple.com` |
| 其中一个恢复地址 HEAD | 200，`binary/octet-stream`，约 25.6 GB；未下载镜像本体 |

本地验证：类型检查与 128 项测试通过；295 个源规则／生成 JSON 正反样例、三个最终输出中的 286 个域名策略样例通过。Mihomo v1.19.34 的 95 个模拟出口请求通过，涵盖新 CDN 和共享父域排除。Sing-Box v1.14.4 编译两个 CDN 规则集、检查包含全部 20 个 provider 的配置；另用本地 DNS / HTTP 服务运行 6 个真实内核请求，证实默认解析器为 `google` 时，这些 CDN 仍通过 `local` 解析并直连，未向默认解析器发出查询。模拟请求不访问样例网站。

规则仓库执行 `mise run build` / `mise run check`，工作区 Worker 执行 `npm run check` / `npm run check:rules` 可复核源规则、生成结果、分组和冲突。当前共 41 类；新增分类仍需先发布规则文件，再上线引用它的模板／代码，已有个人模板应合并更新。
