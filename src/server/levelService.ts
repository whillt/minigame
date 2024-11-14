import { getDb } from './db';

export interface Level {
  id: number;
  difficulty: string;
  tilesCount: number;
  minMoves: number;
}

export interface Record {
  id: number;
  playerName: string;
  levelId: number;
  moves: number;
  timeUsed: number;
  completedAt: string;
}

export class LevelService {
  // 获取关卡信息
  static async getLevel(levelId: number): Promise<Level> {
    const db = await getDb();
    return db.get('SELECT * FROM levels WHERE id = ?', levelId);
  }

  // 保存通关记录
  static async saveRecord(record: Omit<Record, 'id' | 'completedAt'>): Promise<number> {
    const db = await getDb();
    const result = await db.run(
      `INSERT INTO records (player_name, level_id, moves, time_used) 
       VALUES (?, ?, ?, ?)`,
      [record.playerName, record.levelId, record.moves, record.timeUsed]
    );
    return result.lastID;
  }

  // 获取排行榜
  static async getRanking(levelId: number): Promise<Record[]> {
    const db = await getDb();
    return db.all(
      `SELECT * FROM records 
       WHERE level_id = ? 
       ORDER BY moves ASC, time_used ASC 
       LIMIT 10`,
      levelId
    );
  }
} 