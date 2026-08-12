<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()

const features = [
  { icon: '✍️', titleKey: 'features.editor.title', descKey: 'features.editor.desc' },
  { icon: '📂', titleKey: 'features.workspace.title', descKey: 'features.workspace.desc' },
  { icon: '🔗', titleKey: 'features.wiki.title', descKey: 'features.wiki.desc' },
  { icon: '🎨', titleKey: 'features.themes.title', descKey: 'features.themes.desc' },
  { icon: '📐', titleKey: 'features.preview.title', descKey: 'features.preview.desc' },
  { icon: '🖨️', titleKey: 'features.export.title', descKey: 'features.export.desc' },
  { icon: '🔒', titleKey: 'features.local.title', descKey: 'features.local.desc' },
  { icon: '📊', titleKey: 'features.stats.title', descKey: 'features.stats.desc' }
]
</script>

<template>
  <section class="features">
    <div class="container">
      <h2 class="section-title">{{ t('features.title') }}</h2>
      <div class="grid">
        <article v-for="f in features" :key="f.titleKey" class="card">
          <span class="card-icon">{{ f.icon }}</span>
          <h3>{{ t(f.titleKey) }}</h3>
          <p>{{ t(f.descKey) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features {
  padding: 64px 0;
}

.section-title {
  text-align: center;
  font-size: 28px;
  margin-bottom: 36px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;
}

.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 24px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 30px color-mix(in srgb, var(--text) 8%, transparent);
}

.card-icon {
  font-size: 26px;
}

.card h3 {
  margin-top: 12px;
  font-size: 17px;
}

.card p {
  margin-top: 6px;
  font-size: 14px;
  color: var(--text-muted);
}
</style>
