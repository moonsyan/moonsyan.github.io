import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'json-csv',
  name: 'JSON/CSV 转换',
  description: 'JSON 数组与 CSV 互转，表头/分隔符/引号规则可选，嵌套展开策略显式选择',
  category: 'format',
  tags: ['json', 'csv', '转换'],
  aliases: ['json 转 csv', 'csv 转 json'],
  execution: 'client',
  seo: {
    title: 'JSON/CSV 转换工具 · 在线互转',
    description: '在线 JSON 与 CSV 互转：支持表头、分隔符与引号规则，嵌套字段展开策略显式选择，不静默丢字段。',
  },
  status: 'ready',
}
