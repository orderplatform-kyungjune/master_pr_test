<script setup lang="ts">

import CategorySkeleton from '@pages/CategoryManage/Components/CategorySkeleton.vue';
import CategoryManage from '@pages/CategoryManage/Components/CategoryManage.vue';
</script>

<template>
  <div class="flex size-full flex-col">
    <Suspense>
      <CategoryManage />
      <template #fallback>
        <CategorySkeleton />
      </template>
    </Suspense>
  </div>
</template>
