<script setup lang='ts'>
import { useTranslation } from 'i18next-vue';
import icon_back from '@assets/icon/icon_back.svg';

const { t } = useTranslation();

const props = defineProps<{
  titleKey: string,
  closeModal: () => void,
}>();
</script>

<template>
  <div class="border-b-header-1 flex h-[6.7188vw] w-full items-center justify-between p-[2.109375vw_2.34375vw]">
    <p class="typo-b-h1 text-white">
      {{ t(props.titleKey) }}
    </p>
    <icon_back
      class="size-[1.5625vw]"
      @click="props.closeModal"
    />
  </div>
</template>
