<script setup lang='ts'>
import { goBack } from '@router/route.helper';
import left_arrow from '@assets/icon/icon_left_arrow.svg';

const props = defineProps<{
  title: string,
}>();

</script>

<template>
  <div class="mb-5 flex h-[2.5vw] w-full items-center">
    <left_arrow
      class="icon-header mr-[0.7813vw]"
      @click="goBack"
    />
    <span class="typo-b-h1">
      {{ props.title }}
    </span>
  </div>
</template>
