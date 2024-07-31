<script setup lang="ts">
const props = defineProps<{
  isCompactMenu: boolean,
  altText: string,
  label: string,
  onClick: () => void,
  isQuickSettingOpen?: boolean,
  gaId: string,
}>();

const click = () => {
  props.onClick();
};

</script>

<template>
  <button
    :id="props.gaId"
    class="btn-side-bottom-menu text-white-disabled typo-r-h4 relative flex items-center justify-center gap-[0.78125vw] outline-none"
    type="button"
    @click="click"
  >
    <span
      v-if="!props.isCompactMenu"
      :id="props.gaId"
      class="truncate"
      :class="props.isQuickSettingOpen ? 'text-[red]' : ''"
    >
      {{ props.label }}
    </span>
    <slot name="img"></slot>
  </button>
</template>
