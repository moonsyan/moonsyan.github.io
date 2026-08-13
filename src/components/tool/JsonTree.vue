<script setup lang="ts">
/**
 * JSON 树形视图（工具体验升级）：把解析后的 JSON 渲染为可折叠/展开的语法高亮树。
 * 交互对齐主流 JSON 工具：行号、折叠箭头、展开层级控制、节点 hover 复制。
 * 实现要点：扁平化渲染（单层 v-for + 缩进），折叠只触发一次重算，大 JSON 下仍流畅；
 * 超过节点上限时如实降级为提示（内容红线：不渲染半棵树）。
 */
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

export type JsonValue = string | number | boolean | null | JsonValue[] | { [k: string]: JsonValue }

interface Row {
  path: string // 唯一 key（path + '/' + 序号）
  kind: 'start' | 'end' | 'leaf'
  depth: number
  key: string | number | null // null = 根
  value: JsonValue | null // end 行为 null
  isObj: boolean
  childCount: number
  collapsed: boolean // start 行是否折叠
  open: string // { 或 [
  close: string // } 或 ]
}

const props = defineProps<{
  data: JsonValue
  /** 默认展开层数：1 = 仅根，2 = 根 + 一层子级……默认 3 */
  defaultDepth?: number
}>()

/** 节点总数上限：超出后停止渲染并提示（大 JSON 保护） */
const LARGE_LIMIT = 15000

const isObj = (v: JsonValue): v is Record<string, JsonValue> =>
  v !== null && typeof v === 'object' && !Array.isArray(v)
const isArr = (v: JsonValue): v is JsonValue[] => Array.isArray(v)
const isCollapsible = (v: JsonValue) => isObj(v) || isArr(v)

/** 生成折叠集合：深度 >= defaultDepth 的容器默认折叠 */
function collapsedFor(depth: number): Set<string> {
  const s = new Set<string>()
  const mark = (v: JsonValue, d: number, p: string) => {
    if (isCollapsible(v)) {
      if (d >= depth) s.add(p)
      if (isObj(v)) for (const k of Object.keys(v)) mark(v[k], d + 1, `${p}/${k}`)
      else for (let i = 0; i < v.length; i++) mark(v[i], d + 1, `${p}/${i}`)
    }
  }
  mark(props.data, 0, 'root')
  return s
}

const collapsed = ref<Set<string>>(collapsedFor(props.defaultDepth ?? 3))

const rows = computed<Row[]>(() => {
  const out: Row[] = []
  let count = 0
  let tooLarge = false
  const walk = (v: JsonValue, key: string | number | null, d: number, p: string) => {
    if (tooLarge) return
    count++
    if (count > LARGE_LIMIT) {
      tooLarge = true
      return
    }
    if (isCollapsible(v)) {
      const o = isObj(v)
      const open = o ? '{' : '['
      const close = o ? '}' : ']'
      const col = collapsed.value.has(p)
      out.push({ path: p, kind: 'start', depth: d, key, value: v, isObj: o, childCount: o ? Object.keys(v).length : v.length, collapsed: col, open, close })
      if (!col) {
        if (o) for (const k of Object.keys(v)) walk(v[k], k, d + 1, `${p}/${k}`)
        else for (let i = 0; i < v.length; i++) walk(v[i], i, d + 1, `${p}/${i}`)
        out.push({ path: `${p}/end`, kind: 'end', depth: d, key: null, value: null, isObj: o, childCount: 0, collapsed: false, open, close })
      }
    } else {
      out.push({ path: p, kind: 'leaf', depth: d, key, value: v, isObj: false, childCount: 0, collapsed: false, open: '', close: '' })
    }
  }
  walk(props.data, null, 0, 'root')
  return tooLarge ? [] : out
})

const tooLarge = computed(() => {
  let count = 0
  let big = false
  const walk = (v: JsonValue) => {
    if (big) return
    count++
    if (count > LARGE_LIMIT) { big = true; return }
    if (isObj(v)) for (const k of Object.keys(v)) walk(v[k])
    else if (isArr(v)) for (let i = 0; i < v.length; i++) walk(v[i])
  }
  walk(props.data)
  return big
})

const totalCount = computed(() => {
  let count = 0
  const walk = (v: JsonValue) => {
    count++
    if (isObj(v)) for (const k of Object.keys(v)) walk(v[k])
    else if (isArr(v)) for (let i = 0; i < v.length; i++) walk(v[i])
  }
  walk(props.data)
  return count
})

function toggle(path: string) {
  const s = new Set(collapsed.value)
  if (s.has(path)) s.delete(path)
  else s.add(path)
  collapsed.value = s
}

function expandTo(depth: number) {
  collapsed.value = collapsedFor(depth)
}
function expandAll() {
  collapsed.value = new Set()
}
function collapseAll() {
  collapsed.value = collapsedFor(0)
}

function scalarText(v: JsonValue): string {
  if (typeof v === 'string') return JSON.stringify(v) // 自动转义引号与换行
  return String(v)
}
function scalarClass(v: JsonValue): string {
  if (typeof v === 'string') return 's-str'
  if (typeof v === 'number') return 's-num'
  if (typeof v === 'boolean') return 's-bool'
  return 's-null'
}

async function copyValue(v: JsonValue) {
  try {
    await navigator.clipboard.writeText(typeof v === 'string' ? v : String(v))
    ElMessage.success('已复制该值')
  } catch {
    ElMessage.error('复制失败，请手动选择复制')
  }
}

/** 行缩进：行号列 44px 固定 + 每层 18px */
function pad(depth: number) {
  return { paddingLeft: `${44 + depth * 18}px` }
}
</script>

<template>
  <div class="jt">
    <div class="jt-toolbar">
      <button class="jt-tb-btn" @click="expandAll">展开全部</button>
      <button class="jt-tb-btn" @click="expandTo(2)">展开 2 层</button>
      <button class="jt-tb-btn" @click="expandTo(3)">展开 3 层</button>
      <button class="jt-tb-btn" @click="collapseAll">折叠全部</button>
      <span class="jt-count">{{ totalCount }} 个节点</span>
    </div>

    <div v-if="tooLarge" class="jt-too-large">
      内容节点数超过 15,000，已暂停树形渲染（避免页面卡顿）。
      可切换「压缩」模式复制文本结果。
    </div>

    <div v-else class="jt-body">
      <template v-for="(row, i) in rows" :key="row.path">
        <!-- 闭合行 -->
        <div v-if="row.kind === 'end'" class="jt-row jt-end" :style="pad(row.depth)">
          <span class="jt-num">{{ i + 1 }}</span>
          <span class="jt-close">{{ row.close }}</span>
        </div>
        <!-- 容器行（对象/数组） -->
        <div
          v-else-if="row.kind === 'start'"
          class="jt-row"
          :class="{ collapsed: row.collapsed }"
          :style="pad(row.depth)"
        >
          <span class="jt-num">{{ i + 1 }}</span>
          <button
            class="jt-toggle"
            :aria-label="row.collapsed ? '展开该节点' : '折叠该节点'"
            @click="toggle(row.path)"
          >
            <svg v-if="row.collapsed" viewBox="0 0 12 12" width="8" height="8" aria-hidden="true"><path d="M3 1.5v9l7-4.5z" fill="currentColor" /></svg>
            <svg v-else viewBox="0 0 12 12" width="8" height="8" aria-hidden="true"><path d="M1.5 3h9l-4.5 7z" fill="currentColor" /></svg>
          </button>
          <span v-if="row.key !== null" class="jt-key">{{ row.key }}<span class="jt-colon">: </span></span>
          <span class="jt-brace">{{ row.open }}</span>
          <!-- 折叠时：内联省略号 + 项数 + 闭合符号；展开时闭合符号由底部 end 行独占，行尾不重复 -->
          <button v-if="row.collapsed" class="jt-ellipsis" @click="toggle(row.path)">
            … {{ row.childCount }} 项
          </button>
          <span v-if="row.collapsed" class="jt-brace">{{ row.close }}</span>
        </div>
        <!-- 标量行 -->
        <div v-else class="jt-row" :style="pad(row.depth)">
          <span class="jt-num">{{ i + 1 }}</span>
          <span class="jt-gap" />
          <span v-if="row.key !== null" class="jt-key">{{ row.key }}<span class="jt-colon">: </span></span>
          <span class="jt-scalar" :class="scalarClass(row.value!)">{{ scalarText(row.value!) }}</span>
          <button class="jt-copy" @click="copyValue(row.value!)">复制</button>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.jt {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.jt-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.jt-tb-btn {
  padding: 4px 13px;
  font-size: 12px;
  font-family: inherit;
  color: var(--text-2);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 999px;
  cursor: pointer;
  transition: all var(--transition);
}
.jt-tb-btn:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
  background: var(--accent-tint);
}
.jt-count {
  margin-left: auto;
  font-size: 12px;
  color: var(--text-3);
}
.jt-too-large {
  padding: 28px 16px;
  text-align: center;
  font-size: 13px;
  color: var(--text-3);
  background: var(--bg-soft);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
}
.jt-body {
  max-height: 760px;
  overflow: auto;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 13px;
  line-height: 1.95;
  padding: 8px 0;
}
.jt-row {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  padding-right: 12px;
  white-space: pre;
  transition: background var(--transition);
}
.jt-row:hover {
  background: var(--bg-hover);
}
.jt-num {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 44px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 12px;
  font-size: 11px;
  color: var(--text-3);
  user-select: none;
}
.jt-toggle {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 5px;
  background: none;
  color: var(--text-3);
  cursor: pointer;
  transition: all var(--transition);
}
.jt-toggle:hover {
  color: var(--accent-deep);
  background: var(--accent-tint);
}
.jt-gap {
  width: 18px;
  flex-shrink: 0;
}
.jt-key {
  color: var(--json-key);
}
.jt-colon {
  color: var(--text-3);
}
.jt-brace {
  color: var(--text-2);
}
.jt-ellipsis {
  border: none;
  background: none;
  cursor: pointer;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent-deep);
  padding: 0 2px;
  border-radius: 5px;
}
.jt-ellipsis:hover {
  background: var(--accent-tint);
}
.jt-scalar {
  color: var(--text-1);
}
.jt-scalar.s-str {
  color: var(--json-str);
}
.jt-scalar.s-num {
  color: var(--json-num);
}
.jt-scalar.s-bool {
  color: var(--json-bool);
}
.jt-scalar.s-null {
  color: var(--json-null);
}
.jt-close {
  color: var(--text-2);
}
.jt-copy {
  margin-left: auto;
  padding: 1px 10px;
  font-size: 11px;
  font-family: inherit;
  color: var(--text-3);
  background: transparent;
  border: 1px solid transparent;
  border-radius: 999px;
  cursor: pointer;
  opacity: 0;
  transition: all var(--transition);
  flex-shrink: 0;
}
.jt-row:hover .jt-copy,
.jt-copy:focus-visible {
  opacity: 1;
}
.jt-copy:hover {
  color: var(--accent-deep);
  border-color: var(--accent);
  background: var(--accent-tint);
}
@media (hover: none) {
  .jt-copy {
    opacity: 1;
  }
}
</style>
