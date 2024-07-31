<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useDashboardStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import icon_up from '@assets/icon/dashboard/icon_up.svg?url';
import icon_down from '@assets/icon/dashboard/icon_down.svg?url';

const { t } = useTranslation();

const {
  dashboardData,
  selectedDayOfWeek,
} = storeToRefs(useDashboardStore());

const props = defineProps<{
  isCallStaff: boolean,
}>();

const getPreviousDayOrderCnt = () => {
  if (props.isCallStaff) {
    return dashboardData.value.orderData.serviceOrder.orderCnt.toLocaleString();
  }
  return dashboardData.value.orderData.goodOrder.orderCnt.toLocaleString();
};

const getPreviousDayComparison = () => {
  if (props.isCallStaff) {
    return dashboardData.value.orderData.serviceOrder.previousDayComparison;
  }
  return dashboardData.value.orderData.goodOrder.previousDayComparison;
};

const getPreviousWeekComparison = () => {
  if (props.isCallStaff) {
    return dashboardData.value.orderData.serviceOrder.lastWeekComparison;
  }
  return dashboardData.value.orderData.goodOrder.lastWeekComparison;
};

const getInfoTypeClass = (): DynamicClassType => ({
  'h-[1.5625vw] w-[1.5625vw] rounded-[0.3125vw]': true,
  'bg-[#CEE2FD]': props.isCallStaff,
  'bg-[#2179E2]': !props.isCallStaff,
});
</script>

<template>
  <div class="flex flex-col gap-[1.5625vw]">
    <div class="bg-depth-03 flex h-[3.4375vw] w-[22.578125vw] justify-between rounded-[0.625vw] p-[0.78125vw]">
      <div class="flex items-center gap-[0.625vw]">
        <div :class="getInfoTypeClass()"></div>
        <span class="typo-b-h4">{{ props.isCallStaff ? t("직원 호출") : t("상품 주문") }}</span>
      </div>
      <div class="flex items-center gap-[0.15625vw]">
        <span class="typo-b-h3">{{ getPreviousDayOrderCnt() }}</span>
        <span class="typo-r-h4">{{ t("건") }}</span>
      </div>
    </div>
    <div class="flex flex-col gap-[1.5625vw]">
      <div class="flex items-center justify-between">
        <span>{{ t("전 일 대비") }}</span>
        <div class="flex gap-[0.3125vw] rounded-[0.625vw] border-[0.078125vw] border-[#38C08E] p-[0.625vw_0.78125vw]">
          <img
            :src="icon_down"
            alt="icon_down"
            class="size-[1.40625vw]"
          />
          <div class="flex items-baseline gap-[0.15625vw] text-[#38C08E]">
            <span class="typo-b-h5">{{ getPreviousDayOrderCnt() }}{{ t('건') }}</span>
            <span class="typo-r-h6">({{ getPreviousDayComparison() }}%)</span>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between">
        <span>{{ t("전 주 N요일 대비", { day: selectedDayOfWeek }) }}</span>
        <div class="border-error-1 flex gap-[0.3125vw] rounded-[0.625vw] p-[0.625vw_0.78125vw]">
          <img
            :src="icon_up"
            alt="icon_up"
            class="size-[1.40625vw]"
          />
          <div class="text-primary-01 flex items-baseline gap-[0.15625vw]">
            <span class="typo-b-h5">{{ getPreviousDayOrderCnt() }}{{ t('건') }}</span>
            <span class="typo-r-h6">({{ getPreviousWeekComparison() }}%)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
