<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useDashboardStore } from '@store/index';

const { t } = useTranslation();

const { dashboardData } = storeToRefs(useDashboardStore());

const getProductClass = (index: number) => ({
  'bg-depth-01 typo-r-h4 flex h-[5vw]': true,
  'rounded-b-[0.625vw]': index === 5,
  'border-b-list-1': index !== 5,
});
</script>

<template>
  <div class="bg-depth-02 w-[29.6875vw] rounded-[0.9375vw] border-[0.078125vw] border-[#3A414F] p-[1.875vw]">
    <div class="flex items-center justify-between">
      <span class="typo-b-h3">
        {{ t("인기 상품") }}
      </span>
    </div>
    <div class="mt-[2.34375vw]">
      <div class="bg-depth-03 typo-r-h5 flex rounded-t-[0.625vw]">
        <div class="flex w-[70%] items-center justify-center py-[1.25vw]">
          {{ t("상품명") }}
        </div>
        <div class="flex w-[30%] items-center justify-center py-[1.25vw]">
          {{ t("주문건수") }}
        </div>
      </div>
      <div
        v-for="(item, i) in dashboardData.bestGoods"
        :key="i"
        :class="getProductClass(i)"
      >
        <div class="flex w-[70%] items-center justify-center p-[1.25vw_1.171875vw]">
          <span class="line-clamp-1">{{ item.goodName }}</span>
        </div>
        <div class="flex w-[30%] items-center justify-center gap-[0.15625vw] py-[1.25vw]">
          <span class="typo-b-h3">{{ item.orderCnt }}</span>
          <span>{{ t('건') }}</span>
        </div>
      </div>
    </div>
    <div class="bg-alpha-white-100 typo-b-h4 active:text-white-01 mt-[1.5625vw] flex h-[4.53125vw] items-center justify-center rounded-[0.625vw] text-black active:bg-[#FFFFFF33]">
      {{ t('더보기') }}
    </div>
  </div>
</template>
