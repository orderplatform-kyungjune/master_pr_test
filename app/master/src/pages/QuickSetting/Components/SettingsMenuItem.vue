<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { SideMenu } from '@interfaces/Menu';

const props = defineProps<{
  menu: Omit<SideMenu, 'PathName'>;
  index: number;
}>();

const { t } = useTranslation();
</script>

<template>
  <div
    class="flex h-[8.515625vw] w-full items-center justify-between
      p-[1.875vw_2.34375vw]"
  >
    <div class="flex flex-col gap-[0.78125vw]">
      <p class="typo-b-h2">
        {{ t(props.menu.name) }}
      </p>
      <p class="typo-r-h4 text-white-disabled">
        {{ t(props.menu.description) }}
      </p>
    </div>
    <slot></slot>
  </div>
</template>
