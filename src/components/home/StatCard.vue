<template>
    <div class="stat-card" :class="{ 'animate-fade-in': isAnimated }">
      <img 
        :src="stat.icon" 
        class="stat-icon" 
        :alt="stat.label"
        @load="onGifLoad"
        @error="onGifError"
      >
      <div class="stat-info">
        <span class="stat-label">{{ stat.label }}</span>
        <span class="stat-value">{{ stat.value }}</span>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
  import type { StatItem } from '@/composables/useHomeStats';
  
  const props = defineProps<{
    stat: StatItem;
  }>();
  
  const isAnimated = ref(false);
  const emit = defineEmits(['gifLoad', 'gifError']);
  
  const onGifLoad = () => {
    console.log(`StatCard: GIF加载成功 - ${props.stat.name}`);
    isAnimated.value = true;
    emit('gifLoad', props.stat.name);
  };
  
  const onGifError = (error: Event) => {
    console.error(`StatCard: GIF加载失败 - ${props.stat.name}`, error);
    emit('gifError', props.stat.name, error);
  };
  </script>
  
  <style scoped>
  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    display: flex;
    align-items: center;
    gap: 15px;
    opacity: 0;
  }
  
  .stat-icon {
    width: 48px;
    height: 48px;
    object-fit: contain;
  }
  
  .animate-fade-in {
    animation: fadeIn 0.5s ease forwards;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  </style>