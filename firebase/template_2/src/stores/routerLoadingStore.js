import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useRouterLoadingStore = defineStore('routerLoadingStore', () => {
  const routerLoading = ref(false)
  
  return { routerLoading }
})
