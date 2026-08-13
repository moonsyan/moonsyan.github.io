<script setup lang="ts">
/**
 * 颜色转换运行区（TOOL-012）。
 * 输入任意受支持格式，输出 HEX / RGB / HSL 三种结果与色块预览，
 * 每种结果提供可访问的复制按钮（RUN-004）。
 */
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { convertColor, type ColorConvertResult } from './core'
import { colorInputSchema, EXAMPLE_COLOR } from './schema'

const input = ref('')
const result = ref<ColorConvertResult | null>(null)

function run() {
  const parsed = colorInputSchema.safeParse({ text: input.value })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value = convertColor(parsed.data.text)
}

function clearAll() {
  input.value = ''
  result.value = null
}

function loadExample() {
  input.value = EXAMPLE_COLOR
  run()
}

async function copy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    ElMessage.success(`已复制 ${text}`)
  } catch {
    ElMessage.error('复制失败，请手动选择文本复制')
  }
}
</script>

<template>
  <div class="tool-view">
    <section aria-label="输入区">
      <label for="color-input" class="field-label">颜色值</label>
      <div class="input-row">
        <el-input
          id="color-input"
          v-model="input"
          placeholder="如 #00b589、rgb(0, 181, 137)、hsl(165, 100%, 35%)"
          @keyup.enter="run"
        />
        <el-button type="primary" :disabled="!input.trim()" @click="run">转换</el-button>
      </div>
      <p class="field-hint">支持 HEX（3/4/6/8 位）、rgb()/rgba()、hsl()/hsla()。</p>
    </section>

    <section aria-label="结果区" aria-live="polite">
      <el-alert
        v-if="result && !result.ok"
        type="error"
        :title="result.message"
        :closable="false"
        show-icon
      />
      <div v-else-if="result?.ok" class="color-result">
        <div
          class="swatch"
          :style="{ background: result.rgb }"
          role="img"
          :aria-label="`颜色预览 ${result.hex}`"
        ></div>
        <div class="format-list">
          <div v-for="fmt in ['hex', 'rgb', 'hsl'] as const" :key="fmt" class="format-row">
            <span class="format-label">{{ fmt.toUpperCase() }}</span>
            <code class="format-value">{{ result[fmt] }}</code>
            <el-button size="small" @click="copy(result[fmt]!)">复制</el-button>
          </div>
          <div v-if="result.rgba && result.rgba.a < 1" class="format-row">
            <span class="format-label">Alpha</span>
            <code class="format-value">{{ result.rgba.a }}</code>
          </div>
        </div>
      </div>
      <div v-else class="result-empty">输入颜色值后点击"转换"</div>
    </section>

    <div class="controls">
      <el-button @click="clearAll">清空</el-button>
      <el-button link type="primary" @click="loadExample">加载示例</el-button>
    </div>

    <p class="privacy-hint">🛡 本地处理：所有计算在浏览器内完成，输入内容不会发送到服务器。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.field-hint { font-size: 12px; color: var(--text-3); margin: 6px 0 0; }
.input-row { display: flex; gap: 8px; max-width: 520px; }
.color-result { display: flex; gap: 20px; align-items: flex-start; flex-wrap: wrap; }
.swatch {
  width: 96px; height: 96px; border-radius: var(--radius-lg);
  border: 1px solid var(--border); flex-shrink: 0;
  background-image: linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%),
    linear-gradient(45deg, #ccc 25%, transparent 25%, transparent 75%, #ccc 75%);
  background-size: 16px 16px; background-position: 0 0, 8px 8px;
}
.format-list { flex: 1; min-width: 260px; display: flex; flex-direction: column; gap: 8px; }
.format-row {
  display: flex; align-items: center; gap: 10px;
  padding: 8px 12px; background: var(--bg-soft);
  border: 1px solid var(--border-light); border-radius: var(--radius-md);
}
.format-label { font-size: 12px; font-weight: 600; color: var(--text-3); width: 44px; }
.format-value { flex: 1; font-family: var(--font-mono); font-size: 13px; }
.result-empty {
  padding: 24px 14px; text-align: center; color: var(--text-3); font-size: 13px;
  background: var(--bg-soft); border: 1px dashed var(--border); border-radius: var(--radius-md);
}
.controls { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
