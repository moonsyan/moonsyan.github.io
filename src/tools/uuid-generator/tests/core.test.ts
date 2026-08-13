import { describe, expect, it } from 'vitest'
import { generateUuids, UUID_PATTERN, uuidV4, uuidV7 } from '../core'

describe('uuid-generator core', () => {
  it('v4 格式合法且版本位正确', () => {
    const id = uuidV4()
    expect(id).toMatch(UUID_PATTERN)
    expect(id[14]).toBe('4')
    expect(['8', '9', 'a', 'b']).toContain(id[19])
  })

  it('v7 格式合法、版本位正确且时间有序', () => {
    const a = uuidV7(1700000000000)
    const b = uuidV7(1700000001000)
    expect(a).toMatch(UUID_PATTERN)
    expect(a[14]).toBe('7')
    expect(a < b).toBe(true)
  })

  it('批量生成数量正确且不重复', () => {
    const res = generateUuids(50, 'v4')
    expect(res.ok).toBe(true)
    expect(res.output).toHaveLength(50)
    expect(new Set(res.output).size).toBe(50)
  })

  it('批量数量越界报错', () => {
    expect(generateUuids(0, 'v4').ok).toBe(false)
    expect(generateUuids(101, 'v7').message).toContain('1-100')
    expect(generateUuids(1.5, 'v4').ok).toBe(false)
  })
})
