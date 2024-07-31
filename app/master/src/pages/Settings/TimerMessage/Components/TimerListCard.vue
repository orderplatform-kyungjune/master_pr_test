<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import dayjs from 'dayjs';
import Toggle from '@vueform/toggle';
import { TimerMessageType } from '@interfaces/TimerMessage';

const props = defineProps<{
  timer: TimerMessageType,
  pushMessageWritePage: Function,
  handleTimerToggle: Function,
}>();

const { t } = useTranslation();

const isOn = ref<string>(props.timer.messageUse);

const setTimeStringToDay = (time: string) => {
  const hour = time.split(':')[0] ? Number(time.split(':')[0]) : 0;
  const minutes = time.split(':')[1] ? Number(time.split(':')[1]) : 0;
  return dayjs().hour(hour).minute(minutes).second(0)
    .millisecond(0);
};

const diffTime = () => {
  const startDay = setTimeStringToDay(props.timer.startTime);
  const endDay = setTimeStringToDay(props.timer.endTime);

  const hourDiff = endDay.diff(startDay, 'hour');
  const minuteDiff = endDay.diff(startDay, 'minute') % 60;

  if (hourDiff > 0 && minuteDiff > 0) { return `${hourDiff}${t('시간')} ${minuteDiff}${t('분')}`; }
  if (hourDiff > 0 && minuteDiff === 0) { return `${hourDiff}${t('시간')}`; }
  if (hourDiff === 0 && minuteDiff > 0) { return `${minuteDiff}${t('분')}`; }
  return '';
};

const getActiveBgClass = () => ({
  'flex h-[14.8438vw] w-full items-center rounded-[0.7813vw] pl-[1.5625vw] pr-[1.8750vw] justify-between': true,
  'bg-depth-03 active:bg-depth-02': isOn.value === 'Y',
  'bg-depth-02 opacity-50': isOn.value !== 'Y',
});

const getActiveMessageClass = () => ({
  'typo-b-h0 overflow-hidden text-ellipsis whitespace-nowrap text-[3.125vw]': true,
  'text-black-disabled': isOn.value !== 'Y',
});
</script>

<template>
  <div
    id="타이머 메시지 - 수정하기 진입"
    :class="getActiveBgClass()"
    @click="props.pushMessageWritePage('edit', props.timer.id)"
  >
    <div
      id="타이머 메시지 - 수정하기 진입"
      class="flex w-[31.25vw] flex-col gap-[0.7813vw]"
    >
      <p
        id="타이머 메시지 - 수정하기 진입"
        :class="getActiveMessageClass()"
      >
        {{ props.timer.message }}
      </p>
      <div
        id="타이머 메시지 - 수정하기 진입"
        class="typo-r-h3 mt-[0.7813vw]"
      >
        <span
          id="타이머 메시지 - 수정하기 진입"
          class="typo-r-h4 rounded-[0.7813vw] bg-[#1111118C] px-[0.7813vw] py-[0.6250vw] text-[#FFFFFF8C]"
        >
          {{ diffTime() }}
        </span>
        <span
          id="타이머 메시지 - 수정하기 진입"
          class="typo-r-h3 ml-[0.7813vw] text-[#FFFFFF8C]"
        >
          {{ props.timer.startTime }} ~ {{ props.timer.endTime }}
        </span>
      </div>
    </div>
    <Toggle
      id="타이머 메시지 - 토글 클릭"
      v-model="isOn"
      class="ml-[0.8594vw]"
      :classes="{
        handle: 'toggle-handles',
        handleOff: 'left-[0.3125vw] bg-[#303745]',
        handleOn: 'left-[95%] transform -translate-x-full',
      }"
      true-value="Y"
      false-value="N"
      on-label="ON"
      off-label="OFF"
      @click.stop="props.handleTimerToggle(props.timer.id, isOn)"
    />
  </div>
</template>
