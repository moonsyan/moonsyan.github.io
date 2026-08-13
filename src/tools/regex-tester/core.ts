/**
 * 正则测试核心逻辑（TOOL-008）。
 * - 纯函数部分：校验正则合法性、执行匹配并提取分组；
 * - 浏览器运行区（ToolView）通过 Web Worker + 超时执行，
 *   避免灾难性回溯冻结页面（见 runner.ts）；
 * - 匹配结果上限 500 条，超出截断并提示。
 */

export interface RegexMatch {
  index: number
  match: string
  groups: string[]
}

export interface RegexResult {
  ok: boolean
  message?: string
  matches?: RegexMatch[]
  /** 结果是否因超过上限被截断 */
  truncated?: boolean
}

export const MAX_MATCHES = 500

export const VALID_FLAGS = ['g', 'i', 'm', 's', 'u', 'y'] as const
export type RegexFlag = (typeof VALID_FLAGS)[number]

/** 校验正则表达式是否可编译。 */
export function validateRegex(pattern: string, flags: string): { ok: boolean; message?: string } {
  if (!pattern) return { ok: false, message: '正则为空，请填写表达式' }
  const invalidFlags = [...flags].filter((f) => !(VALID_FLAGS as readonly string[]).includes(f))
  if (invalidFlags.length) {
    return { ok: false, message: `不支持的标志位：${invalidFlags.join(' ')}` }
  }
  try {
    new RegExp(pattern, flags)
    return { ok: true }
  } catch (err) {
    return { ok: false, message: `正则语法错误：${(err as Error).message}` }
  }
}

/** 执行匹配。无论是否带 g 标志都枚举全部命中（测试场景需要全量结果）。 */
export function findMatches(pattern: string, flags: string, text: string): RegexResult {
  const validation = validateRegex(pattern, flags)
  if (!validation.ok) return validation

  const regex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`)
  const matches: RegexMatch[] = []
  let truncated = false

  try {
    for (const m of text.matchAll(regex)) {
      if (matches.length >= MAX_MATCHES) {
        truncated = true
        break
      }
      // 防止零宽匹配导致 matchAll 异常的兜底：matchAll 自身会推进 lastIndex
      matches.push({
        index: m.index ?? 0,
        match: m[0],
        groups: m.slice(1).map((g) => g ?? ''),
      })
    }
  } catch (err) {
    return { ok: false, message: `执行失败：${(err as Error).message}` }
  }

  return { ok: true, matches, truncated }
}
