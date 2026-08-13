<script setup lang="ts">
/**
 * 404 页面（SEO：noindex）。
 */
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo({
  title: '页面不存在 · ToolKit',
  description: '页面不存在或已被移除。',
  path: '/404',
  noindex: true,
})
</script>

<template>
  <section class="container section">
    <div class="soft-empty">
      <b>404</b> · 页面不存在或已被移除
      <br />
      <NuxtLink class="soft-empty-action" to="/">返回首页</NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.section {
  padding-top: 72px;
}
</style>
