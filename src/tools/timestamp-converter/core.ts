/**
 * 时间戳转换核心逻辑（TOOL-004）。
 * - 秒/毫秒自动识别（10 位及以下视为秒，11-13 位视为毫秒），也可手动指定；
 * - 同时输出本地时区、UTC 与 ISO 8601 三种表示；
 * - 处理非法输入与超出 Date 表示范围（±275760 年）的时间。
 */

export type TimeUnit = 'auto' | 'seconds' | 'milliseconds'

export interface TimestampResult {
  ok: boolean
  message?: string
  /** 识别出的单位 */
  unit?: 'seconds' | 'milliseconds'
  iso?: string
  local?: string
  utc?: string
  seconds?: number
  milliseconds?: number
}

/** JavaScript Date 可表示的最大毫秒数（±275760 年）。 */
const MAX_MS = 8_640_000_000_000_000

export function detectUnit(digits: number): 'seconds' | 'milliseconds' | null {
  if (digits >= 1 && digits <= 10) return 'seconds'
  if (digits >= 11 && digits <= 13) return 'milliseconds'
  return null
}

/** 时间戳 → 日期。 */
export function timestampToDate(raw: string, unit: TimeUnit = 'auto'): TimestampResult {
  const trimmed = raw.trim()
  if (!trimmed) return { ok: false, message: '输入为空，请填写时间戳' }
  if (!/^\d+$/.test(trimmed)) {
    return { ok: false, message: '时间戳必须是纯数字（Unix 秒或毫秒）' }
  }

  const value = Number(trimmed)
  const detected = unit === 'auto' ? detectUnit(trimmed.length) : unit
  if (!detected) {
    return { ok: false, message: '无法判断单位：10 位及以下按秒，11-13 位按毫秒，请手动指定' }
  }

  const ms = detected === 'seconds' ? value * 1000 : value
  if (ms > MAX_MS) {
    return { ok: false, message: '超出可表示范围（±275760 年），请检查输入' }
  }

  const date = new Date(ms)
  return {
    ok: true,
    unit: detected,
    iso: date.toISOString(),
    local: date.toLocaleString('zh-CN', { hour12: false, timeZoneName: 'short' }),
    utc: date.toUTCString(),
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
  }
}

/** 日期字符串 → 时间戳。空输入使用当前时间。 */
export function dateToTimestamp(raw: string): TimestampResult {
  const trimmed = raw.trim()
  const date = trimmed ? new Date(trimmed) : new Date()
  if (Number.isNaN(date.getTime())) {
    return { ok: false, message: '无法解析该日期，试试 ISO 格式如 2026-01-01T08:00:00' }
  }
  const ms = date.getTime()
  return {
    ok: true,
    iso: date.toISOString(),
    local: date.toLocaleString('zh-CN', { hour12: false, timeZoneName: 'short' }),
    utc: date.toUTCString(),
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
  }
}
