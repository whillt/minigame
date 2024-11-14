import { ref } from 'vue';

export function useHomeAnimation() {
  const animationInitialized = ref(false);
  const gifLoaded = ref<Record<string, boolean>>({});

  const initializeAnimations = () => {
    console.log('开始初始化动画效果');
    
    // 初始化标题动画
    const titleSection = document.querySelector('.title-section');
    console.log('标题区域元素:', titleSection);
    if (titleSection) {
      titleSection.classList.add('animate-fade-in');
      console.log('已添加标题动画类');
    }

    // 初始化统计卡片动画
    const cards = document.querySelectorAll('.stat-card');
    console.log('找到统计卡片数量:', cards.length);
    
    cards.forEach((card, index) => {
      console.log(`初始化第 ${index + 1} 个卡片动画`);
      card.classList.add('animate-fade-in');
      (card as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });

    animationInitialized.value = true;
    console.log('动画初始化完成状态:', animationInitialized.value);
  };

  const handleGifLoad = (gifName: string) => {
    console.log(`GIF加载成功: ${gifName}`);
    gifLoaded.value[gifName] = true;
  };

  const handleGifError = (gifName: string, error: Event) => {
    console.error(`GIF加载失败: ${gifName}`, error);
    gifLoaded.value[gifName] = false;
  };

  return {
    animationInitialized,
    gifLoaded,
    initializeAnimations,
    handleGifLoad,
    handleGifError
  };
} 