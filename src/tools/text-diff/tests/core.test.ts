import { describe, expect, it } from 'vitest'
import { diffText } from '../core'

describe('text-diff core', () => {
  it('行级对比标记增删', () => {
    const res = diffText('a\nb\n', 'a\nc\n', 'line')
    expect(res.ok).toBe(true)
    expect(res.addedCount).toBe(1)
    expect(res.removedCount).toBe(1)
    const types = res.parts!.map((p) => p.type)
    expect(types).toContain('added')
    expect(types).toContain('removed')
    expect(types).toContain('same')
  })

  it('字符级对比', () => {
    const res = diffText('abc', 'axc', 'char')
    expect(res.ok).toBe(true)
    expect(res.parts).toEqual([
      { type: 'same', value: 'a' },
      { type: 'removed', value: 'b' },
      { type: 'added', value: 'x' },
      { type: 'same', value: 'c' },
    ])
  })

  it('完全相同文本无增删', () => {
    const res = diffText('same', 'same')
    expect(res.addedCount).toBe(0)
    expect(res.removedCount).toBe(0)
  })

  it('双侧为空报错', () => {
    expect(diffText('', '').ok).toBe(false)
  })

  it('超大文本拒绝', () => {
    const big = 'x'.repeat(300 * 1024)
    expect(diffText(big, 'a').message).toContain('上限')
  })
})
