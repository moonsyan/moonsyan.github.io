import { describe, expect, it } from 'vitest'
import { parseJwt } from '../core'
import { EXAMPLE_JWT } from '../schema'

function makeJwt(header: object, payload: object): string {
  const enc = (o: object) =>
    Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${enc(header)}.${enc(payload)}.sig`
}

describe('jwt-parser core', () => {
  it('解析 Header 与 Payload', () => {
    const res = parseJwt(makeJwt({ alg: 'HS256', typ: 'JWT' }, { sub: 'u1', iss: 'x' }))
    expect(res.ok).toBe(true)
    expect(res.header).toEqual({ alg: 'HS256', typ: 'JWT' })
    expect(res.payload).toEqual({ sub: 'u1', iss: 'x' })
  })

  it('中文声明正确解码', () => {
    const res = parseJwt(makeJwt({ typ: 'JWT' }, { name: '测试用户' }))
    expect(res.payload).toEqual({ name: '测试用户' })
  })

  it('过期状态判断', () => {
    const expired = parseJwt(makeJwt({}, { exp: 1000 }))
    expect(expired.expired).toBe(true)
    expect(expired.expiresAt).toBeTruthy()
    const future = parseJwt(makeJwt({}, { exp: 4102444800 }))
    expect(future.expired).toBe(false)
  })

  it('段数不对报错', () => {
    expect(parseJwt('a.b').message).toContain('3 段')
  })

  it('非法 Base64URL 与非法 JSON 报错', () => {
    expect(parseJwt('!!!.@@@.sig').ok).toBe(false)
    expect(parseJwt('aGVsbG8.d29ybGQ.sig').message).toContain('不是合法 JSON')
  })

  it('内置示例可解析', () => {
    const res = parseJwt(EXAMPLE_JWT)
    expect(res.ok).toBe(true)
    expect(res.payload?.sub).toBe('demo-user')
  })

  it('空输入有提示', () => {
    expect(parseJwt(' ').ok).toBe(false)
  })
})
