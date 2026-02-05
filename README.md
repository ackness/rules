# Clash Rules

Clash 规则集合，包含各种分类的代理规则。

## 规则列表

| 规则名称 | 原始链接 | 国内代理链接 |
|---------|---------|------------|
| reject.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/reject.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/reject.yaml` |
| ai.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/ai.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/ai.yaml` |
| analysis.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/analysis.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/analysis.yaml` |
| cloudflare.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/cloudflare.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/cloudflare.yaml` |
| cn-analysis.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/cn-analysis.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/cn-analysis.yaml` |
| crypto.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/crypto.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/crypto.yaml` |
| LAN.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/LAN.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/LAN.yaml` |
| steam.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/steam.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/steam.yaml` |
| steam-download.yaml | `https://raw.githubusercontent.com/ackness/rules/main/clash/steam-download.yaml` | `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/steam-download.yaml` |

## 规则说明

- **reject.yaml** - 拒绝规则
- **ai.yaml** - AI 服务规则
- **analysis.yaml** - 分析服务规则
- **cloudflare.yaml** - Cloudflare 规则
- **cn-analysis.yaml** - 国内分析服务规则
- **crypto.yaml** - 加密货币相关规则
- **LAN.yaml** - 本地网络规则
- **steam.yaml** - Steam 相关规则
- **steam-download.yaml** - Steam 下载加速规则

## 使用方式

在 Clash 配置文件中引入以下规则）。建议在国内使用代理链接以获得更快的速度。配置文件位于 `./ruleset` 文件夹。

```yaml
rule_providers:
  reject:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/reject.yaml`
    path: ./ruleset/reject.yaml
    interval: 86400

  ai:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/ai.yaml`
    path: ./ruleset/ai.yaml
    interval: 86400

  analysis:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/analysis.yaml`
    path: ./ruleset/analysis.yaml
    interval: 86400

  cloudflare:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/cloudflare.yaml`
    path: ./ruleset/cloudflare.yaml
    interval: 86400

  cn-analysis:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/cn-analysis.yaml`
    path: ./ruleset/cn-analysis.yaml
    interval: 86400

  crypto:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/crypto.yaml`
    path: ./ruleset/crypto.yaml
    interval: 86400

  lan:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/LAN.yaml`
    path: ./ruleset/LAN.yaml
    interval: 86400

  steam:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/steam.yaml`
    path: ./ruleset/steam.yaml
    interval: 86400

  steam-download:
    type: http
    behavior: domain
    url: `https://gh-proxy.com/raw.githubusercontent.com/ackness/rules/main/clash/steam-download.yaml`
    path: ./ruleset/steam-download.yaml
    interval: 86400
```
