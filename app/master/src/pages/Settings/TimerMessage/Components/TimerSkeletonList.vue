<script setup lang='ts'>
import HeadTitle from '@layouts/UI/HeadTitle.vue';
import { t } from '@i18n/i18next.js';
</script>

<template>
  <div
    role="status"
    class="flex flex-col"
  >
    <HeadTitle :title="t('타이머 메시지')" />
    <div class="grid size-full flex-1 grid-cols-2 grid-rows-3 gap-[0.7813vw]">
      <div
        v-for="i in 5"
        :key="i"
        class="flex h-[14.8438vw] w-[40vw] items-center rounded-[0.7813vw] bg-[#FFFFFF0D] pl-[1.5625vw] pr-[1.8750vw]"
      >
        <div class="flex w-[90%] flex-col">
          <div class="loading-animation h-[3.1250vw] w-[90%] rounded-full bg-[#FFFFFF0D]"></div>
          <div class="mt-[0.7813vw] flex ">
            <div class="loading-animation bg-[#FFFFFF0D]- mb-[1.2500vw] h-[2.2656vw] w-[5.9289vw] rounded-full"></div>
            <div class="loading-animation mb-[1.2500vw] ml-[0.7813vw] h-[2.2656vw] w-[11.6336vw] rounded-full bg-[#FFFFFF0D]"></div>
          </div>
        </div>
        <div class="flex justify-end">
          <div class="loading-animation h-[2.890625vw] w-[5.3906vw] rounded-[100vw] bg-[#FFFFFF0D]"></div>
        </div>
      </div>
    </div>
    <div class="flex w-full justify-end pb-[3.1250vw] pr-[3.1250vw]">
      <div class="typo-b-h3 loading-animation h-[5vw] w-[23.4375vw] rounded-lg bg-[#FFFFFF0D]"></div>
    </div>
  </div>
</template>
