/**
 * 字数统计核心逻辑（TOOL-010）。
 *
 * 计数规则（在界面上需向用户明示）：
 * - 字符：按 Unicode 码点计数（Array.from 正确处理 Emoji 代理对）；
 * - 非空白字符：去掉所有空白字符（含换行、制表符）后的字符数；
 * - 行数：按换行符拆分，空文本为 0 行；
 * - 中文字数：CJK 统一表意文字区间的字符数（每字计 1）；
 * - 英文词数：连续字母/数字序列计 1 词（含 ' 和 - 连接的复合词）；
 * - 总词数 = 中文字数 + 英文词数。
 */

export interface WordStats {
  chars: number
  charsNoSpace: number
  lines: number
  cjk: number
  latinWords: number
  words: number
}

const CJK_PATTERN = /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/g
const LATIN_WORD_PATTERN = /[A-Za-z0-9]+(?:['\u2019-][A-Za-z0-9]+)*/g

export function countText(text: string): WordStats {
  const codePoints = Array.from(text)
  const chars = codePoints.length
  const charsNoSpace = codePoints.filter((c) => !/\s/.test(c)).length
  const lines = text === '' ? 0 : text.split(/\r\n|\r|\n/).length
  const cjk = (text.match(CJK_PATTERN) ?? []).length
  const latinWords = (text.match(LATIN_WORD_PATTERN) ?? []).length

  return { chars, charsNoSpace, lines, cjk, latinWords, words: cjk + latinWords }
}
