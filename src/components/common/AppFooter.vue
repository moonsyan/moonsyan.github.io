<script setup lang="ts">
/** 全局页脚（风格 Demo V5 柔和极简）：居中式，隐私声明与常见问题入口。 */
</script>

<template>
  <footer class="footer">
    <div class="container footer-inner">
      <span class="fbrand">
        <span class="fmark" aria-hidden="true">T</span>
        ToolKit
      </span>
      <p class="fslogan">简单地做完小事</p>
      <nav class="footer-links" aria-label="页脚导航">
        <NuxtLink to="/faq">常见问题</NuxtLink>
        <NuxtLink to="/faq#privacy">隐私说明</NuxtLink>
        <NuxtLink to="/markdownsoft">MarkdownSoft</NuxtLink>
      </nav>
      <p class="fcopy">© 2026 ToolKit · 所有工具本地运行，不收集用户数据</p>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 64px 0 48px;
  margin-top: 56px;
  border-top: 1px solid var(--border-light);
}
.footer-inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
}
.fbrand {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 14px;
  color: var(--text-2);
}
.fmark {
  width: 24px;
  height: 24px;
  border-radius: 8px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
}
.fslogan {
  margin: 0;
  font-size: 13px;
  color: var(--text-3);
}
.footer-links {
  display: flex;
  gap: 20px;
  margin-top: 6px;
  font-size: 13px;
}
.footer-links a {
  color: var(--text-2);
  transition: color var(--transition);
}
.footer-links a:hover {
  color: var(--accent-deep);
}
.fcopy {
  margin: 10px 0 0;
  font-size: 12px;
  color: var(--text-3);
}
</style>
