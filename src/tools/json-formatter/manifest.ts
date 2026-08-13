import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'json-formatter',
  name: 'JSON 格式化',
  description: '格式化、压缩、校验 JSON，错误精确定位到行列',
  category: 'format',
  tags: ['json', '格式化', '校验'],
  aliases: ['json beautifier', 'json 校验', 'json 压缩'],
  execution: 'client',
  seo: {
    title: 'JSON 格式化工具 · 在线格式化、压缩与校验',
    description: '在线 JSON 格式化工具：格式化、压缩、语法校验，错误定位到行列，全程浏览器本地处理。',
  },
  capabilities: { download: true },
  status: 'ready',
}
