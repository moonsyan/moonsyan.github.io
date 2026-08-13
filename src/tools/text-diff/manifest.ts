import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'text-diff',
  name: '文本对比',
  description: '行级与字符级差异对比，标记增删改，使用成熟 diff 库',
  category: 'text',
  tags: ['diff', '对比', '差异'],
  aliases: ['文本差异', 'diff 在线', '比较文本'],
  execution: 'client',
  seo: {
    title: '文本对比工具 · 在线 Diff 差异比对',
    description: '在线文本对比：行级与字符级差异，标记增删内容，基于成熟 diff 库，浏览器本地运行。',
  },
  status: 'ready',
}
