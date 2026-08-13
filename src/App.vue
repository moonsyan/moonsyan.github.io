<script setup lang="ts">
/**
 * 应用骨架：全局头部 + 页面出口 + 全局页脚。
 * 主题初始化在客户端挂载时执行（WEB-008）。
 */
import AppHeader from '~/components/common/AppHeader.vue'
import AppFooter from '~/components/common/AppFooter.vue'
import { useThemeStore } from '~/stores/theme'

const theme = useThemeStore()
theme.init()
</script>

<template>
  <AppHeader />
  <main class="page">
    <RouterView />
  </main>
  <AppFooter />
</template>

<style scoped>
.page {
  min-height: calc(100dvh - 68px);
}
</style>
