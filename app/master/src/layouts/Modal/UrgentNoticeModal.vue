<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useModalStore } from '@store/index';
import icon_back from '@assets/icon/icon_back.svg?url';

const { t } = useTranslation();

const { modalData } = storeToRefs(useModalStore());

const { closeModalWithData } = useModalStore();

const { noticeTitle, noticeDesc, createDate, noticeCategory } =
  modalData.value.urgentNotice;
</script>

<template>
  <div
    class="bg-modal-dim fixed left-0 top-0 z-[100] flex h-screen w-screen
      items-center justify-center text-white"
    @click.self="closeModalWithData('urgentNotice', {})"
  >
    <div
      class="border-modal-2 flex h-[47.03125vw] w-[78.125vw] flex-col
        rounded-[0.9375vw] bg-[#111]"
    >
      <div
        class="border-b-header-1 flex w-full items-center justify-between
          p-[2.109375vw_2.34375vw]"
      >
        <p class="typo-b-h1">
          {{ t('긴급공지') }}
        </p>
        <img
          :src="icon_back"
          alt="icon_back"
          class="size-[1.5625vw]"
          @click="closeModalWithData('urgentNotice', {})"
        />
      </div>
      <div class="p-[2.34375vw]">
        <div
          class="border-b-default-1 flex w-full flex-col gap-[0.78125vw]
            pb-[1.25vw]"
        >
          <div class="typo-b-h2 flex gap-[0.78125vw]">
            <div>
              {{ t(noticeCategory) }}
            </div>
            <div class="text-white-disabled w-[87%] break-words">
              <p>{{ noticeTitle }}</p>
            </div>
          </div>
          <span class="typo-r-h4 text-black-disabled">
            {{ createDate.replace('20', '').replaceAll('-', '.') }}
          </span>
        </div>
      </div>
      <div
        class="board typo-b-h2 w-full overflow-y-auto px-[2.34375vw]
          scrollbar-hide"
      >
        <div
          class="board leading-10 text-white"
          v-html="noticeDesc"
        ></div>
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.board {
  span {
    color: white !important;
  }

  p {
    color: white !important;
  }
}
</style>
