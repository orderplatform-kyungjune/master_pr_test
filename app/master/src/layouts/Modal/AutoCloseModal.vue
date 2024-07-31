<script lang="ts" setup>
import { nextTick } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useLocalStorageData } from '@utils/localStorage';
import useModalStore from '@store/useModalStore';
import { useOrderDetailStore, useToastStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import icon_back from '@assets/icon/icon_back.svg';

const { t } = useTranslation();

const { setNormalTime } = useOrderDetailStore();
const { closeModal } = useModalStore();
const { addToast } = useToastStore();

const autoCloseTimeArray: number[] = [10, 15, 30, 50];

const localNormalTime = useLocalStorageData<number>('autoClose');

/**
 * 주문 상세 내역 노출 시간 선택하기
 * @param time
 */
const setAutoCloseTime = (time: number) => {
  localNormalTime.value = time;
  setNormalTime(time);
  addToast(t('노출 시간 토스트', { time }), 'success', 1.5);

  nextTick(() => {
    closeModal('autoClose');
  });
};

const getActiveButtonClass = (time: number): DynamicClassType => ({
  'bg-alpha-white-5': localNormalTime.value === time,
});
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen
      items-center justify-center text-white"
    @click.self="closeModal('autoClose')"
  >
    <div
      class="border-modal-2 flex w-[54.6875vw] flex-col rounded-[0.9375vw]
        bg-black"
    >
      <div
        class="flex items-center justify-between border-b-[0.078125vw]
          border-solid border-[#FC0000] p-[1.875vw_2.34375vw]"
      >
        <div class="typo-b-h1 text-white">
          {{ t('주문 상세내역 노출 시간') }}
        </div>
        <icon_back
          class="size-[1.5625vw]"
          @click="closeModal('autoClose')"
        />
      </div>
      <div class="flex flex-col">
        <div
          v-for="closeTime in autoCloseTimeArray"
          :key="closeTime"
          class="auto-close-time border-b-list-2 flex p-[2.34375vw]"
          :class="getActiveButtonClass(closeTime)"
          @click="setAutoCloseTime(closeTime)"
        >
          <div class="typo-r-h2">{{ closeTime }}{{ t('초') }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.auto-close-time:last-child {
  border-bottom: none;
}
</style>
