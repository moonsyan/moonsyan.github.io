<script setup lang="ts">
/** JSON/CSV 转换运行区（TOOL-014）。嵌套展开策略必须显式选择，不静默丢字段。 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { jsonToCsv, csvToJson, type CsvResult } from './core'
import { jsonCsvInputSchema, EXAMPLE_JSON } from './schema'

const input = ref('')
const action = ref<'json2csv' | 'csv2json'>('json2csv')
const delimiter = ref<',' | '\t' | ';'>(',')
const hasHeader = ref(true)
const nested = ref<'flatten' | 'stringify'>('flatten')
const result = ref<CsvResult | null>(null)

function run() {
  const parsed = jsonCsvInputSchema.safeParse({
    text: input.value, action: action.value,
    delimiter: delimiter.value, hasHeader: hasHeader.value, nested: nested.value,
  })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value =
    action.value === 'json2csv'
      ? jsonToCsv(parsed.data.text, { delimiter: parsed.data.delimiter, quote: 'minimal', nested: parsed.data.nested })
      : csvToJson(parsed.data.text, parsed.data.delimiter, parsed.data.hasHeader)
}

function clearAll() {
  input.value = ''
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
  const ext = action.value === 'json2csv' ? 'csv' : 'json'
  const blob = new Blob([result.value.output], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `result.${ext}`
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tool-view">
    <div class="run-grid">
      <section aria-label="输入区">
        <label for="jc-input" class="field-label">{{ action === 'json2csv' ? 'JSON 数组' : 'CSV 文本' }}</label>
        <el-input id="jc-input" v-model="input" type="textarea" :rows="12"
          :placeholder="action === 'json2csv' ? '粘贴 JSON 对象数组' : '粘贴 CSV 文本'" resize="vertical" />
      </section>
      <section aria-label="结果区" aria-live="polite">
        <div class="result-head">
          <span class="field-label">结果</span>
          <div v-if="result?.ok">
            <el-button size="small" @click="copyResult">复制</el-button>
            <el-button size="small" @click="downloadResult">下载</el-button>
          </div>
        </div>
        <el-alert v-if="result && !result.ok" type="error" :title="result.message" :closable="false" show-icon />
        <pre v-else-if="result?.output" class="result-pre">{{ result.output }}</pre>
        <div v-else class="result-empty">执行后在此展示结果</div>
      </section>
    </div>

    <div class="controls">
      <el-radio-group v-model="action" aria-label="转换方向">
        <el-radio-button value="json2csv">JSON → CSV</el-radio-button>
        <el-radio-button value="csv2json">CSV → JSON</el-radio-button>
      </el-radio-group>
      <el-select v-model="delimiter" style="width: 130px" aria-label="分隔符">
        <el-option value="," label="逗号 ," />
        <el-option value=";" label="分号 ;" />
        <el-option value="&#9;" label="制表符 Tab" />
      </el-select>
      <el-checkbox v-if="action === 'csv2json'" v-model="hasHeader">首行为表头</el-checkbox>
      <el-select v-if="action === 'json2csv'" v-model="nested" style="width: 180px" aria-label="嵌套展开策略">
        <el-option value="flatten" label="嵌套：点路径展开" />
        <el-option value="stringify" label="嵌套：JSON 字符串" />
      </el-select>
      <el-button type="primary" :disabled="!input.trim()" @click="run">执行</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="input = EXAMPLE_JSON">加载示例</el-button>
    </div>
    <p class="privacy-hint">本地处理：列头取所有记录键的并集，嵌套字段按所选策略展开，不会静默丢字段。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.run-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) { .run-grid { grid-template-columns: 1fr; } }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.result-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.result-pre {
  margin: 0; padding: 14px; max-height: 460px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono);
  font-size: 13px; white-space: pre-wrap; word-break: break-all;
}
.result-empty {
  padding: 32px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>
