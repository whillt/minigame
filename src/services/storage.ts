// 使用 localStorage 模拟数据存储
export interface Level {
  id: number;
  difficulty: string;
  tilesCount: number;
  minMoves: number;
}

export interface GameRecord {
  id: number;
  playerName: string;
  levelId: number;
  moves: number;
  timeUsed: number;
  completedAt: string;
}

export class StorageService {
  private static LEVELS_KEY = 'game_levels';
  private static RECORDS_KEY = 'game_records';

  // 初始化关卡数据
  static initLevels() {
    const levels: Level[] = [
      { id: 1, difficulty: 'easy', tilesCount: 30, minMoves: 15 },
      { id: 2, difficulty: 'medium', tilesCount: 45, minMoves: 25 },
      { id: 3, difficulty: 'hard', tilesCount: 60, minMoves: 35 }
    ];
    localStorage.setItem(this.LEVELS_KEY, JSON.stringify(levels));
  }

  // 获取关卡信息
  static getLevel(levelId: number): Level | null {
    const levels = JSON.parse(localStorage.getItem(this.LEVELS_KEY) || '[]');
    return levels.find((level: Level) => level.id === levelId) || null;
  }

  // 保存游戏记录
  static saveRecord(record: Omit<GameRecord, 'id' | 'completedAt'>): GameRecord {
    const records = JSON.parse(localStorage.getItem(this.RECORDS_KEY) || '[]');
    const newRecord: GameRecord = {
      ...record,
      id: records.length + 1,
      completedAt: new Date().toISOString()
    };
    records.push(newRecord);
    localStorage.setItem(this.RECORDS_KEY, JSON.stringify(records));
    return newRecord;
  }

  // 获取排行榜
  static getRanking(levelId: number): GameRecord[] {
    const records = JSON.parse(localStorage.getItem(this.RECORDS_KEY) || '[]');
    return records
      .filter((record: GameRecord) => record.levelId === levelId)
      .sort((a: GameRecord, b: GameRecord) => {
        // 先按步数排序，步数相同按时间排序
        if (a.moves !== b.moves) {
          return a.moves - b.moves;
        }
        return a.timeUsed - b.timeUsed;
      })
      .slice(0, 10); // 只返回前10名
  }

  // 清除所有数据（用于测试）
  static clearAll() {
    localStorage.removeItem(this.LEVELS_KEY);
    localStorage.removeItem(this.RECORDS_KEY);
  }
} 