import { describe, expect, it } from 'vitest'
import { countText } from '../core'

describe('word-counter core', () => {
  it('中英文混合计数', () => {
    const s = countText('你好 world 123')
    expect(s.cjk).toBe(2)
    expect(s.latinWords).toBe(2)
    expect(s.words).toBe(4)
  })

  it('Emoji 按码点计数而不是 UTF-16 单元', () => {
    const s = countText('😀')
    expect(s.chars).toBe(1)
    expect(s.charsNoSpace).toBe(1)
  })

  it('行数统计', () => {
    expect(countText('a\nb\r\nc').lines).toBe(3)
    expect(countText('').lines).toBe(0)
    expect(countText('单行').lines).toBe(1)
  })

  it('空白字符不计入非空白字符', () => {
    const s = countText(' a \t\n')
    expect(s.chars).toBe(5)
    expect(s.charsNoSpace).toBe(1)
  })

  it('复合英文词按 1 词计', () => {
    expect(countText("don't well-known").latinWords).toBe(2)
  })

  it('空文本全部为 0', () => {
    const s = countText('')
    expect(s.chars).toBe(0)
    expect(s.words).toBe(0)
  })
})
