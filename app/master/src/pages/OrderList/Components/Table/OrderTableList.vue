<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useOrderDetailStore, useOrderStore } from '@store/index';
import TableCard from '@pages/OrderList/Components/Table/__Components/TableCard.vue';

const { t } = useTranslation();

const { getOrderHistoryTableType } = useOrderStore();

await getOrderHistoryTableType().call();
const { openTableDetail } = useOrderDetailStore();
const { selectedTableList, selectedTableType } = storeToRefs(useOrderStore());

const currentStatusName = computed(() => {
  const getOrderListStatus = () => selectedTableType.value;

  switch (getOrderListStatus()) {
    case 'untaken':
      return t('이용안함테이블없음');
    case 'taken':
      return t('이용중테이블없음');
    default:
      return '';
  }
});
</script>

<template>
  <div
    v-if="selectedTableList.length > 0"
    v-auto-animate
    class="scrollbar-hide grid w-full grid-cols-3 gap-[1.25vw]
      overflow-y-auto overflow-x-hidden pb-[1.5625vw]"
  >
    <TableCard
      v-for="info in selectedTableList"
      :key="info.info.table_id"
      :tableInfo="info.info"
      :tableOrder="info.orders"
      @click="openTableDetail(info)"
    />
  </div>
  <div
    v-else
    class="bg-depth-01 text-black-disabled typo-r-h3 flex size-full items-center
      justify-center rounded-[0.9375vw]"
  >
    {{ currentStatusName }}
  </div>
</template>
