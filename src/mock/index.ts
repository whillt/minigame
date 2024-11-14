import { createServer } from 'miragejs'

export function makeServer() {
  return createServer({
    routes() {
      this.get("/api/stats/region", () => {
        return [
          { region: "北京", player_count: 1000, clear_count: 5000 },
          { region: "上海", player_count: 800, clear_count: 4000 },
          { region: "广州", player_count: 600, clear_count: 3000 },
        ]
      })

      this.get("/api/stats/ranking", (schema, request) => {
        const level = request.queryParams.level
        return [
          { id: 1, region: "北京", clear_time: 120 },
          { id: 2, region: "上海", clear_time: 125 },
          { id: 3, region: "广州", clear_time: 130 },
        ]
      })
    },
  })
} 