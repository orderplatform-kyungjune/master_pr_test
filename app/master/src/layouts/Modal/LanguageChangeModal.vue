<script setup lang="ts">
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { changeLanguageNotation } from '@utils/langTranferUtils';
import { serviceGeneralErrorHandler } from '@utils/errorHandler';
import { useModalStore, useUserStore } from '@store/index';
import icon_back from '@assets/icon/icon_back.svg';
import useApi from '@apis/useApi';
import { requestUpdateLanguage } from '@apis/settings';

const { t, i18next } = useTranslation();

const { closeModal } = useModalStore();
const router = useRouter();

const { userAuth } = storeToRefs(useUserStore());

/**
 * 마스터 태블릿 기본 언어 설정 변경하기
 * @param language
 */
const changeMasterLanguage = async (
  language: 'KR' | 'EN' | 'JP' | 'CN' | 'CN-S',
) => {
  const { request, error } = useApi(requestUpdateLanguage, '기본 언어 변경');

  await request({
    store_code: userAuth.value?.store.store_code,
    lang: language,
  })
    .then(serviceGeneralErrorHandler)
    .then(() => {
      i18next.changeLanguage(changeLanguageNotation(language));
    });

  if (error.value !== null) return;

  router.push('/orderlist');
  closeModal('languageChange');
};

const languageList = [
  {
    name: '한국어',
    description: '한국어 설명',
    value: 'KR' as const,
  },
  {
    name: 'English',
    description: '영어 설명',
    value: 'EN' as const,
  },
  {
    name: '日本語',
    description: '일본어 설명',
    value: 'JP' as const,
  },
  {
    name: '简体',
    description: '중국어(간체) 설명',
    value: 'CN-S' as const,
  },
  {
    name: '簡體',
    description: '중국어 설명',
    value: 'CN' as const,
  },
];

const getLanguageCardClass = (id: number) => ({
  'text-white-01 flex w-full flex-col gap-[0.78125vw] p-[2.34375vw]': true,
  'border-b-[0.078125vw] border-[#252A35]': id !== languageList.length - 1,
});
</script>

<template>
  <div
    class="bg-modal-dim absolute z-[1000] flex size-full items-center
      justify-center"
    @click.self="closeModal('languageChange')"
  >
    <div
      class="bg border-modal-2 flex w-[55vw] flex-col rounded-[0.9375vw]
        bg-black"
    >
      <div
        class="flex h-[6.796875vw] w-full items-center justify-between
          border-b-[0.078125vw] border-b-[#FC0000]
          p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]"
      >
        <div class="typo-b-h1 text-white-01">
          {{ t('언어설정') }}
        </div>
        <icon_back
          class="size-[1.5625vw] cursor-pointer"
          @click="closeModal('languageChange')"
        />
      </div>
      <div class="flex max-h-[31.875vw] flex-col overflow-y-scroll">
        <div
          v-for="(list, i) in languageList"
          :key="list.value"
          :class="getLanguageCardClass(i)"
          @click="changeMasterLanguage(list.value)"
        >
          <p class="typo-r-h3">
            {{ list.name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
