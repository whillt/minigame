<template>
  <div class="ranking-container">
    <!-- 地区选择器 -->
    <div class="region-selector">
      <div class="current-region">
        {{ currentRegion.province }} - {{ currentRegion.city }} - {{ currentRegion.district }}
      </div>
      <button @click="refreshData">刷新数据</button>
    </div>

    <!-- 统计信息 -->
    <div class="stats-panel">
      <div class="stat-item">
        <div class="stat-label">总玩家数</div>
        <div class="stat-value">{{ stats.totalPlayers }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">通关人数</div>
        <div class="stat-value">{{ stats.clearCount }}</div>
      </div>
      <div class="stat-item">
        <div class="stat-label">通关率</div>
        <div class="stat-value">{{ clearRate }}%</div>
      </div>
    </div>

    <!-- 排行榜列表 -->
    <div class="ranking-list">
      <h3>地区排行榜</h3>
      <div class="list-header">
        <span>排名</span>
        <span>玩家</span>
        <span>用时</span>
        <span>关卡</span>
      </div>
      <div v-for="(item, index) in rankingList" 
           :key="index" 
           class="ranking-item">
        <span class="rank">{{ index + 1 }}</span>
        <span class="player-name">{{ item.name }}</span>
        <span class="time">{{ formatTime(item.timeUsed) }}</span>
        <span class="level">{{ item.maxLevel }}</span>
      </div>
    </div>

    <!-- 开始游戏按钮 -->
    <button class="start-game" @click="startGame">开始游戏</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { RegionService } from '../../services/region';
import { amapService } from '../../services/amap';

const router = useRouter();
const currentRegion = ref({ province: '', city: '', district: '', adcode: '' });
const stats = ref({ totalPlayers: 0, clearCount: 0 });
const rankingList = ref([]);
const loading = ref(false);

// 计算通关率
const clearRate = computed(() => {
  if (stats.value.totalPlayers === 0) return 0;
  return ((stats.value.clearCount / stats.value.totalPlayers) * 100).toFixed(1);
});

// 格式化时间
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

// 刷新数据
const refreshData = async () => {
  if (loading.value) return;
  loading.value = true;
  
  try {
    const rankings = await RegionService.getRegionRanking(currentRegion.value.adcode);
    rankingList.value = rankings;
  } catch (error) {
    console.error('Failed to refresh data:', error);
  } finally {
    loading.value = false;
  }
};

// 开始游戏
const startGame = () => {
  router.push('/game');
};

// 初始化
onMounted(async () => {
  try {
    // 获取位置信息
    const location = await amapService.getLocation();
    currentRegion.value = location;
    
    // 获取或创建地区信息
    const region = await RegionService.getOrCreateRegion(location);
    stats.value.totalPlayers = region.totalPlayers;
    stats.value.clearCount = region.clearCount;
    
    // 获取排行榜数据
    await refreshData();
  } catch (error) {
    console.error('Failed to initialize:', error);
  }
});
</script>

<style scoped>
.ranking-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
}

.region-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.stats-panel {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 30px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 12px;
  text-align: center;
}

.ranking-list {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
}

.list-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px;
  padding: 10px;
  font-weight: bold;
  border-bottom: 1px solid #eee;
}

.ranking-item {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.start-game {
  width: 100%;
  padding: 15px;
  font-size: 18px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style> 