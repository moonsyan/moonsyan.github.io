import type { App } from 'vue'
import { defineComponent } from 'vue'
import { RouterLink } from 'vue-router'
import ToolCard from '~/components/tool/Card.vue'
import CommonPrivacyBanner from '~/components/common/PrivacyBanner.vue'

/**
 * Nuxt 兼容全局组件：让移植页面与组件无需修改即可运行。
 * 独立成函数，供 main.ts 与冒烟测试共用。
 */
export function registerGlobals(app: App) {
  app.component('NuxtLink', RouterLink)
  app.component(
    'ClientOnly',
    defineComponent({
      name: 'ClientOnly',
      setup(_props, { slots }) {
        // 纯客户端 SPA：无条件渲染默认插槽
        return () => slots.default?.()
      },
    }),
  )
  app.component('ToolCard', ToolCard)
  app.component('CommonPrivacyBanner', CommonPrivacyBanner)
}
