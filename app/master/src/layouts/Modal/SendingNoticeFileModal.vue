<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useModalStore, useToastStore } from '@store/index';
import { requestNoticeDetailFilesParams } from '@interfaces/Notice';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import icon_delete from '@assets/icon/icon_delete.svg';
import icon_back from '@assets/icon/icon_back.svg';
import { requestNoticeDetailFile } from '@apis/notice';

const { t } = useTranslation();

const { useApiRequest } = useMasterApiRequest();
const { addToast } = useToastStore();
const { closeModal } = useModalStore();
const { modalData } = storeToRefs(useModalStore());

const getDials = (i: number) => {
  switch (i) {
    case 10:
    case 11:
      return 0;
    case 12:
      return t('전송하기');
    default:
      return i;
  }
};

const params = ref<requestNoticeDetailFilesParams>({
  phone_number: '010-',
  notice_id: modalData.value.sendingNoticeFile.notice_id,
  notice_file_id: modalData.value.sendingNoticeFile.notice_file_id,
} as requestNoticeDetailFilesParams);

const { call } = useApiRequest(
  requestNoticeDetailFile,
  () => {
    addToast(
      t('메시지발송', { phone_number: params.value.phone_number }),
      'success',
      1.5,
      true,
    );
  },
  params.value,
  '공지사항 파일',
  true,
);

const isDelete = (i: number) => i === 10;

const insertNumber = (i: number) => {
  if (i === 12) {
    if (params.value.phone_number.length !== 13) {
      addToast(t('전화번호확인'), 'warning', 1.5, true);
      return;
    }
    const num = params.value.phone_number;
    params.value.phone_number = params.value.phone_number.replaceAll('-', '');
    call();
    params.value.phone_number = num;
    closeModal('sendingNoticeFile');
    return;
  }
  if (i === 10 && params.value.phone_number.length > 4) {
    params.value.phone_number = params.value.phone_number.slice(
      0,
      params.value.phone_number.length - 1,
    );
    if (params.value.phone_number.length === 9) {
      params.value.phone_number = params.value.phone_number.slice(
        0,
        params.value.phone_number.length - 1,
      );
    }
  }
  if (i !== 10) {
    if (params.value.phone_number.length === 13) {
      return;
    }
    if (params.value.phone_number.length === 8) {
      params.value.phone_number += '-';
    }
    if (i === 11) {
      params.value.phone_number += 0;
    } else {
      if (i === 12) {
        return;
      }
      params.value.phone_number += i;
    }
  }
};

const getDialsClass = (i: number): DynamicClassType => ({
  'flex h-[6.09375vw] w-[19.6875vw] items-center justify-center rounded-[0.78125vw] active:bg-[#FFFFFF33]':
    true,
  'bg-[#FFFFFF0D]': i !== 12,
  'btn-bg-gray-disabled text-white-disabled typo-r-h2':
    i === 12 && params.value.phone_number.length !== 13,
  'bg-[#FC0000] typo-b-h2': i === 12 && params.value.phone_number.length === 13,
});
</script>

<template>
  <div
    class="bg-modal-dim absolute z-[1000] flex size-full items-center
      justify-center"
    @click.self="closeModal('sendingNoticeFile')"
  >
    <div
      class="border-modal-2 relative flex h-[47.34375vw] w-[66.5625vw] flex-col
        items-center rounded-[0.9375vw] bg-black"
    >
      <div
        class="flex h-[6.796875vw] w-full items-center justify-between
          border-b-[0.078125vw] border-b-[#FC0000]
          p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]"
      >
        <div class="typo-b-h1 text-white-01">
          {{ t('첨부파일전송') }}
          <span class="typo-r-h4 text-white-disabled">{{
            t('총N개', { count: params.notice_file_id.length })
          }}</span>
        </div>
        <icon_back
          class="size-[1.5625vw]"
          @click="closeModal('sendingNoticeFile')"
        />
      </div>
      <div
        class="text-white-01 mt-[3.125vw] flex h-[34.0625vw] w-[61.5625vw]
          flex-col gap-[3.125vw]"
      >
        <div
          class="typo-r-h1 flex h-[2.8125vw] w-full justify-center text-white"
        >
          {{ params.phone_number }}
        </div>
        <div
          class="typo-r-h1 text-white-01 grid h-[28.125vw] w-full grid-cols-3
            justify-items-center"
        >
          <div
            v-for="i in 12"
            :key="i"
            :class="getDialsClass(i)"
            @click="insertNumber(i)"
          >
            <icon_delete v-if="isDelete(i)" />
            <span v-else>
              {{ getDials(i) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
