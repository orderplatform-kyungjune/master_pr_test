import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import { ToastType } from '@interfaces/Toast';

const useToastStore = defineStore('Toast', () => {
  const refToasts = ref<ToastType[]>([] as ToastType[]);
  const toasts = computed({
    get: () => refToasts.value,
    set: (value) => {
      refToasts.value = value;
    },
  });

  const removeToast = (id: number) => {
    toasts.value = toasts.value.filter((toast) => toast.id !== id);
  };

  const addToast = (
    message: string,
    status: 'error' | 'warning' | 'success' | 'info',
    duration: number,
    teleport?: boolean,
  ) => {
    if (toasts.value?.length > 1) {
      toasts.value.pop();
    }
    const id = Number((Math.random() * 100).toFixed(0));
    toasts.value.push({
      id,
      message,
      status,
      duration,
      teleport: teleport ?? false, // TODO: 참조하는 곳없음 삭제 필요.
    });

    setTimeout(async () => {
      removeToast(id);
    }, duration * 1000);
  };

  return {
    toasts,
    addToast,
  };
});

export default useToastStore;
