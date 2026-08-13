import { describe, expect, it } from 'vitest'
import { textToUnicode, unicodeToText } from '../core'

describe('unicode-converter core', () => {
  it('中文转义与还原', () => {
    const enc = textToUnicode('中文a')
    expect(enc.output).toBe('\\u4e2d\\u6587a')
    expect(unicodeToText(enc.output!).output).toBe('中文a')
  })

  it('Emoji 代理对正确处理（TOOL-013 硬性要求）', () => {
    const enc = textToUnicode('😀')
    expect(enc.output).toBe('\\ud83d\\ude00')
    expect(unicodeToText(enc.output!).output).toBe('😀')
  })

  it('支持 \\u{...} 码点写法', () => {
    expect(unicodeToText('\\u{1F600}').output).toBe('😀')
    expect(unicodeToText('\\u{4e2d}').output).toBe('中')
  })

  it('可打印 ASCII 保持原样', () => {
    expect(textToUnicode('abc 123').output).toBe('abc 123')
  })

  it('非法码点报错', () => {
    expect(unicodeToText('\\u{110000}').ok).toBe(false)
  })

  it('空输入有提示', () => {
    expect(textToUnicode('').ok).toBe(false)
    expect(unicodeToText(' ').ok).toBe(false)
  })
})
