<script setup lang="ts">
import { useI18n } from '../composables/useI18n'
import { RELEASE_URL } from '../lib/constants'
import ScreenshotPlaceholder from './ScreenshotPlaceholder.vue'

const { t } = useI18n()
</script>

<template>
  <section class="hero">
    <div class="container">
      <h1 class="hero-title">MarkdownSoft</h1>
      <p class="hero-tagline">{{ t('hero.tagline') }}</p>
      <p class="hero-desc">{{ t('hero.desc') }}</p>
      <div class="hero-cta">
        <a class="btn-primary" :href="RELEASE_URL" target="_blank" rel="noopener">
          {{ t('hero.cta') }}
        </a>
        <p class="cta-sub">{{ t('hero.ctaSub') }}</p>
      </div>
      <ScreenshotPlaceholder />
    </div>
  </section>
</template>

<style scoped>
.hero {
  padding: 72px 0 32px;
  text-align: center;
}

.hero-title {
  font-size: 44px;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.hero-tagline {
  margin-top: 16px;
  font-size: 20px;
  color: var(--text-muted);
}

.hero-desc {
  margin: 12px auto 0;
  max-width: 560px;
  font-size: 15px;
  color: var(--text-muted);
}

.hero-cta {
  margin-top: 28px;
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

.cta-sub {
  margin-top: 10px;
  font-size: 13px;
  color: var(--text-muted);
}
</style>
