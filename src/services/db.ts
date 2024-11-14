import Dexie from 'dexie';

export interface Region {
  id?: number;
  adcode: string;
  province: string;
  city: string;
  district: string;
  totalPlayers: number;
  clearCount: number;
  updateTime: Date;
}

export interface Player {
  id?: number;
  name: string;
  regionId: string;
  bestTime: number;
  maxLevel: number;
  lastPlayTime: Date;
}

export interface Ranking {
  id?: number;
  playerId: number;
  regionId: string;
  score: number;
  timeUsed: number;
  createTime: Date;
}

class GameDatabase extends Dexie {
  regions: Dexie.Table<Region, number>;
  players: Dexie.Table<Player, number>;
  rankings: Dexie.Table<Ranking, number>;

  constructor() {
    super('GameDB');
    
    this.version(1).stores({
      regions: '++id, adcode, province, city, district',
      players: '++id, name, regionId',
      rankings: '++id, playerId, regionId, score'
    });
    
    this.regions = this.table('regions');
    this.players = this.table('players');
    this.rankings = this.table('rankings');
  }
}

export const db = new GameDatabase(); 