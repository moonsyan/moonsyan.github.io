import { describe, expect, it } from 'vitest'
import { convertColor, hslToRgb, rgbToHsl } from '../core'

describe('color-converter core', () => {
  it('HEX 转 RGB 与 HSL', () => {
    const res = convertColor('#00b589')
    expect(res.ok).toBe(true)
    expect(res.rgb).toBe('rgb(0, 181, 137)')
    expect(res.hsl).toContain('hsl(165')
  })

  it('缩写 HEX 展开', () => {
    expect(convertColor('#fff').hex).toBe('#ffffff')
  })

  it('RGB 字符串解析与往返转换', () => {
    const res = convertColor('rgb(255, 0, 0)')
    expect(res.hex).toBe('#ff0000')
    const hsl = rgbToHsl(255, 0, 0)
    expect(hsl).toEqual({ h: 0, s: 100, l: 50 })
  })

  it('HSL 解析', () => {
    const rgb = hslToRgb(120, 100, 50)
    expect(rgb).toEqual({ r: 0, g: 255, b: 0 })
    expect(convertColor('hsl(120, 100%, 50%)').hex).toBe('#00ff00')
  })

  it('透明度支持', () => {
    const res = convertColor('#00b58980')
    expect(res.ok).toBe(true)
    expect(res.rgba!.a).toBeCloseTo(0.5, 1)
    expect(res.rgb).toMatch(/^rgba\(/)
    expect(convertColor('rgba(0, 0, 0, 0.5)').hsl).toMatch(/^hsla\(/)
  })

  it('非法输入返回可恢复提示', () => {
    expect(convertColor('rgb(300, 0, 0)').ok).toBe(false)
    expect(convertColor('不是颜色').message).toContain('无法识别')
    expect(convertColor('').ok).toBe(false)
    expect(convertColor('rgba(0,0,0,2)').message).toContain('透明度')
  })
})
