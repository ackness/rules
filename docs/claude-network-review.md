# Claude 网络规则核对与优化（2026-11-14）

对照用户提供的 [域名规则页](https://ip.net.coffee/claude/site.html)与 [稳定使用指南](https://ip.net.coffee/claude/claudecode.html)，并交叉核对 Claude 官方网络文档、ARIN RDAP、RIPE RIS 与 NTP 标准。

结论：页面完整配置示例中的 **17 条 DOMAIN / DOMAIN-SUFFIX 规则全部已有覆盖**。本轮不整体替换现有规则，补充了可确认的 IP 兜底和 Claude 专用 DNS 路径；规则总数由 73 增至 76。现有镜像直连、Tailscale、浏览器和其他服务的出口偏好保留。

## 当前满足的部分

| 要求 | 检查结果 |
|---|---|
| 核心、OAuth、CDN、MCP 和常见监控域名 | 完整示例的 17 条域名均被覆盖；后缀同时覆盖 `api`、`platform`、`sso`、`bridge` 等子域。官方新增客户端主机也在已列后缀内 |
| Claude 独立出口 | 主 Clash、Builtin、Sing-Box 均为手动选择的具体节点，不含 DIRECT 或嵌套自动组；无可用节点时拒绝应用流量 |
| 规则优先级 | Claude 位于普通广告、AI、区域和通用代理之前；保留 Tailscale 及下载镜像的既有优先例外 |
| 目标 UDP | 匹配 Claude 的应用 UDP 拒绝，保留其他业务的 UDP / QUIC |
| WebRTC | 有识别到的浏览器 STUN/TURN 补充规则，仍需浏览器 `disable_non_proxied_udp` 等设置；网页检测不能验证所有原生应用 UDP |
| Chrome uTLS | 自建节点默认设置已存在，显式自定义指纹保留；这控制代理隧道握手，不等于改变 Claude Code 到源站的应用 TLS 实现 |
| 连接保持 | 模板已有 TCP keep-alive 参数；HTTP 连接池、SSE 重试与请求并发仍由应用及服务端控制 |

当前基于域名的策略可以选择同一个节点，但不能仅凭节点名称证明真实国家、单一公网 IP、服务端不轮换出口，或保证账号不会受限。

## 本轮完成的优化

### 已确认的 IP 兜底

ARIN 当前记录确认 `160.79.104.0/21` 和 `2607:6bc0::/32` 分配给 Anthropic, PBC，页面的分配归属有依据：

- [IPv4 RDAP](https://rdap.arin.net/registry/ip/160.79.104.0)
- [IPv6 RDAP](https://rdap.arin.net/registry/ip/2607:6bc0::)

分配范围与实际宣告范围不同。本轮 [RIPE AS399358](https://stat.ripe.net/data/announced-prefixes/data.json?resource=AS399358) 返回以下三段，已加入 `claude` 并同步生成 Sing-Box：

```text
IP-CIDR,160.79.104.0/23,no-resolve
IP-CIDR6,2607:6bc0::/48,no-resolve
IP-CIDR6,2607:6bc0:11::/48,no-resolve
```

这样已确认的纯 IP 连接优先采用 Claude 策略，不再落到一般 AI 策略。没有额外引入 ASN 数据库加载依赖。IP 兜底只覆盖所列地址，无法替代 Cloudflare、GCP 等共享设施上的域名匹配。未来路由变化需要重新核对；本轮同步记录了 ASN 快照的核对时间。

### DNS 路径与所选 Claude 节点对齐

Mihomo 在存在 Claude provider、Claude 分组和 DNS 配置时，默认增加 `rule-set:claude` 的 DoH 策略，通过 `#Claude` 指定同一选择器。显式设置的该项 DNS 策略保留；节点域名的引导解析继续使用原配置。下载镜像的 DNS 策略排在 Claude 前面，优先采用已有直连解析器；Tailscale 的 MagicDNS 仍最先匹配。屏蔽 provider 时会移除对应 DNS 引用，避免遗留无效引用。

Sing-Box 有可用 Claude 节点时，默认增加 `claude-dns` 加密 DNS 服务，设置 `detour: claude`，并在 Claude 应用路由前显式 `resolve`，避免 `default_domain_resolver=google` 绕过专用 DNS。已有同名自定义解析器保留。镜像 DNS 查询规则先于 Claude，Tailscale 规则和下载直连继续保留。新建的无节点配置不增加 Claude DNS 服务，应用流量继续拒绝。

加密 DNS URL 本身不代表查询经过代理；本轮验证的是解析器路径和节点选择，不把 DoH 的存在当作零泄露证明。用户显式关闭内核 DNS、使用自定义策略，或应用自己使用其他 DoH 时，需要检查实际连接路径。

## 两篇文章中不宜直接采纳的说法

| 文章建议或说法 | 核对与处理 |
|---|---|
| NTP 返回代理地区的时区，因此 NTP 必须通过 Claude | NTP 同步 UTC 时间，系统／浏览器时区是另外的设置。RFC 5905 没有该机制。保留系统时间服务原策略，未新增全局 NTP 代理或拦截 |
| `no-resolve` 避免对每个域名做反向 DNS | 该选项主要避免为了 IP 规则额外解析域名取得目的地址，不能解释成 PTR 反查 |
| `fingerprint: chrome` 使 Claude 看到与浏览器完全相同的 TLS | 代理隧道和应用到源站的 TLS 分属不同连接；不能由这个开关保证源站识别结果 |
| `network: tcp` 能解释所有客户端的传输设置 | 配置字段依赖引擎和协议。我们的应用层 UDP 限制不强制把 Hysteria2 / TUIC 之类代理传输变成 TCP；需要 TCP 传输时应选择对应节点 |
| 禁用 IPv6 是所有环境的必需条件 | 应确保 IPv4 / IPv6 都按预期分流。当前按模板和用户开关控制应用解析，Builtin 仍允许用 IPv6 连接代理节点，不强制修改系统 IPv6 |
| 单 IP 并发必须小于 5、住宅 IP 变更不会触发限制 | 未找到通用的官方保证。按模型／账号实际额度、429 和 Retry-After 管理请求，分流规则不硬编码这个上限 |
| DNS 检测页、Canvas / WebGL 能证明 CLI 的全部网络环境 | 浏览器测试有自己的观测范围，不能替代 CLI、WSL、SSH、后台代理进程的检查 |
| 泛 `datadog` / `sentry` / `sift` 关键词兜底 | 保留已列出的供应商后缀和精确主机，避免把任意包含这些字符串的域名分到 Claude |

参考：[RFC 5905](https://www.rfc-editor.org/rfc/rfc5905)、[官方网络配置](https://code.claude.com/docs/en/network-config)、[官方 API rate limits](https://platform.claude.com/docs/en/api/rate-limits)。

## 仍需区分的依赖与使用场景

- **KYC**：规则页正文额外列出 `maps.googleapis.com`、`frompersona.com`，但其完整复制示例也未包含这两项。现有 `withpersona.com` 已覆盖核心 Persona 验证域名，[Claude 官方身份验证说明](https://support.claude.com/en/articles/14328960-identity-verification-on-claude)确认合作方为 Persona。正文关于 Google Maps 和邮件域名的说明尚不足以证明它们是所有 Claude 会话必需的主机，本轮保留它们的原有策略。
- **验证码**：`challenges.cloudflare.com` 仍按原设置使用通用网页选择器。若 Claude 网页和该选择器实际出口不同，验证码可能需要对齐所选节点。共享验证码不能仅按目标域名识别它嵌入在哪个网站。
- **镜像**：`cdn.jsdelivr.net` 在 Claude 依赖表和下载镜像中都有记录，依用户偏好仍由镜像直连优先。第三方公开素材加载与账号核心会话不能混为同一种要求。
- **CLI / 远程环境**：Claude 官方支持 HTTP(S) 代理环境变量，不支持直接使用 SOCKS URL。启动后改 shell 变量不一定影响已运行会话；WSL、SSH、容器和后台 supervisor 应分别核对设置与 `/status`。HTTPS、SSE 和 WebSocket 都需要能稳定通过代理。

## 验证与发布

140 项 Worker 测试与类型检查通过；330 个源规则／生成 JSON 域名边界样例、三个输出中 289 个最终策略样例通过。新增断言检查 IP 兜底仅来自已记录的 RIPE 宣告，以及共享镜像／MagicDNS 的优先级和 provider 屏蔽。

Mihomo v1.19.34 原生测试使用本地 DNS 和 HTTP 代理，确认 classical provider 可用于 DNS 匹配、`#Claude` 确实经过指定节点，镜像查询采用原直连解析路径。Sing-Box v1.14.4 原生测试确认 Claude 域名查询经过带 Claude detour 的解析器、三段 IPv4 / IPv6 纯 IP 流量走 Claude，网段外地址不被扩大匹配，镜像保持直连。原生测试使用本地模拟端点，没有登录账号、调用付费 API 或验证用户实际节点的公网信誉。

本轮不新增分类。`claude` 文件内容更新需按规则缓存的“检查更新 → 下载候选版本 → 发布规则”流程生效；新的 DNS 构建逻辑还需要部署 Worker 并更新客户端订阅。已有个人模板与明确 DNS 设置保留。
