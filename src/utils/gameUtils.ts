// 游戏工具函数
export const waitTimeout = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const randomString = (len: number) => {
  const pool = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let res = '';
  while (len >= 0) {
    res += pool[Math.floor(pool.length * Math.random())];
    len--;
  }
  return res;
};

export const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}; 