/**
 * 单位换算核心逻辑（TOOL-016）。
 * - 支持长度、面积、质量、温度、数据大小五个量纲；
 * - 不同量纲不能混算（换算前校验量纲一致）；
 * - 浮点精度可控（结果保留可配置的小数位）。
 */

export type Dimension = 'length' | 'area' | 'mass' | 'temperature' | 'data'

export interface UnitDef {
  id: string
  name: string
  /** 相对基准单位的换算系数（温度为特殊处理） */
  factor: number
}

export const DIMENSIONS: Record<Dimension, { name: string; units: UnitDef[] }> = {
  length: {
    name: '长度',
    units: [
      { id: 'mm', name: '毫米', factor: 0.001 },
      { id: 'cm', name: '厘米', factor: 0.01 },
      { id: 'm', name: '米', factor: 1 },
      { id: 'km', name: '千米', factor: 1000 },
      { id: 'in', name: '英寸', factor: 0.0254 },
      { id: 'ft', name: '英尺', factor: 0.3048 },
      { id: 'mi', name: '英里', factor: 1609.344 },
    ],
  },
  area: {
    name: '面积',
    units: [
      { id: 'cm2', name: '平方厘米', factor: 0.0001 },
      { id: 'm2', name: '平方米', factor: 1 },
      { id: 'ha', name: '公顷', factor: 10000 },
      { id: 'km2', name: '平方千米', factor: 1e6 },
      { id: 'acre', name: '英亩', factor: 4046.8564224 },
    ],
  },
  mass: {
    name: '质量',
    units: [
      { id: 'mg', name: '毫克', factor: 1e-6 },
      { id: 'g', name: '克', factor: 0.001 },
      { id: 'kg', name: '千克', factor: 1 },
      { id: 't', name: '吨', factor: 1000 },
      { id: 'lb', name: '磅', factor: 0.45359237 },
    ],
  },
  temperature: {
    name: '温度',
    units: [
      { id: 'c', name: '摄氏度 ℃', factor: 1 },
      { id: 'f', name: '华氏度 ℉', factor: 1 },
      { id: 'k', name: '开尔文 K', factor: 1 },
    ],
  },
  data: {
    name: '数据大小',
    units: [
      { id: 'b', name: '字节 B', factor: 1 },
      { id: 'kb', name: 'KB', factor: 1024 },
      { id: 'mb', name: 'MB', factor: 1024 ** 2 },
      { id: 'gb', name: 'GB', factor: 1024 ** 3 },
      { id: 'tb', name: 'TB', factor: 1024 ** 4 },
    ],
  },
}

export interface UnitResult {
  ok: boolean
  output?: number
  message?: string
}

function dimensionOf(unitId: string): Dimension | null {
  for (const [dim, def] of Object.entries(DIMENSIONS)) {
    if (def.units.some((u) => u.id === unitId)) return dim as Dimension
  }
  return null
}

function convertTemperature(value: number, from: string, to: string): number {
  // 先转摄氏度
  let celsius: number
  if (from === 'c') celsius = value
  else if (from === 'f') celsius = ((value - 32) * 5) / 9
  else celsius = value - 273.15
  // 再从摄氏度转目标
  if (to === 'c') return celsius
  if (to === 'f') return (celsius * 9) / 5 + 32
  return celsius + 273.15
}

export function convertUnit(
  value: number,
  from: string,
  to: string,
  precision = 6,
): UnitResult {
  if (!Number.isFinite(value)) return { ok: false, message: '数值无效' }
  const dimFrom = dimensionOf(from)
  const dimTo = dimensionOf(to)
  if (!dimFrom || !dimTo) return { ok: false, message: '未知的单位' }
  if (dimFrom !== dimTo) {
    return { ok: false, message: `不同量纲不能混算：${DIMENSIONS[dimFrom].name} 与 ${DIMENSIONS[dimTo].name}` }
  }
  if (precision < 0 || precision > 12) return { ok: false, message: '精度需在 0-12 位小数之间' }

  let result: number
  if (dimFrom === 'temperature') {
    result = convertTemperature(value, from, to)
  } else {
    const units = DIMENSIONS[dimFrom].units
    const fromFactor = units.find((u) => u.id === from)!.factor
    const toFactor = units.find((u) => u.id === to)!.factor
    result = (value * fromFactor) / toFactor
  }
  return { ok: true, output: Number(result.toFixed(precision)) }
}
