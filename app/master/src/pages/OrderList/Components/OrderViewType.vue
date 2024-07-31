<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useOrderStore } from '@store/index';

const { t } = useTranslation();

const { currentViewType } = storeToRefs(useOrderStore());

const setCurrentViewType = (type: string) => {
  if (type === 'list') {
    currentViewType.value = 'list';
  } else {
    currentViewType.value = 'table';
  }
};

const getViewTypeClass = (type: string) => ({
  'typo-b-h1': true,
  'text-white-01': type === currentViewType.value,
  'text-black-disabled': type !== currentViewType.value,
});
</script>

<template>
  <div class="mb-[1.25vw] flex w-full items-center gap-[1.25vw]">
    <p
      id="주문보기 - 주문별 선택"
      :class="getViewTypeClass('list')"
      @click="setCurrentViewType('list')"
    >
      {{ t('주문별') }}
    </p>
    <p
      id="주문보기 - 테이블별 선택"
      :class="getViewTypeClass('table')"
      @click="setCurrentViewType('table')"
    >
      {{ t('테이블별') }}
    </p>
  </div>
</template>
