<script setup lang="ts">
import ProductTable from '@pages/ProductManage/Components/ProductTable.vue';
import ProductSkeleton from '@pages/ProductManage/Components/ProductSkeleton.vue';
</script>

<template>
  <div class="flex size-full flex-col">
    <Suspense>
      <ProductTable />
      <template #fallback>
        <ProductSkeleton />
      </template>
    </Suspense>
  </div>
</template>
