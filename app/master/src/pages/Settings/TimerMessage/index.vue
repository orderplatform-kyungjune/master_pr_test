<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useToastStore } from '@store/index';
import { pushPage, pushPageWithQuery } from '@router/route.helper';
import pathName from '@router/pathName';
import TimerSkeletonList from '@pages/Settings/TimerMessage/Components/TimerSkeletonList.vue';
import TimerListCard from '@pages/Settings/TimerMessage/Components/TimerListCard.vue';
import HeadTitle from '@layouts/UI/HeadTitle.vue';
import { TimerMessageType } from '@interfaces/TimerMessage';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import {
  requestTimerMessageList,
  requestTimerMessageUpdate,
} from '@apis/settings';

const { t } = useTranslation();

const { S_TIMERMESSAGE_WRITE } = pathName;

const { useApiRequest } = useMasterApiRequest();

const timerMessageList = ref<TimerMessageType[]>([]);

const requestTimerMessages = () =>
  useApiRequest(
    requestTimerMessageList,
    (data: TimerMessageType[]) => {
      timerMessageList.value = data;
    },
    {},
    '타이머 메시지 목록',
  );

const { addToast } = useToastStore();

const pushMessageWritePage = (action: string, timerId: number) => {
  if (action === 'add') {
    if (timerMessageList.value.length >= 5) {
      addToast(t('타이머 등록 개수 제한'), 'error', 1.5);
      return;
    }
    pushPage(S_TIMERMESSAGE_WRITE);
  }
  if (action === 'edit') {
    pushPageWithQuery(S_TIMERMESSAGE_WRITE, { timerId });
  }
};

const requestUpdateTimer = (timerInfo: TimerMessageType, isOn: string) =>
  useApiRequest(
    requestTimerMessageUpdate,
    () => {
      requestTimerMessages().call();
    },
    {
      id: timerInfo.id,
      message: timerInfo.message,
      messageUse: isOn,
      startTime: timerInfo.startTime,
      endTime: timerInfo.endTime,
    },
    '타이머 메시지 수정',
  );

const handleTimerToggle = (timerId: number, isOn: string) => {
  const foundTimer = timerMessageList.value.find(
    (timer) => timer.id === timerId,
  );
  if (foundTimer) {
    requestUpdateTimer(foundTimer, isOn).call();
  }
};

const getContentsClass = () => ({
  'flex h-full w-full flex-1': true,
  'items-center justify-center': timerMessageList.value.length === 0,
});

const getTimerCardKey = (timerId: number, index: number) =>
  timerId ? `timerCard-${timerId}` : `timerCard-${index}`;

const { call, loading } = requestTimerMessages();

call();
</script>

<template>
  <TimerSkeletonList v-if="loading" />
  <div
    v-else
    class="flex w-full flex-col"
  >
    <HeadTitle :title="t('타이머 메시지')" />
    <div :class="getContentsClass()">
      <p
        v-if="timerMessageList.length === 0"
        class="typo-r-h3 text-[#666666]"
      >
        {{ t('타이머 빈 리스트 안내') }}
      </p>
      <div
        v-else
        class="grid w-full grid-cols-2 grid-rows-3 gap-[0.7813vw]"
      >
        <TimerListCard
          v-for="(timer, index) in timerMessageList"
          :key="getTimerCardKey(timer.id, index)"
          :timer="timer"
          :pushMessageWritePage="pushMessageWritePage"
          :handleTimerToggle="handleTimerToggle"
        />
      </div>
    </div>
    <div class="flex w-full justify-end pb-[3.1250vw] pr-[3.1250vw]">
      <button
        id="타이머 메시지 - 등록하기 클릭"
        type="button"
        class="typo-b-h3 text-black-01 active:btn-bg-primary-pressed
          bg-alpha-white-100 active:text-white-01 h-[5vw] w-[23.4375vw]
          rounded-lg"
        @click="pushMessageWritePage('add', -1)"
      >
        {{ t('등록하기') }}
      </button>
    </div>
  </div>
</template>
