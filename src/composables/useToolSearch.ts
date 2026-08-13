/**
 * 本地工具搜索（WEB-004）：按名称、别名、简介和标签匹配。
 * 阶段一使用构建时生成的前端索引，不走服务端（《工具站架构.md》七）。
 */
import { allTools } from '~/tools/registry'
import type { ToolManifest } from '~/tools/types'

function haystack(tool: ToolManifest): string {
  return [tool.name, tool.description, ...(tool.aliases ?? []), ...(tool.tags ?? [])]
    .join(' ')
    .toLowerCase()
}

export function useToolSearch() {
  function search(query: string): ToolManifest[] {
    const q = query.trim().toLowerCase()
    if (!q) return [...allTools]
    const terms = q.split(/\s+/)
    return allTools.filter((tool) => {
      const text = haystack(tool)
      return terms.every((t) => text.includes(t))
    })
  }

  return { search }
}
