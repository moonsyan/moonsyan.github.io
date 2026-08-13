import { describe, expect, it } from 'vitest'
import { findMatches, validateRegex } from '../core'

describe('regex-tester core', () => {
  it('校验合法与非法正则', () => {
    expect(validateRegex('\\d+', 'g').ok).toBe(true)
    expect(validateRegex('(', 'g').ok).toBe(false)
    expect(validateRegex('a', 'z').message).toContain('标志位')
    expect(validateRegex('', 'g').ok).toBe(false)
  })

  it('全局匹配返回全部命中与位置', () => {
    const res = findMatches('\\d+', 'g', 'a1 b22 c333')
    expect(res.ok).toBe(true)
    expect(res.matches).toHaveLength(3)
    expect(res.matches![1]).toEqual({ index: 4, match: '22', groups: [] })
  })

  it('提取捕获分组', () => {
    const res = findMatches('(\\w+)=(\\d+)', 'g', 'a=1 b=2')
    expect(res.matches![0].groups).toEqual(['a', '1'])
  })

  it('无 g 标志时按全局匹配处理', () => {
    const res = findMatches('\\d', '', '1 2 3')
    expect(res.matches).toHaveLength(3)
  })

  it('缺失分组以空字符串占位', () => {
    const res = findMatches('(a)|(b)', 'g', 'b')
    expect(res.matches![0].groups).toEqual(['', 'b'])
  })

  it('语法错误返回可恢复提示', () => {
    const res = findMatches('(', 'g', 'abc')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('语法错误')
  })

  it('超过上限截断并提示', () => {
    const res = findMatches('a', 'g', 'a'.repeat(600))
    expect(res.ok).toBe(true)
    expect(res.matches).toHaveLength(500)
    expect(res.truncated).toBe(true)
  })
})
