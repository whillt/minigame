import { ref } from 'vue';

export interface StatItem {
  name: string;
  label: string;
  value: string;
  icon: string;
}

export function useHomeStats() {
  const stats = ref<StatItem[]>([
    {
      name: 'online',
      label: '当前在线',
      value: '0',
      icon: '/src/assets/homepage/online.gif'
    },
    {
      name: 'complete',
      label: '今日通关',
      value: '0',
      icon: '/src/assets/homepage/complete.gif'
    },
    {
      name: 'percentage',
      label: '通关率',
      value: '0%',
      icon: '/src/assets/homepage/percentage.gif'
    }
  ]);

  const checkGifResources = async () => {
    console.log('开始检查GIF资源');
    for (const stat of stats.value) {
      try {
        console.log(`检查GIF资源: ${stat.name}`);
        const response = await fetch(stat.icon);
        console.log(`GIF资源 ${stat.name} 检查结果:`, response.ok);
        
        // 测试GIF是否可以正常加载
        const img = new Image();
        img.onload = () => console.log(`GIF ${stat.name} 预加载成功`);
        img.onerror = (error) => console.error(`GIF ${stat.name} 预加载失败:`, error);
        img.src = stat.icon;
      } catch (error) {
        console.error(`GIF资源 ${stat.name} 加载失败:`, error);
      }
    }
  };

  return {
    stats,
    checkGifResources
  };
}