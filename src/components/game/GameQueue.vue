<template>
  <div class="queue-container">
    <div v-for="(item, index) in queue" 
         :key="item.id"
         class="queue-item"
         :style="{ left: `${index * 80}px` }">
      <div class="queue-item-inner">
        <img :src="item.icon" alt="">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { GameSymbol } from '../../types/game';

defineProps<{
  queue: GameSymbol[]
}>();
</script>

<style scoped>
.queue-container {
  width: 100%;
  max-width: 500px;
  height: 80px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  margin: 20px 0;
  position: relative;
  overflow: hidden;
  border: 2px solid #eee;
}

.queue-item {
  position: absolute;
  width: 70px;
  height: 70px;
  top: 5px;
  transition: all 0.3s ease;
}

.queue-item-inner {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.queue-item img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style> 