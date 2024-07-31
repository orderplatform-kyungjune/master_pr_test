<script setup lang='ts'>
import { storeToRefs } from 'pinia';
import useCategoryStore from '@store/useCategoryStore';
import CategorySubController from '@pages/CategoryManage/Components/CategorySubController.vue';
import CategoryNavigation from '@pages/CategoryManage/Components/CategoryNavigation.vue';
import CategoryMainController from '@pages/CategoryManage/Components/CategoryMainController.vue';

const { getCategoryList } = useCategoryStore();
const { selectedCategory } = storeToRefs(useCategoryStore());

await getCategoryList('categoryManage').call();
</script>

<template>
  <div v-auto-animate>
    <CategoryNavigation />
    <CategoryMainController />
    <CategorySubController v-if="selectedCategory.categoryUse === 'Y'" />
  </div>
</template>
