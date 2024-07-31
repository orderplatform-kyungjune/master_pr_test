<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import {
  useDashboardStore,
  useModalStore,
} from '@store/index';
import ModalHeader from '@layouts/Modal/Components/ModalHeader.vue';
import WeeklyCalendar from '@layouts/Modal/Components/Dashboard/WeeklyCalendar.vue';
import MonthlyCalendar from '@layouts/Modal/Components/Dashboard/MonthlyCalendar.vue';
import DailyCalendar from '@layouts/Modal/Components/Dashboard/DailyCalendar.vue';

const { closeModal } = useModalStore();
const { currentViewType } = storeToRefs(useDashboardStore());

const close = () => closeModal('dashboardDaySelector');

</script>

<template>
  <div
    class="bg-modal-dim absolute z-[100] flex h-screen w-screen items-center justify-center"
    @click.self="close"
  >
    <div class="border-modal-2 flex h-[53.59375vw] w-[54.6875vw] flex-col rounded-[0.9375vw] bg-black">
      <ModalHeader
        titleKey="조회 기간 변경"
        :closeModal="close"
      />
      <DailyCalendar
        v-if="currentViewType === 'day'"
        :close="close"
      />
      <WeeklyCalendar
        v-if="currentViewType === 'week'"
        :close="close"
      />
      <MonthlyCalendar
        v-if="currentViewType === 'month'"
        :close="close"
      />
    </div>
  </div>
</template>
