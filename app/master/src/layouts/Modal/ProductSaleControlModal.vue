<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import { useGoodsStore, useModalStore, useToastStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import icon_lock from '@assets/icon/icon_lock.svg?url';
import icon_check_none from '@assets/icon/icon_check_none.svg?url';
import icon_check from '@assets/icon/icon_check.svg?url';
import icon_back from '@assets/icon/icon_back.svg?url';
import { requestProductUpdate } from '@apis/goods';

const { t } = useTranslation();

const { closeModalWithData } = useModalStore();
const { modalData } = storeToRefs(useModalStore());
const { useApiRequest } = useMasterApiRequest();
const { changeGoodSaleStatus } = useGoodsStore();
const { addToast } = useToastStore();

const { goodsCode, goodsName, goodNameArray, saleStatus, useLock, saleLock } =
  modalData.value.productSale;

type SaleStatusType = {
  id: number;
  text: string;
  toast: string;
  isLock: boolean;
  status: {
    is_sale: boolean;
    is_use: boolean;
  };
};

const saleData: SaleStatusType[] = [
  {
    id: 1,
    text: '판매중',
    toast: '판매 토스트',
    isLock: false,
    status: {
      is_sale: false,
      is_use: false,
    },
  },
  {
    id: 2,
    text: '판매 중지(숨김)',
    toast: '판매 중지(숨김) 토스트',
    isLock: useLock === 'Y',
    status: {
      is_sale: false,
      is_use: true,
    },
  },
  {
    id: 3,
    text: '품절(보임)',
    toast: '품절(보임) 토스트',
    isLock: saleLock === 'Y',
    status: {
      is_sale: true,
      is_use: false,
    },
  },
  {
    id: 4,
    text: '품절(숨김)',
    toast: '품절(숨김) 토스트',
    isLock: useLock === 'Y' || saleLock === 'Y',
    status: {
      is_sale: true,
      is_use: true,
    },
  },
];

const requestStickerUpdate = (data: SaleStatusType) => {
  const { call, loading, error } = useApiRequest(
    requestProductUpdate,
    (datas) => {},
    {
      goodsCode,
      is_sale: data.status.is_sale,
      is_use: data.status.is_use,
    },
    '상품 판매 업데이트',
  );

  return {
    call,
    loading,
    error,
  };
};

const closeModalAndChangeData = async (data: SaleStatusType) => {
  if (data.isLock) {
    addToast(t('상태 변경 잠금 토스트'), 'error', 1.5);
    return;
  }

  changeGoodSaleStatus(goodsCode, data.status.is_sale, data.status.is_use);

  const getTranslatedName = translateLanguage(goodNameArray, goodsName);
  const refinedGoodsName = () => {
    if (getTranslatedName.length > 15) {
      return `${getTranslatedName.substring(0, 13)}...`;
    }
    return getTranslatedName;
  };

  addToast(
    t('상태 변경 토스트', {
      productName: refinedGoodsName(),
      status: t(data.toast),
    }),
    'success',
    1.5,
  );

  closeModalWithData('productSale', {});

  const { call, error } = requestStickerUpdate(data);

  await call();

  if (error.value !== null) {
    changeGoodSaleStatus(goodsCode, !data.status.is_sale, !data.status.is_use);
  }
};

const getCardClass = (id: number): DynamicClassType => ({
  'flex items-center typo-r-h2 w-full p-[1.953125vw_2.34375vw] active:bg-alpha-white-5 justify-between':
    true,
  'border-b-[0.078125vw] border-[#252A35]': id !== 4,
});
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen
      items-center justify-center text-white"
    @click.self="closeModalWithData('productSale', {})"
  >
    <div
      class="border-modal-2 flex w-[54.6875vw] flex-col gap-[1.25vw]
        rounded-[0.9375vw] bg-[#111]"
    >
      <div
        class="border-b-header-1 flex h-[6.71875vw] w-full items-center
          justify-between border-b p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]"
      >
        <p class="typo-b-h1">
          {{ t('판매 상태 변경') }}
        </p>
        <img
          :src="icon_back"
          alt="icon_back"
          class="size-[1.5625vw]"
          @click="closeModalWithData('productSale', {})"
        />
      </div>
      <div class="mb-[1.25vw] flex size-full flex-col">
        <div
          v-for="item in saleData"
          id="상품관리 - 판매 상태 변경 - 상태 변경 클릭"
          :key="item.id"
          :class="getCardClass(item.id)"
          @click="closeModalAndChangeData(item)"
        >
          <div class="flex items-center gap-[0.78125vw]">
            <img
              :src="item.text === saleStatus ? icon_check : icon_check_none"
              alt="icon_check"
              class="size-[1.5625vw]"
            />
            <span v-html="t(item.text)"></span>
          </div>
          <img
            v-if="item.isLock"
            :src="icon_lock"
            alt="icon_lock"
            class="size-[1.5625vw]"
          />
        </div>
      </div>
    </div>
  </div>
</template>
