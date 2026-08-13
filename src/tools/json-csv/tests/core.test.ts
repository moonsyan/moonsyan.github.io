import { describe, expect, it } from 'vitest'
import { csvToJson, flattenRecord, jsonToCsv } from '../core'

const opts = { delimiter: ',', quote: 'minimal' as const, nested: 'flatten' as const }

describe('json-csv core', () => {
  it('对象数组转 CSV，列头为并集（不丢字段）', () => {
    const res = jsonToCsv('[{"a":1},{"b":2}]', opts)
    expect(res.output).toBe('a,b\n1,\n,2')
  })

  it('嵌套 JSON 按 flatten 点路径展开', () => {
    expect(flattenRecord({ user: { name: 'x' }, tags: [1] })).toEqual({
      'user.name': 'x',
      tags: '[1]',
    })
    const res = jsonToCsv('[{"user":{"name":"张三"}}]', opts)
    expect(res.output).toContain('user.name')
  })

  it('含分隔符与引号的单元格正确转义', () => {
    const res = jsonToCsv('[{"a":"x,y","b":"he said \\"hi\\""}]', opts)
    expect(res.output).toContain('"x,y"')
    expect(res.output).toContain('"he said ""hi"""')
  })

  it('CSV 转 JSON（带表头与引号解析）', () => {
    const res = csvToJson('name,note\n"张,三","he said ""hi"""\n', ',', true)
    const records = JSON.parse(res.output!)
    expect(records).toEqual([{ name: '张,三', note: 'he said "hi"' }])
  })

  it('无表头时生成 col_N 列名', () => {
    const res = csvToJson('1,2', ',', false)
    expect(JSON.parse(res.output!)).toEqual([{ col_1: '1', col_2: '2' }])
  })

  it('非法输入报错', () => {
    expect(jsonToCsv('{', opts).ok).toBe(false)
    expect(jsonToCsv('[1,2]', opts).message).toContain('对象')
    expect(jsonToCsv('[]', opts).ok).toBe(false)
    expect(csvToJson(' ', ',', true).ok).toBe(false)
  })
})
