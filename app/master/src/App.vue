<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useLocalStorageData } from '@utils/localStorage';
import { changeLanguageNotation } from '@utils/langTranferUtils';
import { setCurrentFontSize } from '@utils/commonUtils';
import {
  useNoticeStore,
  useOrderStore,
  useSocketStore,
  useUserStore,
} from '@store/index';
import { initializeI18next } from '@i18n/i18next';

const { isLoggedIn } = storeToRefs(useUserStore());
const { requestShopStatus } = useUserStore();
const { getNoticeList } = useNoticeStore();
const { getOrderHistory, getOrderHistoryTableType } = useOrderStore();
const { connectSocket } = useSocketStore();

const { userAuth } = useUserStore();
initializeI18next(changeLanguageNotation(userAuth?.store.store_masterLanguage));

let refreshInterval: number;
let socketConnectInterval: number;

onMounted(() => {
  // 마스터2 1시간 새로고침.
  refreshInterval = setInterval(() => {
    clearInterval(refreshInterval);
    clearInterval(socketConnectInterval);
    window.location.reload();
  }, 60 * 60_000);

  if (isLoggedIn.value) {
    getNoticeList().call();
    getOrderHistory().call();
    getOrderHistoryTableType().call();
    requestShopStatus().call();
    socketConnectInterval = setInterval(() => {
      connectSocket();
    }, 60_000);
  }

  // 20240415 RSL [[[ 폰트 사이즈 저장 값을 1~5 를 0~4 로 변경으로 인해 5 를 4로 변경함. TODO: 모든 마스터 버전 업데이트 이후 삭제
  const fontSize = useLocalStorageData<number>('font-size', 2);
  if (fontSize.value >= 5) fontSize.value = 4;
  // ]]] 20240415 RSL
  setCurrentFontSize(fontSize.value);
});

onUnmounted(() => {
  clearInterval(refreshInterval);
  clearInterval(socketConnectInterval);
});
</script>

<template>
  <RouterView />
</template>
