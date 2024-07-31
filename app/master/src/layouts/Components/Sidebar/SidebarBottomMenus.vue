<script setup lang="ts">
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { pushPage } from '@router/route.helper';
import pathName from '@router/pathName';
import SidebarBottomButton from '@layouts/Components/Sidebar/SidebarBottomButton.vue';
import setting_active from '@assets/icon/icon_setting_active.svg?url';
import setting from '@assets/icon/icon_setting.svg?url';
import refresh from '@assets/icon/icon_refresh.svg?url';

const { t } = useTranslation();

const { QUICKSETTINGS } = pathName;
const props = defineProps<{
  isCompactMenu: boolean,
  refreshPage: () => void,
  isMenuVisible: boolean,
  changeTheme: (theme: string) => void,
}>();

const route = useRoute();
const openQuickSettings = () => {
  pushPage(QUICKSETTINGS);
};

const isQuickSettingOpen = computed(() => route.name === QUICKSETTINGS);

const settingIcon = computed(() => (isQuickSettingOpen.value ? setting_active : setting));
</script>

<template>
  <div class="mb-[1.5625vw] flex flex-col justify-end">
    <SidebarBottomButton
      v-if="!props.isMenuVisible"
      id="빠른설정 버튼"
      :gaId="'빠른설정 버튼'"
      :isCompactMenu="props.isCompactMenu"
      altText="quick_system_icon"
      :label="t('빠른설정')"
      :onClick="openQuickSettings"
      :isQuickSettingOpen="isQuickSettingOpen"
    >
      <template #img>
        <img
          id="빠른설정 버튼"
          :class="props.isCompactMenu ? 'icon-24' : 'icon-20'"
          :src="settingIcon"
          alt="settingIcon"
        />
      </template>
    </SidebarBottomButton>
    <SidebarBottomButton
      id="새로고침 버튼"
      :isCompactMenu="props.isCompactMenu"
      altText="refresh_icon"
      :gaId="'새로고침 버튼'"
      :label="t('새로고침')"
      :onClick="props.refreshPage"
    >
      <template #img>
        <img
          id="새로고침 버튼"
          :class="props.isCompactMenu ? 'icon-24' : 'icon-20'"
          :src="refresh"
          alt="refresh"
        />
      </template>
    </SidebarBottomButton>
  </div>
</template>
