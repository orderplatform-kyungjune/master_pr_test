<script setup lang="ts">
import {
  ref,
  computed,
  watch,
  onUnmounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useSwipe } from '@vueuse/core';
import { useModalStore } from '@store/index';
import icon_back from '@assets/icon/icon_back.svg';

const { t } = useTranslation();

/**
 * timeType: 시간 선택 타입 (종료시간은 시작시간에 따라 변경됨)
 * defaultHour, defaultMinute : 모달 최초 출력 시 선택되어있을 시간
 * minimumHour, minimumMinute : 종료시간 선택 시 리스트에 반영될 최소 시간
 * setSelectedTime: 모달을 호출한 페이지로부터 받은 function. data set 을 위함
*/
const { modalData } = storeToRefs(useModalStore());
const {
  timeType,
  defaultHour,
  defaultMinute,
  setSelectedTime,
  minimumHour,
  minimumMinute,
} = modalData.value.timeSelect; // FIXME: timeSelect 타입이 any 이며 타입 정의 필요.

/**
 * hourList/minuteList : 선택 가능한 시간/분 리스트
 * selectedHour/selectedMinute: 현재 선택되어있는 시간/분 값
*/
const hourList = ref<string[]>([]);
const minuteList = ref<string[]>([]);
const selectedHour = ref<string>(Number(defaultHour) ? defaultHour : '00');
const selectedMinute = ref<string>(Number(defaultMinute) ? defaultMinute : '00');

const getTimeList = (total: number, increment: number = 1) => Array(total).fill(0).map((_, i) => {
  const time = i * increment;
  return time < 10 ? `0${time}` : `${time}`;
});

const setDefaultTimeList = () => {
  minuteList.value = getTimeList(12, 5);

  if (timeType === 'start') {
    hourList.value = getTimeList(24);
  }

  if (timeType === 'end') {
    hourList.value = getTimeList(31);

    hourList.value = hourList.value.filter((hour) => Number(hour) >= Number(minimumHour));
    if (defaultHour === minimumHour) {
      minuteList.value = minuteList.value.filter((minute) => Number(minute) >= Number(minimumMinute));
    }

    // 종료시간 30시 00분 설정 후 수정하는 경우
    if (defaultHour === '30') {
      minuteList.value = ['00'];
      selectedMinute.value = '00';
    }
  }
};

/*
 * 종료시간: selectedHour 변경에 따라 minuteList 변경
 * - 30시: 00분만 선택 가능
 * - 메시지의 시작 시간 이후의 시각만 선택 가능하므로 최소 시작 시간(minimumMinute)를 기준으로 구분
 */
const updateEndTypeMinuteList = () => {
  if (selectedHour.value === '30') {
    minuteList.value = ['00'];
    selectedMinute.value = '00';
  } else if (selectedHour.value > minimumHour) {
    minuteList.value = getTimeList(12, 5);
  } else if (selectedHour.value === minimumHour) {
    minuteList.value = getTimeList(12, 5).filter((minute) => Number(minute) >= Number(minimumMinute));
    selectedMinute.value = minuteList.value.length > 0 ? minuteList.value[0] : '00';
  }
};

watch(selectedHour, () => {
  if (timeType === 'end') {
    updateEndTypeMinuteList();
  }
});

/*
 * vue-use useSwipe
 * hourList/minuteList 중 현재 값을 기준으로 이전/후 값 출력
*/
const getNearTime = (list: string[], currentIndex: number, direction: string) => {
  if (direction === 'prev') {
    return currentIndex > 0 ? list[currentIndex - 1] : '';
  } if (direction === 'next') {
    return currentIndex < list.length ? list[currentIndex + 1] : '';
  }
  return '';
};

const selectedHourIndex = computed(() => (hourList.value.findIndex((hour) => hour === selectedHour.value)));
const beforeHour = computed(() => getNearTime(hourList.value, selectedHourIndex.value, 'prev'));
const afterHour = computed(() => getNearTime(hourList.value, selectedHourIndex.value, 'next'));

const selectedMinuteIndex = computed(() => (minuteList.value.findIndex((minute) => minute === selectedMinute.value)));
const beforeMinute = computed(() => getNearTime(minuteList.value, selectedMinuteIndex.value, 'prev'));
const afterMinute = computed(() => getNearTime(minuteList.value, selectedMinuteIndex.value, 'next'));

/*
 * vue-use useSwipe
 * swipe 모션에 따라 selected 시간값 변경
*/
const hourBox = ref<HTMLElement>(null as unknown as HTMLElement);
const hourBoxSwipe = useSwipe(hourBox);
const minuteBox = ref<HTMLElement>(null as unknown as HTMLElement);
const minuteBoxSwipe = useSwipe(minuteBox);

const clickTimeValue = (type: string, timeValue: string) => {
  if (!timeValue) return;

  if (type === 'hour') {
    selectedHour.value = timeValue;
  }
  if (type === 'minute') {
    selectedMinute.value = timeValue;
  }
};

const interval = setInterval(() => {
  if (hourBoxSwipe.isSwiping.value) {
    if (hourBoxSwipe.direction.value === 'down') {
      if (hourList.value[0] !== selectedHour.value) {
        selectedHour.value = beforeHour.value;
      }
    } else if (hourBoxSwipe.direction.value === 'up') {
      const lastIndex = hourList.value.length - 1;
      if (hourList.value[lastIndex] !== selectedHour.value) {
        selectedHour.value = afterHour.value;
      }
    }
  }
  if (minuteBoxSwipe.isSwiping.value) {
    if (minuteBoxSwipe.direction.value === 'down') {
      if (minuteList.value[0] !== selectedMinute.value) {
        selectedMinute.value = beforeMinute.value;
      }
    } else if (minuteBoxSwipe.direction.value === 'up') {
      const lastIndex = minuteList.value.length - 1;
      if (minuteList.value[lastIndex] !== selectedMinute.value) {
        selectedMinute.value = afterMinute.value;
      }
    }
  }
}, 150);

const { closeModalWithData } = useModalStore();

const saveAndCloseModal = () => {
  setSelectedTime(timeType, `${selectedHour.value}:${selectedMinute.value}`);
  closeModalWithData('timeSelect', {});
};

setDefaultTimeList();

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center"
    @click.self="closeModalWithData('timeSelect', {});"
  >
    <div class="border-modal-2 flex h-[43.1250vw] w-[51.5625vw] flex-col rounded-[0.9375vw] bg-[#111] ">
      <div class="border-b-header-1 flex h-[6.7188vw] w-full items-center justify-between border-b px-[2.3438vw]">
        <p class="typo-b-h1">
          {{ modalData.timeSelect.timeType === 'start' ? t('시작 시간 설정') : t('종료 시간 설정') }}
        </p>
        <icon_back
          class="size-[1.5625vw]"
          @click="closeModalWithData('timeSelect', {});"
        />
      </div>
      <div class="flex flex-1 flex-col p-[2.3438vw]">
        <div class="text-white-disabled typo-r-h0 flex h-[23.4375vw] w-full items-center">
          <div
            ref="hourBox"
            class=" h-full flex-1 overflow-y-scroll"
          >
            <div
              class="flex h-[7.8125vw] flex-1 items-center justify-center"
              @click="clickTimeValue('hour', beforeHour)"
            >
              <span>{{ beforeHour }}</span>
            </div>
            <div class="text-white-01 flex h-[7.8125vw] flex-1 items-center justify-center border-y-[0.1389vw] border-[rgba(255,255,255,.4)] bg-[rgba(255,255,255,.05)]">
              <span>{{ selectedHour }}</span>
            </div>
            <div
              class="flex h-[7.8125vw] flex-1 items-center justify-center"
              @click="clickTimeValue('hour', afterHour)"
            >
              <span>{{ afterHour }}</span>
            </div>
          </div>
          <span class="typo-r-h1 text-white-01 px-[1.5625vw]">:</span>
          <div
            ref="minuteBox"
            class="h-full flex-1 overflow-y-scroll"
          >
            <div
              class="flex h-[7.8125vw] flex-1 items-center justify-center"
              @click="clickTimeValue('minute', beforeMinute)"
            >
              <span>{{ beforeMinute }}</span>
            </div>
            <div class="text-white-01 flex h-[7.8125vw] flex-1 items-center justify-center border-y-[0.1389vw] border-[rgba(255,255,255,.4)] bg-[rgba(255,255,255,.05)]">
              <span>{{ selectedMinute }}</span>
            </div>
            <div
              class="flex h-[7.8125vw] flex-1 items-center justify-center"
              @click="clickTimeValue('minute', afterMinute)"
            >
              <span>{{ afterMinute }}</span>
            </div>
          </div>
        </div>
        <div class="mt-[3.1250vw] flex justify-end">
          <button
            type="button"
            class="btn-bg-primary typo-b-h2 h-[5vw] w-[23.2031vw] rounded-[0.6250vw]"
            @click="saveAndCloseModal"
          >
            {{ t('저장하기') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
