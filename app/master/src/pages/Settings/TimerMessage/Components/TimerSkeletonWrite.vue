<script setup lang='ts'>
import HeadTitle from '@layouts/UI/HeadTitle.vue';
import { t } from '@i18n/i18next.js';
</script>

<template>
  <div
    role="status"
    class="flex h-full flex-col"
  >
    <div class="mb-[1.2500vw] h-[2.5vw] w-[21vw] rounded-full">
      <HeadTitle :title="t('타이머 메시지 관리')" />
    </div>
    <div class="flex flex-1 flex-col">
      <div class="loading-animation my-[1.5625vw] h-[2.3438vw] w-[16.4063vw]  rounded-full bg-[#FFFFFF0D]"></div>
      <div class="typo-r-h3 bg-depth-02 loading-animation h-[5vw] w-[66.7188vw]  rounded-[0.6250vw] bg-[#FFFFFF0D]"></div>
      <div class="mt-[3.125vw] flex flex-col">
        <div class="loading-animation mt-[1.5625vw] h-[2.3438vw] w-[16.4063vw] rounded-full bg-[#FFFFFF0D]"></div>
        <div class="loading-animation my-[1vw] h-[1.8750vw] w-[25.7813vw]  rounded-full bg-[#FFFFFF0D]"></div>
        <div class="mt-[1vw] flex gap-[4.5625vw]">
          <div class="typo-r-h3 bg-depth-02 loading-animation h-[9.0625vw] w-[23.9063vw] rounded-[0.6250vw] bg-[#FFFFFF0D]"></div>
          <div class="typo-r-h3 bg-depth-02 loading-animation h-[9.0625vw] w-[23.9063vw] rounded-[0.6250vw] bg-[#FFFFFF0D]"></div>
        </div>
      </div>
    </div>
    <div class="mb-[3.1250vw] flex justify-end gap-[1.5625vw]">
      <div class="loading-animation h-[5vw] w-[10.3125vw] rounded-[0.6250vw] bg-[#FFFFFF0D]"></div>
      <div class="typo-b-h3 loading-animation h-[5vw] w-[23.4375vw] rounded-lg bg-[#FFFFFF0D]"></div>
    </div>
  </div>
</template>
