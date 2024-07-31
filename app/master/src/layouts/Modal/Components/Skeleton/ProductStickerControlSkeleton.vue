<script setup lang='ts'>
import { useTranslation } from 'i18next-vue';
import icon_back from '@assets/icon/icon_back.svg';

const { t } = useTranslation();
</script>

<template>
  <div class="border-modal-2 flex h-[35.46875vw] w-[54.6875vw] flex-col rounded-[0.9375vw] bg-[#111] ">
    <div class="border-b-header-1 flex h-[9.53125vw] w-full justify-between p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]">
      <div class="flex flex-col gap-[0.9375vw]">
        <p class="typo-b-h1">
          {{ t('스티커 변경') }}
        </p>
        <p class="typo-r-h3 text-white-disabled">
          {{ t('스티커 변경 설명') }}
        </p>
      </div>
      <icon_back class="size-[1.5625vw]" />
    </div>
    <div class="flex w-[46.875vw] flex-wrap gap-[1.5625vw] p-[2.34375vw]">
      <div
        v-for="item in 5"
        :key="item"
        class="border-default-1 flex w-fit items-center justify-center gap-[0.625vw] whitespace-nowrap rounded-[15.625vw] p-[1.25vw_1.875vw]"
      >
        <div class="loading-animation size-[1.875vw] rounded-[100vw]"></div>
        <p class="typo-b-h1 loading-animation h-[1.875vw] w-[5vw] rounded-[100vw]"></p>
      </div>
    </div>
  </div>
</template>
