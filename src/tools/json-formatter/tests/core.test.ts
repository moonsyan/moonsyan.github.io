import { describe, expect, it } from 'vitest'
import { processJson } from '../core'

describe('json-formatter core', () => {
  it('格式化合法 JSON', () => {
    const res = processJson('{"a":1}', 'format', 2)
    expect(res.ok).toBe(true)
    expect(res.output).toBe('{\n  "a": 1\n}')
  })

  it('压缩合法 JSON', () => {
    const res = processJson('{\n  "a": 1\n}', 'compress')
    expect(res.ok).toBe(true)
    expect(res.output).toBe('{"a":1}')
  })

  it('校验模式不返回输出文本', () => {
    const res = processJson('[]', 'validate')
    expect(res.ok).toBe(true)
    expect(res.output).toBe('JSON 语法正确')
  })

  it('空输入给出可恢复提示', () => {
    const res = processJson('   ', 'format')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('输入为空')
  })

  it('非法 JSON 报错并定位行列', () => {
    const res = processJson('{\n  "a": ,\n}', 'format')
    expect(res.ok).toBe(false)
    expect(res.message).toContain('JSON 语法错误')
  })

  it('支持数组与 Unicode', () => {
    const res = processJson('["中文", 1, null]', 'compress')
    expect(res.ok).toBe(true)
    expect(res.output).toBe('["中文",1,null]')
  })
})
