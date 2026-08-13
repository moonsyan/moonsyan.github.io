<script setup lang="ts">
/**
 * URL 编解码运行区（TOOL-003）。
 * 安全要求：只做文本转换，绝不自动访问或打开用户输入的 URL。
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { encodeUrl, decodeUrl, type UrlMode, type UrlResult } from './core'
import { urlInputSchema, EXAMPLE_TEXT, EXAMPLE_ENCODED } from './schema'

const input = ref('')
const action = ref<'encode' | 'decode'>('encode')
const mode = ref<UrlMode>('component')
const result = ref<UrlResult | null>(null)

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('url-encoding')
if (shared) {
  if (shared.action === 'encode' || shared.action === 'decode') action.value = shared.action
  if (shared.mode === 'component' || shared.mode === 'full') mode.value = shared.mode
}

function run() {
  const parsed = urlInputSchema.safeParse({ text: input.value, action: action.value, mode: mode.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value =
    action.value === 'encode'
      ? encodeUrl(parsed.data.text, parsed.data.mode)
      : decodeUrl(parsed.data.text, parsed.data.mode)
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
        <label for="url-input" class="field-label">
          {{ action === 'encode' ? '原始文本 / URL' : '已编码文本' }}
        </label>
        <el-input
          id="url-input"
          v-model="input"
          type="textarea"
          :rows="12"
          :placeholder="action === 'encode' ? '填写文本或完整 URL' : '粘贴 %XX 形式的编码文本'"
          resize="vertical"
        />
        <p class="field-hint">最大 512KB；本工具只做文本转换，不会访问你输入的任何 URL。</p>
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
        <el-radio-group v-model="mode" aria-label="编码范围">
          <el-radio-button value="component">组件</el-radio-button>
          <el-radio-button value="full">整体 URL</el-radio-button>
        </el-radio-group>
      </div>
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
.mode-group { margin-left: auto; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
</style>
