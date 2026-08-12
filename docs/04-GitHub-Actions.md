---
tags: [GitHub, Actions, CI, 自动化]
created: 2026-08-13
---

# ⚙️ GitHub Actions:自动化的流水线工人

## 是什么

**GitHub Actions = 仓库里雇的一群自动干活的小工。** 你告诉它"什么时候、做什么",它就照做,全程不用你动手。

**类比**:像工厂流水线——原料(代码)一进来,机器自动完成 清洗(测试)→ 加工(构建)→ 打包(产物)→ 送货(发布)。

## 三个核心概念

| 概念 | 是什么 | 类比 |
|------|--------|------|
| **Workflow(工作流)** | 一份 `.yml` 配置文件,描述整套流程 | 流水线的操作手册 |
| **Event(事件)** | 触发工作流的时机 | 按下启动按钮 |
| **Job / Step(任务/步骤)** | 流程中的每一步动作 | 流水线的一个工位 |

**文件放哪**:`.github/workflows/` 目录下,每个 `.yml` 文件就是一个工作流。本站只有一个:`deploy.yml`。

## 本站 deploy.yml 逐段讲解

```yaml
name: Deploy to GitHub Pages   # 工作流名字,显示在 Actions 页
on:
  push:
    branches: [main]           # 事件:只要 main 分支有新推送,自动触发
permissions:
  contents: read               # 权限:能读代码
  pages: write                 # 权限:能写 Pages(发布用)
  id-token: write              # 权限:身份令牌(Pages 校验用)
concurrency:
  group: pages                 # 同一时间只跑一个部署,防止互相打架
  cancel-in-progress: true     # 有新的推送,就取消旧的部署
jobs:
  deploy:                      # 一个任务,叫 deploy
    environment: github-pages
    runs-on: ubuntu-latest     # 在一台全新的 Ubuntu 服务器上执行
    steps:
      - uses: actions/checkout@v4          # 1.把仓库代码拷到服务器
      - uses: actions/setup-node@v4
        with:
          node-version: 22                 # 2.装 Node.js(版本 22)
      - run: npm ci                        # 3.按 lockfile 精确安装依赖
      - run: npm run build                 # 4.构建,产出 dist/ 目录
      - uses: actions/configure-pages@v5   # 5.准备 Pages 环境
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist                       # 6.把 dist/ 打包成部署产物
      - uses: actions/deploy-pages@v4      # 7.发布到 Pages!
```

**整个流程**:推代码 → 装依赖 → 构建 → 打包产物 → 发布。绿了就是上线成功。

## 那些 `uses:` 是什么?

`actions/xxx@v4` 是 **GitHub 官方做好的现成工具(actions)**,相当于流水线的标准设备,拿来即用:

- `checkout` — 把代码拿下来
- `setup-node` — 装 Node.js
- `configure-pages` / `upload-pages-artifact` / `deploy-pages` — 官网专用:配置、打包、发布

你不需要会写这些,会"组装"就行。

## 去哪里看、怎么排查

1. 仓库顶部 **Actions** 标签页 → 列表里点最新一次运行
2. 绿色 ✅ = 成功;红色 ❌ = 失败,点进去看**哪一步红了**
3. 点开红色步骤,看它的**日志**,一般能看到具体报错
4. 常见失败原因:
   - `npm ci` 报错 → 依赖装不上,先本地 `npm install` 看问题
   - `npm run build` 报错 → 本地先 `npm run build` 复现
   - 部署步骤报错 → 多半是 Pages 发布源没设成 Actions,见 [[03-GitHub-Pages]]

## 和 mkEditor 的 CI 对比

| | 本站(官网) | mkEditor(应用) |
|---|---|---|
| 触发 | 推 `main` | 打 tag `v*` |
| 装依赖 | `npm ci`(有 lockfile) | `npm install`(刻意不用 lockfile) |
| 产出 | 静态网站 → Pages | 三平台安装包 → Release |
| 工作流 | `deploy.yml` | `build.yml` |

> 为什么两个仓库的约定不同?详见 [[06-mkEditor-发布流程]] 和 [[05-对话总结]]。

## 相关文档

- [[03-GitHub-Pages]] — 产物发布到哪、发布源怎么设
- [[01-官网项目总览]] — 本站整体结构
- [[05-对话总结]] — CI 从反复失败到修好的全过程
