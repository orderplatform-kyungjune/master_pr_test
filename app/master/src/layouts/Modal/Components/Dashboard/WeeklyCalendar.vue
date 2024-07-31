<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import dayjs, { ManipulateType } from 'dayjs';
import { useDashboardStore } from '@store/index';
import weeks from '@common/Calendar';
import icon_arrow_right_black from '@assets/icon/icon_arrow_right_black.svg?url';
import icon_arrow_right from '@assets/icon/icon_arrow_right.svg?url';
import icon_arrow_left_black from '@assets/icon/icon_arrow_left_black.svg?url';
import icon_arrow_left from '@assets/icon/icon_arrow_left.svg?url';

const { t } = useTranslation();

const props = defineProps<{
  close: () => void;
}>();

const { selectDate: saveDate, getStartAndEndOfWeek } = useDashboardStore();
const { selectedDate: storeDate } = storeToRefs(useDashboardStore());

const currentDate = dayjs();
const displayedMonth = ref<dayjs.Dayjs>(storeDate.value);
const selectedDate = ref<dayjs.Dayjs>(storeDate.value);

const isThisWeek = (day: dayjs.Dayjs | null) =>
  day && day.isSame(currentDate, 'week');
const isWithinSelectedWeek = (day: dayjs.Dayjs | null) => {
  if (!day) return false;
  return day.isBetween(
    getStartAndEndOfWeek(selectedDate.value).start,
    getStartAndEndOfWeek(selectedDate.value).end,
    'day',
    '[]',
  );
};

const isLatestMonth = computed(
  () =>
    displayedMonth.value.isSame(currentDate, 'year') &&
    displayedMonth.value.isSame(currentDate, 'month'),
);
const isLastMonth = computed(
  () =>
    displayedMonth.value.isSame(currentDate.subtract(1, 'year'), 'year') &&
    displayedMonth.value.month() === 0,
);
const isAfterThisWeek = (day: dayjs.Dayjs | null) => {
  if (!day) return false;

  const endOfThisWeek = currentDate.endOf('week');
  return day.isAfter(endOfThisWeek, 'day');
};

const days = computed(() => {
  const startOfMonth = displayedMonth.value.startOf('month');
  const endOfMonth = displayedMonth.value.endOf('month');

  const daysArray: (dayjs.Dayjs | null)[] = [];

  let day = startOfMonth.subtract(startOfMonth.day(), 'day');

  while (day <= endOfMonth.add(6 - endOfMonth.day(), 'day')) {
    daysArray.push(day);
    day = day.add(1, 'day');
  }

  return daysArray;
});

const resetToday = () => {
  selectedDate.value = dayjs();
  displayedMonth.value = dayjs();
};

const selectWeek = (day: dayjs.Dayjs | null) => {
  if (day) {
    if (!isAfterThisWeek(day)) {
      if (day.isBefore('2022-01-01', 'day')) {
        selectedDate.value = dayjs('2022-01-01');
        return;
      }

      if (day.isAfter(currentDate, 'day')) {
        selectedDate.value = currentDate;
        return;
      }

      selectedDate.value = day;
    }
  }
};

const saveDateAndCloseModal = () => {
  saveDate(selectedDate.value);
  props.close();
};

const permuteSelectedDate = (
  isIncrease: boolean,
  type: ManipulateType | undefined,
) => {
  if (isIncrease) {
    if (isLatestMonth.value) {
      return;
    }
    displayedMonth.value = displayedMonth.value.add(1, type);
  } else {
    if (isLastMonth.value) {
      return;
    }
    displayedMonth.value = displayedMonth.value.subtract(1, type);
  }
};

const getPeriodDate = (date: dayjs.Dayjs, period: 'start' | 'end') => {
  if (period === 'start') return date.startOf('week');
  if (period === 'end') return date.endOf('week');
  return date;
};

const isSamePeriod = (
  day: dayjs.Dayjs | null,
  comparisonDate: dayjs.Dayjs,
  period: 'start' | 'end',
) => {
  if (!day) return false;
  return day.isSame(getPeriodDate(comparisonDate, period), 'day');
};

const isSelectedWeekStart = (day: dayjs.Dayjs | null) =>
  isSamePeriod(day, getStartAndEndOfWeek(selectedDate.value).start, 'start');
const isSelectedWeekEnd = (day: dayjs.Dayjs | null) =>
  isSamePeriod(day, getStartAndEndOfWeek(selectedDate.value).end, 'end');
const isStartOfThisWeek = (day: dayjs.Dayjs | null) =>
  isSamePeriod(day, currentDate, 'start');
const isEndOfThisWeek = (day: dayjs.Dayjs | null) =>
  isSamePeriod(day, currentDate, 'end');

const getDayClass = (day: dayjs.Dayjs | null) => {
  const isCurrentWeek = isThisWeek(day);
  const isChosenDate = isWithinSelectedWeek(day);
  const isDateAfterCurrent = isAfterThisWeek(day);
  const isStartOfChosenWeek = isSelectedWeekStart(day);
  const isEndOfChosenWeek = isSelectedWeekEnd(day);
  const isStartOfWeek = isStartOfThisWeek(day) || isStartOfChosenWeek;
  const isEndOfWeek = isEndOfThisWeek(day) || isEndOfChosenWeek;

  return {
    'typo-r-h3 p-[1.25vw] text-center': true,
    'rounded-l-[0.78125vw]': isStartOfWeek,
    'rounded-r-[0.78125vw]': isEndOfWeek,
    'bg-depth-03 active:bg-depth-02 text-white': isCurrentWeek,
    'active:bg-[#FFFFFF33]': !isDateAfterCurrent && !isCurrentWeek,
    'bg-white text-black': isChosenDate && !isCurrentWeek,
    '!text-[#FFFFFF33]': isDateAfterCurrent && !isCurrentWeek,
    'text-white': !isChosenDate && !isCurrentWeek,
  };
};

const getMonthClass = (isDisabled: boolean) => ({
  'flex h-[3.125vw] w-[3.90625vw] items-center justify-center rounded-[0.625vw] border-[0.078125vw] border-[#3A414F]':
    true,
  'bg-black': isDisabled,
  'active:bg-depth-03 bg-[#FFFFFF0D]': !isDisabled,
});
</script>

<template>
  <div class="flex w-full flex-col gap-[2.34375vw] p-[2.34375vw]">
    <div class="flex w-full justify-between">
      <div class="flex items-center gap-[2.265625vw]">
        <div
          :class="getMonthClass(isLastMonth)"
          @click="permuteSelectedDate(false, 'month')"
        >
          <img
            class="size-[1.875vw]"
            :src="isLastMonth ? icon_arrow_left_black : icon_arrow_left"
            alt="icon_arrow_left"
          />
        </div>
        <span class="typo-r-h2 text-white">
          {{ displayedMonth.format(t('포멧 YYYY년 MM월')) }}
        </span>
        <div
          :class="getMonthClass(isLatestMonth)"
          @click="permuteSelectedDate(true, 'month')"
        >
          <img
            class="size-[1.875vw]"
            :src="isLatestMonth ? icon_arrow_right_black : icon_arrow_right"
            alt="icon_arrow_right"
          />
        </div>
      </div>
      <div
        class="typo-r-h4 bg-depth-03 active:bg-depth-02 flex items-center
          justify-center rounded-[0.625vw] p-[0.78125vw_1.71875vw] text-white
          active:bg-[#FFFFFF33]"
        @click="resetToday"
      >
        {{ t('이번 주') }}
      </div>
    </div>
    <div class="calendar-grid grid grid-cols-7 text-center">
      <div
        v-for="week in weeks"
        :key="week"
        class="typo-r-h4 text-white-disabled mb-[1.25vw]"
      >
        {{ t(week) }}
      </div>
      <div
        v-for="day in days"
        :key="day ? day.format('YYYY-MM-DD') : Math.random()"
        :class="getDayClass(day)"
        @click="selectWeek(day)"
      >
        {{ day ? day.date() : '' }}
      </div>
    </div>
  </div>
  <div
    class="mb-[2.34375vw] flex size-full items-end justify-end pr-[2.34375vw]"
  >
    <div
      class="typo-b-h2 btn-bg-primary rounded-[0.625vw] p-[1.328125vw_7.5vw]
        text-white active:bg-[#292929]"
      @click="saveDateAndCloseModal"
    >
      {{ t('확인') }}
    </div>
  </div>
</template>
