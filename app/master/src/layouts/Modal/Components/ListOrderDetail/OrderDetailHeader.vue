<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { OrderListDataType } from '@interfaces/Order';
import person from '@assets/icon/icon_person.svg';

const props = defineProps<{
  selectedOrder: OrderListDataType;
}>();

const { t } = useTranslation();

const isVisitPerson = computed(
  () => props.selectedOrder.visitGroups.total !== 0,
);
const getPersonCount = computed(
  () => `${props.selectedOrder.visitGroups.total}${t('명')}`,
);
</script>

<template>
  <div
    class="text-white-01 border-b-header-1 flex min-h-[3.90625vw] w-full
      items-center justify-between p-[1.875vw_2.34375vw]"
  >
    <div class="flex items-center gap-[1.5625vw]">
      <span class="typo-b-h0">{{ props.selectedOrder.table_name }}</span>
      <div
        class="bg-alpha-white-20 flex items-center justify-center gap-[0.3125vw]
          rounded-[0.625vw] px-[0.78125vw] py-2"
      >
        <span class="typo-r-h4">{{ t('주문번호') }}</span>
        <span class="typo-b-h3">{{ props.selectedOrder.orderSequence }}</span>
      </div>
    </div>
    <div
      v-if="isVisitPerson"
      class="flex items-center justify-center gap-[0.625vw] rounded-[0.78125vw]
        bg-[#FFFFFF33] p-[0.78125vw_1.25vw]"
    >
      <person />
      <span class="typo-r-h2 text-white-01">
        {{ getPersonCount }}
      </span>
    </div>
  </div>
</template>
₩
