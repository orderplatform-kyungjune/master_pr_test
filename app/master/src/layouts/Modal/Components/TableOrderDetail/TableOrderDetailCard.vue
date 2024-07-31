<script setup lang="ts">
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import { useUserStore } from '@store/index';
import {
  TableOptionType,
  TableOrderInfoType,
  TableOrderListType,
} from '@interfaces/Order';

const props = defineProps<{
  orderItem: TableOrderListType;
  orderInfo: TableOrderInfoType;
}>();

const { t } = useTranslation();

const { checkStandardPriceUnit } = useUserStore();

const isHaveOptions = props.orderItem.option.length !== 0;

const getMainProductCount = () => `${props.orderItem.good_qty}${t('개')}`;

const getMainProductPrice = () =>
  checkStandardPriceUnit(props.orderItem.good_price.toLocaleString());

const getOptionPrice = (option: TableOptionType) => {
  if (option.good_qty === 0) {
    return checkStandardPriceUnit(option.good_price.toLocaleString());
  }
  return checkStandardPriceUnit(
    (option.good_price * option.good_qty).toLocaleString(),
  );
};

const getOptionPriceAndCount = (option: TableOptionType) => {
  const optionName = translateLanguage(option.name_array, option.display_name);
  const optionCount = ` X ${option.good_qty}`;
  const optionPrice = checkStandardPriceUnit(
    option.good_price.toLocaleString(),
  );
  const calcOptionPrice = checkStandardPriceUnit(
    (option.good_price * option.good_qty).toLocaleString(),
  );

  if (option.good_qty === 0) {
    if (optionName?.length > 10) {
      return `<br>${optionPrice}<span style='color: #FC0000'>${optionCount}</span>`;
    }
    return `${optionPrice}<span style='color: #FC0000'>${optionCount}</span>`;
  }

  if (optionName?.length > 10) {
    return `<br>${calcOptionPrice}<span style='color: #FC0000'>${optionCount}</span>`;
  }
  return `${calcOptionPrice}<span style='color: #FC0000'>${optionCount}</span>`;
};

const getTotalPrice = () => {
  const optionsPrice = props.orderItem.option.reduce(
    (previousValue, currentValue) =>
      previousValue + currentValue.good_price * currentValue.good_qty,
    0,
  );
  const totalPrice =
    (props.orderItem.good_price + optionsPrice) * props.orderItem.good_qty;
  return checkStandardPriceUnit(totalPrice.toLocaleString());
};

const getMainProductClass = () => ({
  'flex w-full justify-between items-center': true,
  'mb-[1.875vw] border-b-default-1 pb-[1.875vw]': isHaveOptions,
});
const getMainProductPriceClass = () => ({
  'typo-r-h3 text-white-disabled w-[30%] flex justify-end': true,
  'typo-b-h3 text-white-01': !isHaveOptions,
});
</script>

<template>
  <article class="max-w-[44.375vw] rounded-[0.625vw] bg-[#FFFFFF0D]">
    <div class="flex flex-col p-[1.875vw]">
      <div :class="getMainProductClass()">
        <div class="flex w-[70%] items-center">
          <span
            class="typo-b-h2 text-white-01 w-full gap-[0.78125vw] break-all"
          >
            {{
              translateLanguage(orderItem.name_array, orderItem.display_name)
            }}
          </span>
        </div>
        <span :class="getMainProductPriceClass()">
          {{ getMainProductPrice() }}
        </span>
      </div>
      <div class="flex flex-col gap-[1.875vw]">
        <div
          v-for="(item, i) in props.orderItem.option"
          :key="i"
          class="typo-r-h3 text-white-disabled flex justify-between"
        >
          <div class="flex w-9/12 gap-[0.3125vw]">
            <span>- </span>
            <span class="w-full break-all leading-7">
              {{ translateLanguage(item.name_array, item.display_name) }}
              <span
                class="typo-r-h3"
                v-html="getOptionPriceAndCount(item)"
              ></span>
            </span>
          </div>
          <span>{{ getOptionPrice(item) }}</span>
        </div>
      </div>
    </div>
    <div
      class="bg-alpha-white-15 flex w-full flex-col justify-between
        gap-[1.5625vw] rounded-b-[0.625vw] p-[1.875vw]"
    >
      <div class="flex justify-between">
        <span class="typo-r-h3 text-white-01">
          {{ t('주문수량') }}
        </span>
        <span class="typo-b-h3 text-primary-01">
          {{ getMainProductCount() }}
        </span>
      </div>
      <div class="flex justify-between">
        <span class="typo-r-h3 text-white-01">
          {{ t('주문금액') }}
        </span>
        <span class="typo-b-h3">
          {{ getTotalPrice() }}
        </span>
      </div>
    </div>
  </article>
</template>
