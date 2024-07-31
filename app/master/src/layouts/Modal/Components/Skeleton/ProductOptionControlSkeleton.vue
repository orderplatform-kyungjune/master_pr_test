<script setup lang='ts'>
import { useTranslation } from 'i18next-vue';
import { useModalStore } from '@store/index';
import icon_back from '@assets/icon/icon_back.svg';

const { t } = useTranslation();

const { closeModalWithData } = useModalStore();
</script>

<template>
  <div class="border-modal-2 flex h-[53.4375vw] w-[88.59375vw] flex-col rounded-[0.9375vw] bg-[#111] ">
    <div class="border-b-header-1 flex h-[6.7188vw] w-full items-center justify-between p-[2.109375vw_2.34375vw]">
      <p class="typo-b-h1 ">
        {{ t('옵션 상태 변경') }}
      </p>
      <icon_back
        class="size-[1.5625vw]"
        @click="closeModalWithData('productOptions', { goodsCode: '' })"
      />
    </div>
    <div class="size-full p-[2.34375vw_2.34375vw_0_2.34375vw]">
      <div class="scrollbar-hide flex h-[44.0625vw] w-[84.375vw] flex-col gap-[2.34375vw] overflow-y-auto">
        <div
          v-for="i in 2"
          :key="i"
          class="flex w-full flex-col gap-[1.5625vw]"
        >
          <div class="flex w-full items-center justify-between">
            <div class="typo-b-h2 flex flex-col gap-[0.78125vw]">
              <div class="flex h-[2.34375vw] gap-[0.78125vw]">
                <span class="text-primary-01 loading-animation w-[10vw] rounded-[100vw]"></span>
                <span class="text-white-01 loading-animation w-[25vw] rounded-[100vw]"></span>
              </div>
              <span class="text-white-disabled typo-r-h3 loading-animation h-[1.875vw] rounded-[100vw]"></span>
            </div>
            <span class="text-primary-01 typo-r-h4 loading-animation h-[1.5625vw] w-[7.109375vw] rounded-[100vw]"></span>
          </div>
          <div class="grid grid-cols-4 gap-[1.25vw]">
            <div
              v-for="is in 8"
              :key="is"
              class="border-default-1 flex h-[12.1875vw] w-[20.15625vw] flex-col gap-[1.5625vw] rounded-[0.625vw] p-[2.34375vw_1.875vw_1.5625vw_1.875vw]"
            >
              <span class="typo-b-h4 loading-animation flex h-[1.875vw] w-full items-center justify-center rounded-[100vw]"></span>
              <div class="typo-r-h3 loading-animation line-clamp-1 h-[3.90625vw] w-full rounded-[100vw]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
