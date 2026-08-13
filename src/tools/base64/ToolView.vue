<script setup lang="ts">
/**
 * Base64 编解码运行区（TOOL-002）。
 * 统一运行体验：输入说明与限制（RUN-001）、执行控制（RUN-002）、
 * 结果状态（RUN-003）、复制（RUN-004）、隐私提示（RUN-005）、示例（RUN-006）。
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { encodeBase64, decodeBase64, type Base64Mode, type Base64Result } from './core'
import { base64InputSchema, EXAMPLE_TEXT, EXAMPLE_ENCODED } from './schema'

const input = ref('')
const action = ref<'encode' | 'decode'>('encode')
const mode = ref<Base64Mode>('standard')
const result = ref<Base64Result | null>(null)

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('base64')
if (shared) {
  if (shared.action === 'encode' || shared.action === 'decode') action.value = shared.action
  if (shared.mode === 'standard' || shared.mode === 'urlsafe') mode.value = shared.mode
}

function run() {
  const parsed = base64InputSchema.safeParse({ text: input.value, action: action.value, mode: mode.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value =
    action.value === 'encode'
      ? encodeBase64(parsed.data.text, parsed.data.mode)
      : decodeBase64(parsed.data.text, parsed.data.mode)
}

function clearAll() {
  input.value = ''
  result.value = null
}

function loadExample() {
  input.value = action.value === 'encode' ? EXAMPLE_TEXT : EXAMPLE_ENCODED
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
        <label for="b64-input" class="field-label">
          {{ action === 'encode' ? '原始文本' : 'Base64 文本' }}
        </label>
        <el-input
          id="b64-input"
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="action === 'encode' ? '填写要编码的文本，支持中文' : '粘贴 Base64 文本'"
          resize="vertical"
        />
        <p class="field-hint">最大 1MB；内容仅在当前页面内存中处理，不会上传。</p>
      </section>

      <section aria-label="结果区" aria-live="polite">
        <div class="result-head">
          <span class="field-label">结果</span>
          <el-button v-if="result?.ok" size="small" @click="copyResult">复制</el-button>
        </div>
        <el-alert
          v-if="result && !result.ok"
          type="error"
          :title="result.message"
          :closable="false"
          show-icon
        />
        <pre v-else-if="result?.output" class="result-pre">{{ result.output }}</pre>
        <div v-else class="result-empty">执行后在此展示结果</div>
      </section>
    </div>

    <div class="controls">
      <el-button type="primary" :disabled="!input.trim()" @click="run">执行</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>

      <div class="mode-group" role="group" aria-label="操作选项">
        <el-radio-group v-model="action" aria-label="操作方向">
          <el-radio-button value="encode">编码</el-radio-button>
          <el-radio-button value="decode">解码</el-radio-button>
        </el-radio-group>
        <el-radio-group v-model="mode" aria-label="字母表">
          <el-radio-button value="standard">标准</el-radio-button>
          <el-radio-button value="urlsafe">URL Safe</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <p class="privacy-hint">🛡 本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
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
  margin: 0; padding: 14px; max-height: 320px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono);
  font-size: 13px; white-space: pre-wrap; word-break: break-all;
}
.result-empty {
  padding: 32px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mode-group { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
