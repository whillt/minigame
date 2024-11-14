export interface GameSymbol {
    type: string
    image: string
    isCleared: boolean
    zIndex: number
    id: string
    x: number
    y: number
}

export interface GameState {
    symbols: GameSymbol[]
    level: number
    moves: number
    timeElapsed: number
    queue: GameSymbol[]
    scene: GameSymbol[]
    animating: boolean
}

export interface GameConfig {
    containerWidth: number
    containerHeight: number
    iconSize: number
    padding: number
    maxQueueSize: number
}

export interface Level {
    id: number
    tilesCount: number
    minMoves: number
    timeLimit: number
}

export interface GameRecord {
    playerName: string
    levelId: number
    moves: number
    timeUsed: number
    timestamp: number
}