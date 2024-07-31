<script setup lang='ts'>
import {
  ref,
  watch,
  computed,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useVirtualList } from '@vueuse/core';
import { vwToPx } from '@utils/commonUtils';
import { useOrderStore } from '@store/index';
import CardHeader from '@pages/OrderList/Components/List/Cards/__Components/CardHeader.vue';
import CardBody from '@pages/OrderList/Components/List/Cards/__Components/CardBody.vue';

const { t } = useTranslation();

const { getOrderHistory } = useOrderStore();
const {
  orderList,
  selectedList,
  selectedListType,
} = storeToRefs(useOrderStore());
const idleList = ref<boolean>(false);

await getOrderHistory().call();

// Virtual Scroll 로직
const initialVirtualList = useVirtualList(selectedList.value, {
  itemWidth: vwToPx(37.421875),
  overscan: 5,
});

let lists = initialVirtualList.list;
let { containerProps } = initialVirtualList;
let { wrapperProps } = initialVirtualList;

watch(() => selectedList.value, () => {
  idleList.value = true;
  const result = useVirtualList(selectedList.value, {
    itemWidth: vwToPx(37.421875),
    overscan: 5,
  });
  lists = result.list;
  containerProps = result.containerProps;
  wrapperProps = result.wrapperProps;
  idleList.value = false;
});

const isFailedOrder = (errorMsg: string) => errorMsg.length > 0;

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
</script>

<template>
  <div
    v-if="selectedList.length > 0"
    class="card-container scrollbar-hide relative h-[calc(100%_+_5vw)] overflow-x-scroll"
    v-bind="containerProps"
  >
    <div
      class="card-wrapper scrollbar-hide absolute flex w-full gap-[1.25vw] overflow-y-hidden"
      v-bind="wrapperProps"
    >
      <div
        v-for="{ data: order } in lists"
        :key="order.order_key"
        class="bg-depth-02 h-[48.671875vw] w-[36.171875vw] rounded-[0.625vw] border-[0.078125vw] border-[#3A414F]"
      >
        <CardHeader
          :orderData="order"
          :isFailedOrder="isFailedOrder(order.errorMsg)"
        />
        <CardBody
          v-if="!idleList"
          :orderData="order"
          :isFailedOrder="isFailedOrder(order.errorMsg)"
        />
      </div>
    </div>
  </div>
  <div
    v-else
    class="bg-depth-01 text-black-disabled typo-r-h3 mb-[1.5625vw] flex size-full items-center justify-center rounded-[0.9375vw]"
  >
    {{ currentStatusName }}
  </div>
</template>
