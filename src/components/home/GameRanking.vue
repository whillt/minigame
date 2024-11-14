<template>
  <div class="game-ranking">
    <h2>排行榜</h2>
    <div class="ranking-list">
      <div v-for="player in topPlayers" 
           :key="player.id" 
           class="ranking-item"
           :class="{ 'top-three': player.rank <= 3 }">
        <div class="rank">{{ player.rank }}</div>
        <img :src="player.avatar" :alt="player.name" class="player-avatar">
        <div class="player-info">
          <div class="player-name">{{ player.name }}</div>
          <div class="player-score">{{ player.score }}分</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const topPlayers = [
  {
    id: 1,
    rank: 1,
    name: "玩家一",
    score: 9999,
    avatar: "/avatars/1.png"
  },
  // ... 更多玩家数据
];
</script> 