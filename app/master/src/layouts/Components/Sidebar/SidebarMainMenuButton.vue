<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useNoticeStore, useOrderStore } from '@store/index';
import { Menu } from '@interfaces/Menu';
import { DynamicClassType } from '@interfaces/DynamicClass';

const { t } = useTranslation();
const { noticeCount } = storeToRefs(useNoticeStore());
const { uncheckedOrderCount } = storeToRefs(useOrderStore());

const props = defineProps<{
  menuInfo: Menu;
  id: string;
  isCompactMenu: boolean;
  changeMenu: (path: string) => void;
  getIndicator: (path: string) => DynamicClassType;
  getMenuClass: (path: string) => DynamicClassType;
}>();

const isNoticeOrOrderList = computed(
  () =>
    (props.menuInfo.PathName === 'Notice' && noticeCount.value !== 0) ||
    (props.menuInfo.PathName === 'OrderList' &&
      uncheckedOrderCount.value !== 0),
);
const getCountByPath = computed(() =>
  props.menuInfo.PathName === 'Notice'
    ? noticeCount.value
    : uncheckedOrderCount.value,
);
</script>

<template>
  <div class="relative">
    <button
      :id="props.id"
      :class="props.getMenuClass(props.menuInfo.PathName)"
      type="button"
      @click="props.changeMenu(props.menuInfo.PathName)"
    >
      <span :id="props.id">{{ t(props.menuInfo.name) }}</span>
    </button>
    <div
      v-if="isNoticeOrOrderList"
      class="absolute right-[-0.15625vw] top-[-1.171875vw] !m-0 flex
        h-[2.34375vw] w-[4.375vw] items-center justify-center rounded-[7.8125vw]
        border-[0.15625vw] border-[#FF0000] bg-white p-[0.46875vw_0.78125vw]"
    >
      <span class="typo-b-h5 text-[red]">{{ getCountByPath }}</span>
    </div>
  </div>
</template>
