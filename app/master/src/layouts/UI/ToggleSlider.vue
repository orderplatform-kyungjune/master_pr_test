<script setup lang="ts">

const props = defineProps<{
  status: boolean,
  toggleKey: string,
  toggleIndex: number,
}>();

const emit = defineEmits(['click']);

const toggleClick = () => {
  const getStatus = (status: boolean) => {
    if (status) return 'Y';
    return 'N';
  };
  emit('click', getStatus(!props.status));
};

const getToggleId = `toggle-${props.toggleKey}-${props.toggleIndex}`;

const getToggleStatusClass = () => ({
  'relative block h-[2.8125vw] w-[5.46875vw] cursor-pointer rounded-[1.875vw]': true,
  'btn-bg-primary': props.status,
  'bg-depth-03': !props.status,
});

const getToggleStatusTextClass = () => ({
  'typo-b-h7 absolute top-[0.9375vw] opacity-60': true,
  'left-[0.78125vw] text-[#FFEFEF]': props.status,
  'right-[0.78125vw] text-[#64718B]': !props.status,
});

const getToggleStatusCoverClass = () => ({
  'absolute top-[0.28125vw] h-[2.25vw] w-[2.25vw] rounded-full bg-white transition-all duration-[0.2s]': true,
  'left-[2.859375vw]': props.status,
  'left-[0.28125vw]': !props.status,
});
</script>

<template>
  <input
    :id="getToggleId"
    :value="props.status"
    type="checkbox"
    class="hidden"
    @click="toggleClick"
  />
  <label
    :for="getToggleId"
    :class="getToggleStatusClass()"
  >
    <span :class="getToggleStatusTextClass()">
      {{ props.status ? 'ON' : 'OFF' }}
    </span>
    <span :class="getToggleStatusCoverClass()"></span>
  </label>
</template>
