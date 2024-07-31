<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import Slider from '@vueform/slider';
import { useLocalStorageData } from '@utils/localStorage';
import { fontRate, setCurrentFontSize } from '@utils/commonUtils';
import SampleOrderList from '@pages/Settings/FontManage/Components/SampleOrderList.vue';
import HeadTitle from '@layouts/UI/HeadTitle.vue';

const { t } = useTranslation();

const currentSize = useLocalStorageData('font-size', 2);

const format = (value: number) => {
  let percent = 100;

  // TODO: fontRate 의 비율이 10% 단위가 된다면 fontRate 값을 비율만큼 화면에 표실 할수 있도록 해야함.
  if (value === 0) percent = 80;
  if (value === 1) percent = 90;
  if (value === 2) percent = 100;
  if (value === 3) percent = 110;
  if (value === 4) percent = 120;

  return `${percent}%`;
};

const increaseSize = () => {
  if (currentSize.value < fontRate.length - 1) {
    currentSize.value += 1;
    setCurrentFontSize(currentSize.value);
  }
};

const decreaseSize = () => {
  if (currentSize.value > 0) {
    currentSize.value -= 1;
    setCurrentFontSize(currentSize.value);
  }
};

const setNormalSize = () => {
  if (currentSize.value !== 2) {
    currentSize.value = 2;
    setCurrentFontSize(currentSize.value);
  }
};
</script>

<template>
  <div class="relative size-full">
    <HeadTitle
      class="mb-[3.125vw]"
      :title="t('글자 크기 변경')"
    />
    <p class="typo-r-h4 text-black-disabled">
      {{ t('글자 크기 변경 안내') }}
    </p>
    <SampleOrderList />
    <div
      class="absolute bottom-[26.71875vw] flex w-full items-center
        justify-center gap-[2.5vw]"
    >
      <p
        id="글자 크기 변경 - 폰트 축소 클릭"
        class="cursor-pointer text-[2.5vw] font-bold"
        @click="decreaseSize"
      >
        {{ t('글자 크키 샘플') }}
      </p>
      <div class="w-[53.28125vw]">
        <Slider
          v-model="currentSize"
          :lazy="false"
          :min="0"
          :max="fontRate.length - 1"
          :step="1"
          tooltipPosition="bottom"
          tooltips
          :format="format"
          @change="setCurrentFontSize"
        />
      </div>
      <p
        id="글자 크기 변경 - 폰트 확대 클릭"
        class="cursor-pointer text-[3.90625vw] font-bold"
        @click="increaseSize"
      >
        {{ t('글자 크키 샘플') }}
      </p>
    </div>
    <div class="absolute bottom-[10vw] flex w-full items-center justify-center">
      <div
        id="글자 크기 변경 - 폰트 초기화 클릭"
        class="typo-b-h4 text-black-01 mx-auto flex h-[3.125vw] w-[12.34375vw]
          cursor-pointer items-center justify-center rounded-[0.625vw] bg-[#FFF]
          text-center !text-[1.5625vw] active:bg-[#FFFFFF33] active:text-white"
        @click="setNormalSize"
      >
        {{ t('글자 크기 초기화') }}
      </div>
    </div>
  </div>
</template>

<style src="@vueform/slider/themes/default.css"></style>
