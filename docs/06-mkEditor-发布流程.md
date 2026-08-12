---
tags: [mkEditor, CI, Release, 发布]
created: 2026-08-13
---

# 🚀 mkEditor 发布流程(另一个仓库)

> 这是 MarkdownSoft **应用本体**所在仓库(`moonsyan/mkEditor`)的发布规矩。和官网仓库([[01-官网项目总览]])是两个仓库、两套约定,别搞混。

## 一句话

mkEditor 是 **Electron 桌面应用**,靠 GitHub Actions 一键打 Windows/macOS/Linux 三平台安装包,并自动发布到 Release 页面。

## 发布流程(三步)

1. **本地**打 tag:`git tag v1.0.0 && git push origin v1.0.0`
2. GitHub Actions 检测到 tag → 自动构建三平台安装包
3. 打包完成 → 自动创建 **Release**(用户下载安装包的页面)

> 官网是"推 `main` 就上线";mkEditor 是"**打 tag 才发布**"——tag 就是版本号,发布是正式动作。

## 关键约定(踩过坑换来的)

### 1. package-lock.json 刻意不入库 ⚠️

- **约定**:`package-lock.json` 不提交,CI 里用 `npm install`
- **为什么**:这个项目以前 lockfile 进了 git 历史,在 CI 里引发报错;已把 lockfile 从历史中抹除(见 [[05-对话总结]] 第二节),从此规定不入库
- **注意**:官网仓库**正好相反**,lockfile 入库、CI 用 `npm ci`——因为官网要精确复现依赖,而桌面应用依赖自由一点

### 2. 用 `--publish never` 防误发

打包时显式指定不自动发布,由工作流**自己掌控发布时机**,避免构建中间状态误发 Release。

### 3. tag 重建规则

- tag 是发布触发器,**打出去就要对**:覆盖历史 tag 要 `git push origin --force tag` 之类操作,影响所有 clone 过的人
- 优先用**新 tag**(v1.0.1)而不是覆盖旧 tag(v1.0.0)
- 之前清理 lockfile 历史时重建过 tag,这类操作只在该做时做

### 4. CI 失败排查习惯

- 看 Actions 页红色步骤的日志
- **先本地复现**:能本地打包过,线上大概率过
- 一次只改一个变量,改完重跑,避免几个问题混在一起

## 与官网仓库的对比

| | mkEditor(应用) | moonsyan.github.io(官网) |
|---|---|---|
| 仓库位置 | `D:\project\markdown\github` | `D:\project\github_io` |
| 产物 | 三平台安装包 | 静态网页 |
| 触发 | 打 tag `v*` | 推 `main` |
| 依赖安装 | `npm install`(无 lockfile) | `npm ci`(有 lockfile) |
| 发布去向 | GitHub Release | GitHub Pages |

## 相关文档

- [[04-GitHub-Actions]] — Actions 概念通讲,含两者对比
- [[05-对话总结]] — 这些约定是怎么踩坑换来的
- [[03-GitHub-Pages]] — 官网的发布方式
