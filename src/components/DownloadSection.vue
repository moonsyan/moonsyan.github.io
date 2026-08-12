<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { RELEASE_URL } from '../lib/constants'

const { t } = useI18n()
</script>

<template>
  <section class="download">
    <div class="container">
      <h2 class="section-title">{{ t('download.title') }}</h2>
      <p class="download-desc">{{ t('download.desc') }}</p>
      <div class="platforms">
        <span class="platform">Windows</span>
        <span class="platform">macOS</span>
        <span class="platform">Linux</span>
      </div>
      <a class="btn-primary" :href="RELEASE_URL" target="_blank" rel="noopener">
        {{ t('download.cta') }}
      </a>
    </div>
  </section>
</template>

<style scoped>
.download {
  padding: 64px 0;
  text-align: center;
  background: var(--bg-soft);
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.section-title {
  font-size: 28px;
}

.download-desc {
  margin: 12px 0 24px;
  color: var(--text-muted);
}

.platforms {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 28px;
}

.platform {
  padding: 6px 18px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: var(--bg-card);
  font-size: 14px;
}

.btn-primary {
  display: inline-block;
  background: var(--accent);
  color: var(--accent-contrast);
  padding: 12px 32px;
  border-radius: 999px;
  font-size: 16px;
  font-weight: 600;
  transition: transform 0.2s ease, opacity 0.2s ease;
}

.btn-primary:hover {
  transform: translateY(-1px);
  opacity: 0.92;
}
</style>
