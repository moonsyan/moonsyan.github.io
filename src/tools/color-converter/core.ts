/**
 * 颜色转换核心逻辑（TOOL-012）。
 * - HEX / RGB / HSL 互转，支持透明度（alpha）；
 * - 严格校验数值范围（RGB 0-255、HSL 色相 0-360、饱和度亮度与透明度 0-100）；
 * - 全部为纯函数，可独立测试。
 */

export interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

export interface ColorConvertResult {
  ok: boolean
  message?: string
  hex?: string
  rgb?: string
  hsl?: string
  rgba?: Rgba
}

const HEX_PATTERN = /^#?([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const RGB_PATTERN = /^rgba?\(\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*[, ]\s*([\d.]+)\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i
const HSL_PATTERN = /^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%\s*(?:[,/]\s*([\d.]+%?)\s*)?\)$/i

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseAlpha(raw: string | undefined): number | null {
  if (raw === undefined) return 1
  const value = raw.endsWith('%') ? Number(raw.slice(0, -1)) / 100 : Number(raw)
  if (Number.isNaN(value) || value < 0 || value > 1) return null
  return value
}

/** 解析任意受支持格式为 RGBA；失败返回 null 与原因。 */
export function parseColor(input: string): { rgba: Rgba | null; message?: string } {
  const text = input.trim()
  if (!text) return { rgba: null, message: '输入为空，请填写颜色值' }

  // HEX
  const hexMatch = HEX_PATTERN.exec(text)
  if (hexMatch) {
    let hex = hexMatch[1]
    if (hex.length <= 4) {
      hex = hex.split('').map((c) => c + c).join('')
    }
    const a = hex.length === 8 ? Math.round((parseInt(hex.slice(6, 8), 16) / 255) * 100) / 100 : 1
    return {
      rgba: {
        r: parseInt(hex.slice(0, 2), 16),
        g: parseInt(hex.slice(2, 4), 16),
        b: parseInt(hex.slice(4, 6), 16),
        a,
      },
    }
  }

  // RGB / RGBA
  const rgbMatch = RGB_PATTERN.exec(text)
  if (rgbMatch) {
    const [r, g, b] = [rgbMatch[1], rgbMatch[2], rgbMatch[3]].map(Number)
    if ([r, g, b].some((v) => Number.isNaN(v) || v < 0 || v > 255)) {
      return { rgba: null, message: 'RGB 分量必须在 0-255 之间' }
    }
    const a = parseAlpha(rgbMatch[4])
    if (a === null) return { rgba: null, message: '透明度必须在 0-1（或 0%-100%）之间' }
    return { rgba: { r: Math.round(r), g: Math.round(g), b: Math.round(b), a } }
  }

  // HSL / HSLA
  const hslMatch = HSL_PATTERN.exec(text)
  if (hslMatch) {
    const h = Number(hslMatch[1]) % 360
    const s = Number(hslMatch[2])
    const l = Number(hslMatch[3])
    if (Number.isNaN(h) || s < 0 || s > 100 || l < 0 || l > 100) {
      return { rgba: null, message: 'HSL 饱和度与亮度必须在 0-100% 之间' }
    }
    const a = parseAlpha(hslMatch[4])
    if (a === null) return { rgba: null, message: '透明度必须在 0-1（或 0%-100%）之间' }
    return { rgba: { ...hslToRgb(h, s, l), a } }
  }

  return { rgba: null, message: '无法识别的颜色格式，支持 HEX、rgb()、hsl()' }
}

/** HSL → RGB（h: 0-360，s/l: 0-100）。 */
export function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const sn = clamp(s, 0, 100) / 100
  const ln = clamp(l, 0, 100) / 100
  const c = (1 - Math.abs(2 * ln - 1)) * sn
  const x = c * (1 - Math.abs((((h % 360) / 60) % 2) - 1))
  const m = ln - c / 2
  let rgb: [number, number, number]
  const seg = Math.floor(((h % 360) + 360) % 360 / 60)
  switch (seg) {
    case 0: rgb = [c, x, 0]; break
    case 1: rgb = [x, c, 0]; break
    case 2: rgb = [0, c, x]; break
    case 3: rgb = [0, x, c]; break
    case 4: rgb = [x, 0, c]; break
    default: rgb = [c, 0, x]
  }
  return {
    r: Math.round((rgb[0] + m) * 255),
    g: Math.round((rgb[1] + m) * 255),
    b: Math.round((rgb[2] + m) * 255),
  }
}

/** RGB → HSL，色相取整、饱和度亮度保留一位小数。 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const rn = r / 255
  const gn = g / 255
  const bn = b / 255
  const max = Math.max(rn, gn, bn)
  const min = Math.min(rn, gn, bn)
  const delta = max - min
  const l = (max + min) / 2
  if (delta === 0) return { h: 0, s: 0, l: Math.round(l * 1000) / 10 }
  const s = delta / (1 - Math.abs(2 * l - 1))
  let h: number
  if (max === rn) h = 60 * (((gn - bn) / delta) % 6)
  else if (max === gn) h = 60 * ((bn - rn) / delta + 2)
  else h = 60 * ((rn - gn) / delta + 4)
  return {
    h: Math.round((h + 360) % 360),
    s: Math.round(s * 1000) / 10,
    l: Math.round(l * 1000) / 10,
  }
}

function toHexPart(v: number): string {
  return clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
}

/** 主入口：解析输入并输出三种格式。 */
export function convertColor(input: string): ColorConvertResult {
  const { rgba, message } = parseColor(input)
  if (!rgba) return { ok: false, message }

  const { r, g, b, a } = rgba
  const hex = `#${toHexPart(r)}${toHexPart(g)}${toHexPart(b)}${a < 1 ? toHexPart(a * 255) : ''}`
  const rgb = a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`
  const { h, s, l } = rgbToHsl(r, g, b)
  const hsl = a < 1 ? `hsla(${h}, ${s}%, ${l}%, ${a})` : `hsl(${h}, ${s}%, ${l}%)`

  return { ok: true, hex, rgb, hsl, rgba }
}
