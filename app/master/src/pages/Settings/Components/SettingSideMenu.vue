<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { SettingMenu } from '@interfaces/Menu';
import { DynamicClassType } from '@interfaces/DynamicClass';

const props = defineProps<{
  settingSideMenuArray: Readonly<SettingMenu[]>;
  currentSelectedSideMenu: string;
  changeMenu: (name: string) => void;
}>();

const { t } = useTranslation();

const getListTypeClass = (id: string): DynamicClassType => ({
  'typo-b-h2 w-full': true,
  'text-primary-01 selected': id === props.currentSelectedSideMenu,
  'text-black-disabled': id !== props.currentSelectedSideMenu,
});
</script>

<template>
  <div class="scrollbar-hide relative flex h-[3.75vw] w-full overflow-x-auto">
    <div class="flex max-h-[3.75vw] gap-[1.5625vw] whitespace-nowrap">
      <div
        v-for="(list, index) in props.settingSideMenuArray"
        :id="list.id"
        :key="index"
        class="relative"
        @click="props.changeMenu(list.id ?? '')"
      >
        <p
          :id="list.id"
          :class="getListTypeClass(list.id ?? '')"
        >
          {{ t(list.name) }}
        </p>
      </div>
    </div>
  </div>
</template>
