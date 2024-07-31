<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useOrderDetailStore } from '@store/index';
import orderIcon from '@assets/icon/icon_simple_order_logo.svg';
import arrowRight from '@assets/icon/icon_arrow_right_white.svg';

const { t } = useTranslation();

const { selectedOrder } = storeToRefs(useOrderDetailStore());

const {
  closeOrderDetailModal,
  openOrderDetailModal,
} = useOrderDetailStore();

const openOrderDetail = () => {
  closeOrderDetailModal(true);
  openOrderDetailModal(false);
};
</script>

<template>
  <div
    class="simple-order absolute bottom-[3.125vw] left-1/4 z-[1000] flex w-[42.34375vw] animate-bounce items-center justify-between rounded-[1.5625vw] p-[1.875vw]"
    @click="openOrderDetail"
  >
    <div class="flex">
      <orderIcon />
      <div class="ml-[1.25vw] flex flex-col gap-[0.78125vw]">
        <p class="typo-b-h1">
          {{ selectedOrder.table_name }}
        </p>
        <p class="typo-b-h3 text-white-01">
          {{ t('상품 주문 확인') }}
        </p>
      </div>
    </div>
    <div class="flex h-full items-center">
      <arrowRight />
    </div>
  </div>
</template>
