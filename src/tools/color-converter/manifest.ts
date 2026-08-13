import type { ToolManifest } from '../types'

export const manifest: ToolManifest = {
  slug: 'color-converter',
  name: '颜色转换',
  description: 'HEX、RGB、HSL 互转，支持透明度与数值范围校验',
  category: 'dev',
  tags: ['颜色', 'hex', 'rgb', 'hsl'],
  aliases: ['rgb 转 hex', 'hsl 转换', '颜色格式转换'],
  execution: 'client',
  seo: {
    title: '颜色转换工具 · HEX / RGB / HSL 互转',
    description: '在线颜色格式转换：HEX、RGB、HSL 互转，支持透明度，严格校验数值范围，浏览器本地运行。',
  },
  status: 'ready',
}
