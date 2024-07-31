<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { checkOrderType, getOrderTime } from '@utils/commonUtils';
import { useOrderDetailStore } from '@store/index';
import { OrderListDataType } from '@interfaces/Order';
import icon_arrow_right_white from '@assets/icon/icon_arrow_right_white.svg?url';

const props = defineProps<{
  orderData: OrderListDataType;
  isFailedOrder: boolean;
}>();

const { t } = useTranslation();

const { getSelectedTablesOrderList } = useOrderDetailStore();

const getOrderTypeClass = (orderInfo: OrderListDataType) => ({
  'typo-b-h4 whitespace-nowrap': true,
  'text-error-01': orderInfo.viewType === 0 || orderInfo.errorMsg,
  'text-warning-01': orderInfo.viewType === 1 && !orderInfo.errorMsg,
  'text-success-01': orderInfo.viewType === 2 && !orderInfo.errorMsg,
});

const getOrderNumberClass = () => ({
  'flex py-2 px-[0.78125vw] items-center justify-center gap-[0.3125vw] rounded-[0.625vw]':
    true,
  'bg-alpha-white-10': !props.isFailedOrder,
  'bg-[#FF461E80]': props.isFailedOrder,
});

const getCardHeaderClass = () => ({
  'flex w-full items-center justify-between rounded-t-[0.625vw] p-[1.25vw_1.5625vw]':
    true,
  'bg-depth-03 ': !props.isFailedOrder,
  'bg-[#FF461E80]': props.isFailedOrder,
});
</script>

<template>
  <div
    :class="getCardHeaderClass()"
    @click="getSelectedTablesOrderList(props.orderData)"
  >
    <div class="flex w-[53%] gap-[0.625vw]">
      <span class="typo-b-h2 max-w-[9.375vw] truncate break-words">
        {{ props.orderData.table_name }}
      </span>
      <div :class="getOrderNumberClass()">
        <span class="typo-r-h6">{{ t('주문번호') }}</span>
        <span class="typo-b-h6">{{ props.orderData.orderSequence }}</span>
      </div>
    </div>
    <div class="flex w-[47%] justify-end gap-[0.78125vw]">
      <span :class="getOrderTypeClass(props.orderData)">
        {{ t(checkOrderType(props.orderData)) }}
      </span>
      <div class="flex gap-[0.78125vw]">
        <span class="typo-r-h4">
          {{ getOrderTime(props.orderData.order_time) }}
        </span>
        <img
          class="icon-20"
          :src="icon_arrow_right_white"
          alt="arrow_right_white"
        />
      </div>
    </div>
  </div>
</template>
