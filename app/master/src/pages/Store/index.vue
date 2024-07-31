<script setup lang="ts">
import {
  computed,
  onMounted,
} from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useUserStore } from '@store/index';
import StoreDataTable from '@pages/Store/Components/StoreDataTable.vue';

const { t } = useTranslation();

const { userAuth } = storeToRefs(useUserStore());

const user = computed(() => userAuth.value?.shop_data);

const {
  selectStore,
  updateStoreList,
} = useUserStore();

onMounted(() => {
  const validShopData = !!userAuth.value?.shop_data;
  if (!validShopData) {
    updateStoreList();
  }
});
</script>

<template>
  <div class="flex w-full flex-col items-start">
    <p class="text-white-01 typo-b-h1 mb-[2.34375vw]">
      {{ t('매장선택 설명') }}
    </p>
    <StoreDataTable
      :shopData="user"
      :selectStore="selectStore"
    />
  </div>
</template>
