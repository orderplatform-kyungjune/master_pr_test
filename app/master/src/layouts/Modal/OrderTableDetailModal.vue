<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { checkPosOrderType } from '@utils/commonUtils';
import { useOrderDetailStore, useRefsStore } from '@store/index';
import TableOrderDetailHeader from '@layouts/Modal/Components/TableOrderDetail/TableOrderDetailHeader.vue';
import TableOrderDetailCard from '@layouts/Modal/Components/TableOrderDetail/TableOrderDetailCard.vue';
import TableDetailInfo from '@layouts/Modal/Components/TableDetailInfo.vue';
import {
  TABLE_ORDER_VIEW,
  TableOrderListType,
  TableOrderViewType,
} from '@interfaces/Order';

const { t } = useTranslation();

const { selectedTableData } = storeToRefs(useOrderDetailStore());
const { tableOrderCardWrapper, tableOrderTimeline } =
  storeToRefs(useRefsStore());

const currentOrderNum = ref(0);

const currentOrder = computed(
  () => selectedTableData.value.orders[currentOrderNum.value],
);

const selectOrder = (index: number) => {
  tableOrderCardWrapper.value?.[index].scrollIntoView({ behavior: 'auto' });
};

const setCurrentOrderNum = (index: number) => {
  currentOrderNum.value = index;
};

const getOrderInfoTitle = (
  viewType: TableOrderViewType,
  orderIndex: number,
) => {
  if (viewType === TABLE_ORDER_VIEW.order) {
    return `${t(checkPosOrderType(viewType))} ${selectedTableData.value.orders.length - orderIndex}`;
  }
  return t(checkPosOrderType(viewType));
};

const getOrderTypeClass = (viewType: number) => ({
  'typo-b-h1': true,
  'text-error-01': viewType === 0,
  'text-warning-01': viewType === 1,
  'text-success-01': viewType === 2,
});

const vwToPx = (vw: number) => {
  const { clientWidth } = document.documentElement;
  const px = (vw / 100) * clientWidth;
  return `${px}px`;
};

const vObserver = {
  mounted: (el: Element) => {
    const setNumAndScroll = async (
      entry: IntersectionObserverEntry,
      observer: IntersectionObserver,
    ) => {
      if (entry.isIntersecting) {
        const index = tableOrderCardWrapper.value.findIndex(
          (e) => e === entry.target,
        );
        if (index !== -1) {
          setCurrentOrderNum(index);
          tableOrderTimeline.value?.[index].scrollIntoView({
            behavior: 'auto',
          });
        }
      }
    };

    const options = {
      root: document.querySelector('.order-detail-card'),
      rootMargin: `0px 0px ${vwToPx(-16.5)} 0px`,
      threshold: 0.1,
    };

    const observers = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => setNumAndScroll(entry, observer));
    }, options);

    observers.observe(el);
  },
};

const getOrderListKey = (order: TableOrderListType, index: number) => {
  if (!order.name_array?.ko) return `recentOrderItem-${index}`;
  return order.name_array?.ko;
};
</script>

<template>
  <div
    class="absolute z-10 flex h-screen w-screen items-center justify-center
      bg-[rgba(0,0,0,0.6)]"
  >
    <div
      class="relative flex size-full flex-col rounded-[0.9375vw] bg-[#111]
        p-[2.34375vw_2.34375vw_0_2.34375vw]"
    >
      <TableOrderDetailHeader
        :selectedOrder="currentOrder"
        :selectedTableData="selectedTableData"
      />
      <div class="relative flex size-full justify-between gap-[1.5625vw]">
        <div class="h-full w-[47.8125vw]">
          <div
            class="text-white-01 order-detail-card absolute flex h-full
              w-[47.8125vw] flex-col gap-[1.25vw] overflow-y-auto pb-[31.25vw]
              pr-[1.25vw]"
          >
            <div
              v-for="(orders, orderIndex) in selectedTableData.orders"
              :key="orders.order_info.order_time"
              ref="tableOrderCardWrapper"
              v-observer
              class="flex flex-col gap-[1.25vw]"
            >
              <p :class="getOrderTypeClass(orders.order_info.view_type)">
                {{ getOrderInfoTitle(orders.order_info.view_type, orderIndex) }}
              </p>
              <TableOrderDetailCard
                v-for="(order, index) in orders.order_list"
                :key="getOrderListKey(order, index)"
                :orderItem="order"
                :orderInfo="orders.order_info"
              />
            </div>
          </div>
        </div>
        <TableDetailInfo
          :totalPrice="selectedTableData.info.total_price"
          :selectedTableData="selectedTableData"
          :orderItem="currentOrder"
          :selectOrder="selectOrder"
        />
      </div>
    </div>
  </div>
</template>
