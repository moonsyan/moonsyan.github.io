import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'url-encoding',
  name: 'URL 编解码',
  description: 'URL 组件与整体两种模式的编码解码，正确处理中文参数',
  category: 'encode',
  tags: ['url', '编码', 'urlencode'],
  aliases: ['urlencode', 'urldecode', 'encodeURIComponent', 'url 转义'],
  execution: 'client',
  seo: {
    title: 'URL 编解码工具 · 在线 urlencode / urldecode',
    description: '在线 URL 编码解码，支持组件与整体两种模式，正确处理中文查询参数，浏览器本地运行。',
  },
  status: 'ready',
}
