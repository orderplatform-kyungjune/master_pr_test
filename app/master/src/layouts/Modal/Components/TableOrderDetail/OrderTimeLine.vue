<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { checkPosOrderType, filteredTime } from '@utils/commonUtils';
import { useRefsStore } from '@store/index';
import {
  TABLE_ORDER_VIEW,
  TableOrderType,
  TableOrderViewType,
} from '@interfaces/Order';

const props = defineProps<{
  totalOrder: TableOrderType[];
  orderItem: TableOrderType;
  selectOrder: (index: number) => void;
}>();

const { t } = useTranslation();

const { tableOrderTimeline } = storeToRefs(useRefsStore());

const currentOrder = (orderKey: string) =>
  orderKey === props.orderItem?.order_info?.order_key;

const getLine = (order_key: string) => {
  if (order_key === props.totalOrder[0]?.order_info?.order_key) {
    return false;
  }
  return (
    order_key !==
    props.totalOrder[props.totalOrder.length - 1]?.order_info?.order_key
  );
};

const isHaveTwoOrder = (order_key: string) =>
  props.totalOrder.length === 2 &&
  order_key === props.totalOrder[0]?.order_info?.order_key;

const getOrderInfoTitle = (
  viewType: TableOrderViewType,
  orderIndex: number,
) => {
  if (viewType === TABLE_ORDER_VIEW.order) {
    return `${t(checkPosOrderType(viewType))} ${props.totalOrder.length - orderIndex}`;
  }
  return t(checkPosOrderType(viewType));
};

const getOrderTypeClass = (viewType: number) => ({
  'typo-b-h3': true,
  'text-error-01': viewType === 0,
  'text-warning-01': viewType === 1,
  'text-success-01': viewType === 2,
});

const getOpacity = (orderKey: string) => ({
  'opacity-50': !currentOrder(orderKey),
});
</script>

<template>
  <div class="relative flex h-[35.78125vw] flex-col justify-start">
    <div
      class="absolute flex h-[35.78125vw] w-full flex-col justify-start
        gap-[3.28125vw] overflow-y-auto scrollbar-hide"
    >
      <div
        v-for="(order, i) in props.totalOrder"
        ref="tableOrderTimeline"
        :key="order.order_info.order_key"
        class="flex w-full items-center gap-[1.5625vw]"
        @click="props.selectOrder(i)"
      >
        <div
          v-if="getLine(order.order_info.order_key)"
          class="absolute m-[0.625vw] h-[11vw] w-[0.078125vw] bg-[#4C4E55]"
        ></div>
        <div
          v-if="isHaveTwoOrder(order.order_info.order_key)"
          class="absolute m-[0.625vw] mt-[6vw] h-[6vw] w-[0.078125vw]
            bg-[#4C4E55]"
        ></div>
        <div
          v-if="currentOrder(order.order_info.order_key)"
          class="z-[2] flex w-[1.40625vw] items-center justify-center"
        >
          <div
            class="absolute flex size-[1.40625vw] animate-pulse items-center
              justify-center rounded-full bg-[#fc000180]"
          ></div>
          <div class="relative size-[0.9375vw] rounded-full bg-[#FC0000]"></div>
        </div>
        <div
          v-else
          class="z-[2] flex w-[1.40625vw] items-center justify-center"
        >
          <div
            class="relative flex size-[0.9375vw] rounded-full bg-[#4C4E55]"
          ></div>
        </div>
        <div :class="getOpacity(order.order_info.order_key)">
          <p :class="getOrderTypeClass(order.order_info.view_type)">
            {{ getOrderInfoTitle(order.order_info.view_type, i) }}
            <span class="text-white-disabled typo-r-h5 pl-[0.78125vw]">
              {{ filteredTime(order.order_info.order_time) }}
            </span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
