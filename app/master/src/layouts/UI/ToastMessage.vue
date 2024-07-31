<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useModalStore, useToastStore, useRefsStore } from '@store/index';
import { ToastType } from '@interfaces/Toast';

const { toasts } = storeToRefs(useToastStore());
const { toastMessageRef } = storeToRefs(useRefsStore());
const { flag } = useModalStore();

const isModalOpen = computed(
  () =>
    flag.tableDetail ||
    flag.languageChange ||
    flag.sendingNoticeFile ||
    flag.commonConfirm ||
    flag.timeSelect ||
    flag.urgentNotice ||
    flag.productOptions ||
    flag.productSticker ||
    flag.productSale ||
    flag.kakaoCs ||
    flag.administrator ||
    flag.orderDetail,
);

const getToastsClass = (toast: ToastType) => {
  let mainStyle =
    'flex items-center max-w-[82.8125vw] absolute rounded-[1.5625vw] border-2 p-[1.875vw_3.125vw] text-center typo-r-h2 drop-shadow-md animate-fadeup ';

  if (toast.status === 'error') {
    mainStyle += 'toast-error';
  } else if (toast.status === 'warning') {
    mainStyle += 'toast-warning';
  } else if (toast.status === 'success') {
    mainStyle += 'toast-success';
  } else if (toast.status === 'info') {
    mainStyle += 'toast-info';
  }

  return mainStyle;
};
</script>

<template>
  <Teleport
    v-if="isModalOpen"
    to="#app"
  >
    <div
      class="absolute bottom-[3.4375vw] left-1/2 z-[1000] flex -translate-x-1/2
        flex-col-reverse items-center"
    >
      <!--      <div-->
      <!--        v-for="toast in toasts"-->
      <!--        ref="toastMessageRef"-->
      <!--        :key="toast.id"-->
      <!--        v-motion="`toastTransition-${toast.id}`"-->
      <!--        :class="getToastsClass(toast)"-->
      <!--        :initial="{ y: 300, opacity: 0 }"-->
      <!--        :enter="{-->
      <!--          y: 0,-->
      <!--          opacity: 1,-->
      <!--        }"-->
      <!--        :leave="{-->
      <!--          y: 300,-->
      <!--          opacity: 0,-->
      <!--          transition: {-->
      <!--            duration: 500,-->
      <!--            type: 'keyframes',-->
      <!--            ease: 'easeIn',-->
      <!--          },-->
      <!--        }"-->
      <!--      >-->
      <div
        v-for="toast in toasts"
        ref="toastMessageRef"
        :key="toast.id"
        :class="getToastsClass(toast)"
      >
        <p class="w-max">
          {{ toast.message }}
        </p>
      </div>
    </div>
  </Teleport>
  <div
    v-else-if="!isModalOpen"
    class="absolute bottom-[3.4375vw] left-1/2 z-[1000] flex -translate-x-1/2
      flex-col-reverse items-center"
  >
    <!--    <div-->
    <!--      v-for="toast in toasts"-->
    <!--      ref="toastMessageRef"-->
    <!--      :key="toast.id"-->
    <!--      v-motion="`toastTransition-${toast.id}`"-->
    <!--      :class="getToastsClass(toast)"-->
    <!--      :initial="{ y: 300, opacity: 0 }"-->
    <!--      :enter="{-->
    <!--        y: 0,-->
    <!--        opacity: 1,-->
    <!--      }"-->
    <!--      :leave="{-->
    <!--        y: 300,-->
    <!--        opacity: 0,-->
    <!--        transition: {-->
    <!--          duration: 500,-->
    <!--          type: 'keyframes',-->
    <!--          ease: 'easeIn',-->
    <!--        },-->
    <!--      }"-->
    <!--    >-->
    <div
      v-for="toast in toasts"
      ref="toastMessageRef"
      :key="toast.id"
      :class="getToastsClass(toast)"
    >
      <p class="w-max">
        {{ toast.message }}
      </p>
    </div>
  </div>
</template>
