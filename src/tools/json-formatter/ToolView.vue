<script setup lang="ts">
/**
 * JSON 格式化工具运行区。
 * 遵循统一工具运行体验（RUN-001 ~ RUN-007）：
 * 输入说明与限制、执行控制、结果状态、复制下载、隐私提示、示例数据、不持久化正文。
 */
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { processJson, type JsonFormatMode, type JsonFormatResult } from './core'
import { jsonFormatterInputSchema, EXAMPLE_VALID, EXAMPLE_INVALID } from './schema'
import JsonTree, { type JsonValue } from '~/components/tool/JsonTree.vue'

const input = ref('')
const mode = ref<JsonFormatMode>('format')
const indent = ref(2)
const result = ref<JsonFormatResult | null>(null)

// 格式化模式的结果转为树形数据（供 JsonTree 可折叠渲染）
const treeData = computed<JsonValue | null>(() => {
  if (mode.value !== 'format' || !result.value?.ok || !result.value.output) return null
  try {
    return JSON.parse(result.value.output) as JsonValue
  } catch {
    return null
  }
})

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('json-formatter')
if (shared) {
  if (shared.mode === 'format' || shared.mode === 'compress' || shared.mode === 'validate') mode.value = shared.mode
  if (typeof shared.indent === 'number' && shared.indent >= 1 && shared.indent <= 8) indent.value = shared.indent
}

const hasResult = computed(() => result.value !== null)

// 每次执行自增：作为 JsonTree 的 key，新结果自动重置折叠状态
const runId = ref(0)

function run() {
  runId.value++
  const parsed = jsonFormatterInputSchema.safeParse({ text: input.value, mode: mode.value, indent: indent.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value = processJson(parsed.data.text, parsed.data.mode, parsed.data.indent)
}

function clearAll() {
  input.value = ''
  result.value = null
}

function loadExample(kind: 'valid' | 'invalid') {
  input.value = kind === 'valid' ? EXAMPLE_VALID : EXAMPLE_INVALID
  result.value = null
}

async function copyResult() {
  if (!result.value?.output) return
  try {
    await navigator.clipboard.writeText(result.value.output)
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

function downloadResult() {
  if (!result.value?.output) return
  const blob = new Blob([result.value.output], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'result.json'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tool-view">
    <div class="run-grid">
      <!-- 输入区：名称、格式说明与长度限制（RUN-001） -->
      <section aria-label="输入区">
        <label for="json-input" class="field-label">JSON 文本</label>
        <el-input
          id="json-input"
          v-model="input"
          type="textarea"
          :rows="16"
          placeholder='粘贴 JSON，例如 {"name": "示例"}'
          resize="vertical"
        />
        <p class="field-hint">最大 5MB；内容仅在当前页面内存中处理，不会上传。</p>
      </section>

      <!-- 结果区：成功 / 失败 / 空状态（RUN-003） -->
      <section aria-label="结果区" aria-live="polite">
        <div class="result-head">
          <span class="field-label">结果</span>
          <div v-if="hasResult && result?.ok && mode !== 'validate'" class="result-actions">
            <el-button size="small" @click="copyResult">复制</el-button>
            <el-button size="small" @click="downloadResult">下载 .json</el-button>
          </div>
        </div>
        <el-alert
          v-if="result && !result.ok"
          type="error"
          :title="result.message"
          :closable="false"
          show-icon
        />
        <el-alert
          v-else-if="result && result.ok && mode === 'validate'"
          type="success"
          title="JSON 语法正确"
          :closable="false"
          show-icon
        />
        <!-- 格式化模式：可折叠的树形结果（嵌套结构可折叠/展开） -->
        <JsonTree v-else-if="treeData" :data="treeData" :key="runId" />
        <pre v-else-if="result?.output" class="result-pre">{{ result.output }}</pre>
        <div v-else class="result-empty">执行后在此展示结果</div>
      </section>
    </div>

    <!-- 执行控制：执行、清空、重置示例；执行中禁止重复提交（RUN-002、RUN-006） -->
    <div class="controls">
      <el-button type="primary" :disabled="!input.trim()" @click="run">执行</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample('valid')">加载示例</el-button>
      <el-button link type="primary" @click="loadExample('invalid')">加载错误用例</el-button>

      <div class="mode-group" role="group" aria-label="处理模式">
        <el-radio-group v-model="mode">
          <el-radio-button value="format">格式化</el-radio-button>
          <el-radio-button value="compress">压缩</el-radio-button>
          <el-radio-button value="validate">校验</el-radio-button>
        </el-radio-group>
        <label class="indent-label">
          缩进
          <el-select v-model="indent" :disabled="mode !== 'format'" style="width: 76px">
            <el-option v-for="n in 8" :key="n" :value="n" :label="`${n} 空格`" />
          </el-select>
        </label>
      </div>
    </div>

    <!-- 隐私提示（RUN-005） -->
    <p class="privacy-hint">本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.run-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 20px;
}
@media (max-width: 768px) {
  .run-grid {
    grid-template-columns: 1fr;
  }
}
.field-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}
.field-hint {
  font-size: 12px;
  color: var(--text-3);
  margin: 6px 0 0;
}
.result-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.result-actions {
  display: flex;
  gap: 8px;
}
.result-pre {
  margin: 0;
  padding: 14px;
  max-height: 640px;
  overflow: auto;
  background: var(--bg-soft);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  font-family: var(--font-mono);
  font-size: 13px;
  white-space: pre-wrap;
  word-break: break-all;
}
.result-empty {
  padding: 32px 14px;
  text-align: center;
  color: var(--text-3);
  font-size: 13px;
  background: var(--bg-soft);
  border: 1px dashed var(--border);
  border-radius: var(--radius-md);
}
.controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.mode-group {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}
.indent-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-2);
}
</style>
