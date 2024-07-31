<script setup lang='ts'>

</script>

<template>
  <div class="bg-depth-03 flex w-full items-center justify-between rounded-t-[0.625vw] p-[1.25vw_1.5625vw]">
    <div class="loading-animation flex h-[2.5vw] w-[13vw] gap-[0.625vw] rounded-full bg-[#FFFFFF0D]"></div>
    <div class="loading-animation flex h-[2.5vw] w-[10.15625vw] gap-[0.78125vw] rounded-full bg-[#FFFFFF0D]"></div>
  </div>
  <div class="relative flex h-[43.75vw] w-full flex-col p-[1.25vw]">
    <div class="relative size-full">
      <div class="flex justify-between">
        <div class="loading-animation h-[1.875vw] w-[8vw] rounded-full bg-[#FFFFFF0D]"></div>
        <div class="loading-animation typo-b-h3 text-white-01 line-clamp-1 w-[10.9375vw] gap-[0.78125vw] rounded-full bg-[#FFFFFF0D] pl-[3.359375vw]"></div>
      </div>
      <div class="scrollbar-hide relative top-[1.25vw] h-[calc(100%_-_2.5vw)] w-full overflow-y-scroll">
        <div class="scrollbar-hide absolute flex w-full flex-col gap-[0.78125vw]">
          <div
            v-for="(_, index) in 3"
            :key="index"
            class="flex w-full flex-col rounded-[0.625vw] border-[0.078125vw] border-[#3A414F]"
          >
            <div class="bg-depth-03 flex h-[3.4375vw] w-full items-center justify-between rounded-t-[0.625vw] p-[0.78125vw_1.25vw_0.78125vw_0.46875vw]">
              <span class="loading-animation typo-b-h3 text-white-01 h-full w-[18vw] rounded-full bg-[#FFFFFF0D]"></span>
              <span class="typo-r-h6 text-white-disabled loading-animation h-full w-[6vw] rounded-full bg-[#FFFFFF0D]"></span>
            </div>
            <div class="typo-r-h5 flex w-full flex-col gap-[0.46875vw] p-[0.78125vw_1.25vw]">
              <div
                v-for="i in 3"
                :key="i"
                class="flex gap-[0.625vw]"
              >
                <span class="loading-animation text-white-disabled h-[1.40625vw] w-full rounded-full bg-[#FFFFFF0D]"></span>
              </div>
            </div>
            <div class="flex h-[4.140625vw] w-full items-center justify-between border-t-[0.078125vw] border-solid border-[#3A414F] p-[1.25vw]">
              <span class="loading-animation typo-r-h5 h-full w-[8vw] rounded-full bg-[#FFFFFF0D]"></span>
              <span class="loading-animation w-[6vw]] typo-b-h4 text-primary-01 h-full rounded-full bg-[#FFFFFF0D]"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
