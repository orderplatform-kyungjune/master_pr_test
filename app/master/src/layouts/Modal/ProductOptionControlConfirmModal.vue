<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import useGoodsStore from '@store/useGoodsStore';
import { useModalStore, useToastStore } from '@store/index';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import icon_back from '@assets/icon/icon_back.svg';
import { requestOptionUpdate } from '@apis/option';

const { t } = useTranslation();

const { addToast } = useToastStore();
const { useApiRequest } = useMasterApiRequest();
const { modalData } = storeToRefs(useModalStore());
const { optionData } = storeToRefs(useGoodsStore());

const { closeModalWithData } = useModalStore();

const {
  goodsName,
  goodNameArray,
  group_name,
  options_name,
  option_no,
  option_isSale,
  index,
  group_name_array,
  option_name_array,
} = modalData.value.productOptionsConfirm;

const refinedGoodsName = () => {
  const getTranslatedLanguage = translateLanguage(goodNameArray, goodsName);
  if (getTranslatedLanguage.length > 15) {
    return `${getTranslatedLanguage.substring(0, 13)}...`;
  }
  return getTranslatedLanguage;
};

const updateOptions = async () => {
  const { call: requestUpdateOption, error } = useApiRequest(
    requestOptionUpdate,
    () => {},
    {
      option_no,
      option_isSale: !option_isSale,
    },
    '옵션 업데이트',
  );

  const refiendOptionName = () => {
    const getTranslatedLanguage = translateLanguage(
      option_name_array,
      options_name,
    );
    if (getTranslatedLanguage.length > 15) {
      return `${getTranslatedLanguage.substring(0, 13)}...`;
    }
    return getTranslatedLanguage;
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

  closeModalWithData('productOptionsConfirm', {});

  await requestUpdateOption();

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
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[110] flex h-screen w-screen
      items-center justify-center text-white"
    @click.self="closeModalWithData('productOptionsConfirm', {})"
  >
    <div
      class="border-modal-2 flex h-[35.546875vw] w-[54.6875vw] flex-col
        rounded-[0.9375vw] bg-[#111]"
    >
      <div
        class="border-b-header-1 flex h-[6.7188vw] w-full items-center
          justify-between p-[2.109375vw_2.34375vw]"
      >
        <p class="typo-b-h1">
          {{ t('옵션 컨펌 모달 타이틀') }}
        </p>
        <icon_back
          class="size-[1.5625vw]"
          @click="closeModalWithData('productOptionsConfirm', {})"
        />
      </div>
      <div
        class="typo-r-h2 flex size-full flex-col justify-between p-[2.34375vw]"
      >
        <p class="leading-10">
          {{
            t('옵션 컨펌 모달 내용', {
              group_name: translateLanguage(group_name_array, group_name),
              goodsName: refinedGoodsName(),
            })
          }}
        </p>
        <div class="typo-b-h3 flex w-full justify-end gap-[1.25vw]">
          <div
            class="border-ghost-1 flex h-[5.15625vw] w-[10.46875vw] items-center
              justify-center rounded-[0.625vw]"
            @click="closeModalWithData('productOptionsConfirm', {})"
          >
            {{ t('취소') }}
          </div>
          <div
            class="border-ghost-1 btn-bg-primary border-transparent-1 flex
              h-[5.15625vw] w-[22.65625vw] items-center justify-center
              rounded-[0.625vw]"
            @click="updateOptions"
          >
            {{ t('변경하기') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
