<script setup lang="ts">

</script>

<template>
  <div class="size-full">
    <div class="mb-[1.875vw] h-[1.875vw] w-full cursor-pointer">
      <div class="loading-animation h-full w-1/3 rounded-[0.625vw]"></div>
    </div>
    <div class="border-b-default-1 mb-[1.5625vw] flex h-[6.09375vw] w-full flex-col gap-[0.78125vw]">
      <div class="typo-b-h2 loading-animation flex h-[2.34375vw] w-2/3 gap-[0.78125vw] rounded-[0.625vw]"></div>
      <span class="typo-r-h4 text-black-disabled loading-animation h-[1.5625vw] w-3/12 rounded-[0.625vw]"></span>
    </div>
    <div class="typo-b-h2 flex h-[44.84375vw] w-full flex-col gap-3 overflow-y-auto">
      <div
        v-for="i in 12"
        :key="i"
        :class="`loading-animation h-[2.34375vw] w-[${(Math.random() * 12).toFixed(0)}/12] rounded-[0.625vw]`"
      ></div>
      <div class="typo-b-h4 loading-animation text-black-01 mt-[3.125vw] flex h-[4.53125vw] w-[26.328125vw] items-center justify-center rounded-[0.625vw] bg-[#FFFFFF]"></div>
    </div>
  </div>
</template>
