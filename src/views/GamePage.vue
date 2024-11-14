<template>
    <div class="game-page">
      <h1>游戏页面</h1>
      <!-- 游戏内容将在这里实现 -->
    </div>
  </template>
  
  <script setup lang="ts">
  import { onMounted } from 'vue'
  
  onMounted(() => {
    console.log('GamePage mounted')
  })
  </script>
  
  <style scoped>
  .game-page {
    padding: 20px;
  }
  </style>