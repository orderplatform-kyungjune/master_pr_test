<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { IS_ORIGIN, IS_PROD } from '@utils/modeUtils';
import { useLocalStorageData } from '@utils/localStorage';
import {
  useUserStore,
  useOrderDetailStore,
  useAdministratorStore,
} from '@store/index';
import VersionInfo from '@layouts/UI/VersionInfo.vue';
import TouchPointer from '@layouts/UI/TouchPointer.vue';
import ToastMessage from '@layouts/UI/ToastMessage.vue';
import RootModalHub from '@layouts/Modal/RootModalHub.vue';
import OrderSimpleModal from '@layouts/Modal/OrderSimpleModal.vue';
import SidebarContainer from '@layouts/Components/SidebarContainer.vue';
import KakaoCsButton from '@layouts/Components/KakaoCsButton.vue';
import { DynamicClassType } from '@interfaces/DynamicClass';

const { userAuth } = storeToRefs(useUserStore());
const { usePointer } = storeToRefs(useAdministratorStore());
const { isSimpleOrderModalOpened } = storeToRefs(useOrderDetailStore());

const isCompactMenu = useLocalStorageData<boolean>('isCompactMenu', false);

const toggleMenuClass = () => {
  isCompactMenu.value = !isCompactMenu.value;
};

const getVersion = () => {
  const app_version =
    window.location.pathname.split('/').filter(Boolean).join('.') || 'Root';

  const build_version = import.meta.env.MODE;

  const userStore = userAuth.value?.store;

  if (userStore) {
    return `${userStore.store_name} - ${IS_PROD ? app_version : build_version}`;
  }
  return IS_PROD ? app_version : build_version;
};

const getMainViewClass = (): DynamicClassType => ({
  'relative flex h-full flex-col pr-[1.5625vw] overflow-hidden': true,
  'w-[84.375vw]': !isCompactMenu.value,
  'w-[93.75vw]': isCompactMenu.value,
});
</script>

<template>
  <RootModalHub />
  <TouchPointer v-if="usePointer" />
  <div class="bg-depth-00 relative flex h-screen w-full text-white">
    <SidebarContainer
      :isCompactMenu="isCompactMenu"
      :toggleMenuClass="toggleMenuClass"
    />
    <main :class="getMainViewClass()">
      <ToastMessage />
      <OrderSimpleModal v-if="isSimpleOrderModalOpened" />
      <KakaoCsButton v-if="IS_ORIGIN" />
      <VersionInfo :getVersion="getVersion" />
      <RouterView
        v-slot="{ Component }"
        class="h-[59.375vw]"
      >
        <component :is="Component" />
      </RouterView>
    </main>
  </div>
</template>
