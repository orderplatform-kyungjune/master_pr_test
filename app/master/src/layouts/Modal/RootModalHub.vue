<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useModalStore } from '@store/index';
import UrgentNoticeModal from '@layouts/Modal/UrgentNoticeModal.vue';
import SendingNoticeFileModal from '@layouts/Modal/SendingNoticeFileModal.vue';
import ProductStickerControlModal from '@layouts/Modal/ProductStickerControlModal.vue';
import ProductSaleControlModal from '@layouts/Modal/ProductSaleControlModal.vue';
import ProductOptionControlModal from '@layouts/Modal/ProductOptionControlModal.vue';
import ProductOptionControlConfirmModal from '@layouts/Modal/ProductOptionControlConfirmModal.vue';
import OrderTableDetailModal from '@layouts/Modal/OrderTableDetailModal.vue';
import OrderListFilterModal from '@layouts/Modal/OrderListFilterModal.vue';
import OrderDetailModal from '@layouts/Modal/OrderDetailModal.vue';
import LanguageChangeModal from '@layouts/Modal/LanguageChangeModal.vue';
import KakaoCsModal from '@layouts/Modal/KakaoCsModal.vue';
import DashboardDaySelectorModal from '@layouts/Modal/DashboardDaySelectorModal.vue';
import CommonConfirmModal from '@layouts/Modal/CommonConfirmModal.vue';
import AutoCloseModal from '@layouts/Modal/AutoCloseModal.vue';
import AdministratorModal from '@layouts/Modal/AdministratorModal.vue';

const { flag } = storeToRefs(useModalStore());
</script>

<template>
  <OrderDetailModal v-if="flag.orderDetail" />
  <OrderTableDetailModal v-if="flag.tableDetail" />
  <LanguageChangeModal v-if="flag.languageChange" />
  <SendingNoticeFileModal v-if="flag.sendingNoticeFile" />
  <CommonConfirmModal v-if="flag.commonConfirm" />
  <UrgentNoticeModal v-if="flag.urgentNotice" />
  <ProductOptionControlModal v-if="flag.productOptions" />
  <ProductOptionControlConfirmModal v-if="flag.productOptionsConfirm" />
  <ProductStickerControlModal v-if="flag.productSticker" />
  <ProductSaleControlModal v-if="flag.productSale" />
  <KakaoCsModal v-if="flag.kakaoCs" />
  <AdministratorModal v-if="flag.administrator" />
  <DashboardDaySelectorModal v-if="flag.dashboardDaySelector" />
  <OrderListFilterModal v-if="flag.orderListFilter" />
  <AutoCloseModal v-if="flag.autoClose" />
</template>
