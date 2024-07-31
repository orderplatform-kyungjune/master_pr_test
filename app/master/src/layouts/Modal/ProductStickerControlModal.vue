<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import {
  useGoodsStore,
  useModalStore,
  useToastStore,
  useUserStore,
} from '@store/index';
import { GoodsLabelType } from '@interfaces/Goods';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import icon_back from '@assets/icon/icon_back.svg?url';
import mdIcon from '@assets/icon/badge/icon_recommend.svg?url';
import newIcon from '@assets/icon/badge/icon_new.svg?url';
import hitIcon from '@assets/icon/badge/icon_hit.svg?url';
import saleIcon from '@assets/icon/badge/icon_discount.svg?url';
import bestIcon from '@assets/icon/badge/icon_best.svg?url';
import loading from '@assets/icon/UX/loading.svg?url';
import loadingBlack from '@assets/icon/UX/loading-black.svg?url';
import { requestProductUpdate } from '@apis/goods';

const { t } = useTranslation();

const { closeModalWithData } = useModalStore();
const { modalData } = storeToRefs(useModalStore());
const { useApiRequest } = useMasterApiRequest();
const { changeGoodStickerStatus } = useGoodsStore();
const { addToast } = useToastStore();
const { isCustomTheme } = storeToRefs(useUserStore());

const { goodsCode, goodsName, goodsLabel, goodNameArray } =
  modalData.value.productSticker;

type StickerType = {
  label: string;
  status: boolean;
  isRequested: boolean;
};

const isCustomThemeStickerData = (key: string) => {
  if (isCustomTheme.value) {
    return key === 'best' || key === 'new';
  }
  return key !== 'signature' && key !== 'spicy' && key !== 'vegan';
};

const convertGoodsLabelToStickerData = (
  labelObj: GoodsLabelType,
): StickerType[] =>
  Object.entries(labelObj)
    .filter((entry: [string, any]) => {
      const [key] = entry;
      return isCustomThemeStickerData(key);
    })
    .map((entry: [string, any]) => {
      const [key, value] = entry;
      return {
        label: key,
        status: value === 'Y',
        isRequested: false,
      };
    });

const stickerData = ref<StickerType[]>(
  convertGoodsLabelToStickerData(goodsLabel),
);

const getStickerIcon = (label: string) => {
  if (label === 'md') return mdIcon;
  if (label === 'new') return newIcon;
  if (label === 'hit') return hitIcon;
  if (label === 'sale') return saleIcon;
  if (label === 'best') return bestIcon;
  return '';
};

const getStickerText = (label: string) => {
  switch (label) {
    case 'md':
      return t('추천');
    case 'new':
      if (isCustomTheme.value) {
        return t('NEW');
      }
      return t('신메뉴');
    case 'hit':
      return t('HIT');
    case 'sale':
      return t('할인');
    case 'best':
      return t('BEST');
    default:
      return '';
  }
};

const requestStickerUpdate = (sticker: StickerType) => {
  const { call: requestUpdateSticker, error } = useApiRequest(
    requestProductUpdate,
    (data) => {},
    {
      goodsCode,
      label: {
        status: !sticker.status,
        name: sticker.label,
      },
    },
    '스티커 업데이트',
  );

  return {
    requestUpdateSticker,
    error,
  };
};

const updateSticker = async (sticker: StickerType) => {
  const { requestUpdateSticker, error } = requestStickerUpdate(sticker);

  // 기존 데이터 변경
  stickerData.value = stickerData.value.map((item) => {
    if (item.label === sticker.label) {
      return {
        ...item,
        status: !item.status,
        isRequested: true,
      };
    }
    return item;
  });

  changeGoodStickerStatus(goodsCode, sticker.label, !sticker.status);

  // 데이터 변경 요청
  await requestUpdateSticker();

  const refinedGoodsName = () => {
    const getTranslatedName = translateLanguage(goodNameArray, goodsName);
    if (getTranslatedName.length > 15) {
      return `${getTranslatedName.substring(0, 13)}...`;
    }
    return getTranslatedName;
  };

  if (sticker.status) {
    addToast(
      t('스티커 제거 토스트', {
        productName: refinedGoodsName(),
        label: getStickerText(sticker.label),
      }),
      'warning',
      1.5,
      true,
    );
  } else {
    addToast(
      t('스티커 추가 토스트', {
        productName: refinedGoodsName(),
        label: getStickerText(sticker.label),
      }),
      'success',
      1.5,
      true,
    );
  }

  if (error.value !== null) {
    changeGoodStickerStatus(goodsCode, sticker.label, sticker.status);
  }

  stickerData.value = stickerData.value.map((item) => {
    if (item.label === sticker.label) {
      return {
        ...item,
        isRequested: false,
      };
    }
    return item;
  });
};

const closeModalAndRequestData = () => {
  closeModalWithData('productSticker', {});
};

const getStickerCardClass = (
  status: boolean,
  requestStatus: boolean,
): DynamicClassType => ({
  'flex w-fit items-center justify-center gap-[0.625vw] whitespace-nowrap rounded-[15.625vw] p-[1.25vw_1.875vw] relative outline-none active:bg-[#FFFFFF33]':
    true,
  'bg-alpha-white-100 text-black-01 border-[0.078125vw] border-white':
    (status && !requestStatus) || (!status && requestStatus),
  'border-default-1': (status && requestStatus) || (!status && !requestStatus),
});
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen
      items-center justify-center text-white"
    @click.self="closeModalAndRequestData"
  >
    <div
      class="border-modal-2 flex h-[35.46875vw] w-[54.6875vw] flex-col
        rounded-[0.9375vw] bg-[#111]"
    >
      <div
        class="border-b-header-1 flex w-full justify-between border-b
          p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]"
      >
        <div class="flex flex-col gap-[0.9375vw]">
          <p class="typo-b-h1">
            {{ t('스티커 변경') }}
          </p>
          <p class="typo-r-h3 text-white-disabled">
            {{ t('스티커 변경 설명') }}
          </p>
        </div>
        <img
          class="size-[1.5625vw]"
          :src="icon_back"
          alt="icon_back"
          @click="closeModalAndRequestData"
        />
      </div>
      <div class="flex w-full flex-wrap gap-[1.5625vw] p-[2.34375vw]">
        <button
          v-for="(item, i) in stickerData"
          id="상품관리 - 스티커 상태 변경 - 상태 변경 클릭"
          :key="i"
          type="button"
          :class="getStickerCardClass(item.status, item.isRequested)"
          :disabled="item.isRequested"
          aria-label="button"
          @click="updateSticker(item)"
        >
          <img
            v-if="!isCustomTheme && !item.isRequested"
            id="상품관리 - 스티커 상태 변경 - 상태 변경 클릭"
            class="size-[1.875vw]"
            :src="getStickerIcon(item.label)"
            alt="iconBest"
          />
          <img
            v-if="item.isRequested"
            class="animate-spin"
            :src="item.status ? loading : loadingBlack"
            alt="loading"
          />
          <span
            v-else
            id="상품관리 - 스티커 상태 변경 - 상태 변경 클릭"
            class="typo-b-h1"
          >
            {{ getStickerText(item.label) }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>
