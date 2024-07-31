<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { IS_US_EAST } from '@utils/modeUtils';
import { useNoticeStore, useOrderStore } from '@store/index';
import SidebarMainMenuButton from '@layouts/Components/Sidebar/SidebarMainMenuButton.vue';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { excludedSideMenuArray, sideMenuArray } from '@common/MenuList';

const { t } = useTranslation();

const { noticeCount } = storeToRefs(useNoticeStore());
const { uncheckedOrderCount } = storeToRefs(useOrderStore());

const props = defineProps<{
  isCompactMenu: boolean;
  isMenuVisible: boolean;
  currentPathName: string;
  changeMenu: (path: string) => void;
  getIndicator: (path: string) => DynamicClassType;
  getMenuClass: (path: string) => DynamicClassType;
}>();

const isNoticeOrOrderList = (path: string) =>
  (path === 'Notice' && noticeCount.value !== 0) ||
  (path === 'OrderList' && uncheckedOrderCount.value !== 0);

const getCompactMenuIconClass = (path: string): DynamicClassType => ({
  'relative flex h-[3.125vw] w-[3.125vw] items-center justify-center rounded-[0.625vw] active:bg-depth-02':
    true,
  'bg-depth-03': props.currentPathName.includes(path),
});

const getCompactMenuTitleClass = (path: string): DynamicClassType => ({
  'typo-r-h7': true,
  'text-white-disabled': !props.currentPathName.includes(path),
  'text-white-01': props.currentPathName.includes(path),
});

const getMenuListData = () => {
  if (IS_US_EAST) return excludedSideMenuArray();
  return sideMenuArray;
};
</script>

<template>
  <div
    v-if="!props.isMenuVisible"
    class="relative mt-[1.875vw] flex flex-col"
    :class="
      props.isCompactMenu
        ? 'mt-[9.1796875vw] items-center'
        : 'space-y-[0.625vw]'
    "
  >
    <div v-if="!props.isCompactMenu">
      <div
        v-for="list in getMenuListData()"
        :key="list.PathName"
      >
        <SidebarMainMenuButton
          :id="list.id ? list.id : ''"
          :menuInfo="list"
          :isCompactMenu="props.isCompactMenu"
          :changeMenu="changeMenu"
          :getIndicator="props.getIndicator"
          :getMenuClass="props.getMenuClass"
        />
      </div>
    </div>
    <div
      v-else
      class="flex flex-col gap-[0.78125vw]"
    >
      <div
        v-for="list in getMenuListData()"
        :id="list.id ? list.id : ''"
        :key="list.PathName"
        class="flex h-[4.375vw] w-[3.125vw] flex-col items-center gap-[0.3125vw]"
        @click="changeMenu(list.PathName)"
      >
        <div :class="getCompactMenuIconClass(list.PathName)">
          <img
            :src="list.icon"
            alt="icon"
          />
          <div
            v-if="isNoticeOrOrderList(list.PathName)"
            class="btn-bg-primary absolute right-[0.46875vw] top-[0.546875vw]
              size-[0.625vw] rounded-full"
          ></div>
        </div>
        <span :class="getCompactMenuTitleClass(list.PathName)">
          {{ t(list.shortName ?? '') }}
        </span>
      </div>
    </div>
  </div>
</template>
