<script setup lang='ts'>
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useModalStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import kakao_arrow_right from '@assets/icon/kakao/kakao_arrow_right.svg?url';
import kakao_arrow_left from '@assets/icon/kakao/kakao_arrow_left.svg?url';
import icon_kakao from '@assets/icon/kakao/icon_kakao.svg?url';

const { t } = useTranslation();

const { openModal } = useModalStore();

const isOpen = ref<boolean>(false);

const permuteKakao = () => {
  isOpen.value = !isOpen.value;
};

const getKakaoCsClass = (): DynamicClassType => ({
  'text-black-01 absolute bottom-[3.125vw] z-[5] h-[6.875vw] rounded-l-[7.8125vw] bg-[#FAE100] transition-all duration-200 w-[11.71875vw]': true,
  'right-0': isOpen.value,
  'right-[-9.375vw]': !isOpen.value,
});
</script>

<template>
  <div :class="getKakaoCsClass()">
    <div class="relative flex size-full">
      <div
        class="relative left-0 flex h-full w-[2.578125vw] items-center justify-center gap-[0.78125vw] rounded-l-[7.8125vw] py-[1.171875vw]"
        @click="permuteKakao"
      >
        <img
          class="w-[0.625vw h-[0.9375vw]"
          :src="isOpen ? kakao_arrow_left : kakao_arrow_right"
          alt="kakao_arrow_right"
        />
      </div>
      <div
        id="카카오톡 상담 오픈"
        class="typo-b-h5 my-[1.328125vw] flex w-[9.140625vw] flex-col items-center gap-[0.46875vw] border-l-[0.078125vw] border-l-[#EDD600] text-[#371D1E]"
        @click="openModal('kakaoCs')"
      >
        <img
          id="카카오톡 상담 오픈"
          class="h-[2.34375vw] w-[2.578125vw]"
          :src="icon_kakao"
          alt="icon_kakao"
        />
        <span
          id="카카오톡 상담 오픈"
          class="whitespace-nowrap"
        >{{ t('상담신청') }}</span>
      </div>
    </div>
  </div>
</template>
