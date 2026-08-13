import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'pdf-merge',
  name: 'PDF 合并',
  description: '多文件合并，支持排序；限制文件数、页数与总大小',
  category: 'file',
  tags: ['pdf', '合并'],
  aliases: ['pdf 合并在线'],
  execution: 'async',
  capabilities: { download: true, fileUpload: true },
  seo: {
    title: 'PDF 合并工具 · 在线合并多个 PDF',
    description: '在线 PDF 合并：支持多文件与排序，限制文件数、页数与总大小，加密 PDF 给出明确提示。',
  },
  status: 'ready',
}
