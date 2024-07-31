<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { ManipulateType } from 'dayjs';
import { useDashboardStore, useModalStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import icon_arrow_right from '@assets/icon/icon_arrow_right.svg?url';
import icon_arrow_left from '@assets/icon/icon_arrow_left.svg?url';

const { t } = useTranslation();

const { openModal } = useModalStore();
const { permuteSelectedDate, changeViewType } = useDashboardStore();
const { selectedDate, selectedWeek, currentViewType } =
  storeToRefs(useDashboardStore());

type dashboardViewTypes = {
  type: ManipulateType | undefined;
  name: string;
};

const dashboardViewType: dashboardViewTypes[] = [
  {
    type: 'day',
    name: '일별',
  },
  {
    type: 'week',
    name: '주별',
  },
  {
    type: 'month',
    name: '월별',
  },
  {
    type: 'year',
    name: '연도별',
  },
];

const getDateFormat = () => {
  switch (currentViewType.value) {
    case 'day':
      return selectedDate.value.format(t('포멧 YY년 MM월 DD일'));
    case 'week':
      return `${selectedWeek.value.start.format(t('포멧 YY년 MM월 DD일'))} ~ ${selectedWeek.value.end.format(t('포멧 MM월 DD일'))}`;
    case 'month':
      return selectedDate.value.format(t('포멧 YY년 MM월'));
    case 'year':
      return selectedDate.value.format(t('포멧 YYYY년'));
    default:
      return selectedDate.value.format(t('포멧 YY년 MM월 DD일'));
  }
};

const getViewTypeClass = (
  type: ManipulateType | undefined,
): DynamicClassType => ({
  'text-black-disabled': type !== currentViewType.value,
});
</script>

<template>
  <div class="flex flex-col gap-[1.5625vw]">
    <div class="typo-b-h1 flex gap-[1.25vw]">
      <div
        v-for="data in dashboardViewType"
        :key="data.type"
        :class="getViewTypeClass(data.type)"
        @click="changeViewType(data.type)"
      >
        {{ t(data.name) }}
      </div>
    </div>
    <div class="typo-r-h4 flex items-baseline justify-between">
      <div class="flex items-center gap-[1.5625vw]">
        <div
          class="bg-depth-02 active:bg-depth-03 flex h-[3.125vw] w-[3.90625vw]
            items-center justify-center rounded-[0.625vw]"
          @click="permuteSelectedDate(false, currentViewType)"
        >
          <img
            class="size-[1.875vw]"
            :src="icon_arrow_left"
            alt="icon_arrow_left"
          />
        </div>
        <div
          class="typo-r-h3"
          @click="openModal('dashboardDaySelector')"
        >
          {{ getDateFormat() }}
        </div>
        <div
          class="bg-depth-02 active:bg-depth-03 flex h-[3.125vw] w-[3.90625vw]
            items-center justify-center rounded-[0.625vw]"
          @click="permuteSelectedDate(true, currentViewType)"
        >
          <img
            class="size-[1.875vw]"
            :src="icon_arrow_right"
            alt="icon_arrow_right"
          />
        </div>
      </div>
      <div class="typo-r-h4 text-white-disabled">
        {{ t('YY.MM.DD hh:mm:ss 기준', { time: 'YY.MM.DD hh:mm:ss' }) }}
      </div>
    </div>
  </div>
</template>
