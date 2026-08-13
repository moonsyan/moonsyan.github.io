/**
 * JWT 解析输入校验与示例（RUN-006）。
 * 示例令牌为手工构造的演示数据：alg=none 明确标识非真实签名，
 * Payload 不含任何真实用户信息。
 */
import { z } from 'zod'

export const jwtInputSchema = z.object({
  text: z.string().max(64 * 1024, '输入超过 64KB 限制，请确认粘贴的是完整令牌'),
})

const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' }))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
const payload = btoa(JSON.stringify({ sub: 'demo-user', iss: 'toolkit-example', iat: 1700000000, exp: 4102444800 }))
  .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')

/** 演示令牌：签名段为空，仅供体验解析流程。 */
export const EXAMPLE_JWT = `${header}.${payload}.`
