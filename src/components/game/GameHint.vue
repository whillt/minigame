<template>
  <div class="hint-container">
    <button 
      class="hint-button"
      :class="{ 'disabled': disabled }"
      :disabled="disabled || showingAd"
      @click="handleHintClick"
    >
      {{ buttonText }}
    </button>

    <!-- 提示弹窗 -->
    <Transition name="fade">
      <div v-if="hintVisible && currentHint" class="hint-modal">
        <div class="hint-content">
          <h3>游戏提示</h3>
          <p>{{ currentHint.message }}</p>
          <div class="hint-visual">
            <!-- 可以在这里添加视觉提示，比如高亮显示推荐的卡片 -->
          </div>
          <button class="close-btn" @click="closeHint">知道了</button>
        </div>
      </div>
    </Transition>

    <!-- 广告弹窗 -->
    <Transition name="fade">
      <div v-if="showingAd" class="ad-modal">
        <div class="ad-content">
          <h3>提示即将到来</h3>
          <div class="loading-spinner"></div>
          <p>广告播放中，请稍候...</p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { HintResult } from '../../composables/useGameHints';
import { useGameHints } from '../../composables/useGameHints';

const props = defineProps<{
  disabled: boolean;
  gameState: GameState;
}>();

const {
  freeHintUsed,
  showingAd,
  hintVisible,
  getHint,
  closeHint
} = useGameHints();

const currentHint = ref<HintResult | null>(null);

const buttonText = computed(() => {
  if (showingAd.value) return '加载中...';
  return freeHintUsed.value ? '获取提示(广告)' : '获取提示(免费)';
});

const handleHintClick = async () => {
  currentHint.value = await getHint(props.gameState);
};
</script>

<style scoped>
.hint-container {
  position: relative;
}

.hint-button {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #2196F3;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hint-button:hover:not(:disabled) {
  background: #1976D2;
}

.hint-button.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.hint-modal,
.ad-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.hint-content,
.ad-content {
  background: white;
  padding: 24px;
  border-radius: 16px;
  text-align: center;
  max-width: 80%;
  width: 400px;
}

.close-btn {
  margin-top: 20px;
  padding: 8px 24px;
  border: none;
  border-radius: 8px;
  background: #4CAF50;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #45a049;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #2196F3;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 20px auto;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 