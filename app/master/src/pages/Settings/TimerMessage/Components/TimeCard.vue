<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { DynamicClassType } from '@interfaces/DynamicClass';

const props = defineProps<{
  timeType: string,
  hour: string,
  minute: string,
  clickTimeCard: (timeType: string) => void,
  timeSetType: string,
}>();

const { t } = useTranslation();

const getCardClass = (): DynamicClassType => ({
  'active:border-pressed-1 flex h-[9.0625vw] w-[23.9063vw] flex-col justify-center rounded-[0.6250vw] p-[1.5625vw]': true,
  'bg-depth-02 border-transparent-1': props.timeSetType === 'unActive',
  'bg-depth-00 border-pressed-2': props.timeSetType === 'needActive',
  'bg-depth-02 text-white-01 border-transparent-1': props.timeSetType === 'active',
});

const getTimeTypeTextClass = (): DynamicClassType => ({
  'typo-r-h5 typo-r-h5': true,
  'text-white-disabled': props.timeSetType === 'unActive',
  'text-white-01': props.timeSetType !== 'unActive',
});

const getTimeColorClass = (): DynamicClassType => ({
  'mt-[0.8333vw] text-[3.9063vw] leading-none tracking-[0.0156vw]': true,
  'text-white-01': props.timeSetType === 'active',
  'text-[rgba(255,255,255,.05)]': props.timeSetType !== 'active',
});
</script>

<template>
  <div
    :class="getCardClass()"
    @click="props.clickTimeCard(props.timeType)"
  >
    <p :class="getTimeTypeTextClass()">
      {{ props.timeType === 'start' ? t('시작 시간') : t('종료 시간') }}
    </p>
    <p :class="getTimeColorClass()">
      {{ props.hour }}:{{ props.minute }}
    </p>
  </div>
</template>
