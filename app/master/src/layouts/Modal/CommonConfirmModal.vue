<!-- eslint-disable vue/no-v-html -->
<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useModalStore } from '@store/index';
import icon_back from '@assets/icon/icon_back.svg';

const { t } = useTranslation();

const { modalData } = storeToRefs(useModalStore());

const { closeModalWithData } = useModalStore();

const {
  title,
  message,
  buttonName,
  cancelName,
  onClickButton,
} = modalData.value.commonConfirm;

const clickSaveButton = () => {
  onClickButton?.();
  closeModalWithData('commonConfirm', {});
};

</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen items-center justify-center text-white"
    @click.self="closeModalWithData('commonConfirm', {})"
  >
    <div class="border-modal-2 flex min-h-[35.2344vw] w-[51.5625vw] flex-col rounded-[0.9375vw] bg-[#111] ">
      <div class="border-b-header-1 flex h-[6.7188vw] w-full items-center justify-between px-[2.3438vw]">
        <p class="typo-b-h1 ">
          {{ title ? title : t('확인모달-타이틀') }}
        </p>
        <icon_back
          class="size-[1.5625vw]"
          @click="closeModalWithData('commonConfirm', {})"
        />
      </div>
      <div class="flex flex-1 flex-col p-[2.3438vw]">
        <div class="typo-r-h2 flex w-full flex-1 text-[2.3438vw]">
          <p
            class="leading-10"
            v-html="message ? message : ''"
          ></p>
        </div>
        <div class="mt-[3.1250vw] flex justify-end gap-[1.2500vw]">
          <button
            type="button"
            class="typo-b-h3 active:!border-transparent-1 h-[5vw] w-[10.3125vw] rounded-[0.6250vw] border-[0.0781vw] border-[rgba(255,255,255,.2)] active:bg-[#252A35]"
            @click="closeModalWithData('commonConfirm', {})"
          >
            {{ cancelName ? cancelName : t('취소') }}
          </button>
          <button
            type="button"
            class="btn-bg-primary typo-b-h3 h-[5vw] w-[23.2031vw] rounded-[0.6250vw] active:bg-[#252A35]"
            @click="clickSaveButton"
          >
            {{ buttonName ? buttonName : t('확인모달-승인버튼') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
