import { describe, expect, it } from 'vitest'
import { DIGEST_HEX_LENGTH, hashText } from '../core'

describe('hash-calculator core', () => {
  it('SHA-256 摘要与已知向量一致', async () => {
    // "abc" 的 SHA-256 为 RFC 6234 公开测试向量
    const res = await hashText('abc', 'SHA-256')
    expect(res.ok).toBe(true)
    expect(res.output).toBe('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad')
  })

  it('SHA-1 摘要长度正确（仅兼容校验用途）', async () => {
    const res = await hashText('abc', 'SHA-1')
    expect(res.output).toHaveLength(DIGEST_HEX_LENGTH['SHA-1'])
    expect(res.output).toBe('a9993e364706816aba3e25717850c26c9cd0d89d')
  })

  it('SHA-512 输出 128 位十六进制', async () => {
    const res = await hashText('abc', 'SHA-512')
    expect(res.output).toHaveLength(128)
  })

  it('中文文本可正常计算', async () => {
    const res = await hashText('你好')
    expect(res.ok).toBe(true)
    expect(res.output).toMatch(/^[0-9a-f]{64}$/)
  })

  it('空输入有提示', async () => {
    expect((await hashText('')).ok).toBe(false)
  })

  it('非法算法被拒绝', async () => {
    // @ts-expect-error 测试非法入参
    const res = await hashText('abc', 'MD5')
    expect(res.ok).toBe(false)
  })
})
