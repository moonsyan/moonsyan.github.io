<script setup lang="ts">
import { useI18n } from './composables/useI18n'
import { useTheme, THEMES } from './composables/useTheme'
import type { Theme } from './composables/useTheme'
import type { Locale } from './composables/useI18n'
import HeroSection from './components/HeroSection.vue'
import FeatureGrid from './components/FeatureGrid.vue'
import DownloadSection from './components/DownloadSection.vue'
import SiteFooter from './components/SiteFooter.vue'

const { locale, setLocale, t } = useI18n()
const { theme, setTheme } = useTheme()

const DOT_STYLE: Record<Theme, string> = {
  light: '#f7f6f4',
  dark: '#1a1a1e',
  rose: '#e5688e',
  ocean: '#2f8fba'
}
</script>

<template>
  <header class="site-header">
    <div class="container">
      <a class="brand" href="#">
        <img src="/icon.png" alt="MarkdownSoft" />
        <span>MarkdownSoft</span>
      </a>
      <div class="header-controls">
        <div class="lang-toggle" :aria-label="t('header.language')">
          <button :class="{ active: locale === 'zh' }" @click="setLocale('zh')">中</button>
          <button :class="{ active: locale === 'en' }" @click="setLocale('en')">EN</button>
        </div>
        <div class="theme-toggle" :aria-label="t('header.theme')">
          <button
            v-for="th in THEMES"
            :key="th"
            class="theme-dot"
            :class="{ active: theme === th }"
            :style="{ background: DOT_STYLE[th] }"
            :aria-label="th"
            @click="setTheme(th)"
          />
        </div>
      </div>
    </div>
  </header>

  <main class="site-main">
    <HeroSection />
    <FeatureGrid />
    <DownloadSection />
  </main>

  <SiteFooter />
</template>
