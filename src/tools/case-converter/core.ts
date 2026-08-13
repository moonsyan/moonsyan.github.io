/**
 * 大小写转换核心逻辑（TOOL-015）。
 *
 * 分词规则（需在界面说明）：
 * 1. 非字母数字字符（空格、中划线、下划线等）作为分隔符；
 * 2. camelCase/PascalCase 的小写→大写边界自动切分（fooBar → foo bar）；
 * 3. 连续大写视为一个词（HTTPServer → http server）；
 * 4. 中文等非 ASCII 字符不参与分词，原样保留在每个词内。
 */

export type CaseStyle = 'upper' | 'lower' | 'camel' | 'pascal' | 'snake' | 'kebab'

export interface CaseResult {
  ok: boolean
  output?: string
  message?: string
}

/** 分词：返回小写词元数组。 */
export function tokenize(text: string): string[] {
  const words: string[] = []
  for (const chunk of text.split(/[^A-Za-z0-9\u4e00-\u9fff]+/)) {
    if (!chunk) continue
    // 在 小写→大写 与 连续大写→大写+小写 边界切分
    const parts = chunk
      .replace(/([a-z0-9])([A-Z])/g, '$1\u0000$2')
      .replace(/([A-Z]+)([A-Z][a-z])/g, '$1\u0000$2')
      .split('\u0000')
    words.push(...parts.filter(Boolean).map((w) => w.toLowerCase()))
  }
  return words
}

export function convertCase(text: string, style: CaseStyle): CaseResult {
  if (!text.trim()) return { ok: false, message: '输入为空，请填写要转换的文本' }
  const words = tokenize(text)
  if (words.length === 0) return { ok: false, message: '没有可转换的字母或数字内容' }

  let output: string
  switch (style) {
    case 'upper':
      output = text.toUpperCase()
      break
    case 'lower':
      output = text.toLowerCase()
      break
    case 'camel':
      output = words.map((w, i) => (i === 0 ? w : w[0].toUpperCase() + w.slice(1))).join('')
      break
    case 'pascal':
      output = words.map((w) => w[0].toUpperCase() + w.slice(1)).join('')
      break
    case 'snake':
      output = words.join('_')
      break
    case 'kebab':
      output = words.join('-')
      break
  }
  return { ok: true, output }
}
