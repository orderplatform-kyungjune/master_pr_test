<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import { useDashboardStore } from '@store/index';
import PopularProducts from '@pages/Dashboard/Components/charts/PopularProducts.vue';
import OrderTimeCharts from '@pages/Dashboard/Components/charts/OrderTimeCharts.vue';
import OrderDayOfTheWeeksCharts from '@pages/Dashboard/Components/charts/OrderDayOfTheWeeksCharts.vue';
import OrderCountCharts from '@pages/Dashboard/Components/charts/OrderCountCharts.vue';
import DashboardWarning from '@pages/Dashboard/Components/charts/DashboardWarning.vue';

const { currentViewType } = storeToRefs(useDashboardStore());
const { getDashboardData } = useDashboardStore();

await getDashboardData('daily').call();
</script>

<template>
  <div class="flex flex-col gap-[1.25vw] overflow-y-auto">
    <div class="flex gap-[1.25vw]">
      <OrderCountCharts />
      <PopularProducts />
    </div>
    <div class="flex gap-[1.25vw]">
      <OrderDayOfTheWeeksCharts v-if="currentViewType !== 'day'" />
      <OrderTimeCharts />
    </div>
    <DashboardWarning />
  </div>
</template>
