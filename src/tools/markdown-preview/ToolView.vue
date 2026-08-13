<script setup lang="ts">
/**
 * Markdown 预览运行区（TOOL-011）。
 * 安全要求（架构文档 8.2）：marked 输出的 HTML 必须先经 DOMPurify 清洗，
 * 脚本、事件属性与 javascript: 链接不得执行；禁止直接 v-html 原始输出。
 */
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import DOMPurify from 'dompurify'
import { renderMarkdown } from './core'
import { markdownInputSchema, EXAMPLE_MARKDOWN } from './schema'

const input = ref('')
const sanitizedHtml = ref('')
const error = ref('')

/** 清洗配置：DOMPurify 默认移除 script/iframe/事件属性与危险 URL。 */
function sanitize(html: string): string {
  return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
}

function render() {
  const parsed = markdownInputSchema.safeParse({ text: input.value })
  if (!parsed.success) {
    error.value = '输入校验失败'
    sanitizedHtml.value = ''
    return
  }
  const res = renderMarkdown(parsed.data.text)
  if (!res.ok) {
    error.value = res.message ?? '解析失败'
    sanitizedHtml.value = ''
    return
  }
  error.value = ''
  sanitizedHtml.value = sanitize(res.html!)
}

// 实时预览（输入即渲染；清洗在每次渲染前执行）
watch(input, render)

function clearAll() {
  input.value = ''
  sanitizedHtml.value = ''
  error.value = ''
}

function loadExample() {
  input.value = EXAMPLE_MARKDOWN
}

async function copyHtml() {
  if (!sanitizedHtml.value) return
  try {
    await navigator.clipboard.writeText(sanitizedHtml.value)
    ElMessage.success('已复制清洗后的 HTML')
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}
</script>

<template>
  <div class="tool-view">
    <div class="run-grid">
      <section aria-label="Markdown 输入">
        <label for="md-input" class="field-label">Markdown 文本</label>
        <el-input
          id="md-input"
          v-model="input"
          type="textarea"
          :rows="14"
          placeholder="# 标题&#10;&#10;在此输入 Markdown…"
          resize="vertical"
        />
        <p class="field-hint">最大 500KB；预览经清洗库处理，脚本不会执行。</p>
      </section>

      <section aria-label="预览结果" aria-live="polite">
        <div class="result-head">
          <span class="field-label">预览</span>
          <el-button v-if="sanitizedHtml" size="small" @click="copyHtml">复制 HTML</el-button>
        </div>
        <el-alert v-if="error" type="error" :title="error" :closable="false" show-icon />
        <!-- v-html 内容为 DOMPurify 清洗后的 HTML -->
        <div v-else-if="sanitizedHtml" class="md-preview" v-html="sanitizedHtml"></div>
        <div v-else class="result-empty">输入 Markdown 后实时预览</div>
      </section>
    </div>

    <div class="controls">
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
    </div>

    <p class="privacy-hint">本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.run-grid { display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 20px; }
@media (max-width: 768px) { .run-grid { grid-template-columns: 1fr; } }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; }
.result-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
.md-preview {
  padding: 14px 18px; max-height: 640px; overflow: auto;
  background: var(--bg-card); border: 1px solid var(--border-light);
  border-radius: var(--radius-md); font-size: 14px; line-height: 1.7;
}
.md-preview :deep(h1), .md-preview :deep(h2), .md-preview :deep(h3) {
  margin: 12px 0 6px; line-height: 1.4;
}
.md-preview :deep(pre) {
  background: var(--bg-soft); padding: 10px 12px;
  border-radius: var(--radius-sm); overflow: auto; font-size: 13px;
}
.md-preview :deep(blockquote) {
  margin: 8px 0; padding: 4px 14px;
  border-left: 3px solid var(--accent); color: var(--text-2);
}
.result-empty {
  padding: 32px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
</style>
