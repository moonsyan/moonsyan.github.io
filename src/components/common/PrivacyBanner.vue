<script setup lang="ts">
/** 本地处理与隐私说明横幅（风格 Demo V5 柔和极简；内容红线：只陈述已实现的事实）。 */
</script>

<template>
  <div class="privacy-band">
    <h3>你的数据，从不离开浏览器</h3>
    <p class="pb-sub">前端工具的计算逻辑在浏览器本地执行，输入内容不会发送到任何服务器。</p>
    <ul class="pb-points">
      <li>
        <span class="pb-icon" aria-hidden="true">⚡</span>
        <div><h4>即输即算</h4><p>前端工具即时出结果，可离线使用</p></div>
      </li>
      <li>
        <span class="pb-icon" aria-hidden="true">🛡</span>
        <div><h4>敏感数据不出设备</h4><p>密钥与令牌无传输风险</p></div>
      </li>
      <li>
        <span class="pb-icon" aria-hidden="true">💾</span>
        <div><h4>本地收藏与历史</h4><p>仅存浏览器 localStorage，可一键清除</p></div>
      </li>
      <li>
        <span class="pb-icon" aria-hidden="true">✕</span>
        <div><h4>关闭即清空</h4><p>不保留任何输入内容</p></div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.privacy-band {
  border-radius: 22px;
  background: var(--bg-card);
  box-shadow: var(--shadow-sm);
  padding: 44px 40px;
  text-align: center;
}
.privacy-band h3 {
  font-size: 22px;
  font-weight: 600;
  letter-spacing: -0.01em;
  margin: 0 0 10px;
}
.pb-sub {
  font-size: 13.5px;
  color: var(--text-2);
  margin: 0 auto 30px;
  max-width: 34em;
}
.pb-points {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  list-style: none;
  margin: 0;
  padding: 0;
  text-align: left;
}
.pb-points li {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px;
  border-radius: var(--radius-md);
  background: var(--bg-page);
}
.pb-icon {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  border-radius: 12px;
  background: var(--accent-tint);
  color: var(--accent-deep);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
}
.pb-points h4 {
  font-size: 13.5px;
  font-weight: 600;
  margin: 0 0 2px;
}
.pb-points p {
  font-size: 12px;
  color: var(--text-3);
  line-height: 1.5;
  margin: 0;
}
@media (max-width: 900px) {
  .privacy-band {
    padding: 32px 24px;
  }
  .pb-points {
    grid-template-columns: 1fr 1fr;
  }
}
@media (max-width: 560px) {
  .pb-points {
    grid-template-columns: 1fr;
  }
}
</style>
