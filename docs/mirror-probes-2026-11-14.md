# 镜像连通性记录（2026-11-14）

`download-mirrors` 当前有 **64 条**规则。用户提供的清单去重后为 26 个主机，其中 3 个已存在，本轮补入其余 23 个；同时补充北大、浙大、哈工大、华科镜像站、腾讯软件源和两个 Go proxy。Clash 与 Sing-Box 使用相同边界。

镜像规则表示客户端直连**所连接的镜像主机**。镜像服务器在美国、亚洲，或使用 Cloudflare CDN，都不影响此处的直连偏好。清单中的地区和运营者说明是用户提供的来源信息，本轮没有逐一核实服务器地理位置。没有把 `cloudflare.com`、共享边缘 IP、`eu.org`、`xyz`、`jsdelivr.net` 或学校根域放宽为直连。

以下请求从当前测试环境发出，使用 `curl --noproxy '*'`，启用证书校验；一般为跟随跳转的首页 GET，超时 25 秒。**它们不是中国大陆多运营商测速，也不能单凭首页证明 Release、Git Clone、Raw 都正常。** 本轮失败的用户指定主机仍保留精确直连规则；未自动加入它们跳转出的无关主机。

## 用户指定的 26 个主机

| 主机 | 探测结果 |
|---|---|
| `gh.h233.eu.org` | HTTP 403 |
| `gh.api.99988866.xyz` | TLS 握手失败 |
| `ghproxy.1888866.xyz` | HTTP 525 |
| `gh.ddlc.top` | HTTP 429，限流 |
| `dl.ghpig.top` | DNS 无法解析 |
| `slink.ltd` | HTTP 200 |
| `gh-proxy.com` | HTTP 200；另测实际 Raw 文件成功，见下表 |
| `cors.isteed.cc` | HTTP 200 |
| `ghproxy.it` | 跳转 `ghfast.top`，最终 200；两者已覆盖 |
| `github.boki.moe` | HTTP 403 |
| `gh-proxy.net` | HTTP 302 跳转 `http://ww19.gh-proxy.net/` 后连接重置；只保留用户指定的精确主机，没有收录 `ww19` |
| `ghdd.862510.xyz` | DNS 无法解析 |
| `ghproxy.net` | HTTP 200 |
| `ghfast.top` | HTTP 200 |
| `wget.la` | HTTP 200 |
| `gitclone.com` | HTTP 200；未做完整 clone 或凭据验证 |
| `kkgithub.com` | HTTP 200 |
| `githubfast.com` | HTTP 403 |
| `github.moeyy.xyz` | DNS 无法解析 |
| `ssh.fastgit.org` | DNS 无法解析，未能建立 SSH 连接 |
| `git.zhlh6.cn` | TCP 22 超时；未登录 SSH。HTTPS 另有 TLS SNI 错误，不能用 HTTPS 结果代替 SSH 测试 |
| `raw.kkgithub.com` | TCP 443 连接失败 |
| `jsd.proxy.aks.moe` | 证书验证失败：自签名证书；未绕过校验 |
| `fastly.jsdelivr.net` | 首页跳转 `www.jsdelivr.com`；另测实际 Raw URL 返回 200，见下表 |
| `jsdelivr.pai233.top` | HTTP 402 |
| `raw.cachefly.998111.xyz` | DNS 无法解析 |

## 软件源、包与实际下载路径抽查

| 请求 | 结果与边界 |
|---|---|
| [HF-Mirror 首页](https://hf-mirror.com/) | 200，保留独立镜像分类 |
| `https://hf-mirror.com/api/models/gpt2` | 跳转到 `https://huggingface.co/api/models/openai-community/gpt2`，最终 200；只证明这次 API 重定向，不代表所有模型下载都会跳回原站。新连接应按 Hugging Face 原站规则处理 |
| `https://gh-proxy.com/https://raw.githubusercontent.com/ackness/rules/main/catalog.json` | 200，返回仓库 JSON；只读小文件测试 |
| `https://fastly.jsdelivr.net/gh/ackness/rules@main/catalog.json` | 200，返回仓库 JSON；没有因此把整个 `jsdelivr.net` 直连 |
| `https://registry.npmmirror.com/-/ping` 与 `/is-number/latest` | 均 200，返回服务响应／包元数据 |
| `https://rsproxy.cn/index/config.json` 与 `/dist/channel-rust-stable.toml` | 均 200，返回 Cargo 配置／Rust 清单；下载子域由 `rsproxy.cn` 专用后缀覆盖 |
| `https://goproxy.cn/golang.org/x/text/@v/list` | 200，返回 Go 模块版本 |
| `https://goproxy.io/golang.org/x/text/@v/list` | 200，返回 Go 模块版本；[官方使用说明](https://goproxy.io/)明确提供 GOPROXY 服务 |
| `https://goproxy.bj.bcebos.com/golang.org/x/text/@v/list` | 200，返回 Go 模块版本；仅收录这一个主机，不收录整个 `bcebos.com` |
| `https://mirrors.tuna.tsinghua.edu.cn/debian/README` | 200，返回 Debian 说明文件 |
| `https://mirror.sjtu.edu.cn/pypi/web/simple/pip/` | 200；从索引选取 wheel URL，以 HEAD 检查，302 到 TUNA 的同一包路径，最终 200，两端均在规则内 |
| [腾讯](https://mirrors.tencent.com/)、[北大](https://mirrors.pku.edu.cn/)、[浙大](https://mirrors.zju.edu.cn/)、[哈工大](https://mirrors.hit.edu.cn/)、[华科](https://mirrors.hust.edu.cn/)首页 | 均 200，页面标识软件镜像服务；部分页面为 JS 外壳，未将首页 200 当作所有源同步正常 |
| `https://mirrors.ustc.edu.cn/debian/README` | 本环境 403，未宣称当前可下载 |
| `https://mirrors.nju.edu.cn/` 及 PyPI 索引 | 本环境出现重定向循环；保留既有规则 |

阿里云的大型 `ls-lR.gz` 探测在达到预设文件大小限制时中止，未计为完整下载成功。未按域名相似性收录无法解析的 BUPT 地址或本环境超时的 CQU 地址；这些与用户明确指定并要求保留的主机分别处理。

后续更新应在实际使用的网络上重复请求目标文件，再检查客户端连接记录中的规则命中、最终跳转域名和传输速度。规则不会自动将原站地址改写成镜像地址；Hugging Face 仍需设置 `HF_ENDPOINT=https://hf-mirror.com`，npm、pip、apt、Cargo、Go 等也需要在各自工具里配置镜像。
