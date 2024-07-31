<script setup lang='ts'>
import VueApexCharts from 'vue3-apexcharts';
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useDashboardStore } from '@store/index';

const { t } = useTranslation();

const { dashboardData } = storeToRefs(useDashboardStore());

const labels = ref(dashboardData.value.donutChar.labels.map((item) => `${item}요일`));

const donutSeries = ref(dashboardData.value.donutChar.series);

const colors = [
  '#FCB045',
  '#38B8C7',
  '#2179E2',
  '#A674E7',
  '#8E97AA',
  '#606C85',
  '#424C5E',
];

const rankedColors = ref(colors.slice());

donutSeries.value.map((value, index) => ({
  value,
  index,
}))
  .sort((a, b) => b.value - a.value)
  .forEach((item, rankIndex) => {
    rankedColors.value[item.index] = colors[rankIndex];
  });

const donutOptions = {
  chart: { type: 'donut' },
  labels: labels.value,
  fill: { opacity: 1 },
  plotOptions: { pie: { donut: { size: '40%' } } },
  dataLabels: { enabled: false },
  stroke: { show: false },
  legend: { show: false },
  colors: rankedColors.value,
};

</script>

<template>
  <div class="bg-depth-02 h-[48.359375vw] w-[40.78125vw] rounded-[0.9375vw] border-[0.078125vw] border-[#3A414F] p-[1.875vw]">
    <div class="flex items-center justify-between">
      <span class="typo-b-h3">
        {{ t('요일별 주문 횟수') }}
      </span>
    </div>
    <div class="relative mt-[2.5vw]">
      <div class="absolute top-[-0.78125vw] h-[30vw] w-full">
        <VueApexCharts
          width="100%"
          height="100%"
          type="donut"
          :options="donutOptions"
          :series="donutSeries"
        />
      </div>
    </div>
    <div class="bg-depth-01 mt-[30.5vw] grid h-[12.5vw] w-full grid-flow-col grid-rows-4 gap-[1.25vw] rounded-[0.625vw] p-[1.25vw]">
      <div
        v-for="(item, index) in rankedColors"
        :key="index"
        class="flex gap-[1.25vw]"
      >
        <div class="flex h-[1.5625vw] items-center gap-[0.625vw]">
          <div
            class="size-[1.5625vw] rounded-[0.3125vw]"
            :style="`background-color: ${item}`"
          ></div>
          <span class="typo-b-h4">{{ labels[index].slice(0, 1) }}</span>
        </div>
        <div class="flex h-[1.5625vw] items-center gap-[0.625vw]">
          <span class="typo-r-h4">{{ donutSeries[index].toLocaleString() }}{{ t('건') }}</span>
          <span class="typo-r-h6">(22.3%)</span>
        </div>
      </div>
    </div>
  </div>
</template>
