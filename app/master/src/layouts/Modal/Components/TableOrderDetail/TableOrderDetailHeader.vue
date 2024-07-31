<script setup lang='ts'>
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import {
  useModalStore,
  useOrderDetailStore,
  useOrderStore,
  useToastStore,
  useUserStore,
} from '@store/index';
import {
  OrderTableDataType,
  TableOrderType,
} from '@interfaces/Order';
import { commonConfirmDataType } from '@interfaces/Modal';
import person from '@assets/icon/icon_person.svg';

const props = defineProps<{
  selectedOrder: TableOrderType,
  selectedTableData: OrderTableDataType,
}>();

const { t } = useTranslation();
const { openModalWithData } = useModalStore();
const { addToast } = useToastStore();
const { postTableReset } = useOrderDetailStore();
const { getOrderHistoryTableType } = useOrderStore();
const { isNoposStore } = useUserStore();
const resetTable = async () => {
  const {
    call,
    error,
  } = postTableReset(props.selectedTableData.info.table_id);

  const { call: requestTableData } = getOrderHistoryTableType();
  await call();
  addToast(t('테이블 비우기 완료', { tableName: props.selectedTableData.info.table_name }), 'success', 1.5);

  if (error.value) {
    addToast(t('테이블 비우기 실패', { tableName: props.selectedTableData.info.table_name }), 'success', 1.5);
  }
  await requestTableData();
};

const openClearTable = () => {
  openModalWithData('commonConfirm', {
    title: t('테이블 비우기'),
    message: t('테이블 비우기 설명', { tableName: props.selectedTableData.info.table_name }),
    buttonName: t('삭제하기'),
    onClickButton: () => { resetTable(); },
  } as commonConfirmDataType);
};

const isVisitPerson = computed(() => props.selectedTableData.info.visitGroups !== 0);
const getPersonCount = computed(() => `${props.selectedTableData.info.visitGroups}${t('명')}`);
</script>

<template>
  <div class="text-white-01 mb-[2.03125vw] flex min-h-[3.90625vw] w-full items-center justify-between">
    <div class="flex items-center gap-[1.5625vw]">
      <div class="flex items-center gap-[1.71875vw]">
        <span class="typo-b-h0">{{ props.selectedTableData.info.table_name }}</span>
      </div>
      <div
        v-if="isNoposStore"
        class="bg-alpha-white-100 typo-b-h3 active:btn-bg-primary-pressed rounded-[0.625vw] p-[1.015625vw_3.125vw] text-black active:text-white"
        @click="openClearTable"
      >
        {{ t('테이블 비우기') }}
      </div>
    </div>

    <div
      v-if="isVisitPerson"
      class="flex items-center justify-center gap-[0.625vw] rounded-[0.78125vw] bg-[#FFFFFF33] p-[0.78125vw_1.25vw]"
    >
      <person />
      <span class="typo-r-h2 text-white-01">
        {{ getPersonCount }}
      </span>
    </div>
  </div>
</template>
