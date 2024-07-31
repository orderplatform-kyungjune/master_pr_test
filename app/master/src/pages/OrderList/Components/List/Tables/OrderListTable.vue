<script setup lang="ts">
import { computed, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useVirtualList } from '@vueuse/core';
import { translateLanguage } from '@utils/langTranferUtils';
import { checkOrderType, getOrderTime, vwToPx } from '@utils/commonUtils';
import { useOrderDetailStore, useOrderStore } from '@store/index';
import { OrderListDataType, OrderListType } from '@interfaces/Order';
import { DynamicClassType } from '@interfaces/DynamicClass';

const { t } = useTranslation();

const { orderList, selectedList, selectedListType } =
  storeToRefs(useOrderStore());
const { getSelectedTablesOrderList } = useOrderDetailStore();
const { getOrderHistory } = useOrderStore();

await getOrderHistory().call();

const isSuccessOrder = (errMsg: string) => errMsg.length === 0;

const currentStatusName = computed(() => {
  const getOrderListStatus = () => {
    if (orderList.value.length === 0) {
      return 'none';
    }
    return selectedListType.value;
  };

  switch (getOrderListStatus()) {
    case 'none':
      return t('전체 주문 내역 없음');
    case 'all':
      return t('전체 주문 내역 없음');
    case 'unchecked':
      return t('미확인 주문 내역 없음');
    case 'checked':
      return t('확인 완료 주문 내역 없음');
    default:
      return '';
  }
});

// Virtual Scroll 로직
const initialVirtualList = useVirtualList(selectedList.value, {
  itemHeight: vwToPx(5.6640625),
  overscan: 12,
});

let lists = initialVirtualList.list;
let { containerProps } = initialVirtualList;
let { wrapperProps } = initialVirtualList;

watch(
  () => selectedList.value,
  () => {
    const result = useVirtualList(selectedList.value, {
      itemHeight: vwToPx(5.6640625),
      overscan: 12,
    });
    lists = result.list;
    containerProps = result.containerProps;
    wrapperProps = result.wrapperProps;
  },
);

const isMoreThanOne = (orderInfo: OrderListType[]) => orderInfo.length > 1;

const getUncheckedSubOrderCount = (order: OrderListDataType) =>
  order.order_list.reduce(
    (previousValue, currentValue) =>
      previousValue + (currentValue.order_product_commit ? 0 : 1),
    0,
  );

const getOrderTypeClass = (orderInfo: OrderListDataType) => ({
  'w-[8%] h-[5.625vw] flex justify-center items-center': true,
  'text-error-01': orderInfo.viewType === 0 || orderInfo.errorMsg,
  'text-warning-01': orderInfo.viewType === 1 && !orderInfo.errorMsg,
  'text-success-01': orderInfo.viewType === 2 && !orderInfo.errorMsg,
});

const getOrderCardClass = (orderInfo: OrderListDataType) => ({
  'typo-b-h4 flex h-[5.625vw] border-b-[0.078125vw] border-b-[#252A35]': true,
  'bg-[#FF461E80] active:bg-[#FF461EB3]': orderInfo.errorMsg,
  'active:bg-[#FFFFFF0D]': !orderInfo.errorMsg,
});

const getCheckedStatusClass = (checked: boolean): DynamicClassType => ({
  'rounded-[0.625vw] w-[12.34375vw] h-[3.125vw] text-center mx-auto flex justify-center items-center typo-b-h4':
    true,
  'bg-[#FFF] text-black-01': !checked,
  'bg-[#292929] text-white-01': checked,
});

const getMenuNameClass = (orderList: OrderListType[]) => {
  if (isMoreThanOne(orderList)) return 'truncate leading-tight text-start max-w-[75%]';
  return 'truncate leading-tight text-start max-w-full';
};
</script>

<template>
  <div class="bg-depth-01 scrollbar-hide h-[50.5vw] w-full rounded-t-[0.625vw]">
    <div class="size-full border-collapse text-center">
      <div
        class="typo-r-h5 text-white-01 bg-depth-03 sticky top-0 z-10
          h-[4.0625vw] rounded-t-[0.625vw]"
      >
        <div class="flex size-full items-center">
          <div class="typo-r-h5 w-[9%]">
            {{ t('주문 번호') }}
          </div>
          <div class="typo-r-h5 w-[10%]">
            {{ t('주문 시간') }}
          </div>
          <div class="typo-r-h5 w-[8%]">
            {{ t('주문 유형') }}
          </div>
          <div class="typo-r-h5 w-[13%]">
            {{ t('테이블명') }}
          </div>
          <div class="typo-r-h5 w-[42%]">
            {{ t('주문 내역') }}
          </div>
          <div class="typo-r-h5 w-[18%]">
            {{ t('완료 여부') }}
          </div>
        </div>
      </div>
      <div
        v-if="!selectedList.length"
        class="bg-depth-01 absolute h-[45vw] w-full"
      >
        <div
          class="typo-r-h3 text-black-disabled bg-depth-01 absolute flex
            size-full items-center justify-center"
        >
          {{ currentStatusName }}
        </div>
      </div>
      <div
        v-else
        v-bind="containerProps"
        class="bg-depth-01 scrollbar-hide h-[46.4375vw] w-full overflow-y-auto"
      >
        <div
          v-bind="wrapperProps"
          class="scrollbar-hide size-full overflow-y-auto"
        >
          <div
            v-for="{ data: list } in lists"
            :key="list.order_key"
            :class="getOrderCardClass(list)"
            @click="getSelectedTablesOrderList(list)"
          >
            <div class="typo-r-h3 flex w-[9%] items-center justify-center">
              <span>{{ list.orderSequence }}</span>
            </div>
            <div
              class="typo-r-h4 flex h-[5.625vw] w-[10%] items-center
                justify-center"
            >
              {{ getOrderTime(list.order_time) }}
            </div>
            <div :class="getOrderTypeClass(list)">
              <span>{{ t(checkOrderType(list)) }}</span>
            </div>
            <div class="typo-r-h3 flex w-[13%] items-center justify-center">
              {{ list.table_name }}
            </div>
            <div
              class="typo-b-h2 flex h-[5.625vw] w-[42%] items-center
                justify-start gap-[0.78125vw] px-[1.5625vw]"
            >
              <span :class="getMenuNameClass(list.order_list)">
                {{
                  translateLanguage(
                    list.order_list[0]?.name_array,
                    list.order_list[0].display_name,
                  )
                }}
              </span>
              <span
                v-if="isMoreThanOne(list.order_list)"
                class="max-w-[25%]"
              >
                외 {{ list.order_list.length - 1 }}개
              </span>
            </div>
            <div class="flex h-[5.625vw] w-[18%] items-center justify-center">
              <div
                v-if="isSuccessOrder(list.errorMsg)"
                :class="getCheckedStatusClass(list.order_commit)"
              >
                {{ list.order_commit ? t('완료') : t('미완료') }}
                <span
                  v-if="!list.order_commit"
                  class="text-primary-01 pl-[0.390625vw]"
                >
                  {{ getUncheckedSubOrderCount(list) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
