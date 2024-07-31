<script setup lang='ts'>
import VueApexCharts from 'vue3-apexcharts';
import {
  ref,
  watch,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useDashboardStore } from '@store/index';

const { t } = useTranslation();

const { currentViewType } = storeToRefs(useDashboardStore());

const getChartClass = () => ({
  'bg-depth-02 rounded-[0.9375vw] p-[1.875vw] flex flex-col gap-[2.34375vw] border-[#3A414F] border-[0.078125vw]': true,
  'w-[40.78125vw] h-[48.359375vw]': currentViewType.value !== 'day',
  'w-full h-[46.953125vw]': currentViewType.value === 'day',
});

const xaxisCategories = new Array(25).fill(0).map((_, index) => {
  if (index < 10) {
    return t('HH시', { time: `0${index}` });
  }
  return t('HH시', { time: index });
});

const lineSeries = ref([{
  name: '주문',
  data: new Array(20).fill(0).map(() => Math.round(Math.random() * 100 + 20)),
}]);

lineSeries.value[0].data.push(0);
lineSeries.value[0].data.push(0);
lineSeries.value[0].data.push(0);
lineSeries.value[0].data.push(0);
lineSeries.value[0].data.push(0);

const updateValue = () => {
  lineSeries.value[0].data = new Array(20).fill(0).map(() => Math.round(Math.random() * 100 + 20));
};

watch(() => currentViewType.value, () => updateValue());

// setInterval(
//   () => updateValue(),
//   // lineSeries.value[0].data[20] = lineSeries.value[0].data[20] + 1;
//   1000,
// );

const centerValue = lineSeries.value[0].data.reduce((a, b) => a + b, 0) / 25;

const lineOptions = {
  chart: {
    type: 'line',
    toolbar: { show: false },
    zoom: { enabled: false },
    animations: {
      enabled: true,
      easing: 'easeinout',
      speed: 1000,
      animateGradually: {
        enabled: true,
        delay: 1000,
      },
      dynamicAnimation: {
        enabled: true,
        speed: 600,
      },
    },
  },
  colors: ['#CEE2FD'],
  dataLabel: { show: false },
  stroke: {
    curve: 'smooth',
    width: 2,
  },
  annotations: {
    yaxis: [{
      y: centerValue,
      y2: centerValue + 1,
      borderColor: '#000',
      offsetY: 16,
      fillColor: '#B0C3DB',
      opacity: 0.6,
      label: {
        borderColor: '#333',
        style: {
          fontSize: '14px',
          color: '#333',
          background: '#B0C3DB',
          padding: {
            left: 8,
            right: 8,
            top: 8,
            bottom: 8,
          },
        },
        text: t('포멧 평균 주문건 수', { count: Math.floor(centerValue) }),
      },
    }],
  },
  xaxis: {
    axisTicks: { show: false },
    categories: xaxisCategories,
    labels: {
      formatter: (value: string) => {
        const hoursToShow = [
          '00시',
          '04시',
          '08시',
          '12시',
          '16시',
          '20시',
          '24시',
        ];
        if (hoursToShow.includes(value)) {
          return value;
        }
        return '';
      },
      style: {
        colors: '#AAAAAA',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
    crosshairs: {
      show: true,
      position: 'back',
      stroke: {
        color: '#FF0000',
        width: 1,
        dashArray: 5,
      },
    },
  },
  grid: { borderColor: '#252A35' },
  yaxis: {
    labels: {
      style: {
        colors: '#AAAAAA',
        fontSize: '12px',
        fontWeight: 400,
      },
    },
  },
  tooltip: {
    theme: 'dark',
    y: {
      formatter(val: string, opts: any) {
        return val;
      },
    },
    x: {
      formatter(val: string, opts: any) {
        return xaxisCategories[opts.dataPointIndex];
      },
    },
    custom({
      series,
      seriesIndex,
      dataPointIndex,
      w,
    }: any) {
      return '<div class="flex gap-[0.625vw] p-[0.625vw_0.78125vw] bg-white items-center">'
        + '<div class="flex gap-[0.3125vw] items-center">'
        + `<span class="typo-b-h6 text-black">${xaxisCategories[dataPointIndex]}</span>`
        + `<span class="typo-b-h6 text-black">${t('주문건수')}</span>`
        + '</div>'
        + '<div class="flex gap-[0.15625vw] items-center">'
        + `<span class="typo-b-h3 text-black">${series[seriesIndex][dataPointIndex]}</span>`
        + `<span class="typo-r-h4 text-black">${t('건')}</span>`
        + '</div>'
        + '</div>';
    },
  },
  markers: {
    size: 0,
    colors: '#FF0000',
    strokeColors: '#FC0000',
    strokeWidth: 8,
    strokeOpacity: 0.4,
    strokeDashArray: 0,
    fillOpacity: 1,
    shape: 'circle',
    radius: 2,
    showNullDataPoints: true,
    hover: { sizeOffset: 6 },
  },
};
</script>

<template>
  <div :class="getChartClass()">
    <div class="typo-b-h3 flex items-center">
      {{ t("시간대 별 주문건 수") }}
    </div>
    <div class="h-[34.296875vw] w-full">
      <VueApexCharts
        class="bg-depth-01 rounded-[0.625vw]"
        width="100%"
        height="100%"
        type="line"
        :options="lineOptions"
        :series="lineSeries"
      />
    </div>
    <div class="bg-alpha-white-100 typo-b-h4 active:text-white-01 flex h-[4.53125vw] items-center justify-center rounded-[0.625vw] text-black active:bg-[#FFFFFF33]">
      {{ t('더보기') }}
    </div>
  </div>
</template>
