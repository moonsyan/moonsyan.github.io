import { describe, expect, it } from 'vitest'
import { convertCase, tokenize } from '../core'

describe('case-converter core', () => {
  it('camelCase 边界分词', () => {
    expect(tokenize('fooBarBaz')).toEqual(['foo', 'bar', 'baz'])
  })

  it('连续大写视为一个词（HTTPServer）', () => {
    expect(tokenize('HTTPServer')).toEqual(['http', 'server'])
  })

  it('各种分隔符统一处理', () => {
    expect(tokenize('foo-bar_baz qux')).toEqual(['foo', 'bar', 'baz', 'qux'])
  })

  it('五种风格转换', () => {
    const input = 'hello world foo'
    expect(convertCase(input, 'camel').output).toBe('helloWorldFoo')
    expect(convertCase(input, 'pascal').output).toBe('HelloWorldFoo')
    expect(convertCase(input, 'snake').output).toBe('hello_world_foo')
    expect(convertCase(input, 'kebab').output).toBe('hello-world-foo')
    expect(convertCase(input, 'upper').output).toBe('HELLO WORLD FOO')
  })

  it('camel 输入转 snake', () => {
    expect(convertCase('userIdValue', 'snake').output).toBe('user_id_value')
  })

  it('空输入与无意义输入报错', () => {
    expect(convertCase(' ', 'camel').ok).toBe(false)
    expect(convertCase('!!!', 'camel').ok).toBe(false)
  })
})
