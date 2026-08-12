# moonsyan.github.io

MarkdownSoft 官方网站(单页落地页)。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与测试

```bash
npm run typecheck
npm run test
npm run build
```

## 部署

推送到 `main` 分支即自动经 GitHub Actions 部署到 `https://moonsyan.github.io/`。

## 站点结构

- 文案: `src/locales/zh.ts` / `en.ts`(改文案只动这两个文件)
- 主题: `src/themes/*.css`(4 套主题的 CSS 变量)
- 截图: 将真实截图放入 `public/screenshots/` 后替换 `ScreenshotPlaceholder.vue`
