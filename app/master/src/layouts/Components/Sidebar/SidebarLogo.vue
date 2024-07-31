<script setup lang="ts">
import { IS_US_EAST } from '@utils/modeUtils';
import icon_sidebar_open from '@assets/icon/icon_sidebar_open.svg?url';
import icon_sidebar_close from '@assets/icon/icon_sidebar_close.svg?url';
import icon_ci_small from '@assets/ci_small.svg?url';
import icon_ci from '@assets/ci.svg?url';
import icon_bi_small from '@assets/bi_small.svg?url';
import icon_bi from '@assets/bi.svg?url';

const props = defineProps<{
  isCompactMenu: boolean;
  toggleMenuClass: () => void;
}>();
</script>

<template>
  <div
    class="flex w-full items-center justify-between"
    :class="props.isCompactMenu ? 'flex-col gap-[1.5625vw]' : 'mb-[1.5625vw]'"
  >
    <img
      v-if="IS_US_EAST"
      :class="
        props.isCompactMenu
          ? 'h-[3.125vw] w-[3.125vw]'
          : 'h-[3.125vw] w-[8.4375vw]'
      "
      :src="props.isCompactMenu ? icon_ci_small : icon_ci"
      alt="ci"
    />
    <img
      v-else
      :class="
        props.isCompactMenu
          ? 'h-[2.5vw] w-[2.8125vw]'
          : 'h-[2.34375vw] w-[5.15625vw]'
      "
      :src="props.isCompactMenu ? icon_bi_small : icon_bi"
      alt="bi"
    />
    <div
      class="active:bg-depth-02 flex size-[3.125vw] items-center justify-center
        rounded-[0.625vw]"
      @click="props.toggleMenuClass"
    >
      <img
        class="icon-24"
        :src="props.isCompactMenu ? icon_sidebar_open : icon_sidebar_close"
        alt="sidebar_icon"
      />
    </div>
  </div>
</template>
