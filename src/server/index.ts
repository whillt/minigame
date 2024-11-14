import express from 'express'
import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import geoip from 'geoip-lite'

const app = express()
const db = await open({
  filename: './database/game.db',
  driver: sqlite3.Database
})

// 获取地区统计
app.get('/api/stats/region', async (req, res) => {
  const stats = await db.all('SELECT * FROM region_stats ORDER BY player_count DESC')
  res.json(stats)
})

// 获取速度排行榜
app.get('/api/stats/ranking', async (req, res) => {
  const level = parseInt(req.query.level as string) || 1
  const ranking = await db.all(`
    SELECT id, region, clear_time 
    FROM player_records 
    WHERE level = ? 
    ORDER BY clear_time ASC 
    LIMIT 10
  `, [level])
  res.json(ranking)
})

// 记录游戏结果
app.post('/api/record', async (req, res) => {
  const { level, clearTime } = req.body
  const ip = req.ip
  const geo = geoip.lookup(ip)
  const region = geo ? geo.region : '未知'
  
  await db.run(`
    INSERT INTO player_records (player_ip, region, level, clear_time)
    VALUES (?, ?, ?, ?)
  `, [ip, region, level, clearTime])
  
  res.json({ success: true })
}) 