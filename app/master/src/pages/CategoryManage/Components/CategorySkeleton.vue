<script setup lang="ts">

</script>

<template>
  <div class="scrollbar-hide absolute flex h-[3.75vw] w-full overflow-x-auto">
    <div class="relative flex max-h-[3.75vw] gap-[1.5625vw]">
      <div
        v-for="i in 10"

        :key="i"
        class="loading-animation w-[10vw] rounded-[1vw] bg-[#FFFFFF0D]"
      ></div>
    </div>
  </div>
  <div class="relative mb-[1.5625vw] mt-[5.3125vw] flex h-[4.6875vw] w-full items-center justify-between">
    <div class="flex h-full flex-col gap-[0.78125vw]">
      <div class="loading-animation h-[2.34375vw] w-[15vw] rounded-[1vw] bg-[#FFFFFF0D]"></div>
      <div class="loading-animation h-[1.5625vw] w-[25vw] rounded-[1vw] bg-[#FFFFFF0D]"></div>
    </div>
    <div class="loading-animation h-[2.890625vw] w-[5.390625vw] rounded-[100vw] bg-[#FFFFFF0D]"></div>
  </div>
  <div class="relative mb-[1.5625vw] mt-[3.046875vw] flex h-[4.6875vw] w-full flex-col gap-[2.34375vw]">
    <div class="flex h-full flex-col gap-[0.78125vw]">
      <div class="loading-animation h-[2.34375vw] w-[15vw] rounded-[1vw] bg-[#FFFFFF0D]"></div>
      <div class="loading-animation h-[1.5625vw] w-[25vw] rounded-[1vw] bg-[#FFFFFF0D]"></div>
    </div>
    <div class="h-[40vw] w-full">
      <div class="grid w-full grid-cols-3 gap-[0.78125vw] overflow-y-auto">
        <div
          v-for="i in 9"
          :key="i"
          class="flex h-[11.25vw] w-[26.796875vw] flex-col gap-[2.34375vw] rounded-[0.78125vw] bg-[#FFFFFF0D] p-[1.875vw_1.5625vw]"
        >
          <div class="typo-r-h2 loading-animation line-clamp-1 h-[2.34375vw] break-words rounded-[5vw]"></div>
          <div class="flex justify-end">
            <div class="loading-animation h-[2.890625vw] w-[5.390625vw] rounded-[100vw] bg-[#FFFFFF0D]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
