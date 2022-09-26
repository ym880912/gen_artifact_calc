<template>
  <HTML lang="ja">
    <Head>
      <Title>聖遺物ドロップ率計算機</Title>
    </Head>
    <body>
      <NuxtPage />
    </body>
  </HTML>
</template>

<script setup>
  import { ID_INJECTION_KEY } from 'element-plus'
  provide(ID_INJECTION_KEY, {
    prefix: 100,
    current: 0
  })
</script>