<script setup lang="ts">
/** 单位换算运行区（TOOL-016）。不同量纲不能混算，精度可控。 */
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { convertUnit, DIMENSIONS, type Dimension, type UnitResult } from './core'
import { unitInputSchema, EXAMPLE_VALUE, EXAMPLE_FROM, EXAMPLE_TO } from './schema'

const value = ref<number | undefined>(EXAMPLE_VALUE)
const dimension = ref<Dimension>('data')
const from = ref(EXAMPLE_FROM)
const to = ref(EXAMPLE_TO)
const precision = ref(6)
const result = ref<UnitResult | null>(null)

const units = computed(() => DIMENSIONS[dimension.value].units)

function switchDimension(dim: Dimension) {
  dimension.value = dim
  from.value = DIMENSIONS[dim].units[0].id
  to.value = DIMENSIONS[dim].units[1]?.id ?? DIMENSIONS[dim].units[0].id
  result.value = null
}

watch(dimension, switchDimension)

function run() {
  const parsed = unitInputSchema.safeParse({
    value: value.value, from: from.value, to: to.value, precision: precision.value,
  })
  if (!parsed.success) {
    result.value = { ok: false, message: parsed.error.errors[0]?.message ?? '输入校验失败' }
    return
  }
  result.value = convertUnit(parsed.data.value, parsed.data.from, parsed.data.to, parsed.data.precision)
}

function swap() {
  const f = from.value
  from.value = to.value
  to.value = f
  if (value.value !== undefined) run()
}

async function copyResult() {
  if (result.value?.output === undefined) return
  try {
    await navigator.clipboard.writeText(String(result.value.output))
    ElMessage.success('已复制到剪贴板')
  } catch {
    ElMessage.error('复制失败')
  }
}

function unitName(id: string) {
  return units.value.find((u) => u.id === id)?.name ?? id
}
</script>

<template>
  <div class="tool-view">
    <el-radio-group :model-value="dimension" aria-label="量纲选择" @change="(d: Dimension) => switchDimension(d)">
      <el-radio-button v-for="(def, key) in DIMENSIONS" :key="key" :value="key">{{ def.name }}</el-radio-button>
    </el-radio-group>

    <div class="convert-row">
      <section class="convert-side" aria-label="原始值">
        <label for="unit-value" class="field-label">数值</label>
        <el-input-number id="unit-value" v-model="value" :controls="false" style="width: 100%" />
        <el-select v-model="from" style="margin-top: 8px" aria-label="原始单位">
          <el-option v-for="u in units" :key="u.id" :value="u.id" :label="u.name" />
        </el-select>
      </section>

      <button class="swap-btn" aria-label="交换单位" @click="swap">⇄</button>

      <section class="convert-side" aria-label="目标单位">
        <span class="field-label">结果</span>
        <div class="output" aria-live="polite">
          <template v-if="result?.ok">{{ result.output }}</template>
          <template v-else>—</template>
        </div>
        <el-select v-model="to" style="margin-top: 8px" aria-label="目标单位">
          <el-option v-for="u in units" :key="u.id" :value="u.id" :label="u.name" />
        </el-select>
      </section>
    </div>

    <el-alert v-if="result && !result.ok" type="error" :title="result.message" :closable="false" show-icon />

    <div class="controls">
      <el-button type="primary" :disabled="value === undefined" @click="run">换算</el-button>
      <el-button v-if="result?.ok" @click="copyResult">复制结果</el-button>
      <label class="precision-label">
        精度
        <el-select v-model="precision" style="width: 110px" aria-label="小数位数">
          <el-option v-for="n in 13" :key="n - 1" :value="n - 1" :label="`${n - 1} 位小数`" />
        </el-select>
      </label>
      <span v-if="result?.ok" class="formula">
        {{ value }} {{ unitName(from) }} = {{ result.output }} {{ unitName(to) }}
      </span>
    </div>
    <p class="privacy-hint">🛡 本地处理：所有计算在浏览器内完成；不同量纲之间不能混算。</p>
  </div>
</template>

<style scoped>
.tool-view { display: flex; flex-direction: column; gap: 16px; }
.field-label { display: block; font-size: 13px; font-weight: 600; margin-bottom: 6px; }
.convert-row { display: flex; align-items: flex-end; gap: 16px; flex-wrap: wrap; }
.convert-side { flex: 1; min-width: 180px; }
.swap-btn {
  border: 1px solid var(--border); background: var(--bg-card); color: var(--text-2);
  width: 40px; height: 40px; border-radius: 50%; cursor: pointer; font-size: 18px;
  transition: all var(--transition);
}
.swap-btn:hover { color: var(--accent-deep); border-color: var(--accent); }
.output {
  min-height: 32px; padding: 4px 10px; font-family: var(--font-mono); font-size: 18px;
  background: var(--bg-soft); border: 1px solid var(--border-light); border-radius: var(--radius-sm);
}
.controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.precision-label { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--text-2); }
.formula { font-size: 13px; color: var(--text-2); font-family: var(--font-mono); }
.privacy-hint { font-size: 12.5px; color: var(--text-3); margin: 0; }
</style>
