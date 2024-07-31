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
  <div class="scrollbar-hide absolute mt-[5vw] flex h-[3.75vw] w-full overflow-x-auto">
    <div class="relative flex max-h-[3.75vw] gap-[1.5625vw]">
      <div
        v-for="i in 10"
        :key="i"
        class="loading-animation w-[10vw] rounded-[1vw] bg-[#FFFFFF0D]"
      ></div>
    </div>
  </div>
  <div class="relative mb-[1.5625vw] mt-[10.3125vw] flex h-[5.625vw] w-full flex-col gap-[2.34375vw]">
    <div class="h-[40vw] w-full">
      <div class="flex w-full flex-col gap-[0.78125vw] overflow-y-auto">
        <div
          v-for="i in 5"
          :key="i"
          class="flex h-[9.6875vw] w-full items-center justify-between gap-[2.34375vw] rounded-[0.78125vw] bg-[#FFFFFF0D] p-[1.875vw_1.5625vw]"
        >
          <div class="flex w-1/2 items-center gap-[2vw]">
            <div class="typo-r-h2 loading-animation line-clamp-1 size-[6vw] break-words rounded-[1vw]"></div>
            <div class="flex flex-col gap-[1vw]">
              <div class="typo-r-h2 loading-animation line-clamp-1 h-[2.34375vw] w-[20.3125vw] break-words rounded-[5vw]"></div>
              <div class="flex gap-[1vw]">
                <div class="typo-r-h2 loading-animation line-clamp-1 h-[2.34375vw] w-[6vw] break-words rounded-[5vw]"></div>
                <div class="typo-r-h2 loading-animation line-clamp-1 h-[2.34375vw] w-[6vw] break-words rounded-[5vw]"></div>
                <div class="typo-r-h2 loading-animation line-clamp-1 h-[2.34375vw] w-[6vw] break-words rounded-[5vw]"></div>
              </div>
            </div>
          </div>
          <div class="flex justify-end gap-[2vw]">
            <div class="loading-animation h-[4vw] w-[12vw] rounded-[100vw] bg-[#FFFFFF0D]"></div>
            <div class="loading-animation h-[4vw] w-[12vw] rounded-[100vw] bg-[#FFFFFF0D]"></div>
            <div class="loading-animation h-[4vw] w-[16vw] rounded-[100vw] bg-[#FFFFFF0D]"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
