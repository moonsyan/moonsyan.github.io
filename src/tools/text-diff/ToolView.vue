<script setup lang="ts">
/**
 * 文本对比运行区（TOOL-009）。
 * 双栏输入 → 差异渲染（新增绿 / 删除红），粒度可切换行级/字符级。
 */
import { ref } from 'vue'
import { diffText, MAX_DIFF_SIZE, type DiffGranularity, type DiffResult } from './core'
import { diffInputSchema, EXAMPLE_OLD, EXAMPLE_NEW } from './schema'

const oldText = ref('')
const newText = ref('')
const granularity = ref<DiffGranularity>('line')
const result = ref<DiffResult | null>(null)

// 分享链接携带的白名单选项（RUN-008）
import { consumeSharedOptions } from '~/composables/useSharedOptions'

const shared = consumeSharedOptions('text-diff')
if (shared) {
  if (shared.granularity === 'line' || shared.granularity === 'char') granularity.value = shared.granularity
}

function run() {
  const parsed = diffInputSchema.safeParse({
    oldText: oldText.value,
    newText: newText.value,
    granularity: granularity.value,
  })
  if (!parsed.success) {
    result.value = { ok: false, message: '输入校验失败' }
    return
  }
  result.value = diffText(parsed.data.oldText, parsed.data.newText, parsed.data.granularity)
}

function clearAll() {
  oldText.value = ''
  newText.value = ''
  result.value = null
}

function loadExample() {
  oldText.value = EXAMPLE_OLD
  newText.value = EXAMPLE_NEW
  run()
}
</script>

<template>
  <div class="tool-view">
    <div class="run-grid">
      <section aria-label="原始文本">
        <label for="diff-old" class="field-label">原始文本</label>
        <el-input
          id="diff-old"
          v-model="oldText"
          type="textarea"
          :rows="9"
          placeholder="粘贴修改前的文本"
          resize="vertical"
        />
      </section>
      <section aria-label="修改后文本">
        <label for="diff-new" class="field-label">修改后文本</label>
        <el-input
          id="diff-new"
          v-model="newText"
          type="textarea"
          :rows="9"
          placeholder="粘贴修改后的文本"
          resize="vertical"
        />
      </section>
    </div>
    <p class="field-hint">单侧最大 {{ MAX_DIFF_SIZE / 1024 }}KB；内容仅在当前页面内存中处理，不会上传。</p>

    <section aria-label="结果区" aria-live="polite">
      <el-alert
        v-if="result && !result.ok"
        type="error" :title="result.message" :closable="false" show-icon
      />
      <template v-else-if="result?.ok">
        <p class="diff-count">
          新增 {{ result.addedCount }} 处 · 删除 {{ result.removedCount }} 处
        </p>
        <pre class="diff-pre"><template
          v-for="(part, i) in result.parts" :key="i"
        ><span :class="`diff-${part.type}`">{{ part.value }}</span></template></pre>
      </template>
      <div v-else class="result-empty">填写两侧文本后点击"对比"</div>
    </section>

    <div class="controls">
      <el-button type="primary" :disabled="(!oldText && !newText)" @click="run">对比</el-button>
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
      <el-radio-group v-model="granularity" class="mode-group" aria-label="对比粒度">
        <el-radio-button value="line">行级</el-radio-button>
        <el-radio-button value="char">字符级</el-radio-button>
      </el-radio-group>
    </div>

    <p class="privacy-hint">🛡 本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 14px; }
.run-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 768px) { .run-grid { grid-template-columns: 1fr; } }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 0; }
.diff-count { font-size: 13px; color: var(--text-2); margin: 0 0 8px; }
.diff-pre {
  margin: 0; padding: 14px; max-height: 340px; overflow: auto;
  background: var(--bg-soft); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-family: var(--font-mono);
  font-size: 13px; white-space: pre-wrap; word-break: break-all;
}
.diff-added { background: rgba(0, 181, 137, 0.18); color: inherit; border-radius: 2px; }
.diff-removed { background: rgba(225, 29, 72, 0.16); text-decoration: line-through; border-radius: 2px; }
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.mode-group { margin-left: auto; }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
