import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'large-text-formatter',
  name: '大文本 JSON 格式化',
  description: '服务端格式化超大 JSON（最大 20MB），浏览器处理不动时使用',
  category: 'format',
  tags: ['json', '大文本', '格式化'],
  aliases: ['大文件 json', 'json 服务端格式化'],
  execution: 'server',
  seo: {
    title: '大文本 JSON 格式化工具 · 服务端处理',
    description: '服务端 JSON 格式化：最大 20MB 输入，限时执行，结果不持久化；浏览器本地工具处理大文本时的补充方案。',
  },
  status: 'ready',
}
