/**
 * JSON/CSV 转换核心逻辑（TOOL-014）。
 * - 支持表头开关、分隔符与引号规则；
 * - 嵌套 JSON 必须显式选择展开策略（flatten 点路径 / stringify 序列化），
 *   绝不静默丢字段：列头取所有记录键的并集。
 */

export interface CsvOptions {
  delimiter: string
  /** minimal：仅在需要时加引号；always：所有单元格加引号 */
  quote: 'minimal' | 'always'
  /** 嵌套对象/数组处理策略 */
  nested: 'flatten' | 'stringify'
}

export interface CsvResult {
  ok: boolean
  output?: string
  message?: string
}

function escapeCell(value: string, opts: CsvOptions): string {
  const needQuote =
    opts.quote === 'always' ||
    value.includes(opts.delimiter) ||
    value.includes('"') ||
    value.includes('\n')
  if (!needQuote) return value
  return `"${value.replace(/"/g, '""')}"`
}

/** 扁平化嵌套对象为点路径键。 */
export function flattenRecord(record: Record<string, unknown>, prefix = ''): Record<string, unknown> {
  const out: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(record)) {
    const path = prefix ? `${prefix}.${key}` : key
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      Object.assign(out, flattenRecord(value as Record<string, unknown>, path))
    } else if (Array.isArray(value)) {
      out[path] = JSON.stringify(value)
    } else {
      out[path] = value
    }
  }
  return out
}

/** JSON 数组 → CSV。输入必须是对象数组。 */
export function jsonToCsv(jsonText: string, opts: CsvOptions): CsvResult {
  if (!jsonText.trim()) return { ok: false, message: '输入为空，请粘贴 JSON 数组' }
  let parsed: unknown
  try {
    parsed = JSON.parse(jsonText)
  } catch (err) {
    return { ok: false, message: `JSON 语法错误：${(err as Error).message}` }
  }
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return { ok: false, message: '输入必须是非空 JSON 数组' }
  }
  if (parsed.some((r) => typeof r !== 'object' || r === null || Array.isArray(r))) {
    return { ok: false, message: '数组元素必须全部是对象（不支持标量或嵌套数组元素）' }
  }

  // 展开嵌套（策略必须显式选择，不静默丢字段）
  const records = (parsed as Record<string, unknown>[]).map((r) =>
    opts.nested === 'flatten'
      ? flattenRecord(r)
      : Object.fromEntries(
          Object.entries(r).map(([k, v]) => [
            k,
            v !== null && typeof v === 'object' ? JSON.stringify(v) : v,
          ]),
        ),
  )

  // 列头 = 所有记录键的并集（保持首次出现顺序）
  const headers: string[] = []
  for (const r of records) {
    for (const key of Object.keys(r)) {
      if (!headers.includes(key)) headers.push(key)
    }
  }

  const lines = [headers.map((h) => escapeCell(h, opts)).join(opts.delimiter)]
  for (const r of records) {
    lines.push(
      headers
        .map((h) => {
          const v = r[h]
          const text = v === undefined || v === null ? '' : String(v)
          return escapeCell(text, opts)
        })
        .join(opts.delimiter),
    )
  }
  return { ok: true, output: lines.join('\n') }
}

/** CSV → JSON 数组（带引号解析）。 */
export function csvToJson(csvText: string, delimiter: string, hasHeader: boolean): CsvResult {
  if (!csvText.trim()) return { ok: false, message: '输入为空，请粘贴 CSV 文本' }

  // 逐字符解析，正确处理引号内的分隔符与换行
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false
  for (let i = 0; i < csvText.length; i++) {
    const ch = csvText[i]
    if (inQuotes) {
      if (ch === '"') {
        if (csvText[i + 1] === '"') {
          cell += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        cell += ch
      }
    } else if (ch === '"') {
      inQuotes = true
    } else if (ch === delimiter) {
      row.push(cell)
      cell = ''
    } else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && csvText[i + 1] === '\n') i++
      row.push(cell)
      cell = ''
      if (row.some((c) => c !== '')) rows.push(row)
      row = []
    } else {
      cell += ch
    }
  }
  row.push(cell)
  if (row.some((c) => c !== '')) rows.push(row)

  if (rows.length === 0) return { ok: false, message: '没有解析到任何行' }

  const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `col_${i + 1}`)
  const dataRows = hasHeader ? rows.slice(1) : rows
  const records = dataRows.map((cells) =>
    Object.fromEntries(headers.map((h, i) => [h, cells[i] ?? ''])),
  )
  return { ok: true, output: JSON.stringify(records, null, 2) }
}
