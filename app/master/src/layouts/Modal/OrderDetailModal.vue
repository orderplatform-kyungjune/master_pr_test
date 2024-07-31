<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { checkOrderType, filteredTime } from '@utils/commonUtils';
import { useOrderDetailStore } from '@store/index';
import CheckboxLabel from '@layouts/UI/CheckboxLabel.vue';
import OrderDetailInfo from '@layouts/Modal/Components/ListOrderDetail/OrderDetailInfo.vue';
import OrderDetailHeader from '@layouts/Modal/Components/ListOrderDetail/OrderDetailHeader.vue';
import OrderDetailCard from '@layouts/Modal/Components/ListOrderDetail/OrderDetailCard.vue';
import { OrderListDataType } from '@interfaces/Order';
import OrderDetailFailInfo from './Components/ListOrderDetail/OrderDetailFailInfo.vue';

const { t } = useTranslation();

const { selectedOrder, mutatedSubOrderCard } = storeToRefs(
  useOrderDetailStore(),
);

const { postCheckOrder } = useOrderDetailStore();

onMounted(() => {
  if (mutatedSubOrderCard.value.mutated) {
    const selectedCard = document.querySelector(
      `#sub-order-${mutatedSubOrderCard.value.index}`,
    );
    if (selectedCard) {
      selectedCard.scrollIntoView({ behavior: 'smooth' });
      mutatedSubOrderCard.value.mutated = false;
    }
  }
});

const isFailedOrder = computed(() => selectedOrder.value.errorMsg.length > 1);
const uncheckedSubOrder = computed(() =>
  selectedOrder.value.order_list.reduce(
    (a, b) => a + (b.order_product_commit ? 0 : 1),
    0,
  ),
);

const { closeOrderDetailModal, resetOpenTime } = useOrderDetailStore();

const getOrderTypeClass = (orderInfo: OrderListDataType) => ({
  'typo-b-h1': true,
  'text-error-01': orderInfo.viewType === 0 || orderInfo.errorMsg,
  'text-warning-01': orderInfo.viewType === 1 && !orderInfo.errorMsg,
  'text-success-01': orderInfo.viewType === 2 && !orderInfo.errorMsg,
});
</script>

<template>
  <div
    class="bg-modal-dim absolute z-[100] flex h-screen w-screen items-center
      justify-center"
    @click.self="closeOrderDetailModal(false)"
  >
    <div
      class="border-modal-2 relative flex h-[53.125vw] w-[88.59375vw] flex-col
        rounded-[0.9375vw] bg-[#111]"
      @click="resetOpenTime(false)"
    >
      <OrderDetailHeader :selectedOrder="selectedOrder" />
      <div
        class="relative flex size-full justify-between gap-[1.875vw]
          p-[2.34375vw]"
      >
        <div class="relative flex h-auto w-[45.78125vw] flex-col">
          <div class="flex w-[44.375vw] justify-between gap-[1.25vw]">
            <div class="flex items-end gap-[1.25vw]">
              <span :class="getOrderTypeClass(selectedOrder)">
                {{ t(checkOrderType(selectedOrder)) }}
              </span>
              <span class="typo-r-h5 text-white-disabled">{{
                filteredTime(selectedOrder.order_time)
              }}</span>
            </div>
            <div
              v-if="!isFailedOrder"
              class="flex items-end justify-between gap-[1.5625vw]"
            >
              <CheckboxLabel
                class="flex h-[2.5vw] items-end"
                :orderChecked="selectedOrder.order_commit"
                @click="postCheckOrder(selectedOrder)"
              >
                <div
                  class="typo-b-h2 text-white-01 line-clamp-1 gap-[0.78125vw]
                    pl-[0.78125vw]"
                >
                  {{ t('전체 완료하기') }}
                </div>
              </CheckboxLabel>
            </div>
          </div>
          <div
            class="text-white-01 order-detail-card absolute top-[3.75vw] flex
              h-[calc(100%_-_1.40625vw)] w-[45.78125vw] flex-col gap-[1.25vw]
              overflow-y-auto"
            @scroll="resetOpenTime(false)"
          >
            <OrderDetailCard
              v-for="(order, index) in selectedOrder.order_list"
              :id="`sub-order-${index}`"
              :key="order.order_product_key"
              :orderItem="order"
              :orderIndex="index"
              :isFailedOrder="isFailedOrder"
              :class="
                selectedOrder.order_list.length === index + 1
                  ? 'pb-[2.34375vw]'
                  : null
              "
            />
          </div>
        </div>
        <OrderDetailFailInfo
          v-if="isFailedOrder"
          :orderItem="selectedOrder"
        />
        <OrderDetailInfo
          v-else
          :orderItem="selectedOrder"
          :uncheckedSubOrder="uncheckedSubOrder"
        />
      </div>
    </div>
  </div>
</template>
