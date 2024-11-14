import { ref } from 'vue';
import type { GameState } from '../types/game';

export const useGameHints = () => {
  const hints = ref<number[]>([]);

  // 查找可以消除的相同符号组合
  const findMatchingSymbols = (gameState: GameState): number[] => {
    const { symbols } = gameState;
    const availableIndices = symbols
      .map((symbol, index) => ({ symbol, index }))
      .filter(({ symbol, index }) => !symbol.isCleared);

    // 查找三个相同的符号
    for (let i = 0; i < availableIndices.length - 2; i++) {
      for (let j = i + 1; j < availableIndices.length - 1; j++) {
        for (let k = j + 1; k < availableIndices.length; k++) {
          const a = availableIndices[i];
          const b = availableIndices[j];
          const c = availableIndices[k];

          if (
            a.symbol.type === b.symbol.type &&
            b.symbol.type === c.symbol.type &&
            !isSymbolCovered(a.index, gameState) &&
            !isSymbolCovered(b.index, gameState) &&
            !isSymbolCovered(c.index, gameState)
          ) {
            return [a.index, b.index, c.index];
          }
        }
      }
    }

    return [];
  };

  // 检查符号是否被覆盖
  const isSymbolCovered = (index: number, gameState: GameState): boolean => {
    const symbol = gameState.symbols[index];
    return gameState.symbols.some(
      (s, i) => i !== index && !s.isCleared && s.zIndex > symbol.zIndex
    );
  };

  // 显示提示
  const showHint = (gameState: GameState) => {
    hints.value = findMatchingSymbols(gameState);
  };

  // 清除提示
  const clearHints = () => {
    hints.value = [];
  };

  return {
    hints,
    showHint,
    clearHints
  };
}; 