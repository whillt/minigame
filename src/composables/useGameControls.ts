import { ref, type Ref } from 'vue';
import type { GameState } from '../types/game';
import { waitTimeout } from '../utils/gameUtils';

export function useGameControls(
  gameState: Ref<GameState>,
  checkCover: (card: any, scene: any[]) => boolean  // 修改参数类型
) {
  // 添加一个辅助函数来检查整个场景
  const checkAllCovers = (scene: any[]) => {
    return scene.map(card => ({
      ...card,
      isCover: checkCover(card, scene)
    }));
  };

  const pop = async () => {
    if (!gameState.value.queue.length || gameState.value.animating) return;
    
    try {
      gameState.value.animating = true;
      
      const symbol = gameState.value.queue[0];
      gameState.value.queue = gameState.value.queue.slice(1);
      
      const sceneSymbol = gameState.value.scene.find(s => s.id === symbol.id);
      if (sceneSymbol) {
        sceneSymbol.status = 0;
        // 随机新位置
        sceneSymbol.x = Math.random() * (460 - 70);
        sceneSymbol.y = Math.random() * (560 - 70);
        
        // 更新场景并重新检查覆盖
        gameState.value.scene = [...gameState.value.scene];
        await waitTimeout(100);
        gameState.value.scene = checkAllCovers(gameState.value.scene);  // 使用新的辅助函数
      }
    } finally {
      gameState.value.animating = false;
    }
  };

  const undo = async () => {
    if (!gameState.value.queue.length || gameState.value.animating) return;
    
    try {
      gameState.value.animating = true;
      
      const symbol = gameState.value.queue[gameState.value.queue.length - 1];
      gameState.value.queue = gameState.value.queue.slice(0, -1);
      
      const sceneSymbol = gameState.value.scene.find(s => s.id === symbol.id);
      if (sceneSymbol) {
        sceneSymbol.status = 0;
        gameState.value.scene = [...gameState.value.scene];
        await waitTimeout(100);
        gameState.value.scene = checkAllCovers(gameState.value.scene);  // 使用新的辅助函数
      }
    } finally {
      gameState.value.animating = false;
    }
  };

  const wash = async () => {
    if (gameState.value.animating) return;
    
    try {
      gameState.value.animating = true;
      
      // 只重新排列未消除和未在队列中的卡片
      const activeSymbols = gameState.value.scene.filter(s => s.status === 0);
      
      activeSymbols.forEach(symbol => {
        symbol.x = Math.random() * (460 - 70);
        symbol.y = Math.random() * (560 - 70);
      });
      
      gameState.value.scene = [...gameState.value.scene];
      await waitTimeout(100);
      gameState.value.scene = checkAllCovers(gameState.value.scene);  // 使用新的辅助函数
    } finally {
      gameState.value.animating = false;
    }
  };

  return {
    pop,
    undo,
    wash
  };
}