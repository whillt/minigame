import { ref, computed } from 'vue'
import { icons } from '../constants/icons'

interface Position {
  x: number
  y: number
}

interface Symbol {
  id: string
  type: number
  isCleared: boolean
  isSelected: boolean
  zIndex: number
  position: Position
}

export const useGameLogic = () => {
  const level = ref(1)
  const queue = ref<Symbol[]>([])
  const scene = ref<Symbol[]>([])
  const finished = ref(false)
  const tipText = ref('')
  const showHint = ref(false)
  const currentHint = ref<Symbol[]>([])

  // 生成随机ID
  const randomString = (length: number): string => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // 生成指定数量的同类型符号
  const randomSet = (count: number, type: number): Symbol[] => {
    return Array(count).fill(null).map(() => ({
      id: randomString(8),
      type,
      isCleared: false,
      isSelected: false,
      zIndex: 0,
      position: { x: 0, y: 0 }
    }))
  }

  // 生成游戏场景
  const makeScene = () => {
    const symbolCount = level.value === 1 ? 30 : level.value === 2 ? 60 : 120
    const typeCount = Math.floor(symbolCount / 3)
    let symbols: Symbol[] = []
    
    // 确保每种类型的符号数量是3的倍数
    for (let i = 0; i < typeCount; i++) {
      const type = Math.floor(Math.random() * icons.length)
      symbols = symbols.concat(randomSet(3, type))
    }

    // 随机打乱顺序
    for (let i = symbols.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [symbols[i], symbols[j]] = [symbols[j], symbols[i]]
    }

    return symbols
  }

  // 检查是否可以消除
  const canClear = (symbol: Symbol) => {
    const sameTypeSymbols = scene.value.filter(s => 
      s.type === symbol.type && !s.isCleared
    )
    return sameTypeSymbols.length >= 3
  }

  // 消除符号
  const clearSymbols = (type: number) => {
    scene.value = scene.value.map(s => {
      if (s.type === type && !s.isCleared) {
        return { ...s, isCleared: true }
      }
      return s
    })
  }

  // 点击符号
  const clickSymbol = (symbol: Symbol) => {
    if (symbol.isCleared) return
    
    const sameTypeSymbols = scene.value.filter(s => 
      s.type === symbol.type && !s.isCleared
    )

    if (sameTypeSymbols.length >= 3) {
      clearSymbols(symbol.type)
      checkFinished()
    }
  }

  // 检查游戏是否结束
  const checkFinished = () => {
    finished.value = scene.value.every(s => s.isCleared)
  }

  // 显示提示
  const showHintSymbols = () => {
    showHint.value = true
    const availableSymbols = scene.value.filter(s => !s.isCleared)
    const types = new Set(availableSymbols.map(s => s.type))
    
    for (const type of types) {
      const sameType = availableSymbols.filter(s => s.type === type)
      if (sameType.length >= 3) {
        currentHint.value = sameType.slice(0, 3)
        break
      }
    }
  }

  // 初始化游戏
  const initGame = () => {
    scene.value = makeScene()
    finished.value = false
    showHint.value = false
    currentHint.value = []
    tipText.value = ''
  }

  return {
    level,
    queue: scene, // 为了兼容之前的代码，将scene作为queue导出
    scene,
    finished,
    tipText,
    showHint,
    currentHint,
    initGame,
    clickSymbol,
    showHintSymbols
  }
} 