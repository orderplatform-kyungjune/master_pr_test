<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import dayjs from 'dayjs';
import { translateLanguage } from '@utils/langTranferUtils';
import { useUserStore } from '@store/index';
import { tableInfoType, TableOrderType } from '@interfaces/Order';
import { DynamicClassType } from '@interfaces/DynamicClass';
import useCurrentTime from '@composable/useCurrentTime';
import person from '@assets/icon/icon_person_black.svg';

const props = defineProps<{
  tableInfo: tableInfoType;
  tableOrder: TableOrderType[];
}>();

const { t } = useTranslation();

const { userAuth } = storeToRefs(useUserStore());

const isEmptyTable = computed(() => props.tableInfo.order_use === 'N');

const isVisitPerson = () => {
  if (isEmptyTable.value) {
    return false;
  }
  return props.tableInfo.visitGroups !== 0;
};
const getPersonCount = () => {
  if (isEmptyTable.value) {
    return '';
  }
  return `${props.tableInfo.visitGroups ?? 0}${t('명')}`;
};

const getFirstOrder = () => {
  if (isEmptyTable.value) {
    return '';
  }

  const firstOrderItem = props.tableOrder[0]?.order_list[0];
  return translateLanguage(
    firstOrderItem?.name_array,
    firstOrderItem?.display_name,
  );
};

const isMoreThanOne = () => {
  if (isEmptyTable.value) {
    return false;
  }
  return props.tableInfo.total_count > 1;
};

const getStandardPriceUnit = userAuth.value?.store?.store_standardPriceUnit
  ? userAuth.value.store.store_standardPriceUnit
  : '원';

const getLastOrderPrice = () => {
  if (isEmptyTable.value) {
    return '';
  }
  return props.tableInfo.total_price.toLocaleString();
};

const { tableDate } = useCurrentTime();

const getOrderTime = computed(() => {
  const time = props.tableInfo.first_order_time;
  let difference = dayjs.duration(tableDate.value.diff(dayjs(time)));

  if (difference.asHours() < 0) {
    difference = dayjs.duration({
      hours: 0,
      minutes: 0,
    });
  }

  const hours = Math.floor(difference.asHours());
  const minutes = Math.floor(difference.asMinutes() % 60);
  if (hours === 0) {
    return t('테이블 점유 시간 제외', { minutes });
  }

  return t('테이블 점유 시간', {
    hours,
    minutes,
  });
});

const getCardClass = (): DynamicClassType => ({
  'h-[19.0625vw] rounded-[0.625vw] w-full p-[1.5625vw_1.5625vw_1.5625vw_1.5625vw]':
    true,
  'bg-[#3A414F80]': isEmptyTable.value,
  'bg-depth-03 active:bg-depth-02': !isEmptyTable.value,
});

const getTableNameClass = (): DynamicClassType => ({
  'typo-b-h2 truncate w-8/12': true,
  'text-black-disabled': isEmptyTable.value,
});
</script>

<template>
  <div :class="getCardClass()">
    <div class="mb-[2.1875vw] flex items-center justify-between">
      <span :class="getTableNameClass()">
        {{ props.tableInfo.table_name }}
      </span>
      <div
        v-if="isVisitPerson()"
        class="flex items-center justify-center gap-[0.625vw]
          rounded-[0.78125vw] bg-[#11111180] p-[0.625vw_0.78125vw]"
      >
        <person class="size-[1.5625vw]" />
        <span class="typo-r-h4 whitespace-nowrap text-[#FFFFFF80]">
          {{ getPersonCount() }}
        </span>
      </div>
    </div>
    <div class="h-[7.8125vw] w-full">
      <p class="typo-r-h2 text-white-01 mb-[0.78125vw] truncate">
        {{ getFirstOrder() }}
      </p>
      <p
        v-if="isMoreThanOne()"
        class="typo-r-h3 text-primary-01"
      >
        {{ `${t('외')} ${props.tableInfo.total_count - 1}${t('개')}` }}
      </p>
    </div>
    <div class="border-t-list-1 flex h-[3.28125vw] items-end">
      <div
        v-if="!isEmptyTable"
        class="getStandardPriceUnit flex w-full items-baseline justify-between"
      >
        <span class="typo-r-h6 text-white-disabled w-5/12 whitespace-nowrap">
          {{ getOrderTime }}
        </span>
        <span
          v-if="getStandardPriceUnit === '원'"
          class="typo-b-h2"
        >
          {{ getLastOrderPrice() }}
          <span class="typo-b-h4">
            {{ getStandardPriceUnit }}
          </span>
        </span>
        <span
          v-else
          class="typo-b-h2"
        >
          <span class="typo-b-h3">
            {{ getStandardPriceUnit }}
          </span>
          {{ getLastOrderPrice() }}
        </span>
      </div>
    </div>
  </div>
</template>
