import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 数据库连接
export async function getDb() {
  return open({
    filename: './game.db',
    driver: sqlite3.Database
  });
}

// 初始化数据库表
export async function initDb() {
  const db = await getDb();
  
  await db.exec(`
    CREATE TABLE IF NOT EXISTS levels (
      id INTEGER PRIMARY KEY,
      difficulty TEXT NOT NULL,
      tiles_count INTEGER NOT NULL,
      min_moves INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      level_id INTEGER NOT NULL,
      moves INTEGER NOT NULL,
      time_used INTEGER NOT NULL,
      completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(level_id) REFERENCES levels(id)
    );
  `);

  // 初始化三个关卡数据
  await db.exec(`
    INSERT OR IGNORE INTO levels (id, difficulty, tiles_count, min_moves) VALUES
    (1, 'easy', 30, 15),
    (2, 'medium', 45, 25),
    (3, 'hard', 60, 35);
  `);
} 