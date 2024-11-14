<template>
  <div class="status-container">
    <div class="status-item">
      <span class="label">步数:</span>
      <span class="value">{{ steps }}</span>
    </div>
    <div class="status-item">
      <span class="label">剩余:</span>
      <span class="value">{{ remainingCards }}</span>
    </div>
    <div class="status-item">
      <span class="label">用时:</span>
      <span class="value">{{ formatTime(timeElapsed) }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  steps: number
  remainingCards: number
  timeElapsed: number
}>()

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}
</script>

<style scoped>
.status-container {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-bottom: 10px;
}

.status-item {
  text-align: center;
}

.label {
  color: #999;
  margin-right: 5px;
}

.value {
  color: #fff;
  font-weight: bold;
}
</style> 