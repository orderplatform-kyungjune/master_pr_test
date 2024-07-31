<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import Toggle from '@vueform/toggle';
import { useUserStore } from '@store/index';
import SettingsMenuItem from '@pages/QuickSetting/Components/SettingsMenuItem.vue';
import { QuickSettingType } from '@interfaces/Menu';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import { requestUpdateShopDefaultStatus } from '@apis/settings';

const { t } = useTranslation();

const { useApiRequest } = useMasterApiRequest();
const { quickSettingList } = storeToRefs(useUserStore());
const {
  getParamsFromQuickData,
  updateQuickSettingStatus,
} = useUserStore();

const dataList = ref<QuickSettingType[]>(quickSettingList.value as QuickSettingType[]);

const requestShopStatusUpdate = async (quickData: QuickSettingType) => {
  const params = getParamsFromQuickData(quickData);
  updateQuickSettingStatus(quickData.quickSetting, quickData.status);

  const {
    call,
    error,
  } = useApiRequest(requestUpdateShopDefaultStatus, (data) => {
  }, { type: params } as any, `${quickData.quickSetting} 업데이트`);

  await call();
  if (error.value !== null) {
    updateQuickSettingStatus(quickData.quickSetting, !quickData.status);
  }
};
const getQuickSettingMenuClass = (index: number): DynamicClassType => ({ 'border-b-list-1': index !== quickSettingList.value.length - 1 });
</script>

<template>
  <div class="flex size-full flex-col gap-[2.5vw]">
    <p class="typo-b-h1 h-[2.5vw]">
      {{ t('빠른설정') }}
    </p>
    <div class="bg-depth-01 rounded-[0.9375vw]">
      <SettingsMenuItem
        v-for="(quickMenu, index) in dataList"
        :key="index"
        :index="index"
        :class="getQuickSettingMenuClass(index)"
        :menu="quickMenu"
      >
        <Toggle
          v-model="quickMenu.status"
          class="typo-b-h7 border-none"
          :classes="{
            handle: 'toggle-handles',
            handleOff: 'left-[0.3125vw]',
            handleOn: 'left-[95%] transform -translate-x-full',
          }"
          on-label="ON"
          off-label="OFF"
          @change="requestShopStatusUpdate(quickMenu)"
        />
      </SettingsMenuItem>
    </div>
  </div>
</template>
