<script setup lang='ts'>
import VueApexCharts from 'vue3-apexcharts';
import {
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useDashboardStore } from '@store/index';
import CountInfo from '@pages/Dashboard/Components/charts/OrderCountCharts/CountInfo.vue';

const { t } = useTranslation();

const { dashboardData } = storeToRefs(useDashboardStore());

const categories = ref(dashboardData.value.barChart.xaxis.categories);
const series = ref(dashboardData.value.barChart.series.map((item) => ({
  ...item,
  name: t(item.name),
})));

const chartOptions = () => ({
  chart: {
    id: 'order-status',
    stacked: true,
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 800,
      animateGradually: {
        enabled: true,
        delay: 150,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 350,
      },
    },
  },
  grid: { show: false },
  yaxis: { show: false },
  xaxis: {
    axisTicks: { show: false },
    categories: categories.value,
    labels: {
      style: {
        colors: [
          '#AAAAAA',
          '#AAAAAA',
          '#AAAAAA',
          '#AAAAAA',
          '#AAAAAA',
          '#AAAAAA',
          '#AAAAAA',
          '#FFFFFF',
        ],
        fontSize: '12px',
        fontWeight: 400,
      },
    },
  },
  tooltip: { theme: 'dark' },
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 10,
      dataLabels: {
        total: {
          enabled: true,
          style: {
            fontSize: '13px',
            fontWeight: 900,
            color: '#FFFFFF',
          },
          formatter(val: string) {
            return `${val.toLocaleString()}건`;
          },
        },
      },
    },
  },
  dataLabels: { enabled: false },
  legend: { show: false },
  colors: [
    '#CEE2FD',
    '#2179E2',
  ],
});

watch(() => dashboardData.value, () => {
  categories.value = dashboardData.value.barChart.xaxis.categories;
  series.value = dashboardData.value.barChart.series.map((item) => ({
    ...item,
    name: t(item.name),
  }));
});
</script>

<template>
  <div class="bg-depth-02 flex w-[52.1875vw] flex-col gap-[2.34375vw] rounded-[0.9375vw] border-[0.078125vw] border-[#3A414F] p-[1.875vw]">
    <div class="flex justify-between">
      <p class="typo-b-h3">
        {{ t("주문건수") }}
      </p>
      <div class="flex items-center gap-[0.3125vw]">
        <span class="typo-b-h2">
          {{ dashboardData.orderData.total.toLocaleString() }}
        </span>
        <span class="typo-r-h3">
          {{ t("건") }}
        </span>
      </div>
    </div>
    <div class="flex gap-[1.5625vw]">
      <CountInfo :isCallStaff="false" />
      <div class="border-default-1 h-full w-[0.078125vw]"></div>
      <CountInfo :isCallStaff="true" />
    </div>
    <div class="bg-depth-01 h-[25.3125vw] w-full rounded-[0.625vw]">
      <VueApexCharts
        width="100%"
        height="100%"
        type="bar"
        :options="chartOptions()"
        :series="series"
      />
    </div>
  </div>
</template>
