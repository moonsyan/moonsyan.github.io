# moonsyan.github.io

ToolKit · 本地运行的在线效率工具集合(部署在 `https://moonsyan.github.io/`)。

前端工具(JSON 格式化、时间戳、编码转换、正则测试、Markdown 预览等 16 款)在浏览器本地运行,即开即用;
服务端与文件类工具(汇率、大文本、图片/PDF 处理等 7 款)需部署后端(FastAPI)后可用,详情页如实标注。

站点同时承载 **站长工具推荐** 栏目:MarkdownSoft 桌面 Markdown 编辑器的产品介绍页(`/markdownsoft`)。

## 本地开发

```bash
npm install
npm run dev
```

## 构建与测试

```bash
npm run typecheck   # vue-tsc 类型检查
npm run test        # vitest(工具 core 逻辑测试 + 应用冒烟测试)
npm run build       # 构建产物 dist/,含 404.html(SPA 深链接兜底)
npm run preview     # 本地预览构建产物
```

## 部署

推送到 `main` 分支即自动经 GitHub Actions 部署到 `https://moonsyan.github.io/`(流程见
`.github/workflows/deploy.yml`,产物为 `dist/`)。

SPA 深链接(如 `/tools/json-formatter`)由构建后复制的 `dist/404.html` 兜底,刷新或直接访问均可正常渲染。

## 站点结构

```
src/
├── pages/        # 路由页面(Home / ToolDetail / Search / Favorites / Recent / Category / Faq / MarkdownSoft / NotFound)
├── tools/        # 工具注册表与 23 款工具(manifest / core / schema / ToolView / tests)
│   └── views.ts  # 客户端工具的 ToolView 动态导入(服务端工具静态版不挂载)
├── components/   # AppHeader / AppFooter / PrivacyBanner / 工具卡片
├── stores/       # pinia:主题 / 收藏 / 最近使用 / 分享状态
├── composables/  # usePageSeo(DOM 版)/ useToolSearch / useSharedOptions
├── styles/       # 全局设计令牌(柔和极简,明暗主题,Element Plus 主色对齐)
└── router/       # vue-router(history 模式)
```

## 技术栈

Vue 3 + Vite + TypeScript + vue-router + pinia + Element Plus(按需自动引入)+ vitest。
代码移植自工具站 Nuxt 4 前端(`~/` 别名与 `NuxtLink`/`ClientOnly` 全局兼容,保持原目录结构)。
