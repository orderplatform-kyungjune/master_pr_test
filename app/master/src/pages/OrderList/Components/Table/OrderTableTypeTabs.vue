<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useOrderStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { tableTypeArray } from '@common/MenuList';

const {
  getTableCount,
  changeTableType,
} = useOrderStore();
const { selectedTableType } = storeToRefs(useOrderStore());

const { t } = useTranslation();

const getListTypeClass = (type: string): DynamicClassType => ({
  'typo-b-h3': true,
  'text-primary-01': type === selectedTableType.value,
  'text-black-disabled': type !== selectedTableType.value,
});

const getTapTypeClass = (type: string): DynamicClassType => ({
  'relative flex h-[3.75vw] items-center gap-[0.625vw]': true,
  selected: type === selectedTableType.value,
});

const getListCountTypeClass = (type: string): DynamicClassType => ({
  'typo-b-h1': true,
  'text-primary-01': type === selectedTableType.value,
  'text-black-disabled': type !== selectedTableType.value,
});
</script>

<template>
  <div class="relative flex justify-start gap-[1.5625vw]">
    <div
      v-for="list in tableTypeArray"
      :key="list.id"
      class="flex items-baseline"
      @click="changeTableType(list.type)"
    >
      <div :class="getTapTypeClass(list.type)">
        <span :class="getListTypeClass(list.type)">
          {{ t(list.name) }}
        </span>
        <span :class="getListCountTypeClass(list.type)">
          {{ getTableCount(list.type) }}
        </span>
      </div>
    </div>
  </div>
</template>
