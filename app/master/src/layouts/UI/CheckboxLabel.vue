<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  orderChecked: boolean;
}>();

const isChecked = ref(props.orderChecked || false);

watch(
  () => props.orderChecked,
  (newVal) => {
    isChecked.value = newVal;
  },
);
</script>

<template>
  <div class="flex">
    <transition
      name="fade"
      mode="out-in"
    >
      <svg
        v-if="isChecked"
        width="2.5vw"
        height="2.5vw"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0 8C0 3.58172 3.58172 0 8 0H24C28.4183 0 32 3.58172 32 8V24C32 28.4183 28.4183 32 24 32H8C3.58172 32 0 28.4183 0 24V8Z"
          fill="white"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.9533 8.84192C25.5929 9.36841 25.6846 10.3137 25.1581 10.9533L15.2805 22.9533C15.0246 23.2643 14.6543 23.4592 14.2531 23.4943C13.8519 23.5294 13.4535 23.4017 13.1474 23.1399L8.02503 18.7586C7.39548 18.2201 7.32165 17.2732 7.86013 16.6437C8.3986 16.0141 9.34548 15.9403 9.97503 16.4788L13.9358 19.8665L22.8419 9.04675C23.3684 8.40714 24.3137 8.31544 24.9533 8.84192Z"
          fill="#FC0000"
        />
      </svg>
      <svg
        v-else
        width="2.5vw"
        height="2.5vw"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M0.5 8C0.5 3.85786 3.85786 0.5 8 0.5H24C28.1421 0.5 31.5 3.85786 31.5 8V24C31.5 28.1421 28.1421 31.5 24 31.5H8C3.85786 31.5 0.5 28.1421 0.5 24V8Z"
          stroke="white"
          stroke-opacity="0.2"
        />
        <path
          opacity="0.3"
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M24.9533 8.84192C25.5929 9.36841 25.6846 10.3137 25.1581 10.9533L15.2805 22.9533C15.0246 23.2643 14.6543 23.4592 14.2531 23.4943C13.8519 23.5294 13.4535 23.4017 13.1474 23.1399L8.02503 18.7586C7.39548 18.2201 7.32165 17.2732 7.86013 16.6437C8.3986 16.0141 9.34548 15.9403 9.97503 16.4788L13.9358 19.8665L22.8419 9.04675C23.3684 8.40714 24.3137 8.31544 24.9533 8.84192Z"
          fill="#E1E1E1"
        />
      </svg>
    </transition>
    <slot :checked="isChecked"></slot>
  </div>
</template>

<style scoped lang="postcss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease-in;
}

.fade-enter-from,
.fade-leave-from {
  opacity: 1;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.5;
}
</style>
