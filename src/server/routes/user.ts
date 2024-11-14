import express from 'express'
import bcrypt from 'bcrypt'
import { db } from '../db'

const router = express.Router()

// 检查手机号是否存在
router.get('/check-phone', async (req, res) => {
  const { phone } = req.query
  const user = await db.get('SELECT id FROM users WHERE phone = ?', [phone])
  res.json({ exists: !!user })
})

// 注册
router.post('/register', async (req, res) => {
  try {
    const { phone, password, nickname } = req.body
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const result = await db.run(
      'INSERT INTO users (phone, password, nickname) VALUES (?, ?, ?)',
      [phone, hashedPassword, nickname]
    )
    
    const user = await db.get('SELECT id, nickname, phone, region FROM users WHERE id = ?', [result.lastID])
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: '注册失败' })
  }
})

// 登录
router.post('/login', async (req, res) => {
  try {
    const { phone, password } = req.body
    const user = await db.get('SELECT * FROM users WHERE phone = ?', [phone])
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.json({ success: false, message: '手机号或密码错误' })
    }
    
    delete user.password
    res.json({ success: true, user })
  } catch (error) {
    res.status(500).json({ success: false, message: '登录失败' })
  }
})

export default router 