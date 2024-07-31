<script setup lang="ts">
import { useTranslation } from 'i18next-vue';

const { t } = useTranslation();
</script>

<template>
  <div class="bg-depth-01 mt-[1.5625vw] h-[15.3125vw] w-full rounded-[0.625vw]">
    <div class="size-full border-collapse text-center">
      <div
        class="typo-r-h5 text-white-01 bg-depth-03 sticky top-0 z-10
          h-[4.0625vw] rounded-t-[0.625vw]"
      >
        <div class="flex size-full items-center">
          <div class="typo-r-h5 w-[9%]">
            {{ t('주문 번호') }}
          </div>
          <div class="typo-r-h5 w-[10%]">
            {{ t('주문 시간') }}
          </div>
          <div class="typo-r-h5 w-[8%]">
            {{ t('주문 유형') }}
          </div>
          <div class="typo-r-h5 w-[13%]">
            {{ t('테이블명') }}
          </div>
          <div class="typo-r-h5 w-[42%]">
            {{ t('주문 내역') }}
          </div>
          <div class="typo-r-h5 w-[18%]">
            {{ t('완료 여부') }}
          </div>
        </div>
      </div>
      <div class="bg-depth-01 h-[11.25vw] w-full rounded-[0.625vw]">
        <div
          class="typo-b-h4 flex h-[5.625vw] border-b-[0.078125vw]
            border-b-[#252A35]"
        >
          <div class="typo-r-h3 flex w-[9%] items-center justify-center">
            <span>002</span>
          </div>
          <div
            class="typo-r-h4 flex h-[5.625vw] w-[10%] items-center
              justify-center"
          >
            21:11:23
          </div>
          <div
            class="text-primary-01 flex h-[5.625vw] w-[8%] items-center
              justify-center"
          >
            <span>{{ t('첫주문') }}</span>
          </div>
          <div class="typo-r-h3 flex w-[13%] items-center justify-center">
            A4
          </div>
          <div
            class="typo-b-h2 flex h-[5.625vw] w-[42%] items-center justify-start
              gap-[0.78125vw] px-[1.5625vw]"
          >
            <span class="line-clamp-1 max-w-[75%] text-start">
              {{ t('샘플주문') }}
            </span>
            <span class="max-w-[25%] whitespace-nowrap">
              {{ `${t('외')} 3${t('개')}` }}
            </span>
          </div>
          <div class="flex h-[5.625vw] w-[18%] items-center justify-center">
            <div
              class="typo-b-h4 text-white-01 mx-auto flex h-[3.125vw]
                w-[12.34375vw] items-center justify-center rounded-[0.625vw]
                bg-[#292929] text-center"
            >
              {{ t('완료') }}
            </div>
          </div>
        </div>
        <div
          class="typo-b-h4 flex h-[5.625vw] border-b-[0.078125vw]
            border-b-[#252A35]"
        >
          <div class="typo-r-h3 flex w-[9%] items-center justify-center">
            <span>001</span>
          </div>
          <div
            class="typo-r-h4 flex h-[5.625vw] w-[10%] items-center
              justify-center"
          >
            12:34:56
          </div>
          <div
            class="text-warning-01 flex h-[5.625vw] w-[8%] items-center
              justify-center"
          >
            <span>{{ t('주문') }}</span>
          </div>
          <div class="typo-r-h3 flex w-[13%] items-center justify-center">
            W2
          </div>
          <div
            class="typo-b-h2 flex h-[5.625vw] w-[42%] items-center justify-start
              gap-[0.78125vw] px-[1.5625vw]"
          >
            <span class="line-clamp-1 max-w-[75%] text-start">
              {{ t('샘플주문') }}
            </span>
            <span class="max-w-[25%] whitespace-nowrap">
              {{ `${t('외')} 3${t('개')}` }}
            </span>
          </div>
          <div class="flex h-[5.625vw] w-[18%] items-center justify-center">
            <div
              class="typo-b-h4 text-black-01 mx-auto flex h-[3.125vw]
                w-[12.34375vw] items-center justify-center rounded-[0.625vw]
                bg-[#FFF] text-center"
            >
              {{ t('미완료') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
