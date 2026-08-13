/**
 * 正则执行器：Web Worker + 超时保护（TOOL-008 的硬性要求）。
 *
 * 灾难性回溯（如 (a+)+$ 匹配长文本）会长时间占用主线程导致页面冻结，
 * 因此实际执行放在一次性 Worker 中：超过 timeoutMs 立即终止 Worker
 * 并返回超时错误，用户可安全修改正则后重试。
 *
 * 本文件只能在浏览器端调用（ToolView 在客户端渲染）。
 */
import type { RegexResult } from './core'
import { MAX_MATCHES } from './core'

/** Worker 内部脚本：收到参数后执行 matchAll 并回传结果。 */
const WORKER_SOURCE = `
self.onmessage = (event) => {
  const { pattern, flags, text, maxMatches } = event.data
  try {
    const regex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g')
    const matches = []
    let truncated = false
    for (const m of text.matchAll(regex)) {
      if (matches.length >= maxMatches) { truncated = true; break }
      matches.push({ index: m.index || 0, match: m[0], groups: m.slice(1).map((g) => g ?? '') })
    }
    self.postMessage({ ok: true, matches, truncated })
  } catch (err) {
    self.postMessage({ ok: false, message: '执行失败：' + err.message })
  }
}
`

export async function runRegexInWorker(
  pattern: string,
  flags: string,
  text: string,
  timeoutMs = 2000,
): Promise<RegexResult> {
  const blob = new Blob([WORKER_SOURCE], { type: 'application/javascript' })
  const url = URL.createObjectURL(blob)
  const worker = new Worker(url)

  return new Promise<RegexResult>((resolve) => {
    const timer = setTimeout(() => {
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({
        ok: false,
        message: `执行超时（${timeoutMs}ms）：该正则可能存在灾难性回溯，请简化表达式后重试`,
      })
    }, timeoutMs)

    worker.onmessage = (event: MessageEvent<RegexResult>) => {
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({ ...event.data, truncated: event.data.truncated ?? false })
    }

    worker.onerror = () => {
      clearTimeout(timer)
      worker.terminate()
      URL.revokeObjectURL(url)
      resolve({ ok: false, message: '执行环境异常，请重试' })
    }

    worker.postMessage({ pattern, flags, text, maxMatches: MAX_MATCHES })
  })
}
