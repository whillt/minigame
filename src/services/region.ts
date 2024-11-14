import { amapService } from './amap';
import { db, Region, Player, Ranking } from './db';

interface RegionStats {
  onlineCount: number;
  todayClear: number;
  clearRate: number;
}

interface RankingItem {
  name: string;
  timeUsed: number;
  level: number;
}

export class RegionService {
  // 获取地区统计数据
  static async getRegionStats(adcode: string): Promise<RegionStats> {
    // 这里暂时返回模拟数据，实际项目中应该调用后端API
    return {
      onlineCount: Math.floor(Math.random() * 1000),
      todayClear: Math.floor(Math.random() * 100),
      clearRate: Math.floor(Math.random() * 30)
    };
  }

  // 获取地区排行榜
  static async getRegionRanking(adcode: string): Promise<RankingItem[]> {
    // 这里暂时返回模拟数据，实际项目中应该调用后端API
    return Array.from({ length: 10 }, (_, index) => ({
      name: `玩家${index + 1}`,
      timeUsed: Math.floor(Math.random() * 300),
      level: 3
    }));
  }
} 