<script setup lang="ts">
/**
 * 时间戳转换运行区（TOOL-004）。
 * 双向转换：时间戳 → 日期（秒/毫秒自动或手动）；日期 → 时间戳；"现在"快捷按钮。
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { timestampToDate, dateToTimestamp, type TimestampResult, type TimeUnit } from './core'
import { timestampInputSchema, EXAMPLE_TIMESTAMP, EXAMPLE_DATE } from './schema'

const tsInput = ref('')
const unit = ref<TimeUnit>('auto')
const dateInput = ref('')
const tsResult = ref<TimestampResult | null>(null)
const dateResult = ref<TimestampResult | null>(null)

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('timestamp-converter')
if (shared) {
  if (shared.unit === 'auto' || shared.unit === 'seconds' || shared.unit === 'milliseconds') unit.value = shared.unit
}

function runTs() {
  const parsed = timestampInputSchema.safeParse({ text: tsInput.value, unit: unit.value })
  if (!parsed.success) {
    tsResult.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  tsResult.value = timestampToDate(parsed.data.text, parsed.data.unit)
}

function runDate() {
  dateResult.value = dateToTimestamp(dateInput.value)
}

function fillNow() {
  const now = Date.now()
  tsInput.value = String(now)
  unit.value = 'milliseconds'
  runTs()
}

function loadExample(kind: 'ts' | 'date') {
  if (kind === 'ts') {
    tsInput.value = EXAMPLE_TIMESTAMP
    unit.value = 'auto'
    runTs()
  } else {
    dateInput.value = EXAMPLE_DATE
    runDate()
  }
}

function clearAll() {
  tsInput.value = ''
  dateInput.value = ''
  tsResult.value = null
  dateResult.value = null
}

async function copy(text: string | undefined, label: string) {
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`已复制${label}`)
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}

function rows(res: TimestampResult | null) {
  if (!res || !res.ok) return []
  return [
    { label: `识别单位`, value: res.unit === 'seconds' ? '秒' : res.unit === 'milliseconds' ? '毫秒' : '—' },
    { label: 'ISO 8601', value: res.iso },
    { label: '本地时间', value: res.local },
    { label: 'UTC', value: res.utc },
    { label: '秒', value: String(res.seconds) },
    { label: '毫秒', value: String(res.milliseconds) },
  ]
}
</script>

<template>
  <div class="tool-view">
    <div class="run-grid">
      <!-- 时间戳 → 日期 -->
      <section aria-label="时间戳转日期">
        <label for="ts-input" class="field-label">时间戳 → 日期</label>
        <div class="input-row">
          <el-input id="ts-input" v-model="tsInput" placeholder="如 1700000000" @keyup.enter="runTs" />
          <el-select v-model="unit" aria-label="单位" style="width: 110px">
            <el-option value="auto" label="自动判断" />
            <el-option value="seconds" label="秒" />
            <el-option value="milliseconds" label="毫秒" />
          </el-select>
        </div>
        <div class="btn-row">
          <el-button type="primary" size="small" :disabled="!tsInput.trim()" @click="runTs">转换</el-button>
          <el-button size="small" @click="fillNow">现在</el-button>
          <el-button size="small" link type="primary" @click="loadExample('ts')">示例</el-button>
        </div>
        <el-alert
          v-if="tsResult && !tsResult.ok"
          type="error" :title="tsResult.message" :closable="false" show-icon
        />
        <ul v-else-if="tsResult?.ok" class="kv-list">
          <li v-for="row in rows(tsResult)" :key="row.label">
            <span class="kv-label">{{ row.label }}</span>
            <code class="kv-value">{{ row.value }}</code>
            <button class="kv-copy" :aria-label="`复制${row.label}`" @click="copy(row.value, row.label)">⧉</button>
          </li>
        </ul>
      </section>

      <!-- 日期 → 时间戳 -->
      <section aria-label="日期转时间戳">
        <label for="date-input" class="field-label">日期 → 时间戳</label>
        <div class="input-row">
          <el-input
            id="date-input" v-model="dateInput"
            placeholder="如 2026-01-01T08:00:00，留空表示当前时间"
            @keyup.enter="runDate"
          />
        </div>
        <div class="btn-row">
          <el-button type="primary" size="small" @click="runDate">转换</el-button>
          <el-button size="small" link type="primary" @click="loadExample('date')">示例</el-button>
        </div>
        <el-alert
          v-if="dateResult && !dateResult.ok"
          type="error" :title="dateResult.message" :closable="false" show-icon
        />
        <ul v-else-if="dateResult?.ok" class="kv-list">
          <li v-for="row in rows(dateResult).filter((r) => r.label !== '识别单位')" :key="row.label">
            <span class="kv-label">{{ row.label }}</span>
            <code class="kv-value">{{ row.value }}</code>
            <button class="kv-copy" :aria-label="`复制${row.label}`" @click="copy(row.value, row.label)">⧉</button>
          </li>
        </ul>
      </section>
    </div>

    <div class="controls">
      <el-button @click="clearAll">清空</el-button>
    </div>

    <p class="privacy-hint">🛡 本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.run-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 768px) { .run-grid { grid-template-columns: 1fr; } }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.input-row { display: flex; gap: 8px; }
.btn-row { display: flex; gap: 8px; align-items: center; margin: 10px 0; }
.kv-list {
  list-style: none; margin: 0; padding: 0;
  border: 1px solid var(--border-light); border-radius: var(--radius-md); overflow: hidden;
}
.kv-list li {
  display: flex; align-items: center; gap: 10px;
  padding: 7px 12px; border-bottom: 1px solid var(--border-light);
  background: var(--bg-card);
}
.kv-list li:last-child { border-bottom: none; }
.kv-label { font-size: 12px; color: var(--text-3); width: 64px; flex-shrink: 0; }
.kv-value { flex: 1; font-family: var(--font-mono); font-size: 12.5px; overflow-wrap: anywhere; }
.kv-copy {
  border: none; background: none; cursor: pointer; color: var(--text-3);
  font-size: 14px; padding: 2px 6px; border-radius: var(--radius-sm);
}
.kv-copy:hover { color: var(--accent-deep); background: var(--accent-tint); }
.controls { display: flex; gap: 8px; }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
