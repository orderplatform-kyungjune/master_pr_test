<script setup lang="ts">
import { ShopDataType } from '@interfaces/User';
import right_arrow from '@assets/icon/icon_arrow_right.svg';

const props = defineProps<{
  shopData?: ShopDataType[],
  selectStore: (storeData: ShopDataType) => void,
}>();
</script>

<template>
  <div class="grid w-full grid-cols-3 gap-[1.25vw]">
    <div
      v-for="shop in props.shopData"
      :key="shop.store_id"
      class="bg-depth-02 active:bg-depth-03 flex h-[9.6875vw] w-[26.796875vw] items-center justify-between rounded-[0.9375vw] bg-[red] pl-[1.875vw] pr-[1.25vw]"
      @click="props.selectStore(shop)"
    >
      <span class="typo-b-h3 line-clamp-1">{{ shop.store_name }}</span>
      <right_arrow class="icon-default" />
    </div>
  </div>
</template>
