import { ref } from 'vue';
import {
  acceptHMRUpdate,
  defineStore,
} from 'pinia';

const useRefsStore = defineStore('Refs', () => {
  const tableOrderCardWrapper = ref<HTMLElement[]>([] as HTMLElement[]);
  const tableOrderTimeline = ref<HTMLElement[]>([] as HTMLElement[]);
  const toastMessageRef = ref<HTMLElement[]>([] as HTMLElement[]);
  const mainCategoryRef = ref<HTMLElement[]>([] as HTMLElement[]);
  const subCategoryRef = ref<HTMLElement[]>([] as HTMLElement[]);
  const categoryNavigatorRef = ref<HTMLElement[]>([] as HTMLElement[]);

  return {
    tableOrderCardWrapper,
    tableOrderTimeline,
    toastMessageRef,
    mainCategoryRef,
    subCategoryRef,
    categoryNavigatorRef,
  };
});

export default useRefsStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRefsStore, import.meta.hot));
}
