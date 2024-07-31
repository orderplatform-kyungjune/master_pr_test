<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, reactive, onMounted, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import dayjs from 'dayjs';
import { useModalStore, useToastStore } from '@store/index';
import { goBack } from '@router/route.helper';
import TimerSkeletonWrite from '@pages/Settings/TimerMessage/Components/TimerSkeletonWrite.vue';
import TimeCard from '@pages/Settings/TimerMessage/Components/TimeCard.vue';
import HeadTitle from '@layouts/UI/HeadTitle.vue';
import TimeSelectModal from '@layouts/Modal/TimeSelectModal.vue';
import { TimerMessageType } from '@interfaces/TimerMessage';
import { timeSelectDataType, commonConfirmDataType } from '@interfaces/Modal';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import {
  requestTimerMessageCreate,
  requestTimerMessageUpdate,
  requestTimerMessageDelete,
  requestTimerMessageDetail,
} from '@apis/settings';

const { t } = useTranslation();
const { flag } = storeToRefs(useModalStore());
const route = useRoute();
const timerInfoInput = ref<HTMLInputElement>();

onMounted(() => {
  timerInfoInput.value?.focus();
});

const timerInfo = reactive<TimerMessageType>({
  id: route.query.timerId ? Number(route.query.timerId) : 0,
  message: '',
  messageUse: 'N',
  startTime: '--:--',
  endTime: '--:--',
});

const isModifyMode = !!route.query.timerId;

const countMessage = computed(() => timerInfo.message.length);

/**
 * 'HH:mm' --> dayjs
 *  */
const setTimeStringToDay = (time: string) => {
  const hour = time.split(':')[0] ? Number(time.split(':')[0]) : 0;
  const minutes = time.split(':')[1] ? Number(time.split(':')[1]) : 0;
  // eslint-disable-next-line newline-per-chained-call
  return dayjs().hour(hour).minute(minutes).second(0).millisecond(0);
};

const startTimeDay = computed(() => setTimeStringToDay(timerInfo.startTime));
const endTimeDay = computed(() => setTimeStringToDay(timerInfo.endTime));

const diffTime = computed(() => {
  const hourDiff = endTimeDay.value.diff(startTimeDay.value, 'hour');
  const minuteDiff = endTimeDay.value.diff(startTimeDay.value, 'minute') % 60;

  if (hourDiff > 0 && minuteDiff > 0) {
    return `${hourDiff}${t('시간')} ${minuteDiff}${t('분')}`;
  }
  if (hourDiff > 0 && minuteDiff === 0) {
    return `${hourDiff}${t('시간')}`;
  }
  if (hourDiff === 0 && minuteDiff > 0) {
    return `${minuteDiff}${t('분')}`;
  }
  return '';
});

const setSelectedTime = (timeType: string, time: string) => {
  if (timeType === 'start') {
    timerInfo.startTime = time;
  } else {
    timerInfo.endTime = time;
  }
};

/**
 * 저장하기 버튼 활성화 조건: 메시지, 시작시간, 종료시간 중 한 개 이상 작성
 */
const isValidMessage = computed(() => timerInfo.message.trim().length > 0);
const isValidStartTime = computed(() => timerInfo.startTime !== '--:--');
const isValidEndTime = computed(() => timerInfo.endTime !== '--:--');
const isActiveSaveBtn = computed(
  () => isValidMessage.value && isValidStartTime.value && isValidEndTime.value,
);

const { addToast } = useToastStore();
const { openModalWithData } = useModalStore();

const clickTimeCard = (timeType: string) => {
  if (timeType === 'end' && !isValidStartTime.value) {
    return addToast(t('종료 시간 선택 오류'), 'error', 1.5);
  }

  /**
   * defaultTime: TimeSelectModal에 기본적으로 선택될 값
   * minimumTime: TimeSelectModal 시간 리스트의 최소값 (종료시간에만 사용)
   */
  let defaultTime = '';
  let minimumTime = '--:--';
  if (timeType === 'start') {
    defaultTime = isValidStartTime.value ? timerInfo.startTime : '00:00';
  }
  if (timeType === 'end') {
    const nextTimeOfStart =
      startTimeDay.value.format('HH:mm') === '23:55'
        ? '24:00'
        : startTimeDay.value.add(5, 'minute').format('HH:mm');

    // 시작시간 설정O, 종료시간 최초 설정
    if (isValidStartTime.value && !isValidEndTime.value) {
      defaultTime = nextTimeOfStart;
      minimumTime = nextTimeOfStart;
    }

    // 종료시간 이미 설정되어 수정 시
    if (isValidEndTime.value) {
      defaultTime = timerInfo.endTime;
      minimumTime = nextTimeOfStart;
    }
  }

  return openModalWithData('timeSelect', {
    timeType,
    defaultHour: defaultTime.split(':')[0],
    defaultMinute: defaultTime.split(':')[1],
    setSelectedTime,
    minimumHour: timeType === 'end' ? minimumTime.split(':')[0] : '--',
    minimumMinute: timeType === 'end' ? minimumTime.split(':')[1] : '--',
  } as timeSelectDataType);
};

/**
 * TimeCard.vue 스타일 구분: unActive, needActive, active
 * */
const startTimeSetType = computed(() => {
  if (timerInfo.startTime !== '--:--') return 'active';
  if (!isModifyMode && timerInfo.startTime === '--:--') return 'needActive';
  return 'unActive';
});

const endTimeSetType = computed(() => {
  if (timerInfo.endTime !== '--:--') return 'active';
  if (
    !isModifyMode &&
    timerInfo.startTime !== '--:--' &&
    timerInfo.endTime === '--:--'
  ) {
    return 'needActive';
  }
  return 'unActive';
});

/**
 * API 연동부: 삭제, 등록, 수정
 */
const { useApiRequest } = useMasterApiRequest();

const requestCreateTimer = () =>
  useApiRequest(
    requestTimerMessageCreate,
    () => {
      addToast(t('등록 완료'), 'success', 1.5);
      goBack();
    },
    {
      message: timerInfo.message,
      messageUse: timerInfo.messageUse,
      startTime: timerInfo.startTime,
      endTime: timerInfo.endTime,
    },
    '타이머 메시지 등록',
  );

const requestUpdateTimer = () =>
  useApiRequest(
    requestTimerMessageUpdate,
    () => {
      addToast(t('등록 완료'), 'success', 1.5);
      goBack();
    },
    {
      id: timerInfo.id,
      message: timerInfo.message,
      messageUse: timerInfo.messageUse,
      startTime: timerInfo.startTime,
      endTime: timerInfo.endTime,
    },
    '타이머 메시지 수정',
  );

const requestDeleteTimer = () =>
  useApiRequest(
    requestTimerMessageDelete,
    () => {
      addToast(t('삭제 완료'), 'success', 1.5);
      goBack();
    },
    { id: timerInfo.id },
    '타이머 메시지 삭제',
  );

const clickTimerDeleteButton = () => {
  openModalWithData('commonConfirm', {
    title: t('타이머 삭제'),
    message: t('타이머 삭제 안내'),
    buttonName: t('삭제하기'),
    onClickButton: () => {
      requestDeleteTimer().call();
    },
  } as commonConfirmDataType);
};

const isPressedSave = ref(false);

const clickTimerSaveButton = async () => {
  if (isPressedSave.value) return;

  if (!isValidStartTime.value) {
    addToast(t('시작 시간 미설정 안내'), 'error', 1.5);
    return;
  }

  if (!isValidEndTime.value) {
    addToast(t('종료 시간 미설정 안내'), 'error', 1.5);
    return;
  }

  if (endTimeDay.value.isSame(startTimeDay.value)) {
    addToast(t('동일 시간 오류 안내'), 'error', 1.5);
    return;
  }

  if (
    isValidStartTime.value &&
    isValidEndTime.value &&
    endTimeDay.value.isBefore(startTimeDay.value)
  ) {
    addToast(t('종료 시간 오류 안내'), 'error', 1.5);
    return;
  }

  isPressedSave.value = true;
  if (route.query.timerId) {
    await requestUpdateTimer().call();
  } else {
    await requestCreateTimer().call();
  }
  isPressedSave.value = false;
};

const changeInputMessage = () => {
  if (timerInfo.message.length > 40) {
    addToast(t('글자 수 초과 안내'), 'error', 1.5);
  }
  timerInfo.message = timerInfo.message.slice(0, 40);
};

const getSaveButtonClass = (): DynamicClassType => ({
  'h-[5vw] w-[23.4375vw] rounded-[0.6250vw]': true,
  'bg-depth-02 typo-r-h3 text-black-disabled': !isActiveSaveBtn.value,
  'bg-white typo-b-h3 text-black-01 active:btn-bg-primary-pressed active:text-white-01':
    isActiveSaveBtn.value,
});

const requestTimerDetail = () =>
  useApiRequest(
    requestTimerMessageDetail,
    (data: TimerMessageType) => {
      timerInfo.id = data.id;
      timerInfo.message = data.message;
      timerInfo.startTime = data.startTime;
      timerInfo.endTime = data.endTime;
      timerInfo.messageUse = data.messageUse;
    },
    { id: timerInfo.id },
    '타이머 메시지 상세',
  );

const { call, loading } = requestTimerDetail();

const getModifyingTimerDetail = () => {
  if (route.query.timerId) {
    call();
  }
};

getModifyingTimerDetail();
</script>

<template>
  <TimerSkeletonWrite v-if="loading" />
  <div
    v-else
    class="flex size-full flex-col gap-[1.5625vw]"
  >
    <TimeSelectModal v-if="flag.timeSelect" />
    <HeadTitle :title="t('타이머 메시지 관리')" />
    <div class="flex-1">
      <div class="mb-[1.5625vw] flex items-baseline">
        <p class="typo-r-h2">
          {{ t('안내문구') }}
        </p>
        <p class="text-white-disabled ml-[0.78125vw]">
          (
          <span class="text-primary-01">
            {{ countMessage }}
          </span>
          /
          {{ t('글자 수 제한') }})
        </p>
      </div>
      <input
        ref="timerInfoInput"
        v-model="timerInfo.message"
        type="text"
        aria-label="message"
        class="typo-r-h3 bg-depth-02 h-[5vw] w-[66.7188vw] rounded-[0.6250vw]
          text-white outline-none focus:ring-0"
        :class="
          timerInfo.message.length >= 40
            ? `border-[#FFB19F] border-[0.078125vw] border-solid
              focus:border-[#FFB19F]`
            : 'border-list-1 focus:border-pressed-1 active:border-pressed-1'
        "
        @input="changeInputMessage"
      />
      <div class="mt-[3.125vw]">
        <div class="flex items-baseline">
          <p class="typo-r-h2">
            {{ t('시간 설정') }}
          </p>
          <p class="text-primary-01 ml-[0.78125vw]">
            {{ diffTime }}
          </p>
        </div>
        <p class="typo-r-h4 text-white-disabled mt-[0.78125vw]">
          {{ t('시간 설정 설명') }}
        </p>
        <div class="mt-[1.5625vw] flex w-full items-center gap-[1.5625vw]">
          <TimeCard
            :clickTimeCard="clickTimeCard"
            :timeType="'start'"
            :hour="timerInfo.startTime.split(':')[0]"
            :minute="timerInfo.startTime.split(':')[1]"
            :timeSetType="startTimeSetType"
          />
          <span class="text-white-01 text-[3.9063vw] tracking-[0.0156vw]">
            ~
          </span>
          <TimeCard
            :clickTimeCard="clickTimeCard"
            :timeType="'end'"
            :hour="timerInfo.endTime.split(':')[0]"
            :minute="timerInfo.endTime.split(':')[1]"
            :timeSetType="endTimeSetType"
          />
        </div>
      </div>
    </div>
    <div class="mb-[3.1250vw] flex justify-end gap-[1.5625vw]">
      <button
        v-if="isModifyMode"
        id="타이머 메시지 - 수정 - 삭제 클릭"
        type="button"
        class="typo-b-h3 active:btn-ghost-pressed active:!border-transparent-1
          h-[5vw] w-[10.3125vw] rounded-[0.6250vw] border-[0.0781vw]
          border-[rgba(255,255,255,.2)]"
        @click="clickTimerDeleteButton"
      >
        {{ t('삭제') }}
      </button>
      <button
        id="타이머 메시지 - 수정 - 저장 클릭"
        type="button"
        :class="getSaveButtonClass()"
        @click="clickTimerSaveButton"
      >
        {{ t('저장하기') }}
      </button>
    </div>
  </div>
</template>
