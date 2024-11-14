<template>
  <div class="game-container">
    <div class="game-board">
      <div 
        v-for="(card, index) in scene" 
        :key="card.id"
        class="card"
        :class="{
          'covered': card.isCover,
          'selected': card.status === 1,
          'removed': card.status === 2
        }"
        :style="{
          left: card.x + 'px',
          top: card.y + 'px',
          zIndex: card.isCover ? 1 : 2
        }"
        @click="clickSymbol(index)"
      >
        <img :src="card.icon" class="card-icon" alt="card icon"/>
      </div>
    </div>

    <div class="queue-area">
      <div class="queue-container">
        <div 
          v-for="card in queue" 
          :key="card.id"
          class="queue-card"
        >
          <img :src="card.icon" class="card-icon" alt="card icon"/>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="pop">弹出</button>
      <button @click="restart">重开</button>
      <button @click="wash">洗牌</button>
      <button @click="levelUp">下一关</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onMounted } from 'vue'
import { icons } from '@/constants/gameIcons'

// 游戏状态
const scene = ref([])
const level = ref(1)
const queue = ref([])
const sortedQueue = ref({})
const finished = ref(false)
const tipText = ref('')
const animating = ref(false)

const waitTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 生成场景
const makeScene = (level: number) => {
  const cards = []
  const iconCount = Math.min(10, level * 2)
  const totalCards = level * 30
  
  // 确保每种图案都是3的倍数
  for (let i = 0; i < totalCards; i += 3) {
    const icon = icons[i % iconCount]
    // 生成三张相同的卡片
    for (let j = 0; j < 3; j++) {
      cards.push({
        id: `${i}-${j}`,
        icon,
        // 调整生成位置范围，确保在视图内且有适当的重叠
        x: Math.random() * 600,  // 游戏板宽度 - 卡片宽度
        y: Math.random() * 400,  // 游戏板高度 - 卡片高度
        status: 0,
        isCover: false
      })
    }
  }
  
  scene.value = cards
  checkCover(cards)
  return cards
}

// 初始化游戏
onMounted(() => {
  makeScene(level.value)
})

// 点击卡片
const clickSymbol = async (idx: number) => {
  if (finished.value || animating.value) return
  
  const symbol = scene.value[idx]
  if (symbol.isCover || symbol.status !== 0) return
  
  symbol.status = 1
  queue.value.push(symbol)
  
  animating.value = true
  await waitTimeout(300)
  
  const filterSame = queue.value.filter(sb => sb.icon === symbol.icon)
  
  if (filterSame.length === 3) {
    queue.value = queue.value.filter(sb => sb.icon !== symbol.icon)
    for (const sb of filterSame) {
      const find = scene.value.find(i => i.id === sb.id)
      if (find) find.status = 2
    }
  }
  
  if (queue.value.length === 7) {
    tipText.value = '失败了'
    finished.value = true
  }
  
  checkCover(scene.value)
  animating.value = false
}

// 检查覆盖关系
const checkCover = (cards) => {
  const updateScene = cards.slice()
  for (let i = 0; i < updateScene.length; i++) {
    const cur = updateScene[i]
    cur.isCover = false
    if (cur.status !== 0) continue
    
    const { x: x1, y: y1 } = cur
    const x2 = x1 + 80  // 卡片宽度
    const y2 = y1 + 80  // 卡片高度
    
    for (let j = i + 1; j < updateScene.length; j++) {
      const compare = updateScene[j]
      if (compare.status !== 0) continue
      
      const { x, y } = compare
      if (!(y + 80 <= y1 || y >= y2 || x + 80 <= x1 || x >= x2)) {
        cur.isCover = true
        break
      }
    }
  }
  scene.value = updateScene
}

// 游戏控制函数
const pop = () => {
  if (!queue.value.length) return
  const updateQueue = queue.value.slice()
  const symbol = updateQueue.shift()
  if (!symbol) return
  
  const find = scene.value.find(s => s.id === symbol.id)
  if (find) {
    queue.value = updateQueue
    find.status = 0
    find.x = Math.random() * 600
    find.y = Math.random() * 400
    checkCover(scene.value)
  }
}

const restart = () => {
  level.value = 1
  queue.value = []
  finished.value = false
  tipText.value = ''
  makeScene(level.value)
}

const levelUp = () => {
  level.value++
  queue.value = []
  finished.value = false
  tipText.value = ''
  makeScene(level.value)
}

const wash = () => {
  const cards = scene.value.map(card => ({
    ...card,
    x: Math.random() * 600,
    y: Math.random() * 400
  }))
  scene.value = cards
  checkCover(cards)
}
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f0f0;
  padding: 20px;
}

.game-board {
  width: 800px;
  height: 600px;
  background: white;
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
}

.card {
  position: absolute;
  width: 80px;
  height: 80px;
  background: #fff;
  border: 2px solid #ddd;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s;
}

.card.covered {
  filter: grayscale(100%);
  pointer-events: none;
}

.card.selected {
  border-color: #4CAF50;
  transform: scale(1.1);
}

.card.removed {
  opacity: 0;
  pointer-events: none;
}

.queue-area {
  width: 800px;
  height: 100px;
  background: white;
  border-radius: 8px;
  margin: 20px 0;
  padding: 10px;
}

.queue-container {
  display: flex;
  gap: 10px;
  height: 100%;
  align-items: center;
}

.queue-card {
  width: 60px;
  height: 60px;
  background: white;
  border: 2px solid #ddd;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-icon {
  width: 60%;
  height: 60%;
  object-fit: contain;
}

.controls {
  display: flex;
  gap: 10px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #45a049;
}
</style>