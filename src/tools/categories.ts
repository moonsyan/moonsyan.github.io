import type { ToolCategory } from './types'

/** 分类定义：构建期注册表校验与各工具 manifest 的 category 必须来自此清单。 */
export const categories: ToolCategory[] = [
  { slug: 'encode', name: '编码转换', description: 'Base64、URL 与 JWT 等编码解析' },
  { slug: 'format', name: '格式化', description: 'JSON、Markdown、CSV 等结构化文本处理' },
  { slug: 'time', name: '时间日期', description: '时间戳与日期格式互转' },
  { slug: 'text', name: '文本处理', description: '正则、对比、字数与 Unicode 等' },
  { slug: 'verify', name: '数据校验', description: '摘要哈希等校验计算' },
  { slug: 'dev', name: '开发辅助', description: 'UUID、颜色、单位与汇率等' },
  { slug: 'file', name: '文件处理', description: '图片与 PDF 异步处理（服务端任务，文件默认 24 小时内删除）' },
]

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]))
