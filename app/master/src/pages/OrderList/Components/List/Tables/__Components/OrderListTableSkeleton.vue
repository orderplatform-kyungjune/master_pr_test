<script setup lang='ts'>
import { useTranslation } from 'i18next-vue';

const { t } = useTranslation();
</script>

<template>
  <div class="bg-depth-01 scrollbar-hide h-[50.5vw] w-full rounded-t-[0.625vw]">
    <div class="size-full border-collapse text-center">
      <div class="typo-r-h5 text-white-01 bg-depth-03 sticky top-0 z-10 h-[4.0625vw] rounded-t-[0.625vw]">
        <div class="typo-r-h5 flex size-full items-center">
          <div class="typo-r-h5 w-[7.109375vw]">
            {{ t("주문 번호") }}
          </div>
          <div class="typo-r-h5 w-[7.890625vw]">
            {{ t("주문 시간") }}
          </div>
          <div class="typo-r-h5 w-[6.71875vw]">
            {{ t("주문 유형") }}
          </div>
          <div class="typo-r-h5 w-[10.859375vw]">
            {{ t("테이블명") }}
          </div>
          <div class="typo-r-h5 w-[35.46875vw]">
            {{ t("주문 내역") }}
          </div>
          <div class="typo-r-h5 w-[14.765625vw]">
            {{ t("완료 여부") }}
          </div>
        </div>
      </div>
      <div class="bg-depth-01 scrollbar-hide h-[45vw] w-full overflow-y-auto">
        <div class="scrollbar-hide h-[45vw] w-full overflow-y-auto">
          <div
            v-for="i in 9"
            :key="i"
            class="typo-b-h4 flex h-[5.625vw] border-b-[0.078125vw] border-b-[#252A35] active:bg-[#FFFFFF0D]"
          >
            <div class="typo-r-h3 flex w-[7.109375vw] items-center justify-center">
              <div class="loading-animation size-2/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
            </div>
            <div class="typo-r-h4 flex h-[5.625vw] w-[7.890625vw] items-center justify-center">
              <div class="loading-animation size-2/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
            </div>
            <div class="flex h-[5.625vw] w-[6.71875vw] items-center justify-center">
              <div class="loading-animation size-2/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
            </div>
            <div class="typo-r-h3 flex w-[10.859375vw] items-center justify-center">
              <div class="loading-animation h-2/3 w-full rounded-[100vw] bg-[#FFFFFF0D]"></div>
            </div>
            <div class="typo-b-h2 flex h-[5.625vw] w-[35.46875vw] items-center justify-center gap-[0.78125vw] px-[1.5625vw]">
              <div class="loading-animation size-2/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
            </div>
            <div class="flex h-[5.625vw] w-[14.84375vw] items-center justify-center">
              <div class="loading-animation size-2/3 rounded-[100vw] bg-[#FFFFFF0D]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
