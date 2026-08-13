<script setup lang="ts">
/** 大小写转换运行区（TOOL-015）。分词规则在界面上明示。 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { convertCase, type CaseStyle, type CaseResult } from './core'
import { caseInputSchema, EXAMPLE_TEXT } from './schema'

const input = ref('')
const style = ref<CaseStyle>('camel')
const result = ref<CaseResult | null>(null)

const STYLES: Array<{ value: CaseStyle; label: string }> = [
  { value: 'upper', label: '全大写 UPPER' },
  { value: 'lower', label: '全小写 lower' },
  { value: 'camel', label: '小驼峰 camelCase' },
  { value: 'pascal', label: '大驼峰 PascalCase' },
  { value: 'snake', label: '下划线 snake_case' },
  { value: 'kebab', label: '中划线 kebab-case' },
]

function run() {
  const parsed = caseInputSchema.safeParse({ text: input.value, style: style.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value = convertCase(parsed.data.text, parsed.data.style)
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
</script>

<template>
  <div class="tool-view">
    <section aria-label="输入区">
      <label for="case-input" class="field-label">原始文本</label>
      <el-input id="case-input" v-model="input" type="textarea" :rows="8"
        placeholder="如 user_name for HTTPServer demo" resize="vertical" />
      <p class="field-hint">分词规则：空格/中划线/下划线为分隔符；驼峰边界自动切分；连续大写视为一个词（HTTPServer → http server）。</p>
    </section>

    <section aria-label="结果区" aria-live="polite">
      <div class="result-head">
        <span class="field-label">结果</span>
        <el-button v-if="result?.ok" size="small" @click="copyResult">复制</el-button>
      </div>
      <el-alert v-if="result && !result.ok" type="error" :title="result.message" :closable="false" show-icon />
      <pre v-else-if="result?.output" class="result-pre">{{ result.output }}</pre>
      <div v-else class="result-empty">选择目标风格后点击"转换"</div>
    </section>

    <div class="controls">
      <el-select v-model="style" style="width: 200px" aria-label="目标风格">
        <el-option v-for="s in STYLES" :key="s.value" :value="s.value" :label="s.label" />
      </el-select>
      <el-button type="primary" :disabled="!input.trim()" @click="run">转换</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="input = EXAMPLE_TEXT">加载示例</el-button>
    </div>
    <p class="privacy-hint">本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; line-height: 1.6; }
.result-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.result-pre {
  margin: 0; padding: 14px; max-height: 400px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono);
  font-size: 13px; white-space: pre-wrap; word-break: break-all;
}
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>
