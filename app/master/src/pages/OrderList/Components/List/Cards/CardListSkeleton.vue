<script setup lang="ts">
import CardSkeleton from '@pages/OrderList/Components/List/Cards/__Components/CardSkeleton.vue';
</script>

<template>
  <div class="card-container scrollbar-hide relative h-[calc(100%_+_5vw)] overflow-x-scroll">
    <div class="card-wrapper scrollbar-hide absolute flex gap-[1.25vw] overflow-y-hidden">
      <div
        v-for="idx in 4"
        :key="idx"
        class="bg-depth-02 h-[48.671875vw] w-[36.171875vw] rounded-[0.625vw] border-[0.078125vw] border-[#3A414F]"
      >
        <CardSkeleton />
      </div>
    </div>
  </div>
</template>
