import { defineStore } from 'pinia'

interface User {
  id: number
  nickname: string
  phone: string
  region: string
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.user,
  },
  
  actions: {
    setUser(user: User | null) {
      this.user = user
    },
    
    logout() {
      this.user = null
    },
  },
}) 