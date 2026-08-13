import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'pdf-split',
  name: 'PDF 拆分',
  description: '按页码范围提取页面；校验重复、倒序和越界页码',
  category: 'file',
  tags: ['pdf', '拆分', '提取'],
  aliases: ['pdf 提取页面', 'pdf 分割'],
  execution: 'async',
  capabilities: { download: true, fileUpload: true },
  seo: {
    title: 'PDF 拆分工具 · 按页码范围提取',
    description: '在线 PDF 拆分：按页码范围提取页面，校验重复、倒序和越界页码。',
  },
  status: 'ready',
}
