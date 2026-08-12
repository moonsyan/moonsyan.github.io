<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <figure class="screenshot">
    <div class="window">
      <div class="window-bar">
        <span class="dot red" />
        <span class="dot yellow" />
        <span class="dot green" />
        <span class="window-title">untitled.md — MarkdownSoft</span>
      </div>
      <div class="window-body">
        <div class="sidebar">
          <div v-for="n in 5" :key="n" class="sidebar-item" />
        </div>
        <div class="editor">
          <div v-for="n in 7" :key="n" class="line" :style="{ width: 85 - (n % 3) * 12 + '%' }" />
        </div>
        <div class="preview">
          <div class="preview-title" />
          <div v-for="n in 5" :key="n" class="line" :style="{ width: 90 - (n % 3) * 15 + '%' }" />
        </div>
      </div>
    </div>
    <figcaption>{{ t('placeholder.caption') }}</figcaption>
  </figure>
</template>

<style scoped>
.screenshot {
  margin: 40px auto 0;
  max-width: 720px;
  text-align: center;
}

.window {
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-card);
  box-shadow: 0 20px 50px color-mix(in srgb, var(--text) 12%, transparent);
}

.window-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--bg-soft);
  border-bottom: 1px solid var(--border);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.red { background: #ff5f57; }
.dot.yellow { background: #febc2e; }
.dot.green { background: #28c840; }

.window-title {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-muted);
}

.window-body {
  display: grid;
  grid-template-columns: 64px 1fr 1fr;
  height: 320px;
}

.sidebar {
  background: var(--bg-soft);
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-item {
  height: 10px;
  border-radius: 3px;
  background: var(--border);
}

.editor,
.preview {
  padding: 18px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.preview {
  border-left: 1px solid var(--border);
  background: var(--bg-card);
}

.preview-title {
  height: 14px;
  width: 40%;
  border-radius: 3px;
  background: var(--accent);
  opacity: 0.7;
}

.line {
  height: 10px;
  border-radius: 3px;
  background: var(--border);
}

figcaption {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
