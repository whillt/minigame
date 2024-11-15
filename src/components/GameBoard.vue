<template>
  <div class="game-container">
    <div class="game-stats">
      <div class="stat-item">关卡: {{ level }}/3</div>
      <div class="stat-item">步数: {{ steps }}</div>
      <div class="stat-item">时间: {{ formattedTime }}</div>
      <div class="stat-item">剩余格子: {{ remainingCards }}</div>
    </div>
    
    <div class="game-area">
      <div class="hint-button" @click="showHint">
        提示 {{ freeHintUsed ? '(看广告)' : '(免费)' }}
      </div>
      
      <div class="game-board">
        <div v-if="!scene.length" class="debug-info">
          场景为空，请检查控制台日志
        </div>
        
        <div 
          v-for="(card, index) in scene" 
          :key="card.id"
          class="card"
          :class="{
            'covered': card.isCover,
            'in-queue': card.inQueue,
            'removed': card.status === 2,
            'hint': hintCards.includes(index)
          }"
          :style="{
            left: `${card.x}px`,
            top: `${card.y}px`,
            zIndex: card.inQueue ? 1000 : card.layer,
            transition: 'all 0.3s ease'
          }"
          @click="clickSymbol(index)"
        >
          <img 
            :src="card.icon" 
            class="card-icon" 
            alt="card icon"
            @error="(e) => console.error('图片载失败:', card.icon, e)"
          />
        </div>
      </div>

      <div class="queue-area">
        <div class="queue-container">
          <div class="queue-slots"></div>
        </div>
      </div>
    </div>

    <div class="controls">
      <button @click="pop">弹出</button>
      <button @click="restart">重开</button>
      <button @click="wash">洗牌</button>
    </div>

    <div v-if="isGameFailed" class="game-over">
      <h2>游戏失败</h2>
      <p>队列已满，无法继续操作</p>
      <button @click="restart">重新开始</button>
    </div>

    <div v-if="isGameComplete" class="game-complete">
      <h2>恭喜通关！</h2>
      <p>总用时: {{ formattedTime }}</p>
      <p>总步数: {{ steps }}</p>
      <button @click="restart">重新开始</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { icons, GAME_CONFIG } from '@/constants/gameIcons'

// 等待函数
const waitTimeout = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

// 游戏状态
const scene = ref([])
const level = ref(1)
const queue = ref([])
const steps = ref(0)
const remainingCards = ref(0)
const isGameComplete = ref(false)
const isGameFailed = ref(false)

console.log('初始化游戏，可用图标数量:', icons.length) // 调试日志

// 修改覆盖检查函数
const updateCoverState = (cards: any[]) => {
  console.log('开始检查覆盖状态')
  
  // 深拷贝卡片数组
  const updateScene = cards.slice()
  
  // 遍历所有卡片检查覆盖关系
  for (let i = 0; i < updateScene.length; i++) {
    const cur = updateScene[i]
    // 重置覆盖状态
    cur.isCover = false
    
    // 跳过已消除或在队列中的卡片
    if (cur.status !== 0) continue
    
    // 获取当前卡片的边界坐标
    const x1 = cur.x
    const y1 = cur.y
    const x2 = x1 + GAME_CONFIG.iconSize
    const y2 = y1 + GAME_CONFIG.iconSize
    
    // 检查是否被后面的卡片覆盖
    for (let j = i + 1; j < updateScene.length; j++) {
      const compare = updateScene[j]
      // 跳过已消除的卡片
      if (compare.status !== 0) continue
      
      // 检查是否有重叠
      const isOverlap = !(
        compare.y + GAME_CONFIG.iconSize <= y1 || 
        compare.y >= y2 || 
        compare.x + GAME_CONFIG.iconSize <= x1 || 
        compare.x >= x2
      )
      
      if (isOverlap) {
        // 如果有重叠，则当前卡片被覆盖
        cur.isCover = true
        break
      }
    }
  }
  
  // 更新场景
  scene.value = updateScene
  console.log('覆盖状态检查完成')
}

// 修改 makeScene 函数中的相关部分
const makeScene = (currentLevel: number) => {
  console.log('开始生成场景')
  const cards = []
  const totalGroups = currentLevel === 1 ? 5 : currentLevel === 2 ? 10 : 15
  
  // 生成卡片
  const shuffledIcons = [...icons].sort(() => Math.random() - 0.5)
  const selectedIcons = shuffledIcons.slice(0, totalGroups)
  
  selectedIcons.forEach((icon, groupIndex) => {
    for (let i = 0; i < 3; i++) {
      cards.push({
        id: `${groupIndex}-${i}`,
        icon,
        x: Math.random() * (GAME_CONFIG.containerWidth - GAME_CONFIG.iconSize),
        y: Math.random() * (GAME_CONFIG.containerHeight - GAME_CONFIG.iconSize),
        status: 0,
        isCover: false,
        inQueue: false
      })
    }
  })
  
  // 打乱卡片顺序
  cards.sort(() => Math.random() - 0.5)
  
  // 立即检查并设置覆盖
  updateCoverState(cards)
  
  console.log('场景生成完成，卡片数量:', cards.length)
  scene.value = cards
  remainingCards.value = cards.length
}

// 确保游戏初始化
onMounted(() => {
  console.log('组件挂载，开始初始化游戏')
  makeScene(level.value)
})

// 重新开始游戏
const restart = () => {
  console.log('重新开始游戏')
  level.value = 1
  steps.value = 0
  queue.value = []
  isGameFailed.value = false
  isGameComplete.value = false
  makeScene(level.value)
}

// 处理三消逻辑
const handleMatch = async () => {
  const matches = {}
  queue.value.forEach(card => {
    matches[card.icon] = (matches[card.icon] || []).concat(card)
  })
  
  let hasMatch = false
  for (const [icon, cards] of Object.entries(matches)) {
    if (cards.length === 3) {
      hasMatch = true
      // 移除匹配的卡片
      queue.value = queue.value.filter(card => card.icon !== icon)
      
      // 更新场景中的卡片状态
      cards.forEach(card => {
        const sceneCard = scene.value.find(s => s.id === card.id)
        if (sceneCard) {
          sceneCard.status = 2
          remainingCards.value--
        }
      })
      
      // 重新排列队列中的卡片
      rearrangeQueue()
      
      // 检查游戏状态
      await checkGameStatus()
    }
  }
  
  return hasMatch
}

// 重新排列队列
const rearrangeQueue = () => {
  const queueArea = document.querySelector('.queue-area')
  if (!queueArea) return
  
  const rect = queueArea.getBoundingClientRect()
  const centerY = rect.top + (rect.height - GAME_CONFIG.iconSize) / 2
  
  queue.value.forEach((card, index) => {
    card.x = GAME_CONFIG.padding + (index * (GAME_CONFIG.iconSize + 10))
    card.y = centerY // 使用中心位置
  })
}

// 检查游戏状态
const checkGameStatus = async () => {
  if (remainingCards.value === 0) {
    if (level.value === 3) {
      // 最后一关通关
      isGameComplete.value = true
      await waitTimeout(300)
      alert(`恭喜通关！\n总用时：${formattedTime.value}\n总步数：${steps.value}`)
    } else {
      // 自动进入下一关
      await waitTimeout(300)
      alert(`完成第${level.value}关！准备进入下一关`)
      level.value++
      steps.value = 0
      queue.value = []
      makeScene(level.value)
    }
  }
}

// 点击卡片
const clickSymbol = async (idx: number) => {
  console.log('点击卡片:', idx)
  const symbol = scene.value[idx]
  
  if (symbol.isCover) {
    console.log('卡片被覆盖，不可点击')
    return
  }
  
  // 检查队列是否已满
  if (queue.value.length >= 6) {
    console.log('队列已满，游戏失败')
    isGameFailed.value = true
    await waitTimeout(300)
    alert('游戏失败！队列已满，无法继续操作')
    return
  }

  steps.value++
  
  // 保原始位置用于可能的返回
  symbol.originalX = symbol.x
  symbol.originalY = symbol.y
  
  // 1. 更新卡片状态和位置 - 这部分是必须
  symbol.status = 1  // 1表示在队列中
  symbol.inQueue = true  // 标记卡片在队列中
  
  // 2. 计算队列位置
  const position = calculateQueuePosition(queue.value.length)
  symbol.x = position.x
  symbol.y = position.y
  
  // 4. 添加到队列
  queue.value.push(symbol)
  
  // 检查三消
  const filterSame = queue.value.filter(sb => sb.icon === symbol.icon)
  if (filterSame.length === 3) {
    await waitTimeout(300)
    queue.value = queue.value.filter(sb => sb.icon !== symbol.icon)
    for (const sb of filterSame) {
      const find = scene.value.find(i => i.id === sb.id)
      if (find) {
        find.status = 2 // 2表示已消除
        remainingCards.value--
      }
    }
    console.log('触发三消，剩余格子:', remainingCards.value)
  }
  
  // 重新检查游戏区卡片的重叠状态
  checkGameAreaOverlap()
  
  // 移动到队列后检查游戏状态
  checkGameStatus()
}

// 弹出队列中的卡片
const pop = () => {
  if (!queue.value.length) return
  
  const lastCard = queue.value.pop()
  if (lastCard) {
    lastCard.x = lastCard.originalX
    lastCard.y = lastCard.originalY
    lastCard.status = 0
    lastCard.inQueue = false
    
    // 重新排列队列中的卡片
    queue.value.forEach((card, index) => {
      card.x = 20 + (index * 85)
      card.y = document.querySelector('.game-board').getBoundingClientRect().height + 10
    })
    
    // 重新检查游戏区所有卡片的覆盖状态
    const gameAreaCards = scene.value.filter(card => 
      !card.inQueue && card.status === 0
    )
    updateCoverState(gameAreaCards)
  }
}

const wash = () => {
  const cards = scene.value.map(card => ({
    ...card,
    x: Math.random() * (GAME_CONFIG.containerWidth - GAME_CONFIG.iconSize),
    y: Math.random() * (GAME_CONFIG.containerHeight - GAME_CONFIG.iconSize),
    layer: Math.floor(Math.random() * 1000)
  }))
  scene.value = cards
  updateCoverState(cards)
}

// 检查覆盖关系
const checkCover = (cards: any[]) => {
  cards.forEach(cur => {
    cur.isCover = false
    const { x: x1, y: y1 } = cur
    const x2 = x1 + GAME_CONFIG.iconSize
    const y2 = y1 + GAME_CONFIG.iconSize

    for (const other of cards) {
      if (other === cur || other.status === 2) continue
      const { x, y } = other
      if (!(y + GAME_CONFIG.iconSize <= y1 || y >= y2 || x + GAME_CONFIG.iconSize <= x1 || x >= x2)) {
        cur.isCover = true
        break
      }
    }
  })
}

// 独立的重叠检测逻辑
const checkGameAreaOverlap = () => {
  const gameAreaCards = scene.value.filter(card => 
    card.status === 0 && !card.inQueue
  )
  
  console.log('开始检查重叠，游戏区卡片数量:', gameAreaCards.length)
  
  for (let i = 0; i < gameAreaCards.length; i++) {
    const current = gameAreaCards[i]
    current.isCover = false
    
    const currentRect = {
      x1: current.x,
      y1: current.y,
      x2: current.x + GAME_CONFIG.iconSize,
      y2: current.y + GAME_CONFIG.iconSize
    }
    
    console.log('检查卡片:', {
      id: current.id,
      icon: current.icon,
      position: {
        x1: currentRect.x1,
        y1: currentRect.y1,
        x2: currentRect.x2,
        y2: currentRect.y2
      }
    })
    
    for (let j = i + 1; j < gameAreaCards.length; j++) {
      const other = gameAreaCards[j]
      const otherRect = {
        x1: other.x,
        y1: other.y,
        x2: other.x + GAME_CONFIG.iconSize,
        y2: other.y + GAME_CONFIG.iconSize
      }
      
      const isOverlap = !(
        otherRect.x1 >= currentRect.x2 || 
        otherRect.x2 <= currentRect.x1 || 
        otherRect.y1 >= currentRect.y2 || 
        otherRect.y2 <= currentRect.y1
      )
      
      console.log('与其他卡片比较:', {
        currentId: current.id,
        currentIcon: current.icon,
        otherId: other.id,
        otherIcon: other.icon,
        isOverlap: isOverlap,
        positions: {
          current: currentRect,
          other: otherRect
        }
      })
      
      if (isOverlap) {
        current.isCover = true
        console.log(`卡片 ${current.id}(${current.icon}) 被卡片 ${other.id}(${other.icon}) 覆盖`)
        break
      }
    }
    
    console.log(`卡片 ${current.id}(${current.icon}) 最终覆盖状态:`, current.isCover)
  }
}

// 添加提示相关状态
const freeHintUsed = ref(false) // 是否已使用免费提示
const hintCards = ref<number[]>([]) // 存储可提示的卡片索引

// 检查可消除的卡片组合
const findHintCards = () => {
  console.log('开始查找可消除卡片组合')
  // 获取当前可点击的卡片（未消除、不在队列、未被覆盖）
  const availableCards = scene.value.filter((card, index) => 
    card.status === 0 && !card.inQueue && !card.isCover
  )
  
  // 按图案分组
  const iconGroups = new Map()
  availableCards.forEach((card, index) => {
    const sceneIndex = scene.value.findIndex(c => c.id === card.id)
    if (!iconGroups.has(card.icon)) {
      iconGroups.set(card.icon, [])
    }
    iconGroups.get(card.icon).push(sceneIndex)
  })
  
  // 查找数量>=3的组合
  for (const [icon, indices] of iconGroups.entries()) {
    if (indices.length >= 3) {
      console.log(`找到可消除组合: ${icon}, 位置:`, indices.slice(0, 3))
      return indices.slice(0, 3)
    }
  }
  
  console.log('未找到可消除组合')
  return []
}

// 显示广告
const showAd = () => {
  return new Promise((resolve) => {
    // TODO: 接入实际的广告SDK
    console.log('显示广告')
    // 模拟广告播放
    setTimeout(() => {
      console.log('广告播放完成')
      resolve(true)
    }, 1000)
  })
}

// 提示功能
const showHint = async () => {
  if (!freeHintUsed.value) {
    // 第一次使用，免费
    console.log('使用免费提示')
    freeHintUsed.value = true
  } else {
    // 需要看广告
    const confirmed = confirm('需要观看广告获得提示机会，是否继续？')
    if (!confirmed) return
    
    const adResult = await showAd()
    if (!adResult) {
      alert('广告播放失败，请重试')
      return
    }
  }
  
  // 查找可消除组合
  const hintIndices = findHintCards()
  if (hintIndices.length > 0) {
    // 高亮显示
    hintCards.value = hintIndices
    
    // 3秒后取消高亮
    setTimeout(() => {
      hintCards.value = []
    }, 3000)
  } else {
    alert('当前没有可消除的卡片组合')
  }
}

// 修改队列位置计算逻辑
const calculateQueuePosition = (queueLength: number) => {
  const queueAreaEl = document.querySelector('.queue-area')
  const boardRect = document.querySelector('.game-board').getBoundingClientRect()
  
  // 调整卡片在队列中的位置计算
  const cardWidth = 100 // 与CSS中的宽度对应
  const cardGap = 30 // 卡片间距
  const queuePadding = 30 // 与CSS中的padding对应
  
  const queueX = queuePadding + (queueLength * (cardWidth + cardGap))
  const queueY = boardRect.height + 20
  
  return { x: queueX, y: queueY }
}
</script>

<style scoped>
.game-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.game-area {
  position: relative;
  width: 800px;
  margin-bottom: 20px;
}

.game-board {
  width: 800px;
  height: 600px;
  background: white;
  border-radius: 8px;
  position: relative;
  margin-bottom: 20px;
}

.queue-area {
  width: 800px;
  height: 120px;
  background: #f5f5f5;
  border: 2px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  position: relative;
  z-index: 999;
  margin-top: 20px;
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
  transition: all 0.3s ease;
}

.card.covered {
  filter: grayscale(100%);
  pointer-events: none;
}

.card.in-queue {
  width: 100px;
  height: 100px;
  margin: 0 10px;
  transition: all 0.3s ease;
}

.card.removed {
  opacity: 0;
  pointer-events: none;
}

.queue-container {
  display: flex;
  gap: 20px;
  height: 100%;
  align-items: center;
  padding: 0 30px;
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
  width: 70%;
  height: 70%;
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

.debug-info {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: red;
  font-size: 16px;
}

.game-complete {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 24px;
  z-index: 1
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 20px 40px;
  border-radius: 8px;
  font-size: 24px;
  z-index: 1000;
  text-align: center;
}

.game-over button,
.game-complete button {
  margin-top: 20px;
  padding: 10px 20px;
}

.hint-button {
  position: absolute;
  top: 20px;
  right: 20px;
  padding: 12px 24px;
  background: #4CAF50;
  color: white;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  z-index: 1001;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.hint-button:hover {
  background: #45a049;
  transform: scale(1.05);
  transition: all 0.3s ease;
}

.card.hint {
  box-shadow: 0 0 15px #4CAF50;
  border: 2px solid #4CAF50;
  animation: hint-pulse 1s infinite;
}

@keyframes hint-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>