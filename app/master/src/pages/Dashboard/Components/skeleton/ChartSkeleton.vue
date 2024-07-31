<script setup lang="ts">
import CountInfoSkeleton from '@pages/Dashboard/Components/skeleton/CountInfoSkeleton.vue';
</script>

<template>
  <div class="flex flex-col gap-[1.25vw] overflow-y-auto">
    <div class="flex gap-[1.25vw]">
      <div class="bg-depth-02 flex w-[52.1875vw] flex-col gap-[2.34375vw] rounded-[0.9375vw] border-[0.078125vw] border-[#3A414F] p-[1.875vw]">
        <div class="flex justify-between">
          <div class="loading-animation h-[2.34375vw] w-[7.8125vw] rounded-[0.625vw]"></div>
          <div class="loading-animation h-[2.34375vw] w-[7.8125vw] rounded-[0.625vw]"></div>
        </div>
        <div class="flex gap-[1.5625vw]">
          <CountInfoSkeleton />
          <div class="border-default-1 h-full w-[0.078125vw]"></div>
          <CountInfoSkeleton />
        </div>
        <div class="bg-depth-01 loading-animation h-[25.3125vw] w-full rounded-[0.625vw]"></div>
      </div>
      <div class="bg-depth-02 w-[29.6875vw] rounded-[0.9375vw] border-[0.078125vw] border-[#3A414F] p-[1.875vw]">
        <div class="loading-animation h-[2.34375vw] w-[7.8125vw] rounded-[0.625vw]"></div>
        <div class="loading-animation mt-[2.34375vw] h-[33.90625vw] rounded-[0.625vw]"></div>
        <div class="loading-animation mt-[1.5625vw] h-[4.53125vw] rounded-[0.625vw]"></div>
      </div>
    </div>
    <div class="flex gap-[1.25vw]"></div>
  </div>
</template>
