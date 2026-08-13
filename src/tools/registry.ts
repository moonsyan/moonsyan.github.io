/**
 * 工具注册表：构建期静态导入全部工具清单。
 *
 * 一致性检查（《工具站架构.md》5.3、《功能清单.md》PLT-001）：
 * - 重复 slug、非法执行模式、未定义分类必须使构建失败；
 * - status=ready 的工具必须提供 ToolView 组件映射。
 *
 * 新增工具时只需新建目录并在此追加导入，首页、搜索页和分类页逻辑不变。
 */
import type { ToolManifest } from './types'
import { categoryBySlug } from './categories'

import { manifest as jsonFormatter } from './json-formatter/manifest'
import { manifest as base64 } from './base64/manifest'
import { manifest as urlEncoding } from './url-encoding/manifest'
import { manifest as jwtParser } from './jwt-parser/manifest'
import { manifest as markdownPreview } from './markdown-preview/manifest'
import { manifest as timestampConverter } from './timestamp-converter/manifest'
import { manifest as regexTester } from './regex-tester/manifest'
import { manifest as textDiff } from './text-diff/manifest'
import { manifest as wordCounter } from './word-counter/manifest'
import { manifest as hashCalculator } from './hash-calculator/manifest'
import { manifest as uuidGenerator } from './uuid-generator/manifest'
import { manifest as colorConverter } from './color-converter/manifest'
// P1 客户端工具（TOOL-013~016）
import { manifest as unicodeConverter } from './unicode-converter/manifest'
import { manifest as jsonCsv } from './json-csv/manifest'
import { manifest as caseConverter } from './case-converter/manifest'
import { manifest as unitConverter } from './unit-converter/manifest'
// 服务端工具（SERVER-001/002）
import { manifest as fxConverter } from './fx-converter/manifest'
import { manifest as largeTextFormatter } from './large-text-formatter/manifest'
// 异步文件工具（FILE-TOOL-001~005）
import { manifest as imageCompress } from './image-compress/manifest'
import { manifest as imageConvert } from './image-convert/manifest'
import { manifest as exifClean } from './exif-clean/manifest'
import { manifest as pdfMerge } from './pdf-merge/manifest'
import { manifest as pdfSplit } from './pdf-split/manifest'

const manifests: ToolManifest[] = [
  jsonFormatter,
  base64,
  urlEncoding,
  jwtParser,
  markdownPreview,
  timestampConverter,
  regexTester,
  textDiff,
  wordCounter,
  hashCalculator,
  uuidGenerator,
  colorConverter,
  unicodeConverter,
  jsonCsv,
  caseConverter,
  unitConverter,
  fxConverter,
  largeTextFormatter,
  imageCompress,
  imageConvert,
  exifClean,
  pdfMerge,
  pdfSplit,
]

// 构建期校验：失败即终止构建（throw 在模块求值期触发，PLT-001）
const seen = new Set<string>()
for (const m of manifests) {
  if (seen.has(m.slug)) {
    throw new Error(`工具注册表错误：重复的 slug "${m.slug}"`)
  }
  seen.add(m.slug)
  if (!['client', 'server', 'async'].includes(m.execution)) {
    throw new Error(`工具注册表错误：${m.slug} 声明了非法执行模式 "${m.execution}"`)
  }
  if (!categoryBySlug.has(m.category)) {
    throw new Error(`工具注册表错误：${m.slug} 的分类 "${m.category}" 未在 categories.ts 定义`)
  }
}

export const allTools: readonly ToolManifest[] = manifests

export const toolBySlug = new Map(manifests.map((m) => [m.slug, m]))

export function toolsByCategory(category: string): ToolManifest[] {
  return manifests.filter((m) => m.category === category)
}

// 工具运行区组件映射在 views.ts（含 .vue 动态导入，不能被服务端代码导入）。
