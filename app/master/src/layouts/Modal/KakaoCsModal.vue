<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useModalStore, useToastStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import icon_delete from '@assets/icon/icon_delete.svg';
import icon_back from '@assets/icon/icon_back.svg';
import { requestKakaoAlimtalk } from '@apis/etc';

const { t } = useTranslation();

const { useApiRequest } = useMasterApiRequest();
const { addToast } = useToastStore();
const { closeModal } = useModalStore();

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

const phone_number = ref<string>('010-');

const isDelete = (i: number) => i === 10;

const insertNumber = (i: number) => {
  if (i === 12) {
    if (phone_number.value.length !== 13) {
      addToast(t('전화번호확인'), 'warning', 3, true);
      return;
    }
    const { call } = useApiRequest(
      requestKakaoAlimtalk,
      () => {
        addToast(
          t('알림톡메시지발송', { phone_number: phone_number.value }),
          'success',
          1.5,
        );
      },
      { receiverNum: phone_number.value },
      '카카오 상담',
    );
    call();
    closeModal('kakaoCs');
    return;
  }
  if (i === 10 && phone_number.value.length > 4) {
    phone_number.value = phone_number.value.slice(
      0,
      phone_number.value.length - 1,
    );
    if (phone_number.value.length === 9) {
      phone_number.value = phone_number.value.slice(
        0,
        phone_number.value.length - 1,
      );
    }
  }
  if (i !== 10) {
    if (phone_number.value.length === 13) {
      return;
    }
    if (phone_number.value.length === 8) {
      phone_number.value += '-';
    }
    if (i === 11) {
      phone_number.value += 0;
    } else {
      if (i === 12) {
        return;
      }
      phone_number.value += i;
    }
  }
};

const getDialsClass = (i: number): DynamicClassType => ({
  'flex h-[6.09375vw] w-[22.03125vw] items-center justify-center rounded-[0.78125vw] active:bg-[#FFFFFF33]':
    true,
  'bg-[#FFFFFF0D]': i !== 12,
  'btn-bg-gray-disabled text-white-disabled typo-r-h2':
    i === 12 && phone_number.value.length !== 13,
  'bg-[#FC0000] typo-b-h2': i === 12 && phone_number.value.length === 13,
});
</script>

<template>
  <div
    class="bg-modal-dim absolute z-[1000] flex size-full items-center
      justify-center"
    @click.self="closeModal('kakaoCs')"
  >
    <div
      class="border-modal-2 relative flex h-[51.25vw] w-[74.0625vw] flex-col
        items-center gap-[2.34375vw] rounded-[0.9375vw] bg-black"
    >
      <div
        class="flex w-full items-start justify-between border-b-[0.078125vw]
          border-b-[#FC0000] p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]"
      >
        <div class="typo-b-h1 text-white-01 flex flex-col gap-[0.9375vw]">
          {{ t('알림톡') }}
          <span class="typo-r-h3 text-white-disabled">{{
            t('알림톡 설명')
          }}</span>
          <span class="typo-r-h3 text-primary-01">{{
            t('알림톡 부가설명')
          }}</span>
        </div>
        <icon_back
          class="size-[1.5625vw]"
          @click="closeModal('kakaoCs')"
        />
      </div>
      <div
        class="text-white-01 flex h-[33.984375vw] w-[68.59375vw] flex-col
          gap-[3.125vw]"
      >
        <div
          class="typo-r-h0 flex h-[2.8125vw] w-full justify-center text-white"
        >
          {{ phone_number }}
        </div>
        <div
          class="typo-r-h1 text-white-01 grid h-[28.125vw] w-full grid-cols-3
            justify-items-center"
        >
          <div
            v-for="i in 12"
            :id="i === 12 ? '카카오톡 상담 신청' : ''"
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
