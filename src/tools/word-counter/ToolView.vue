<script setup lang="ts">
/**
 * 字数统计运行区（TOOL-010）。
 * 输入时即时统计 + 手动执行均可；计数规则在界面上明示（功能清单要求）。
 */
import { ref, computed } from 'vue'
import { countText, type WordStats } from './core'
import { wordCounterInputSchema, EXAMPLE_TEXT } from './schema'

const input = ref('')
const error = ref('')
const stats = ref<WordStats | null>(null)

const rows = computed(() =>
  stats.value
    ? [
        { label: '总字符数', value: stats.value.chars, note: '按 Unicode 码点计，Emoji 计 1' },
        { label: '非空白字符', value: stats.value.charsNoSpace, note: '不含空格、换行、制表符' },
        { label: '行数', value: stats.value.lines, note: '按换行拆分' },
        { label: '中文字数', value: stats.value.cjk, note: 'CJK 区间字符，每字计 1' },
        { label: '英文词数', value: stats.value.latinWords, note: '连续字母/数字计 1 词' },
        { label: '总词数', value: stats.value.words, note: '中文字数 + 英文词数' },
      ]
    : [],
)

function run() {
  const parsed = wordCounterInputSchema.safeParse({ text: input.value })
  if (!parsed.success) {
    error.value = parsed.error.errors[0]?.message ?? '输入校验失败'
    stats.value = null
    return
  }
  error.value = ''
  stats.value = countText(parsed.data.text)
}

function clearAll() {
  input.value = ''
  stats.value = null
  error.value = ''
}

function loadExample() {
  input.value = EXAMPLE_TEXT
  run()
}
</script>

<template>
  <div class="tool-view">
    <section aria-label="输入区">
      <label for="wc-input" class="field-label">待统计文本</label>
      <el-input
        id="wc-input"
        v-model="input"
        type="textarea"
        :rows="8"
        placeholder="粘贴或输入要统计的文本"
        resize="vertical"
        @input="run"
      />
      <p class="field-hint">最大 2MB；输入时即时统计，内容不会上传。</p>
    </section>

    <el-alert v-if="error" type="error" :title="error" :closable="false" show-icon />

    <section v-if="stats" aria-label="结果区" aria-live="polite">
      <div class="stats-grid">
        <div v-for="row in rows" :key="row.label" class="stat-card">
          <div class="stat-value">{{ row.value }}</div>
          <div class="stat-label">{{ row.label }}</div>
          <div class="stat-note">{{ row.note }}</div>
        </div>
      </div>
    </section>
    <div v-else class="result-empty">输入文本后自动展示统计结果</div>

    <div class="controls">
      <el-button type="primary" :disabled="!input" @click="run">重新统计</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
    </div>

    <p class="privacy-hint">🛡 本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; }
.stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
@media (max-width: 768px) { .stats-grid { grid-template-columns: repeat(2, 1fr); } }
.stat-card {
  padding: 14px 16px; background: var(--bg-card);
  border: 1px solid var(--border-light); border-radius: var(--radius-md);
}
.stat-value { font-size: 24px; font-weight: 700; color: var(--accent-deep); font-family: var(--font-mono); }
.stat-label { font-size: 13px; font-weight: 600; margin-top: 2px; }
.stat-note { font-size: 11.5px; color: var(--text-3); margin-top: 2px; }
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
