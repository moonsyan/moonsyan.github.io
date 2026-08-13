/**
 * JSON 格式化核心逻辑：纯函数，便于单元测试。
 * 全程浏览器本地执行，输入不离开设备（TOOL-001）。
 */

export type JsonFormatMode = 'format' | 'compress' | 'validate'

export interface JsonFormatResult {
  ok: boolean
  /** 成功时的输出文本 */
  output?: string
  /** 失败时的错误信息（含行列位置） */
  message?: string
  line?: number
  column?: number
}

/** 从 SyntaxError 消息中提取位置（不同引擎消息格式有差异，做兼容处理） */
function locateError(input: string, error: SyntaxError): { line?: number; column?: number } {
  // V8: "... at position 123" / "... at line 3 column 5"
  const posMatch = /position (\d+)/.exec(error.message)
  if (posMatch) {
    const pos = Number(posMatch[1])
    const before = input.slice(0, pos)
    const line = before.split('\n').length
    const column = pos - before.lastIndexOf('\n')
    return { line, column }
  }
  const lineMatch = /line (\d+) column (\d+)/.exec(error.message)
  if (lineMatch) {
    return { line: Number(lineMatch[1]), column: Number(lineMatch[2]) }
  }
  return {}
}

export function processJson(input: string, mode: JsonFormatMode, indent = 2): JsonFormatResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return { ok: false, message: '输入为空，请粘贴 JSON 文本' }
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed)
  } catch (err) {
    const { line, column } = locateError(trimmed, err as SyntaxError)
    const where = line !== undefined ? `（第 ${line} 行，第 ${column} 列）` : ''
    return { ok: false, message: `JSON 语法错误${where}：${(err as Error).message}`, line, column }
  }

  if (mode === 'validate') {
    return { ok: true, output: 'JSON 语法正确' }
  }

  const output =
    mode === 'compress' ? JSON.stringify(parsed) : JSON.stringify(parsed, null, indent)
  return { ok: true, output }
}
