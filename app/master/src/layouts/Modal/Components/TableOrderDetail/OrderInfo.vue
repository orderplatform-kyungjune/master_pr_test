<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useModalStore, useUserStore } from '@store/index';

const props = defineProps<{
  totalPrice: number;
  orderCnt: number;
}>();

const { t } = useTranslation();

const { closeModal } = useModalStore();

const { userAuth } = storeToRefs(useUserStore());

const getStandardPriceUnit = userAuth.value?.store?.store_standardPriceUnit
  ? userAuth.value.store.store_standardPriceUnit
  : '원';

const getTotalOrderPrice = () => props.totalPrice.toLocaleString();
</script>

<template>
  <div class="flex h-[15.78125vw] flex-col justify-between gap-[1.875vw]">
    <div class="flex flex-col gap-[1.09375vw]">
      <div
        class="flex h-[3.359375vw] w-[45.9375vw] items-baseline justify-between"
      >
        <span class="typo-r-h3 text-white-disabled flex items-end">{{
          t('총 주문 수량')
        }}</span>
        <div class="flex items-baseline gap-[0.3125vw]">
          <span class="typo-b-h0 text-white-01">{{ props.orderCnt }}</span>
          <span class="typo-b-h3 text-white-disabled">{{ t('개') }}</span>
        </div>
      </div>
      <div
        class="flex h-[3.359375vw] w-[45.9375vw] items-baseline justify-between"
      >
        <span class="typo-r-h3 text-white-disabled flex items-end">{{
          t('총 주문 금액')
        }}</span>
        <div
          v-if="getStandardPriceUnit === '원'"
          class="flex items-baseline gap-[0.3125vw]"
        >
          <span class="typo-b-h0 text-white-01">{{
            getTotalOrderPrice()
          }}</span>
          <span class="typo-b-h3 text-white-disabled">{{
            getStandardPriceUnit
          }}</span>
        </div>
        <div
          v-else
          class="flex items-baseline gap-[0.3125vw]"
        >
          <span class="typo-b-h1 text-white-disabled">{{
            getStandardPriceUnit
          }}</span>
          <span class="typo-b-h0 text-white-01">{{
            getTotalOrderPrice()
          }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-[1.25vw]">
      <div
        v-if="false"
        class="border-ghost-1 typo-b-h4 flex h-[5vw] w-[14.21875vw] items-center
          justify-center rounded-[0.625vw]"
        @click="closeModal('tableDetail')"
      >
        <span class="text-white-01">{{ t('닫기') }}</span>
      </div>
      <div
        class="typo-b-h3 btn-bg-primary text-white-01
          active:btn-bg-primary-pressed flex h-[5vw] w-[22.96875vw] items-center
          justify-center rounded-[0.625vw]"
        @click="closeModal('tableDetail')"
      >
        {{ t('닫기') }}
      </div>
    </div>
  </div>
</template>
