/**
 * 工具运行区组件映射（仅客户端使用）。
 *
 * 与 registry.ts 分离的原因：服务端代码（sitemap、robots、预渲染）
 * 会导入 registry.ts，而 .vue 动态导入不能进入 Nitro 服务端打包。
 * 详情页按需加载组件，符合 SEO-005 的首屏拆包要求。
 */
export const toolViewComponents: Record<string, () => Promise<typeof import('*.vue')>> = {
  'json-formatter': () => import('./json-formatter/ToolView.vue'),
  'base64': () => import('./base64/ToolView.vue'),
  'url-encoding': () => import('./url-encoding/ToolView.vue'),
  'jwt-parser': () => import('./jwt-parser/ToolView.vue'),
  'markdown-preview': () => import('./markdown-preview/ToolView.vue'),
  'timestamp-converter': () => import('./timestamp-converter/ToolView.vue'),
  'regex-tester': () => import('./regex-tester/ToolView.vue'),
  'text-diff': () => import('./text-diff/ToolView.vue'),
  'word-counter': () => import('./word-counter/ToolView.vue'),
  'hash-calculator': () => import('./hash-calculator/ToolView.vue'),
  'uuid-generator': () => import('./uuid-generator/ToolView.vue'),
  'color-converter': () => import('./color-converter/ToolView.vue'),
  // P1 客户端工具
  'unicode-converter': () => import('./unicode-converter/ToolView.vue'),
  'json-csv': () => import('./json-csv/ToolView.vue'),
  'case-converter': () => import('./case-converter/ToolView.vue'),
  'unit-converter': () => import('./unit-converter/ToolView.vue'),
  // 服务端/异步文件工具：静态版不挂载组件，详情页显示静态版提示
}
