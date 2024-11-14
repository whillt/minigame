<template>
  <div class="scene-container">
    <div class="scene-inner">
      <div v-for="(item, index) in scene" 
           :key="item.id" 
           class="symbol" 
           :style="getSymbolStyle(item)" 
           @click="$emit('click-symbol', index)">
        <div class="symbol-inner" :style="{ backgroundColor: item.isCover ? '#999' : 'white' }">
          <img style="width:100%;" :src="item.icon" alt="">
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GAME_CONFIG } from '@/constants/gameIcons'

defineProps<{
  scene: Array<{
    id: string
    icon: string
    status: number
    x: number
    y: number
    isCover: boolean
  }>
  sortedQueue: Record<string, number>
}>()

defineEmits<{
  (e: 'click-symbol', index: number): void
}>()

const getSymbolStyle = (item: any) => ({
  transform: `translateX(${item.status===0 ? item.x : item.status===1 ? sortedQueue[item.id] : -1000}%) translateY(${item.status===0 ? item.y : 895}%)`,
  opacity: item.status < 2 ? 1 : 0,
})
</script>

<style scoped>
.scene-container {
  width: 500px;
  height: 600px;
  position: relative;
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.scene-inner {
  width: 100%;
  height: 100%;
  position: relative;
}

.symbol {
  position: absolute;
  width: 70px;
  height: 70px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.symbol.is-covered {
  filter: grayscale(40%) brightness(0.85);
  pointer-events: none;
}

.symbol.in-queue {
  opacity: 0 !important;
}

.symbol.eliminated {
  opacity: 0 !important;
  pointer-events: none;
}

.symbol-inner {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.symbol-inner img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.symbol:not(.is-covered):hover .symbol-inner {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.hint-highlight {
  animation: hint-pulse 1.5s infinite;
}

.hint-highlight .symbol-inner {
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.8);
  border: 2px solid #ffd700;
}

@keyframes hint-pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
</style> 