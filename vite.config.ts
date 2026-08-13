/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url'
import { copyFileSync } from 'node:fs'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

export default defineConfig({
  base: '/',
  resolve: {
    // 与 Nuxt 的 `~/` 别名一致，移植文件无需修改导入路径
    alias: {
      '~': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    vue(),
    // <el-*> 模板组件自动按需引入（等效 Nuxt 下的 @element-plus/nuxt）
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    // GitHub Pages SPA 深链接：构建完成后复制 index.html 为 404.html
    {
      name: 'spa-404-fallback',
      apply: 'build',
      closeBundle() {
        copyFileSync('dist/index.html', 'dist/404.html')
      },
    },
  ],
  test: {
    environment: 'jsdom',
    testTimeout: 30000,
    // element-plus 内部含 CSS 导入，需经 Vite 转换（否则 Node 直接加载报 .css 扩展名错误）
    server: {
      deps: {
        inline: ['element-plus'],
      },
    },
  },
})
