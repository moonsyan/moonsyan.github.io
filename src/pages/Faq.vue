<script setup lang="ts">
/** 常见问题页：关于隐私与使用方式的公开说明（顶部导航独立入口）。 */
import { ElMessage, ElMessageBox } from 'element-plus'
import { InfoFilled, Lock } from '@element-plus/icons-vue'
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
    <div class="page-head">
      <span class="page-head-icon" aria-hidden="true"><el-icon><InfoFilled /></el-icon></span>
      <div>
        <h1 class="page-title">常见问题</h1>
        <p class="page-desc">关于数据安全与使用方式</p>
      </div>
    </div>

    <el-collapse class="faq">
      <el-collapse-item v-for="(item, i) in faqs" :key="i" :title="item.q" :name="i">
        {{ item.a }}
      </el-collapse-item>
    </el-collapse>

    <section id="privacy" class="privacy-note">
      <h2>
        <span class="pn-icon" aria-hidden="true"><el-icon><Lock /></el-icon></span>
        隐私说明
      </h2>
      <ul>
        <li>客户端工具在浏览器本地执行，输入内容不发送到服务器。</li>
        <li>服务端与文件工具需部署后端后使用；部署后服务端工具仅上传必要参数，文件工具的文件临时存储且默认 24 小时内删除。</li>
        <li>收藏与最近使用仅保存在本机 localStorage，不包含输入内容。</li>
        <li>本站不收集、不上传任何输入内容与使用数据。</li>
      </ul>
      <div class="pn-actions">
        <el-button type="danger" plain @click="clearLocalData">一键清除本站本地数据</el-button>
      </div>
    </section>
  </section>
</template>

<style scoped>
.section {
  padding-top: 36px;
  max-width: 780px;
}
.page-head {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}
.page-title {
  font-size: 26px;
  font-weight: 600;
  letter-spacing: -0.015em;
  margin: 0 0 2px;
}
.page-desc {
  font-size: 13.5px;
  color: var(--text-3);
  margin: 0;
}

/* 折叠面板：整块卡片化（柔和圆角 + 轻阴影），逐条分隔 */
.faq {
  border: none;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 8px 0;
}
.faq :deep(.el-collapse-item) {
  border-bottom: 1px solid var(--border-light);
}
.faq :deep(.el-collapse-item:last-child) {
  border-bottom: none;
}
.faq :deep(.el-collapse-item__header) {
  height: auto;
  padding: 16px 22px 16px 20px;
  font-size: 14.5px;
  font-weight: 550;
  color: var(--text-1);
  background: transparent;
  border: none;
  line-height: 1.5;
  transition: background var(--transition), color var(--transition);
}
.faq :deep(.el-collapse-item__header:hover) {
  background: var(--bg-soft);
}
.faq :deep(.el-collapse-item.is-active .el-collapse-item__header) {
  color: var(--accent-deep);
}
/* 展开箭头：移行尾并做成圆形浅底（默认在行首，order 后移） */
.faq :deep(.el-collapse-item__arrow) {
  order: 3;
  margin-left: auto;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--bg-soft);
  color: var(--text-3);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition);
}
.faq :deep(.el-collapse-item.is-active .el-collapse-item__arrow) {
  color: var(--accent-deep);
  background: var(--accent-tint);
}
.faq :deep(.el-collapse-item__wrap) {
  border: none;
  background: transparent;
}
.faq :deep(.el-collapse-item__content) {
  padding: 0 22px 18px 20px;
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.8;
}

/* 隐私说明卡片 */
.privacy-note {
  margin-top: 40px;
  padding: 26px 28px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}
.privacy-note h2 {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 14px;
}
.pn-icon {
  width: 30px;
  height: 30px;
  border-radius: 10px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
}
.privacy-note ul {
  list-style: none;
  margin: 0 0 16px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.privacy-note li {
  display: flex;
  gap: 9px;
  font-size: 13.5px;
  color: var(--text-2);
  line-height: 1.75;
}
.privacy-note li::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  opacity: 0.45;
  margin-top: 9px;
  flex-shrink: 0;
}
.pn-actions {
  display: flex;
  align-items: center;
  padding-top: 14px;
  border-top: 1px solid var(--border-light);
}
</style>
