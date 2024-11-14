-- 用户表
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL, -- 存储加密后的密码
    region VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 游戏记录表
CREATE TABLE game_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level INTEGER NOT NULL,
    clear_time INTEGER NOT NULL, -- 毫秒为单位
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- 速度排行榜视图
CREATE VIEW speed_ranking AS
SELECT 
    r.level,
    r.clear_time,
    u.nickname,
    u.region,
    r.created_at
FROM game_records r
JOIN users u ON r.user_id = u.id; 