<template>
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
  import { ID_INJECTION_KEY } from 'element-plus'
  provide(ID_INJECTION_KEY, {
    prefix: 100,
    current: 0
  })
  useHead({
    title: '聖遺物ドロップ率計算機(α版)',
    htmlAttrs: {
      lang: 'ja',
    }
  })
</script>