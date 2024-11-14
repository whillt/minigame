<template>
  <div class="modal" v-if="show">
    <div class="modal-content">
      <h2>{{ tipText }}</h2>
      <button @click="$emit('restart')">再来一次</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean
  tipText: string
}>()

defineEmits<{
  (e: 'restart'): void
}>()
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}
</style> 