<script setup lang="ts">
/** 常见问题页：关于隐私与使用方式的公开说明（顶部导航独立入口）。 */
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFavoritesStore } from '~/stores/favorites'
import { useRecentStore } from '~/stores/recent'
import { usePageSeo } from '~/composables/usePageSeo'

usePageSeo({
  title: '常见问题 · ToolKit',
  description: '关于数据隐私、本地收藏与使用方式的常见问题。',
  path: '/faq',
})

const faqs = [
  {
    q: '我的数据会被上传吗？',
    a: '客户端工具完全在浏览器内执行，输入不经过任何网络传输；服务端与文件工具需要部署后端后使用，部署后服务端工具仅上传必要参数，文件工具需上传文件且默认 24 小时内自动删除。每个工具页都会如实标注执行方式。',
  },
  {
    q: '收藏和最近使用存在哪里？',
    a: '仅保存在当前浏览器的 localStorage 中，只记录工具标识和时间，不包含输入内容。可在下方一键清除，或清除浏览器数据。',
  },
  {
    q: '断网还能使用吗？',
    a: '客户端工具在页面加载完成后可离线使用；服务端工具与文件工具需要部署后端并联网。',
  },
  {
    q: '如何反馈问题？',
    a: '当前站点为纯静态部署，暂未提供在线反馈入口。可前往 GitHub 仓库提交 Issue 反馈问题或建议。',
  },
]

// 隐私控制（DATA-005）：一键清除本站保存的全部本地数据
async function clearLocalData() {
  try {
    await ElMessageBox.confirm(
      '将清除本站保存的收藏、最近使用与主题偏好（不包括浏览器其它数据）。确认清除？',
      '清除本地数据',
      { confirmButtonText: '清除', cancelButtonText: '取消', type: 'warning' },
    )
  } catch {
    return
  }
  useFavoritesStore().clear()
  useRecentStore().clear()
  localStorage.removeItem('toolkit:theme')
  ElMessage.success('本地数据已清除')
}
</script>

<template>
  <section class="container section">
    <h1 class="page-title">常见问题</h1>
    <p class="page-desc">关于数据安全与使用方式</p>

    <el-collapse class="faq">
      <el-collapse-item v-for="(item, i) in faqs" :key="i" :title="item.q" :name="i">
        {{ item.a }}
      </el-collapse-item>
    </el-collapse>

    <section id="privacy" class="privacy-note">
      <h2>隐私说明</h2>
      <ul>
        <li>客户端工具在浏览器本地执行，输入内容不发送到服务器。</li>
        <li>服务端与文件工具需部署后端后使用；部署后服务端工具仅上传必要参数，文件工具的文件临时存储且默认 24 小时内删除。</li>
        <li>收藏与最近使用仅保存在本机 localStorage，不包含输入内容。</li>
        <li>本站不收集、不上传任何输入内容与使用数据。</li>
      </ul>
      <el-button type="danger" plain @click="clearLocalData">一键清除本站本地数据</el-button>
    </section>
  </section>
</template>

<style scoped>
.section {
  padding-top: 36px;
  max-width: 760px;
}
.page-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 4px;
}
.page-desc {
  font-size: 13.5px;
  color: var(--text-3);
  margin: 0 0 24px;
}
.privacy-note {
  margin-top: 40px;
  padding: 24px 28px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.privacy-note h2 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px;
}
.privacy-note li {
  font-size: 13.5px;
  color: var(--text-2);
  margin-bottom: 4px;
}
</style>
