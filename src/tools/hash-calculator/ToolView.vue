<script setup lang="ts">
/**
 * 哈希计算运行区（TOOL-006）。
 * SHA-1 选择时显示"仅限兼容校验"警示；结果可复制。
 */
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { hashText, type HashAlgorithm, type HashResult } from './core'
import { hashInputSchema, EXAMPLE_TEXT } from './schema'

const input = ref('')
const algorithm = ref<HashAlgorithm>('SHA-256')
const result = ref<HashResult | null>(null)
const running = ref(false)

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('hash-calculator')
if (shared) {
  if (shared.algorithm === 'SHA-1' || shared.algorithm === 'SHA-256' || shared.algorithm === 'SHA-512') {
    algorithm.value = shared.algorithm
  }
}

const showSha1Warning = computed(() => algorithm.value === 'SHA-1')

async function run() {
  const parsed = hashInputSchema.safeParse({ text: input.value, algorithm: algorithm.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  running.value = true // 执行中禁止重复提交（RUN-002）
  try {
    result.value = await hashText(parsed.data.text, parsed.data.algorithm)
  } finally {
    running.value = false
  }
}

function clearAll() {
  input.value = ''
  result.value = null
}

function loadExample() {
  input.value = EXAMPLE_TEXT
  void run()
}

async function copyResult() {
  if (!result.value?.output) return
  try {
    await navigator.clipboard.writeText(result.value.output)
    ElMessage.success('已复制摘要')
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}
</script>

<template>
  <div class="tool-view">
    <section aria-label="输入区">
      <label for="hash-input" class="field-label">待计算文本</label>
      <el-input
        id="hash-input"
        v-model="input"
        type="textarea"
        :rows="10"
        placeholder="粘贴要计算摘要的文本"
        resize="vertical"
      />
      <p class="field-hint">最大 5MB；内容仅在当前页面内存中处理，不会上传。</p>
    </section>

    <el-alert
      v-if="showSha1Warning"
      type="warning"
      title="SHA-1 仅用于兼容校验（如旧系统文件比对），不用于密码或安全场景"
      :closable="false"
      show-icon
    />

    <section aria-label="结果区" aria-live="polite">
      <div class="result-head">
        <span class="field-label">{{ algorithm }} 摘要</span>
        <el-button v-if="result?.ok" size="small" @click="copyResult">复制</el-button>
      </div>
      <el-alert
        v-if="result && !result.ok"
        type="error" :title="result.message" :closable="false" show-icon
      />
      <pre v-else-if="result?.output" class="result-pre">{{ result.output }}</pre>
      <div v-else class="result-empty">执行后在此展示摘要（小写十六进制）</div>
    </section>

    <div class="controls">
      <el-button type="primary" :disabled="!input || running" :loading="running" @click="run">
        执行
      </el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
      <el-radio-group v-model="algorithm" class="mode-group" aria-label="算法选择">
        <el-radio-button value="SHA-256">SHA-256</el-radio-button>
        <el-radio-button value="SHA-512">SHA-512</el-radio-button>
        <el-radio-button value="SHA-1">SHA-1（兼容）</el-radio-button>
      </el-radio-group>
    </div>

    <p class="privacy-hint">本地处理：基于浏览器 Web Crypto 计算，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; }
.result-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.result-pre {
  margin: 0; padding: 14px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono);
  font-size: 13px; white-space: pre-wrap; word-break: break-all;
}
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mode-group { margin-left: auto; }
</style>
