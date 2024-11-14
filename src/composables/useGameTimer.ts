import { onMounted, onUnmounted, type Ref } from 'vue';
import type { GameState } from '../types/game';

import { ref } from 'vue';  // 添加这行导入

export const useGameTimer = () => {
  const timeElapsed = ref(0);
  let timerInterval: number | null = null;

  const startTimer = () => {
    if (timerInterval) return;
    timerInterval = window.setInterval(() => {
      timeElapsed.value++;
    }, 1000);
  };

  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const resetTimer = () => {
    stopTimer();
    timeElapsed.value = 0;
  };

  return {
    timeElapsed,
    startTimer,
    stopTimer,
    resetTimer
  };
}; 