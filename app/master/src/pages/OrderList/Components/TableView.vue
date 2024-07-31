<script setup lang="ts">
import OrderTableSkeleton from '@pages/OrderList/Components/Table/__Components/OrderTableSkeleton.vue';
import OrderTableTypeTabs from '@pages/OrderList/Components/Table/OrderTableTypeTabs.vue';
import OrderTableList from '@pages/OrderList/Components/Table/OrderTableList.vue';
</script>

<template>
  <OrderTableTypeTabs />
  <div class="scrollbar-hide mt-[1.5625vw] size-full grid-cols-3 gap-[1.25vw] overflow-y-auto overflow-x-hidden pb-[1.5625vw]">
    <Suspense>
      <OrderTableList />
      <template #fallback>
        <OrderTableSkeleton />
      </template>
    </Suspense>
  </div>
</template>
