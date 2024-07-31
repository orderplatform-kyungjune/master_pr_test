<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import Toggle from '@vueform/toggle';
import { useLocalStorageData } from '@utils/localStorage';
import { SideMenu } from '@interfaces/Menu';
import arrowRight from '@assets/icon/icon_arrow_right.svg';

const props = defineProps<{
  settingSubMenu: SideMenu;
  onChangeEvent?: () => void;
}>();

const { t } = useTranslation();

const isPickupOn = useLocalStorageData('is_pickup_on', false);

const permutePickUp = () => {
  isPickupOn.value = Boolean(isPickupOn.value);
};
</script>

<template>
  <div
    :id="props.settingSubMenu.id"
    class="flex h-[8.515625vw] w-full items-center justify-between
      p-[1.875vw_2.34375vw]"
  >
    <div class="flex flex-col gap-[0.78125vw]">
      <p
        :id="props.settingSubMenu.id"
        class="typo-b-h2"
      >
        {{ t(props.settingSubMenu.name) }}
      </p>
      <p
        :id="props.settingSubMenu.id"
        class="typo-r-h4 text-white-disabled"
      >
        {{ t(props.settingSubMenu.description) }}
      </p>
    </div>
    <div
      v-if="props.settingSubMenu.PathName === 'Settings-LanguageManage'"
      class="flex gap-[0.625vw]"
    >
      <span class="typo-r-h3 text-white-disabled">{{ t('현재 언어') }}</span>
      <arrowRight />
    </div>
    <div
      v-if="props.settingSubMenu.PathName === 'Settings-PickUp'"
      class="flex gap-[0.625vw]"
    >
      <Toggle
        v-model="isPickupOn"
        class="typo-b-h7 border-none"
        :classes="{
          handle: 'toggle-handles',
          handleOff: 'left-[0.3125vw]',
          handleOn: 'left-[95%] transform -translate-x-full',
        }"
        on-label="ON"
        off-label="OFF"
        @change="permutePickUp"
      />
    </div>
  </div>
</template>
