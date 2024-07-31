<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useOrderDetailStore, useUserStore } from '@store/index';
import { OrderListDataType } from '@interfaces/Order';
import icon_warning from '@assets/icon/icon_warning.svg?url';

const props = defineProps<{
  orderItem: OrderListDataType;
  uncheckedSubOrder: number;
}>();

const { t } = useTranslation();

const { openTime } = storeToRefs(useOrderDetailStore());

const { closeOrderDetailModal } = useOrderDetailStore();

const { userAuth } = storeToRefs(useUserStore());

const getStandardPriceUnit = userAuth.value?.store?.store_standardPriceUnit
  ? userAuth.value.store.store_standardPriceUnit
  : '원';

const getTotalOrderPrice = computed(() =>
  props.orderItem.order_total_price.toLocaleString(),
);
</script>

<template>
  <div class="flex h-full w-[35.15625vw] flex-col justify-end">
    <div class="mb-[1.875vw] flex flex-col gap-[1.09375vw]">
      <div
        class="flex h-[3.359375vw] w-[35.15625vw] items-baseline justify-between"
      >
        <div class="flex items-end gap-4">
          <span class="typo-r-h3 text-white-disabled white flex items-end">
            {{ t('총 주문 수량') }}
          </span>
          <div
            v-if="uncheckedSubOrder !== 0"
            class="flex items-center gap-[0.46875vw]"
          >
            <img
              class="size-[1.5625vw]"
              :src="icon_warning"
              alt="icon_warning"
            />
            <span class="typo-r-h3 text-error-01">
              {{ t('미완료') }} {{ uncheckedSubOrder }}
            </span>
          </div>
        </div>
        <div class="flex items-baseline gap-[0.3125vw]">
          <span class="typo-b-h0 text-white-01">{{
            props.orderItem.order_total_count
          }}</span>
          <span class="typo-b-h3 text-white-disabled">{{ t('개') }}</span>
        </div>
      </div>
      <div
        class="flex h-[3.359375vw] w-[35.15625vw] items-baseline justify-between"
      >
        <span class="typo-r-h3 text-white-disabled flex items-end">
          {{ t('총 주문 금액') }}
        </span>
        <div
          v-if="getStandardPriceUnit === '원'"
          class="flex items-baseline gap-[0.3125vw]"
        >
          <span class="typo-b-h0 text-white-01">{{ getTotalOrderPrice }}</span>
          <span class="typo-b-h3 text-white-disabled">
            {{ getStandardPriceUnit }}
          </span>
        </div>
        <div
          v-else
          class="flex items-baseline gap-[0.3125vw]"
        >
          <span class="typo-b-h1 text-white-disabled">
            {{ getStandardPriceUnit }}
          </span>
          <span class="typo-b-h0 text-white-01">{{ getTotalOrderPrice }}</span>
        </div>
      </div>
    </div>
    <div class="flex justify-end gap-[1.25vw]">
      <div
        id="주문보기 - 리스트뷰 - 주문 상세 닫기"
        class="typo-b-h3 active:btn-bg-primary-pressed btn-bg-primary
          text-white-01 flex h-[5vw] w-[23.4375vw] items-center justify-center
          rounded-[0.625vw]"
        @click="closeOrderDetailModal(false)"
      >
        <span class="min-w-[11.71875vw] text-center tabular-nums">
          {{ t('n초 후 닫힘', { time: openTime }) }}
        </span>
      </div>
    </div>
  </div>
</template>
