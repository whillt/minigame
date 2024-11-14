// 高德地图服务
const AMAP_KEY = '7270b543857d7d553de828e3f6f81c6f';

interface LocationInfo {
  province: string;
  city: string;
  district: string;
  adcode: string;
}

class AmapService {
  private static instance: AmapService;
  
  private constructor() {}
  
  static getInstance() {
    if (!AmapService.instance) {
      AmapService.instance = new AmapService();
    }
    return AmapService.instance;
  }

  // 初始化高德地图SDK
  async initAMap(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.AMap) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
      script.onerror = reject;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  // 获取IP定位信息
  async getLocation(): Promise<LocationInfo> {
    try {
      await this.initAMap();
      return new Promise((resolve, reject) => {
        window.AMap.plugin('AMap.CitySearch', () => {
          const citySearch = new window.AMap.CitySearch();
          citySearch.getLocalCity((status: string, result: any) => {
            if (status === 'complete' && result.info === 'OK') {
              resolve({
                province: result.province,
                city: result.city,
                district: result.district || '',
                adcode: result.adcode
              });
            } else {
              reject(new Error('Failed to get location'));
            }
          });
        });
      });
    } catch (error) {
      console.error('获取位置信息失败:', error);
      throw error;
    }
  }
}

export const amapService = AmapService.getInstance(); 