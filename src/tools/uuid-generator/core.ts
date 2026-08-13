/**
 * UUID 生成核心逻辑（TOOL-005）。
 * - v4：122 位随机，使用浏览器安全随机源 crypto.getRandomValues；
 * - v7：48 位毫秒时间戳前缀 + 随机位，可按生成时间排序（RFC 9562）；
 * - 批量生成限制在 1-100 个，防止误操作产生超大输出。
 */

export type UuidVersion = 'v4' | 'v7'

export const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export interface UuidResult {
  ok: boolean
  message?: string
  output?: string[]
}

function randomBytes(n: number): Uint8Array {
  const bytes = new Uint8Array(n)
  crypto.getRandomValues(bytes)
  return bytes
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

/** 生成单个 UUID v4（随机）。 */
export function uuidV4(): string {
  const bytes = randomBytes(16)
  bytes[6] = (bytes[6] & 0x0f) | 0x40 // version 4
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant RFC 9562
  const hex = toHex(bytes)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** 生成单个 UUID v7（时间有序）。 */
export function uuidV7(now: number = Date.now()): string {
  const bytes = randomBytes(16)
  // 前 48 位写入毫秒时间戳（大端序）
  let ts = now
  for (let i = 5; i >= 0; i--) {
    bytes[i] = ts & 0xff
    ts = Math.floor(ts / 256)
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x70 // version 7
  bytes[8] = (bytes[8] & 0x3f) | 0x80 // variant
  const hex = toHex(bytes)
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
}

/** 批量生成（1-100 个）。 */
export function generateUuids(count: number, version: UuidVersion): UuidResult {
  if (!Number.isInteger(count) || count < 1 || count > 100) {
    return { ok: false, message: '批量数量必须是 1-100 之间的整数' }
  }
  const fn = version === 'v4' ? uuidV4 : uuidV7
  return { ok: true, output: Array.from({ length: count }, fn) }
}
