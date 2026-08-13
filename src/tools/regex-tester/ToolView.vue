<script setup lang="ts">
/**
 * 正则表达式测试运行区（TOOL-008）。
 * 执行通过 Web Worker + 2 秒超时（runner.ts），灾难性回溯不会冻结页面；
 * 执行期间按钮进入 loading，禁止重复提交（RUN-002）。
 */
import { ref } from 'vue'
import { validateRegex, VALID_FLAGS, type RegexResult } from './core'
import { runRegexInWorker } from './runner'
import { regexInputSchema, EXAMPLE_PATTERN, EXAMPLE_FLAGS, EXAMPLE_TEXT } from './schema'

const pattern = ref('')
const activeFlags = ref<string[]>(['g'])
const text = ref('')
const result = ref<RegexResult | null>(null)
const running = ref(false)

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('regex-tester')
if (shared && typeof shared.flags === 'string') {
  const flags = [...shared.flags].filter((f) => VALID_FLAGS.includes(f as never))
  if (flags.length) activeFlags.value = flags
}

const flagsString = ref('')
function syncFlags() {
  flagsString.value = activeFlags.value.join('')
}

async function run() {
  syncFlags()
  const parsed = regexInputSchema.safeParse({
    pattern: pattern.value,
    flags: flagsString.value,
    text: text.value,
  })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  // 语法错误先在主线程快速反馈，避免无谓启动 Worker
  const validation = validateRegex(parsed.data.pattern, parsed.data.flags)
  if (!validation.ok) {
    result.value = { ok: false, message: validation.message }
    return
  }
  running.value = true
  try {
    result.value = await runRegexInWorker(parsed.data.pattern, parsed.data.flags, parsed.data.text)
  } finally {
    running.value = false
  }
}

function clearAll() {
  pattern.value = ''
  text.value = ''
  result.value = null
}

function loadExample() {
  pattern.value = EXAMPLE_PATTERN
  activeFlags.value = EXAMPLE_FLAGS.split('')
  text.value = EXAMPLE_TEXT
  void run()
}
</script>

<template>
  <div class="tool-view">
    <section aria-label="正则表达式">
      <label for="regex-pattern" class="field-label">正则表达式</label>
      <div class="pattern-row">
        <el-input
          id="regex-pattern"
          v-model="pattern"
          placeholder="如 \d+ 或邮箱匹配表达式"
          @keyup.enter="run"
        />
        <el-checkbox-group v-model="activeFlags" aria-label="标志位">
          <el-checkbox v-for="f in VALID_FLAGS" :key="f" :value="f" :label="f" border size="small" />
        </el-checkbox-group>
      </div>
    </section>

    <section aria-label="测试文本">
      <label for="regex-text" class="field-label">测试文本</label>
      <el-input
        id="regex-text"
        v-model="text"
        type="textarea"
        :rows="6"
        placeholder="粘贴用于匹配测试的文本"
        resize="vertical"
      />
      <p class="field-hint">最大 1MB；执行在隔离 Worker 中进行，超时 2 秒自动终止。</p>
    </section>

    <section aria-label="结果区" aria-live="polite">
      <el-alert
        v-if="result && !result.ok"
        type="error" :title="result.message" :closable="false" show-icon
      />
      <template v-else-if="result?.ok">
        <el-alert
          v-if="result.matches!.length === 0"
          type="info" title="没有匹配项" :closable="false" show-icon
        />
        <template v-else>
          <p class="match-count">
            共 {{ result.matches!.length }} 个匹配
            <span v-if="result.truncated">（超过 500 条上限，已截断）</span>
          </p>
          <div class="match-list">
            <div v-for="(m, i) in result.matches" :key="i" class="match-row">
              <span class="match-index">#{{ i + 1 }} @{{ m.index }}</span>
              <code class="match-value">{{ m.match }}</code>
              <code v-if="m.groups.length" class="match-groups">
                分组：{{ m.groups.map((g) => g || '∅').join(' | ') }}
              </code>
            </div>
          </div>
        </template>
      </template>
      <div v-else class="result-empty">填写正则与文本后点击"执行"</div>
    </section>

    <div class="controls">
      <el-button type="primary" :disabled="!pattern || running" :loading="running" @click="run">
        执行
      </el-button>
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
.pattern-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.pattern-row .el-input { max-width: 420px; }
.match-count { font-size: 13px; color: var(--text-2); margin: 0 0 8px; }
.match-list {
  max-height: 300px; overflow: auto;
  border: 1px solid var(--border-light); border-radius: var(--radius-md);
}
.match-row {
  display: flex; align-items: center; gap: 12px; flex-wrap: wrap;
  padding: 7px 12px; border-bottom: 1px solid var(--border-light);
  background: var(--bg-card); font-size: 13px;
}
.match-row:last-child { border-bottom: none; }
.match-index { color: var(--text-3); font-family: var(--font-mono); font-size: 12px; flex-shrink: 0; }
.match-value {
  background: var(--accent-tint); color: var(--accent-deep);
  padding: 1px 8px; border-radius: var(--radius-sm); font-family: var(--font-mono);
}
.match-groups { color: var(--text-2); font-family: var(--font-mono); font-size: 12px; }
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
