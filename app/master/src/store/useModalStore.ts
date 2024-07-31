import { ref, reactive } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { modalType, modalDataType } from '@interfaces/Modal';

const useModalStore = defineStore('Modal', () => {
  const flag = reactive<modalType>({} as modalType);

  const modalData = ref<modalDataType>({} as modalDataType);

  const openModal = (key: keyof modalType) => {
    flag[key] = true;
  };

  const openModalWithData = (key: keyof modalDataType, target: any) => {
    flag[key] = true;
    modalData.value[key] = target;
  };

  const closeModal = (key: keyof modalType) => {
    flag[key] = false;
  };

  const closeModalWithData = (key: keyof modalDataType, target: any) => {
    flag[key] = false;
    modalData.value[key] = target;
  };

  const toggleModal = (key: keyof modalType) => {
    const isFlagKey = flag[key];

    if (isFlagKey) {
      closeModal(key);
    } else {
      openModal(key);
    }
  };

  return {
    flag,
    modalData,
    openModal,
    openModalWithData,
    closeModal,
    closeModalWithData,
    toggleModal,
  };
});

export default useModalStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModalStore, import.meta.hot));
}
