<script setup lang="ts">

import { storeToRefs } from 'pinia';
import { useOrderStore } from '@store/index';
import OrderListTableSkeleton from '@pages/OrderList/Components/List/Tables/__Components/OrderListTableSkeleton.vue';
import OrderListTable from '@pages/OrderList/Components/List/Tables/OrderListTable.vue';
import OrderTypeTabs from '@pages/OrderList/Components/List/OrderTypeTabs.vue';
import OrderListCards from '@pages/OrderList/Components/List/Cards/OrderListCards.vue';
import CardListSkeleton from '@pages/OrderList/Components/List/Cards/CardListSkeleton.vue';

const { orderListFilter } = storeToRefs(useOrderStore());
</script>

<template>
  <OrderTypeTabs />
  <Suspense>
    <OrderListTable v-if="orderListFilter.type === 'list'" />
    <OrderListCards v-else />
    <template #fallback>
      <OrderListTableSkeleton v-if="orderListFilter.type === 'list'" />
      <CardListSkeleton v-else />
    </template>
  </Suspense>
</template>
