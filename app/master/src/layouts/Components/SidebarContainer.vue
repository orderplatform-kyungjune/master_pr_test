<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useNoticeStore } from '@store/index';
import { pushPage } from '@router/route.helper';
import pathName, { RouteNameType } from '@router/pathName';
import SidebarMainMenu from '@layouts/Components/Sidebar/SidebarMainMenu.vue';
import SidebarLogo from '@layouts/Components/Sidebar/SidebarLogo.vue';
import SidebarCalender from '@layouts/Components/Sidebar/SidebarCalender.vue';
import SidebarBottomMenus from '@layouts/Components/Sidebar/SidebarBottomMenus.vue';
import { DynamicClassType } from '@interfaces/DynamicClass';

const { LOGIN, NOTICE, STORE } = pathName;

const props = defineProps<{
  isCompactMenu: boolean;
  toggleMenuClass: () => void;
}>();

const { resetNoticeParams } = useNoticeStore();

const route = useRoute();

const currentPathName = computed(() => route.name as string);

const isMenuVisible = computed(
  () => currentPathName.value === LOGIN || currentPathName.value === STORE,
);

const changeMenu = (path: string) => {
  if (path === 'Notice') {
    resetNoticeParams();
  }
  pushPage(path as RouteNameType);
};

const refreshPage = () => window.location.reload();

const changeTheme = (theme: string) => {
  document.querySelector('html')?.setAttribute('data-theme', theme);
};

const getSideBarClass = (): DynamicClassType => ({
  'flex h-full flex-col justify-between pt-[2.734375vw]': true,
  'w-[15.625vw] pt-[2.734375vw]': !props.isCompactMenu,
  'w-[6.25vw] pt-[3.125vw]': props.isCompactMenu,
});

const getMenuClass = (path: string): DynamicClassType => ({
  'relative w-full btn-side-menu active:bg-[#252A35] outline-none text-[#AAA]':
    true,
  'btn-bg-primary typo-b-h4 text-white':
    currentPathName.value !== 'QuickSettings' &&
    currentPathName.value.includes(path),
  'bg-transparent typo-r-h4 ': !currentPathName.value.includes(path),
  'btn-square': props.isCompactMenu,
});

const getIndicator = (path: string): DynamicClassType => ({
  'w-full': true,
  indicator: path === NOTICE,
});

const getCalenderClass = (): DynamicClassType => ({
  'opacity-0': props.isCompactMenu,
  'opacity-100': !props.isCompactMenu,
});
</script>

<template>
  <aside :class="getSideBarClass()">
    <div class="flex w-full flex-col px-[1.25vw]">
      <SidebarLogo
        :isCompactMenu="props.isCompactMenu"
        :toggleMenuClass="props.toggleMenuClass"
      />
      <SidebarCalender
        v-if="!props.isCompactMenu"
        :class="getCalenderClass()"
      />
      <SidebarMainMenu
        :isCompactMenu="props.isCompactMenu"
        :isMenuVisible="isMenuVisible"
        :changeMenu="changeMenu"
        :getIndicator="getIndicator"
        :getMenuClass="getMenuClass"
        :currentPathName="currentPathName"
      />
    </div>
    <SidebarBottomMenus
      :isCompactMenu="props.isCompactMenu"
      :isMenuVisible="isMenuVisible"
      :changeTheme="changeTheme"
      :refreshPage="refreshPage"
    />
  </aside>
</template>
