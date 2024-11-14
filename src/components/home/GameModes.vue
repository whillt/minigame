<template>
  <div class="game-modes">
    <h2>游戏模式</h2>
    <div class="modes-grid">
      <div 
        v-for="mode in gameModes" 
        :key="mode.id" 
        class="mode-card"
        @click="startGame(mode.id)"
      >
        <div class="mode-icon">
          <img :src="mode.icon" :alt="mode.name">
        </div>
        <h3>{{ mode.name }}</h3>
        <p>{{ mode.description }}</p>
        <div class="mode-stats">
          <span>最高分: {{ mode.highScore }}</span>
          <span>通关: {{ mode.completions }}次</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const gameModes = [
  {
    id: 1,
    name: '休闲模式',
    description: '轻松体验，适合新手入门',
    icon: '/icons/casual.png',
    highScore: 1000,
    completions: 5
  },
  {
    id: 2,
    name: '挑战模式',
    description: '限时挑战，考验反应',
    icon: '/icons/challenge.png',
    highScore: 2000,
    completions: 3
  },
  {
    id: 3,
    name: '无尽模式',
    description: '无限关卡，越玩越难',
    icon: '/icons/endless.png',
    highScore: 3000,
    completions: 1
  }
];

const startGame = (modeId: number) => {
  // 处理游戏开始逻辑
};
</script> 