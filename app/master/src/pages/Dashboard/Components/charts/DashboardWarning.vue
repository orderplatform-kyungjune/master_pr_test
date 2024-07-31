<script setup lang='ts'>
import { useTranslation } from 'i18next-vue';
import icon_warning from '@assets/icon/dashboard/icon_warning.svg?url';

const { t } = useTranslation();
</script>

<template>
  <div class="typo-r-h5 text-white-disabled flex items-center gap-[0.625vw] pb-[3.125vw]">
    <img
      :src="icon_warning"
      alt="icon_warning"
      class="size-[1.5625vw]"
    />
    {{ t("상점분석 안내") }}
  </div>
</template>
