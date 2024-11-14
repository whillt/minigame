<template>
  <router-view v-slot="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(() => {
  console.log('App mounted, current route:', {
    path: router.currentRoute.value.path,
    name: router.currentRoute.value.name,
    timestamp: new Date().toISOString()
  });
});
</script>
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  background: #f0f0f0;
}

.app {
  width: 100%;
  height: 100vh;
  max-width: 500px;
  margin: 0 auto;
  position: relative;
}
</style>
