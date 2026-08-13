import { describe, expect, it } from 'vitest'
import { convertUnit } from '../core'

describe('unit-converter core', () => {
  it('长度换算', () => {
    expect(convertUnit(1, 'km', 'm').output).toBe(1000)
    expect(convertUnit(1, 'mi', 'km').output).toBe(1.609344)
  })

  it('数据大小按 1024 进制', () => {
    expect(convertUnit(1, 'gb', 'mb').output).toBe(1024)
    expect(convertUnit(1536, 'mb', 'gb').output).toBe(1.5)
  })

  it('温度换算', () => {
    expect(convertUnit(100, 'c', 'f').output).toBe(212)
    expect(convertUnit(32, 'f', 'c').output).toBe(0)
    expect(convertUnit(0, 'c', 'k').output).toBe(273.15)
  })

  it('不同量纲拒绝混算（TOOL-016 硬性要求）', () => {
    const res = convertUnit(1, 'kg', 'km')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('不能混算')
  })

  it('精度可控', () => {
    expect(convertUnit(1, 'm', 'km', 2).output).toBe(0)
    expect(convertUnit(1, 'm', 'km', 4).output).toBe(0.001)
  })

  it('非法输入报错', () => {
    expect(convertUnit(Number.NaN, 'm', 'km').ok).toBe(false)
    expect(convertUnit(1, 'xx', 'm').ok).toBe(false)
    expect(convertUnit(1, 'm', 'km', 20).ok).toBe(false)
  })
})
