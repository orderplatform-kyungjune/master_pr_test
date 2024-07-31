<script setup lang="ts">
import useCurrentTime from '@composable/useCurrentTime';

const {
  currentDate,
  currentTime,
} = useCurrentTime();
</script>

<template>
  <div class="flex w-full flex-col items-center justify-center">
    <p class="typo-r-h4 mb-[0.625vw] truncate">
      {{ currentDate }}
    </p>
    <span class="typo-b-h1 countdown truncate !tracking-normal">
      {{ currentTime }}
    </span>
  </div>
</template>
