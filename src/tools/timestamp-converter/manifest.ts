import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'timestamp-converter',
  name: '时间戳转换',
  description: 'Unix 时间戳与日期互转，秒/毫秒自动识别，输出本地与 UTC 时间',
  category: 'time',
  tags: ['时间戳', 'unix', '时间转换'],
  aliases: ['unix timestamp', '时间戳在线转换', '毫秒时间戳'],
  execution: 'client',
  seo: {
    title: 'Unix 时间戳转换工具 · 秒/毫秒自动识别',
    description: '在线 Unix 时间戳转换：秒与毫秒自动识别，输出本地时区、UTC 与 ISO 格式，浏览器本地运行。',
  },
  status: 'ready',
}
