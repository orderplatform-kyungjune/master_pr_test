<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useModalStore, useOrderStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { listTypeArray } from '@common/MenuList';
import icon_filter from '@assets/icon/icon_filter.svg?url';
import arrow_top from '@assets/icon/icon_arrow_top.svg?url';

const { t } = useTranslation();

const { getListCount, changeListType } = useOrderStore();
const { selectedListType, isHaveFailedOrder } = storeToRefs(useOrderStore());
const { openModal } = useModalStore();

const evaluateFailedOrderTab = (type: string) =>
  !(type === 'failed' && !isHaveFailedOrder.value);

const getListTypeClass = (type: string): DynamicClassType => ({
  'typo-b-h3': true,
  'text-primary-01': type === selectedListType.value,
  'text-black-disabled': type !== selectedListType.value,
});

const getTapTypeClass = (type: string): DynamicClassType => ({
  'relative flex h-[3.75vw] items-center gap-[0.625vw]': true,
  selected: type === selectedListType.value,
});

const getListCountTypeClass = (type: string): DynamicClassType => ({
  'typo-b-h1': true,
  'text-primary-01': type === selectedListType.value,
  'text-black-disabled': type !== selectedListType.value,
});
</script>

<template>
  <div class="relative mb-[1.25vw] flex w-full justify-between">
    <div class="flex gap-[1.5625vw]">
      <div
        v-for="list in listTypeArray"
        :key="list.id"
        class="flex items-baseline"
      >
        <div
          v-if="evaluateFailedOrderTab(list.type)"
          :class="getTapTypeClass(list.type)"
          @click="changeListType(list.type)"
        >
          <span :class="getListTypeClass(list.type)">
            {{ t(list.name) }}
          </span>
          <span :class="getListCountTypeClass(list.type)">
            {{ getListCount(list.type) }}
          </span>
        </div>
      </div>
    </div>
    <div
      class="flex min-w-[13.59375vw] items-center justify-between
        rounded-[0.625vw] border-[0.078125vw] border-solid border-[#3A414F] px-4
        py-[1.09375vw] active:bg-[#3A414F]"
      @click="openModal('orderListFilter')"
    >
      <div class="flex items-center gap-2">
        <img
          :src="icon_filter"
          alt="icon_filter"
          class="icon-24"
        />
        <span class="typo-r-h4">{{ t('필터(n)', { n: 2 }) }}</span>
      </div>
      <img
        :src="arrow_top"
        alt="arrow_top"
        class="size-[0.9375vw] rotate-180"
      />
    </div>
  </div>
</template>
