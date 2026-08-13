<script setup lang="ts">
/**
 * UUID 生成器运行区（TOOL-005）。
 * 安全随机源：crypto.getRandomValues；批量上限 100；结果可复制与下载（capabilities.download）。
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { generateUuids, type UuidVersion } from './core'
import { uuidInputSchema } from './schema'

const count = ref(5)
const version = ref<UuidVersion>('v4')
const results = ref<string[]>([])
const error = ref('')

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('uuid-generator')
if (shared) {
  if (typeof shared.count === 'number' && shared.count >= 1 && shared.count <= 100) count.value = shared.count
  if (shared.version === 'v4' || shared.version === 'v7') version.value = shared.version
}

function run() {
  const parsed = uuidInputSchema.safeParse({ count: count.value, version: version.value })
  if (!parsed.success) {
    error.value = parsed.error.errors[0]?.message ?? '输入校验失败'
    results.value = []
    return
  }
  const res = generateUuids(parsed.data.count, parsed.data.version)
  error.value = res.ok ? '' : (res.message ?? '生成失败')
  results.value = res.output ?? []
}

function clearAll() {
  results.value = []
  error.value = ''
}

async function copyAll() {
  if (!results.value.length) return
  try {
    await navigator.clipboard.writeText(results.value.join('\n'))
    ElMessage.success(`已复制 ${results.value.length} 个 UUID`)
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

function downloadAll() {
  if (!results.value.length) return
  const blob = new Blob([results.value.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'uuids.txt'
  link.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="tool-view">
    <section aria-label="生成选项" class="options">
      <label class="option-label">
        数量（1-100）
        <el-input-number v-model="count" :min="1" :max="100" :step="1" />
      </label>
      <el-radio-group v-model="version" aria-label="UUID 版本">
        <el-radio-button value="v4">v4（随机）</el-radio-button>
        <el-radio-button value="v7">v7（时间有序）</el-radio-button>
      </el-radio-group>
      <el-button type="primary" @click="run">生成</el-button>
      <el-button @click="clearAll">清空</el-button>
    </section>

    <el-alert v-if="error" type="error" :title="error" :closable="false" show-icon />

    <section aria-label="结果区" aria-live="polite">
      <div v-if="results.length" class="result-head">
        <span class="field-label">已生成 {{ results.length }} 个</span>
        <div>
          <el-button size="small" @click="copyAll">复制全部</el-button>
          <el-button size="small" @click="downloadAll">下载 .txt</el-button>
        </div>
      </div>
      <pre v-if="results.length" class="result-pre">{{ results.join('\n') }}</pre>
      <div v-else-if="!error" class="result-empty">点击"生成"后在此展示结果</div>
    </section>

    <p class="privacy-hint">🛡 本地处理：使用浏览器安全随机源生成，不经过任何服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.options { display: flex; align-items: center; gap: 14px; flex-wrap: wrap; }
.option-label { display: flex; align-items: center; gap: 8px; font-size: 13px; color: var(--text-2); }
.field-label { font-size: 13px; font-weight: 600; }
.result-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.result-pre {
  margin: 0; padding: 14px; max-height: 320px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 13px;
}
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
