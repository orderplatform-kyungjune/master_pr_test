<script setup lang='ts'>
</script>

<template>
  <div class="scrollbar-hide grid w-full grid-cols-3 gap-[1.25vw] overflow-y-auto overflow-x-hidden pb-[1.5625vw]">
    <div
      v-for="i in 9"
      :key="i"
      class="bg-depth-02 h-[19.0625vw] w-[26.796875vw] rounded-[0.625vw] p-[1.5625vw_1.5625vw_1.5625vw_1.5625vw]"
    >
      <div class="mb-[2.1875vw] flex h-[3vw] items-center justify-start">
        <div class="loading-animation h-full w-1/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
      </div>
      <div class="h-[7.8125vw] w-full">
        <div class="typo-r-h2 text-white-01 loading-animation mb-[0.78125vw] h-2/3 w-full rounded-[100vw] bg-[#FFFFFF0D]"></div>
      </div>
      <div class="flex h-[3.28125vw] items-end">
        <div class="flex size-full items-baseline justify-between gap-[3vw]">
          <div class="typo-r-h5 text-white-disabled loading-animation h-full w-1/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
          <div class="loading-animation h-full w-2/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
        </div>
      </div>
    </div>
  </div>
</template>
