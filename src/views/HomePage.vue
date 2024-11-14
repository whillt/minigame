<template>
  <div class="home-page">
    <!-- 顶部统计信息 -->
    <div class="stats-container">
      <div class="stat-item">
        <img :src="assets.online" alt="online" class="online-icon" />
        <span>当前在线: {{ stats.onlineCount }}人</span>
      </div>
      <div class="stat-item">
        <img :src="assets.complete" alt="complete" class="complete-icon" />
        <span>今日完成: {{ stats.todayComplete }}次</span>
      </div>
      <div class="stat-item">
        <img :src="assets.percentage" alt="percentage" class="percentage-icon" />
        <span>通关率: {{ stats.completionRate }}%</span>
      </div>
    </div>

    <!-- 中间部分 -->
    <img :src="assets.sheep" alt="sheep" class="sheep-icon" />
    
    <!-- 排行榜 -->
    <div class="leaderboard">
      <div class="leaderboard-header">
        <img :src="assets.trophy" alt="trophy" class="trophy-icon" />
        <h2>排行榜</h2>
      </div>
      <div class="leaderboard-list">
        <div v-for="(player, index) in leaderboard" :key="index" class="leaderboard-item">
          <span class="rank">{{ index + 1 }}</span>
          <span class="name">{{ player.name }}</span>
          <span class="score">{{ player.score }}分</span>
        </div>
      </div>
    </div>

    <!-- 开始按钮 -->
    <div class="start-section" @click="startGame">
      <img :src="assets.startArrow" alt="start-arrow" class="start-arrow-icon" />
      <span class="start-text">开始游戏</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

console.log('HomePage 开始初始化 - setup执行', new Date().toISOString())

// 资源定义
const assets = {
  complete: new URL('../assets/homepage/complete.gif', import.meta.url).href,
  online: new URL('../assets/homepage/online.gif', import.meta.url).href,
  percentage: new URL('../assets/homepage/percentage.gif', import.meta.url).href,
  sheep: new URL('../assets/homepage/sheep-animated-icon-download-in-lottie-json-gif-static-svg-file-formats-animal-lamb-farm-cattle-zoo-.gif', import.meta.url).href,
  startArrow: new URL('../assets/homepage/start-arrow.gif', import.meta.url).href,
  trophy: new URL('../assets/homepage/trophy.gif', import.meta.url).href
}

console.log('资源URL配置完成:', assets)

const checkAssetsLoading = () => {
  console.log('开始检查资源加载状态')
  Object.entries(assets).forEach(([key, url]) => {
    const img = new Image()
    img.onload = () => {
      console.log(`资源 ${key} 加载成功: ${url}`)
    }
    img.onerror = (err) => {
      console.error(`资源 ${key} 加载失败: ${url}`, err)
    }
    img.src = url
  })
}

onBeforeMount(() => {
  console.log('HomePage onBeforeMount 触发', new Date().toISOString())
})

onMounted(() => {
  console.log('HomePage onMounted 触发', new Date().toISOString())
  checkAssetsLoading()
})

// 统计数据
const stats = ref({
  onlineCount: 1258,
  todayComplete: 3567,
  completionRate: 35.8
})

// 排行榜数据
const leaderboard = ref([
  { name: '羊羊王者', score: 9999 },
  { name: '快乐小羊', score: 9888 },
  { name: '羊了个羊', score: 9777 },
  { name: '羊羊无敌', score: 9666 },
  { name: '羊羊必胜', score: 9555 }
])

const startGame = () => {
  router.push('/game')
}
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.stats-container {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.2em;
  color: #666;
}

.stat-item img {
  width: 40px;
  height: 40px;
}

.sheep-icon {
  width: 200px;
  margin: 20px 0;
}

.leaderboard {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 15px;
  padding: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.leaderboard-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.leaderboard-header h2 {
  margin: 0;
  color: #333;
}

.trophy-icon {
  width: 40px;
  height: 40px;
}

.leaderboard-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.leaderboard-item {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.rank {
  width: 30px;
  font-weight: bold;
  color: #ff6b6b;
}

.name {
  flex: 1;
  margin: 0 20px;
}

.score {
  color: #ff6b6b;
  font-weight: bold;
}

.start-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.start-section:hover {
  transform: scale(1.1);
}

.start-arrow-icon {
  width: 80px;
}

.start-text {
  margin-top: 10px;
  font-size: 1.5em;
  color: #333;
  font-weight: bold;
}
</style>