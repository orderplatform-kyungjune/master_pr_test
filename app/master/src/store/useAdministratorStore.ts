import { ref } from 'vue';
import {
  acceptHMRUpdate,
  defineStore,
} from 'pinia';

const useAdministratorStore = defineStore('Administrator', () => {
  const usePointer = ref<boolean>(false);

  return { usePointer };
});

export default useAdministratorStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAdministratorStore, import.meta.hot));
}
