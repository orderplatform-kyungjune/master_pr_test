<script setup lang="ts">

import { ref } from 'vue';
import { useModalStore } from '@store/index';

const { openModal } = useModalStore();

const administratorCounter = ref<number>(1);

const accessAdministrator = () => {
  if (administratorCounter.value < 5) {
    administratorCounter.value += 1;
  } else {
    administratorCounter.value = 1;
    openModal('administrator');
  }
};

const props = defineProps<{
  getVersion: () => string,
}>();
</script>

<template>
  <div class="flex h-[3.125vw] w-full justify-end">
    <span
      class="text-black-disabled typo-r-h7 pb-[0.625vw] pt-[1.5625vw]"
      @click="accessAdministrator"
    >{{ props.getVersion() }}</span>
  </div>
</template>
