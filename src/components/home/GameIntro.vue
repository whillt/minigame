<template>
  <div class="game-intro">
    <div class="intro-content">
      <h2>游戏介绍</h2>
      <p>一款充满挑战的三消游戏，考验你的策略思维！</p>
      <div class="feature-list">
        <div v-for="feature in features" :key="feature.id" class="feature-item">
          <img :src="feature.icon" :alt="feature.title">
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.desc }}</p>
        </div>
      </div>
    </div>
    <lottie-player
      src="https://assets2.lottiefiles.com/packages/lf20_kkflmtur.json"
      background="transparent"
      speed="1"
      style="width: 300px; height: 300px;"
      loop
      autoplay
    ></lottie-player>
  </div>
</template>

<script setup lang="ts">
const features = [
  {
    id: 1,
    icon: '/icons/strategy.png',
    title: '策略思考',
    desc: '精心设计的关卡，需要巧妙的策略来通关'
  },
  {
    id: 2,
    icon: '/icons/levels.png',
    title: '多样关卡',
    desc: '递进式的难度设计，让你逐步提升'
  },
  {
    id: 3,
    icon: '/icons/rewards.png',
    title: '丰富奖励',
    desc: '完成挑战获得独特奖励'
  }
];
</script> 