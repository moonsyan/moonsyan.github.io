<script setup lang="ts">
/**
 * JWT 解析运行区（TOOL-007）。
 * 安全文案必须保留：不验证签名 + 不要粘贴生产令牌。
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { parseJwt, type JwtParseResult } from './core'
import { jwtInputSchema, EXAMPLE_JWT } from './schema'

const input = ref('')
const result = ref<JwtParseResult | null>(null)

function run() {
  const parsed = jwtInputSchema.safeParse({ text: input.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value = parseJwt(parsed.data.text)
}

function clearAll() {
  input.value = ''
  result.value = null
}

function loadExample() {
  input.value = EXAMPLE_JWT
  run()
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success('已复制')
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

function pretty(value: unknown): string {
  return JSON.stringify(value, null, 2)
}
</script>

<template>
  <div class="tool-view">
    <el-alert
      type="warning"
      title="本工具只解码 Header 与 Payload，不验证签名；请勿粘贴生产环境的真实令牌"
      :closable="false"
      show-icon
    />

    <section aria-label="输入区">
      <label for="jwt-input" class="field-label">JWT 令牌</label>
      <el-input
        id="jwt-input"
        v-model="input"
        type="textarea"
        :rows="8"
        placeholder="粘贴 JWT，格式为 xxx.yyy.zzz 三段"
        resize="vertical"
      />
      <p class="field-hint">最大 64KB；内容仅在当前页面内存中处理，不会上传。</p>
    </section>

    <section aria-label="结果区" aria-live="polite">
      <el-alert
        v-if="result && !result.ok"
        type="error" :title="result.message" :closable="false" show-icon
      />
      <template v-else-if="result?.ok">
        <div v-if="result.expiresAt" class="exp-row">
          <span class="field-label">过期时间（exp）</span>
          <el-tag :type="result.expired ? 'danger' : 'success'">
            {{ result.expiresAt }} {{ result.expired ? '· 已过期' : '· 未过期' }}
          </el-tag>
        </div>
        <div class="run-grid">
          <div>
            <div class="result-head">
              <span class="field-label">Header</span>
              <el-button size="small" @click="copy(pretty(result.header))">复制</el-button>
            </div>
            <pre class="result-pre">{{ pretty(result.header) }}</pre>
          </div>
          <div>
            <div class="result-head">
              <span class="field-label">Payload</span>
              <el-button size="small" @click="copy(pretty(result.payload))">复制</el-button>
            </div>
            <pre class="result-pre">{{ pretty(result.payload) }}</pre>
          </div>
        </div>
      </template>
      <div v-else class="result-empty">执行后在此展示解析结果</div>
    </section>

    <div class="controls">
      <el-button type="primary" :disabled="!input.trim()" @click="run">解析</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
    </div>

    <p class="privacy-hint">本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; }
.exp-row { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
.exp-row .field-label { margin-bottom: 0; }
.run-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) { .run-grid { grid-template-columns: 1fr; } }
.result-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.result-pre {
  margin: 0; padding: 14px; max-height: 440px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 13px;
}
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>
