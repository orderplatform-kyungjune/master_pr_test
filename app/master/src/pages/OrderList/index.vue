<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import {
  useOrderStore,
  useSocketStore,
} from '@store/index';
import TableView from '@pages/OrderList/Components/TableView.vue';
import OrderViewType from '@pages/OrderList/Components/OrderViewType.vue';
import ListView from '@pages/OrderList/Components/ListView.vue';

const { currentViewType } = storeToRefs(useOrderStore());
const { resetListAndTableType } = useOrderStore();
const isListView = computed(() => currentViewType.value === 'list');

const { connectSocket } = useSocketStore();

connectSocket();
resetListAndTableType();
</script>

<template>
  <div class="relative flex h-[95.3%] w-full flex-col">
    <OrderViewType />
    <ListView v-if="isListView" />
    <TableView v-if="!isListView" />
  </div>
</template>
