<template>
  <div class="game-header">
    <div class="logo-container">
      <img src="@/assets/logo.gif" alt="游戏logo" class="animated-logo">
      <h1>羊了个羊</h1>
    </div>
    <div class="user-info">
      <img :src="userAvatar" alt="用户头像" class="avatar">
      <span class="username">{{ username }}</span>
    </div>
  </div>
</template>

<style scoped>
.game-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.animated-logo {
  width: 80px;
  height: 80px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}
</style> 