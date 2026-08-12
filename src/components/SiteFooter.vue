<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <p>{{ t('footer.copyright') }}</p>
      <a href="https://github.com/moonsyan/mkEditor" target="_blank" rel="noopener">
        {{ t('footer.source') }}
      </a>
    </div>
  </footer>
</template>

<style scoped>
.site-footer {
  padding: 24px 0;
  border-top: 1px solid var(--border);
  font-size: 13px;
  color: var(--text-muted);
}

.site-footer .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
