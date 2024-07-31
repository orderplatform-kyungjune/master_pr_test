<script setup lang="ts">
import { Ref, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import { serviceGeneralErrorHandler } from '@utils/errorHandler';
import useGoodsStore from '@store/useGoodsStore';
import { useModalStore, useToastStore, useUserStore } from '@store/index';
import ProductOptionControlSkeleton from '@layouts/Modal/Components/Skeleton/ProductOptionControlSkeleton.vue';
import { NameArrayType } from '@interfaces/Order';
import { OptionConfirmDataType } from '@interfaces/Modal';
import { GoodsOptionDataType } from '@interfaces/Goods';
import { DynamicClassType } from '@interfaces/DynamicClass';
import icon_back from '@assets/icon/icon_back.svg?url';
import loadingImg from '@assets/icon/UX/loading.svg?url';
import loadingBlackImg from '@assets/icon/UX/loading-black.svg?url';
import useApi from '@apis/useApi';
import { requestOptionUpdate } from '@apis/option';

const { t } = useTranslation();

const { closeModalWithData, openModalWithData } = useModalStore();
const { modalData } = storeToRefs(useModalStore());
const { addToast } = useToastStore();
const { requestOptionData } = useGoodsStore();
const { optionData } = storeToRefs(useGoodsStore());
const { isTorderTwo } = storeToRefs(useUserStore());
const { userAuth } = storeToRefs(useUserStore());

const { goodsCode, goodsName, goodNameArray } = modalData.value.productOptions;

const { call, loading } = requestOptionData(goodsCode);

call();

const targetIsLoadingObj: Ref<Record<string, boolean>> = ref({});

const { request: updateOptionData, error } = useApi(
  requestOptionUpdate,
  '옵션 업데이트',
);

const updateOptions = async (
  options_name: string,
  option_no: number,
  option_isSale: boolean,
  index: number,
  require: boolean,
  group_name: string,
  group_name_array: NameArrayType,
  option_name_array: NameArrayType,
  indexString: string,
) => {
  if (isTorderTwo.value) {
    const minLimit = optionData.value[index].limit_qty;
    if (minLimit !== 0 && !option_isSale && require) {
      const currentSaleCount = optionData.value[index].option_item.reduce(
        (curr, next) => curr + (next.option_isSale ? 0 : 1),
        0,
      );
      if (Number(minLimit) === currentSaleCount) {
        const optionConfirmData: OptionConfirmDataType = {
          goodsName,
          goodNameArray,
          group_name,
          options_name,
          option_no,
          option_isSale,
          index,
          group_name_array,
          option_name_array,
        };
        openModalWithData('productOptionsConfirm', optionConfirmData);
        return;
      }
    }
  }

  const refiendOptionName = () => {
    const getTranslatedName = translateLanguage(
      option_name_array,
      options_name,
    );
    if (getTranslatedName.length > 15) {
      return `${getTranslatedName.substring(0, 13)}...`;
    }
    return getTranslatedName;
  };

  if (option_isSale) {
    addToast(
      t('옵션 판매 토스트', { optionName: refiendOptionName() }),
      'warning',
      1.5,
    );
    optionData.value[index].isSale_cnt += 1;
  } else {
    addToast(
      t('옵션 품절 토스트', { optionName: refiendOptionName() }),
      'warning',
      1.5,
    );
    optionData.value[index].isSale_cnt -= 1;
  }

  optionData.value[index].option_item = optionData.value[index].option_item.map(
    (item) => {
      if (item.option_no === option_no) {
        return {
          ...item,
          option_isSale: !option_isSale,
        };
      }
      return item;
    },
  );

  /**
   * TODO: tanstack 라이브러리로 변경 필요
   * targetIsLoadingObj: 각각의 옵션 아이템 로딩 상태 객체
   */
  targetIsLoadingObj.value[indexString] = true;
  const response = await updateOptionData({
    store_code: userAuth.value?.store.store_code,
    option_no,
    option_isSale: !option_isSale,
  });
  targetIsLoadingObj.value[indexString] = false;

  serviceGeneralErrorHandler(response);

  if (error.value !== null) {
    optionData.value[index].option_item.map((item) => {
      if (item.option_no === option_no) {
        return {
          ...item,
          option_isSale,
        };
      }
      return item;
    });
  }
};

const isNeedOptionNotice = (data: GoodsOptionDataType) =>
  data.require && data.limit_qty > 0 && isTorderTwo;

const getOptionNameClass = (status: boolean): DynamicClassType => ({
  'typo-r-h3 w-full truncate': true,
  'text-white-disabled': status,
  'text-white-01': !status,
});

const getOptionStatusClass = (status: boolean): DynamicClassType => ({
  'typo-b-h4 flex h-[3.90625vw] w-full items-center justify-center rounded-[0.625vw]':
    true,
  'text-white-disabled btn-bg-gray-disabled': status,
  'text-black-01 btn-bg-gray': !status,
});

const getOptionCountClass = (status: boolean): DynamicClassType => ({
  'typo-r-h4': true,
  'text-primary-01': status,
  'text-white-01': !status,
});
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen
      items-center justify-center text-white"
    @click.self="closeModalWithData('productOptions', { goodsCode: '' })"
  >
    <ProductOptionControlSkeleton v-if="loading" />
    <div
      v-else
      class="border-modal-2 flex h-[53.4375vw] w-[88.59375vw] flex-col
        rounded-[0.9375vw] bg-[#111]"
    >
      <div
        class="border-b-header-1 flex h-[6.7188vw] w-full items-center
          justify-between border-b p-[2.109375vw_2.34375vw]"
      >
        <p class="typo-b-h1">
          {{ t('옵션 상태 변경') }}
        </p>
        <img
          class="size-[1.5625vw]"
          :src="icon_back"
          alt="icon_back"
          @click="closeModalWithData('productOptions', { goodsCode: '' })"
        />
      </div>
      <div class="size-full p-[2.34375vw_2.34375vw_0_2.34375vw]">
        <div
          class="flex h-[44.0625vw] w-[84.375vw] flex-col gap-[2.34375vw]
            overflow-y-auto scrollbar-hide"
        >
          <div
            v-for="(data, dataIndex) in optionData"
            :key="dataIndex"
            class="flex w-full flex-col gap-[1.5625vw]"
            :class="optionData.length === dataIndex + 1 ? 'pb-[7.8125vw]' : ''"
          >
            <div class="flex w-full items-center justify-between">
              <div class="typo-b-h2 flex flex-col gap-[0.78125vw]">
                <div class="flex gap-[0.78125vw]">
                  <span
                    v-if="data.require"
                    class="text-primary-01"
                  >
                    {{ t('필수') }}
                  </span>
                  <span class="text-white-01 max-w-[70.3125vw] truncate">
                    {{ translateLanguage(data.name_array, data.name) }}
                  </span>
                </div>
                <span
                  v-if="isNeedOptionNotice(data)"
                  class="text-white-disabled typo-r-h3"
                >
                  {{ t('옵션판매설명', { count: data.limit_qty }) }}
                </span>
              </div>
              <span :class="getOptionCountClass(data.require)">
                {{ t('N개 판매 중', { count: data.isSale_cnt }) }}
              </span>
            </div>
            <div class="grid grid-cols-4 gap-[1.25vw]">
              <div
                v-for="(card, cardIndex) in data.option_item"
                :key="cardIndex"
                class="border-default-1 flex h-[12.1875vw] w-[20.15625vw]
                  flex-col gap-[1.5625vw] rounded-[0.625vw]
                  p-[2.34375vw_1.875vw_1.5625vw_1.875vw]"
              >
                <span :class="getOptionNameClass(card.option_isSale)">
                  {{
                    translateLanguage(card.option_name_array, card.option_name)
                  }}
                </span>
                <div
                  v-if="targetIsLoadingObj[`${dataIndex}-${cardIndex}`]"
                  :class="getOptionStatusClass(!card.option_isSale)"
                >
                  <img
                    class="animate-spin"
                    :src="!card.option_isSale ? loadingImg : loadingBlackImg"
                    alt="loading"
                  />
                </div>
                <div
                  v-else
                  id="상품관리 - 옵션 상태 변경 - 상태 변경 클릭"
                  :class="getOptionStatusClass(card.option_isSale)"
                  @click="
                    updateOptions(
                      card.option_name,
                      card.option_no,
                      card.option_isSale,
                      dataIndex,
                      data.require,
                      data.name,
                      data.name_array,
                      card.option_name_array,
                      `${dataIndex}-${cardIndex}`,
                    )
                  "
                >
                  {{ card.option_isSale ? t('품절 해제') : t('품절') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
