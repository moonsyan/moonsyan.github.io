import { describe, expect, it } from 'vitest'
import { dateToTimestamp, timestampToDate } from '../core'

describe('timestamp-converter core', () => {
  it('秒级时间戳自动识别并转换', () => {
    const res = timestampToDate('1700000000')
    expect(res.ok).toBe(true)
    expect(res.unit).toBe('seconds')
    expect(res.iso).toBe('2023-11-14T22:13:20.000Z')
    expect(res.milliseconds).toBe(1700000000000)
  })

  it('毫秒级时间戳自动识别', () => {
    const res = timestampToDate('1700000000000')
    expect(res.unit).toBe('milliseconds')
    expect(res.seconds).toBe(1700000000)
  })

  it('手动指定秒单位时超大数值超出范围', () => {
    const res = timestampToDate('9999999999999', 'seconds')
    expect(res.ok).toBe(false) // 9.999e15 ms > Date 可表示上限
  })

  it('非数字与空输入报错', () => {
    expect(timestampToDate('abc').message).toContain('纯数字')
    expect(timestampToDate(' ').ok).toBe(false)
  })

  it('超范围时间戳报错', () => {
    expect(timestampToDate('9999999999999', 'seconds').message).toContain('超出可表示范围')
    // 17 位数字无法自动判断单位
    expect(timestampToDate('99999999999999999').message).toContain('无法判断单位')
  })

  it('日期字符串转时间戳', () => {
    const res = dateToTimestamp('2023-11-14T22:13:20Z')
    expect(res.ok).toBe(true)
    expect(res.seconds).toBe(1700000000)
  })

  it('非法日期报错', () => {
    expect(dateToTimestamp('不是日期').ok).toBe(false)
  })
})
