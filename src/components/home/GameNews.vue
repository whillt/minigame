<template>
  <div class="game-news">
    <h2>最新动态</h2>
    <div class="news-list">
      <div v-for="news in newsItems" 
           :key="news.id" 
           class="news-item">
        <div class="news-date">{{ formatDate(news.date) }}</div>
        <div class="news-content">
          <h3>{{ news.title }}</h3>
          <p>{{ news.content }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const newsItems = [
  {
    id: 1,
    date: new Date('2024-01-15'),
    title: '新版本更新公告',
    content: '增加新关卡、优化游戏体验'
  },
  // ... 更多新闻数据
];

const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN');
};
</script> 