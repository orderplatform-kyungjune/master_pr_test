<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import SubCategoryCard from '@pages/CategoryManage/Components/CategorySubController/SubCategoryCard.vue';

const { t } = useTranslation();
</script>

<template>
  <div class="relative mb-[1.5625vw] mt-[3.046875vw] flex h-[4.6875vw] w-full flex-col gap-[2.34375vw]">
    <div class="flex flex-col gap-[0.78125vw]">
      <p class="typo-b-h2">
        {{ t('중분류 노출') }}
      </p>
      <p class="typo-r-h4 text-black-disabled">
        {{ t('중분류 노출 설명') }}
      </p>
    </div>
    <SubCategoryCard />
  </div>
</template>
