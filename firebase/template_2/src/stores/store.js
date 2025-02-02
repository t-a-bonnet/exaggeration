import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useStore = defineStore('store', () => {
  const pid = ref(null);
  const list = ref(null);
  const index = ref(null);
  const currentItem = computed(()=>list?.value[index?.value]);
  function nextItem(){
    index.value+=1;
    if(list.value!=null && index.value >= list.value.length){
      return "end";
    } else {
      return null;
    }
  }  

  return { pid, list, index, currentItem, nextItem }
}, {
  persist: true
})
