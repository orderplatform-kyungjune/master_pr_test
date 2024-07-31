<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { IS_ORIGIN } from '@utils/modeUtils';
import { useModalStore, useUserStore } from '@store/index';
import { OrderListDataType } from '@interfaces/Order';
import icon_kakao from '@assets/icon/icon_kakako.svg?url';

const props = defineProps<{
  orderItem: OrderListDataType;
}>();

const { openModal, closeModal } = useModalStore();

const { t } = useTranslation();

const { userAuth } = storeToRefs(useUserStore());

const openKakaoAlimModal = () => {
  closeModal('orderDetail');
  openModal('kakaoCs');
};
</script>

<template>
  <div class="flex h-full w-[35.15625vw] flex-col justify-between">
    <div class="flex flex-col gap-[2.34375vw]">
      <div class="flex flex-col gap-[0.78125vw]">
        <p class="typo-b-h2 text-white">
          <span class="text-error-01">{{ t('주문접수실패') }}</span>
          {{ t('했습니다') }}
        </p>
        <p
          v-if="IS_ORIGIN"
          class="typo-r-h4 text-white-disabled"
        >
          {{ t('주문 접수 실패 안내 부가') }}
        </p>
      </div>
      <div
        class="typo-b-h3 border-error-2 flex w-full flex-col gap-[1.25vw]
          rounded-[0.78125vw] p-[1.5625vw] text-white"
      >
        <div class="flex items-start gap-[1.875vw]">
          <span class="min-w-[5.3125vw]">{{ t('매장명') }}</span>
          <span class="typo-r-h4">
            {{ `${userAuth?.store.store_name || ''}` }}
          </span>
        </div>
        <div class="flex items-start gap-[1.875vw]">
          <span class="min-w-[5.3125vw]">{{ t('주문키') }}</span>
          <span class="typo-r-h4">{{ props.orderItem.order_key }}</span>
        </div>
        <div class="flex items-start gap-[1.875vw]">
          <span class="min-w-[5.3125vw]">{{ t('IP') }}</span>
          <span class="typo-r-h4">{{ props.orderItem.requestIP }}</span>
        </div>
      </div>
    </div>
    <div class="flex gap-[1.25vw]">
      <div
        class="border-ghost-1 typo-b-h4 active:btn-ghost-pressed flex h-[5vw]
          flex-1 items-center justify-center rounded-[0.625vw]"
        @click="closeModal('orderDetail')"
      >
        <span class="text-white-01">{{ t('닫기') }}</span>
      </div>
      <div
        v-if="IS_ORIGIN"
        class="flex h-[5vw] w-[23.4375vw] items-center justify-center
          gap-[0.625vw] rounded-[0.625vw] bg-[#FAE100] px-5 active:bg-[#AA9100]"
        @click="openKakaoAlimModal"
      >
        <img
          class="h-[2.34375vw] w-[2.578125vw]"
          :src="icon_kakao"
          alt="icon_kakao"
        />
        <span class="typo-b-h3 text-[#371D1E]">
          {{ t('카카오 상담 신청') }}
        </span>
      </div>
    </div>
  </div>
</template>
