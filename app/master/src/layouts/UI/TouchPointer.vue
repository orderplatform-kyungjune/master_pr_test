<script setup lang="ts">
import {
  ref,
  computed,
  onMounted,
  onUnmounted,
} from 'vue';
import { usePointer } from '@vueuse/core';

const isMobile = ref(/Mobi/i.test(window.navigator.userAgent));

const mobileX = ref(0);
const mobileY = ref(0);

if (isMobile.value) {
  const updateTouch = (event: TouchEvent) => {
    if (event.touches.length > 0) {
      mobileX.value = event.touches[0].clientX;
      mobileY.value = event.touches[0].clientY;
    }
  };

  onMounted(() => {
    window.addEventListener('touchmove', updateTouch);
    window.addEventListener('touchstart', updateTouch);
  });

  onUnmounted(() => {
    window.removeEventListener('touchmove', updateTouch);
    window.removeEventListener('touchend', updateTouch);
  });
}

const {
  x,
  y,
} = usePointer();

const circleStyles = computed(() => ({
  top: `${isMobile.value ? mobileY.value : y.value}px`,
  left: `${isMobile.value ? mobileX.value : x.value}px`,
}));

const verticalLine = computed(() => ({ left: `${isMobile.value ? mobileX.value : x.value}px` }));
const horizontalLine = computed(() => ({ top: `${isMobile.value ? mobileY.value : y.value}px` }));

const {
  innerWidth,
  innerHeight,
} = window;

const getLineClass = () => ({
  'text-white-01 absolute left-[-750%] top-[-550%] flex w-[9vw] flex-col gap-[0.5vw] rounded-[0.625vw] bg-[#FC000033] p-[1vw]': true,
  '!left-[150%] !top-[150%]': isMobile.value ? mobileX.value < 150 && mobileY.value < 150 : x.value < 150 && y.value < 150,
  '!left-[-750%] !top-[150%]': isMobile.value ? mobileX.value > innerWidth - 150 && mobileY.value < 150 : x.value > innerWidth - 150 && y.value < 150,
  '!left-[150%] !top-[-550%]': isMobile.value ? mobileX.value < 150 && mobileY.value > innerHeight - 150 : x.value < 150 && y.value > innerHeight - 150,
});
</script>

<template>
  <div class="pointer-events-none absolute size-full">
    <div class="relative size-full">
      <div
        class="border-header-2 absolute z-[2000] size-[1.5625vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FC000033]"
        :style="circleStyles"
      >
        <div :class="getLineClass()">
          <p>X : {{ isMobile ? mobileX.toFixed(2) : x.toFixed(2) }}</p>
          <p>Y : {{ isMobile ? mobileY.toFixed(2) : y.toFixed(2) }}</p>
        </div>
      </div>
      <div
        class="absolute left-0 top-[50%] z-[1999] h-[0.15625vw] w-full -translate-y-1/2 bg-[#FC000033]"
        :style="horizontalLine"
      ></div>
      <div
        class="absolute left-[50%] top-0 z-[1999] h-full w-[0.15625vw] -translate-x-1/2 bg-[#FC000033]"
        :style="verticalLine"
      ></div>
    </div>
  </div>
</template>
