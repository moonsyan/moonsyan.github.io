<script setup lang="ts">
/** Unicode 转换运行区（TOOL-013）。 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { textToUnicode, unicodeToText, type UnicodeResult } from './core'
import { unicodeInputSchema, EXAMPLE_TEXT, EXAMPLE_ESCAPED } from './schema'

const input = ref('')
const action = ref<'encode' | 'decode'>('encode')
const result = ref<UnicodeResult | null>(null)

function run() {
  const parsed = unicodeInputSchema.safeParse({ text: input.value, action: action.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value = action.value === 'encode' ? textToUnicode(parsed.data.text) : unicodeToText(parsed.data.text)
}

function clearAll() {
  input.value = ''
  result.value = null
}

function loadExample() {
  input.value = action.value === 'encode' ? EXAMPLE_TEXT : EXAMPLE_ESCAPED
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
</script>

<template>
  <div class="tool-view">
    <div class="run-grid">
      <section aria-label="输入区">
        <label for="uni-input" class="field-label">{{ action === 'encode' ? '原始文本' : '转义文本' }}</label>
        <el-input
          id="uni-input" v-model="input" type="textarea" :rows="12"
          :placeholder="action === 'encode' ? '填写要转换的文本，支持 Emoji' : '粘贴 \\uXXXX 或 \\u{...} 形式的转义文本'"
          resize="vertical"
        />
        <p class="field-hint">最大 1MB；Emoji 按 UTF-16 代理对输出，兼容性最好。</p>
      </section>
      <section aria-label="结果区" aria-live="polite">
        <div class="result-head">
          <span class="field-label">结果</span>
          <el-button v-if="result?.ok" size="small" @click="copyResult">复制</el-button>
        </div>
        <el-alert v-if="result && !result.ok" type="error" :title="result.message" :closable="false" show-icon />
        <pre v-else-if="result?.output" class="result-pre">{{ result.output }}</pre>
        <div v-else class="result-empty">执行后在此展示结果</div>
      </section>
    </div>
    <div class="controls">
      <el-button type="primary" :disabled="!input.trim()" @click="run">执行</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
      <el-radio-group v-model="action" class="mode-group" aria-label="转换方向">
        <el-radio-button value="encode">文本 → \u 转义</el-radio-button>
        <el-radio-button value="decode">转义 → 文本</el-radio-button>
      </el-radio-group>
    </div>
    <p class="privacy-hint">本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.run-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) { .run-grid { grid-template-columns: 1fr; } }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; }
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
.mode-group { margin-left: auto; }
</style>
