/**
 * 文本对比核心逻辑（TOOL-009）。
 * - 使用成熟 diff 库（jsdiff）：行级 diffLines + 字符级 diffChars；
 * - 两侧输入各限制 200KB，防止超大文本拖慢页面；
 * - 输出结构化差异片段，供界面着色渲染。
 */
import { diffChars, diffLines } from 'diff'

export type DiffGranularity = 'line' | 'char'

export interface DiffPart {
  type: 'same' | 'added' | 'removed'
  value: string
}

export interface DiffResult {
  ok: boolean
  message?: string
  parts?: DiffPart[]
  /** 差异统计：新增与删除的片段数 */
  addedCount?: number
  removedCount?: number
}

export const MAX_DIFF_SIZE = 200 * 1024

function toParts(changes: Array<{ value: string; added?: boolean; removed?: boolean }>): DiffPart[] {
  return changes.map((c) => ({
    type: c.added ? 'added' : c.removed ? 'removed' : 'same',
    value: c.value,
  }))
}

/** 对比两段文本。 */
export function diffText(oldText: string, newText: string, granularity: DiffGranularity = 'line'): DiffResult {
  if (!oldText && !newText) {
    return { ok: false, message: '两侧输入都为空，请填写要对比的文本' }
  }
  if (oldText.length > MAX_DIFF_SIZE || newText.length > MAX_DIFF_SIZE) {
    return { ok: false, message: `单侧文本超过 ${MAX_DIFF_SIZE / 1024}KB 上限，请拆分后对比` }
  }

  const changes = granularity === 'line' ? diffLines(oldText, newText) : diffChars(oldText, newText)
  const parts = toParts(changes)
  return {
    ok: true,
    parts,
    addedCount: parts.filter((p) => p.type === 'added').length,
    removedCount: parts.filter((p) => p.type === 'removed').length,
  }
}
