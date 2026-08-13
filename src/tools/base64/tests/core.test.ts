import { describe, expect, it } from 'vitest'
import { decodeBase64, encodeBase64 } from '../core'
import { EXAMPLE_ENCODED, EXAMPLE_TEXT } from '../schema'

describe('base64 core', () => {
  it('编码中文与 Emoji', () => {
    expect(encodeBase64('你好').output).toBe('5L2g5aW9')
    expect(encodeBase64('hi😀').output).toBe('aGnwn5iA')
  })

  it('解码可还原原文', () => {
    const encoded = encodeBase64('你好，世界！').output!
    expect(decodeBase64(encoded).output).toBe('你好，世界！')
  })

  it('URL Safe 模式替换字符并去掉填充', () => {
    const std = encodeBase64('subjects?_d').output!
    const url = encodeBase64('subjects?_d', 'urlsafe').output!
    expect(url).not.toMatch(/[+/=]/)
    expect(decodeBase64(url, 'urlsafe').output).toBe('subjects?_d')
    expect(std).not.toBe(url)
  })

  it('非法 Base64 给出可恢复提示', () => {
    const res = decodeBase64('!!!')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('不是合法的 Base64')
  })

  it('URL Safe 模式下拒绝标准字符', () => {
    const res = decodeBase64('aGk+/w==', 'urlsafe')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('标准模式')
  })

  it('内置示例数据真实有效（RUN-006）', () => {
    expect(encodeBase64(EXAMPLE_TEXT).output).toBe(EXAMPLE_ENCODED)
    expect(decodeBase64(EXAMPLE_ENCODED).output).toBe(EXAMPLE_TEXT)
  })

  it('空输入有提示', () => {
    expect(encodeBase64('').ok).toBe(false)
    expect(decodeBase64('  ').ok).toBe(false)
  })
})
