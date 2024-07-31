<script setup lang="ts">

import ChartSkeleton from '@pages/Dashboard/Components/skeleton/ChartSkeleton.vue';
import DayController from '@pages/Dashboard/Components/DayController.vue';
import ChartsContainer from '@pages/Dashboard/Components/ChartsContainer.vue';
</script>

<template>
  <div class="flex w-full flex-col gap-[1.5625vw]">
    <DayController />
    <Suspense>
      <ChartsContainer />
      <template #fallback>
        <ChartSkeleton />
      </template>
    </Suspense>
  </div>
</template>
