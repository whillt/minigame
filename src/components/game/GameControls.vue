<template>
  <div class="flex-container flex-between">
    <button class="flex-grow" @click="$emit('pop')">弹出</button>
    <button class="flex-grow" @click="$emit('undo')">撤销</button>
    <button class="flex-grow" @click="$emit('wash')">洗牌</button>
    <button class="flex-grow" @click="$emit('level-up')">下一关</button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{
  (e: 'pop'): void
  (e: 'undo'): void
  (e: 'wash'): void
  (e: 'level-up'): void
}>()
</script>

<style scoped>
.control-panel {
  width: 100%;
  max-width: 500px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.control-btn {
  padding: 12px 0;
  font-size: 16px;
  border: none;
  border-radius: 10px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.control-btn:hover:not(:disabled) {
  background: #45a049;
}

.control-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
}
</style> 