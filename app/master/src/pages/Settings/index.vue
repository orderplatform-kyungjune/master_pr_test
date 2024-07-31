<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useModalStore, useUserStore } from '@store/index';
import { pushPage } from '@router/route.helper';
import pathName from '@router/pathName';
import SettingSubSideMenu from '@pages/Settings/Components/SettingSubSideMenu.vue';
import SettingSideMenu from '@pages/Settings/Components/SettingSideMenu.vue';
import { SideMenu } from '@interfaces/Menu';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { settingSideMenuArray } from '@common/MenuList';

const { S_LANGUAGE, STORE, S_PICKUP } = pathName;

const { openModal } = useModalStore();
const { logout } = useUserStore();
const { userAuth } = storeToRefs(useUserStore());

const currentSelectedSideMenu = ref<string>('설정 - 매장 관리 클릭');

const getCurrentSideSubMenu = computed(() =>
  settingSideMenuArray
    .find((item) => item.id === currentSelectedSideMenu.value)!
    .sideMenu.filter((item) => {
      const isOneStore = userAuth.value?.shop_data?.length === 1;
      return isOneStore
        ? item.PathName !== 'storeSelect' &&
            item.PathName !== 'Settings-TimerMessage'
        : item.PathName !== 'Settings-TimerMessage';
    }),
);

const changeMenu = (name: string) => {
  currentSelectedSideMenu.value = name;
};

const getSettingMenuClass = (
  item: SideMenu,
  index: number,
): DynamicClassType => ({
  'active:bg-depth-03': item.PathName !== S_PICKUP,
  'border-b-list-1': index !== getCurrentSideSubMenu.value.length - 1,
  'active:rounded-b-[0.9375vw]':
    index === getCurrentSideSubMenu.value.length - 1,
  'active:rounded-t-[0.9375vw]': index === 0,
});

const clickEvents = (path: string) => {
  if (path === S_PICKUP) {
    return;
  }

  if (path === S_LANGUAGE) {
    openModal('languageChange');
    return;
  }

  if (path === 'logout') {
    logout();
    return;
  }

  if (path === 'storeSelect') {
    pushPage(STORE);
    return;
  }

  // 주문 상세내역 자동 닫기 시간 모달
  if (path === 'autoClose') {
    openModal('autoClose');
    return;
  }

  pushPage(path);
};
</script>

<template>
  <div class="flex size-full flex-col gap-[1.5625vw]">
    <SettingSideMenu
      :settingSideMenuArray="settingSideMenuArray"
      :currentSelectedSideMenu="currentSelectedSideMenu"
      :changeMenu="changeMenu"
    />
    <div
      v-auto-animate
      class="bg-depth-01 rounded-[0.9375vw]"
    >
      <SettingSubSideMenu
        v-for="(item, index) in getCurrentSideSubMenu"
        :key="index"
        :class="getSettingMenuClass(item, index)"
        :settingSubMenu="item"
        @click="clickEvents(item.PathName)"
      />
    </div>
  </div>
</template>
