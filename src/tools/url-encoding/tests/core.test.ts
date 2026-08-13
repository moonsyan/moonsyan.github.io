import { describe, expect, it } from 'vitest'
import { decodeUrl, encodeUrl } from '../core'
import { EXAMPLE_ENCODED, EXAMPLE_TEXT } from '../schema'

describe('url-encoding core', () => {
  it('组件模式编码中文与特殊字符', () => {
    expect(encodeUrl('工具 站').output).toBe('%E5%B7%A5%E5%85%B7%20%E7%AB%99')
  })

  it('组件模式与整体模式行为不同', () => {
    const url = 'https://a.com/x?y=1'
    expect(encodeUrl(url, 'component').output).toContain('%3A%2F%2F')
    expect(encodeUrl(url, 'full').output).toBe(url)
  })

  it('解码还原原文', () => {
    expect(decodeUrl('%E4%B8%AD%E6%96%87').output).toBe('中文')
  })

  it('非法转义序列报错', () => {
    const res = decodeUrl('%ZZ')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('不是合法的 URL 编码')
  })

  it('内置示例数据真实有效', () => {
    expect(encodeUrl(EXAMPLE_TEXT, 'component').output).toBe(EXAMPLE_ENCODED)
    expect(decodeUrl(EXAMPLE_ENCODED, 'component').output).toBe(EXAMPLE_TEXT)
  })

  it('空输入有提示', () => {
    expect(encodeUrl(' ').ok).toBe(false)
    expect(decodeUrl('').ok).toBe(false)
  })
})
