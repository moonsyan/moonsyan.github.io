---
tags: [GitHub, Pages, 托管]
created: 2026-08-13
---

# 🌐 GitHub Pages:免费网站托管

## 是什么

GitHub Pages 是 GitHub 提供的**免费静态网站托管**——把网页文件放到 GitHub 服务器上,用户就能通过网址访问。适合官网、文档、个人主页。

**特点**:免费、无需自己买服务器、`xxx.github.io` 这种网址。

## 两类站点(本站是"用户站点")

| 类型 | 网址 | 用途 |
|------|------|------|
| **用户站点** | `moonsyan.github.io` | 整个账号一个,放官网/个人页 |
| 项目站点 | `moonsyan.github.io/项目名` | 每个仓库一个,放项目文档 |

本站是**用户站点**:仓库名必须叫 `moonsyan.github.io`,内容展示 MarkdownSoft。

## 最关键的概念:发布源(Source)

Pages 到底**发布哪份文件**,由 GitHub 仓库 **Settings → Pages → Source** 决定。两种模式:

### 模式 A:Deploy from a branch(从分支直接发布)

GitHub 把仓库里**选中的分支/目录**直接当网站发布。
- 优点:零配置,建站时自动启用
- 缺点:**发布的是源码文件**,浏览器不认识 TypeScript 等源码

### 模式 B:GitHub Actions(用构建产物发布)✅ 本站该用这个

由 Actions 工作流构建出真正的静态文件(`dist/`),再把产物交给 Pages 发布。
- 优点:先构建、再发布,结果正确
- 本站的 `deploy.yml` 就是干这个的,见 [[04-GitHub-Actions]]

> **一句话区分**:模式 A 发布"原料",模式 B 发布"做好的菜"。

## 💥 本站踩过的大坑:白屏事故(务必记住)

**现象**:部署工作流全绿,但打开网站一片空白。

**原因**:
1. GitHub 对用户站点仓库**自动启用模式 A**(从分支发布)
2. 于是发布的是源码:`index.html` 找到了,但它引用的 `/src/main.ts` 是 TypeScript,**浏览器不会执行**,页面就挂了
3. 我们 Actions 构建好的 `dist/` 产物虽然存在,但**发布源没指向它**,没人用它

**修复步骤**(一次性):
1. 打开仓库 **Settings → Pages**
2. **Source** 改成 **"GitHub Actions"**
3. 去 **Actions** 标签页,找到最新的部署,点 **Re-run**(重新跑一遍)
4. 等绿了,刷新 `moonsyan.github.io` 就能看到页面

## 如何确认部署成功

1. 仓库 **Actions** 标签页 → 最新一次运行是 ✅ 绿色
2. 打开 `https://moonsyan.github.io` 看页面内容正常
3. 换语言、换主题测试(见 [[02-本地开发指南]] 的验证项)

## 相关文档

- [[01-官网项目总览]] — 本站是什么
- [[04-GitHub-Actions]] — 自动部署流水线
- [[05-对话总结]] — 白屏事故的完整经过
