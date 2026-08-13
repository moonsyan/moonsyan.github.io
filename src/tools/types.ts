/**
 * 工具清单类型：与 contracts/tool-manifest.schema.json 对齐。
 * 可执行工具以仓库中的版本化清单和代码为准（《工具站架构.md》5.3）。
 */

export type ExecutionMode = 'client' | 'server' | 'async'
export type ToolStatus = 'ready' | 'wip'

export interface ToolCapabilities {
  /** 是否允许分享（仅白名单化非敏感选项） */
  share?: boolean
  /** 结果是否可下载为文件 */
  download?: boolean
  /** 是否支持文件上传 */
  fileUpload?: boolean
}

export interface ToolSeo {
  title?: string
  description?: string
}

export interface ToolManifest {
  /** 稳定且唯一的标识，发布后不可修改，只能新增别名或重定向 */
  slug: string
  name: string
  description: string
  category: string
  tags?: string[]
  aliases?: string[]
  execution: ExecutionMode
  seo?: ToolSeo
  capabilities?: ToolCapabilities
  status: ToolStatus
}

export interface ToolCategory {
  slug: string
  name: string
  description: string
}
