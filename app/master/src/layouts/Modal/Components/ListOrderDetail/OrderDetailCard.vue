<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import { useOrderDetailStore, useUserStore } from '@store/index';
import CheckboxLabel from '@layouts/UI/CheckboxLabel.vue';
import { OptionType, OrderListType } from '@interfaces/Order';
import { DynamicClassType } from '@interfaces/DynamicClass';

const props = defineProps<{
  orderIndex: number;
  orderItem: OrderListType;
  isFailedOrder: boolean;
}>();

const { t } = useTranslation();
const { postCheckSubOrder } = useOrderDetailStore();
const { checkStandardPriceUnit } = useUserStore();

const checkSubOrder = () => {
  if (props.isFailedOrder) return;
  postCheckSubOrder(props.orderIndex);
};

const orderChecked = computed(() => props.orderItem.order_product_commit);

const isHaveOptions = props.orderItem.option.length !== 0;

const getMainProductCount = () => `${props.orderItem.good_qty}${t('개')}`;

const getMainProductPrice = () =>
  checkStandardPriceUnit(Number(props.orderItem.good_price)?.toLocaleString());

const getOptionCount = (option: OptionType) => {
  const optionName = translateLanguage(option.name_array, option.display_name);
  const optionCount = ` X ${option.good_qty}`;
  const optionPrice = checkStandardPriceUnit(option.pos_price.toLocaleString());

  if (optionName.length > 10) {
    return `<br>${optionPrice}<span style='color: #FC0000'>${optionCount}</span>`;
  }
  return `${optionPrice}<span style='color: #FC0000'>${optionCount}</span>`;
};

const getOptionPrice = (option: OptionType) => {
  if (option.good_qty === 0) {
    return checkStandardPriceUnit(option.pos_price.toLocaleString());
  }
  return checkStandardPriceUnit(
    (option.pos_price * option.good_qty).toLocaleString(),
  );
};

const getTotalPrice = () =>
  checkStandardPriceUnit(
    Number(props.orderItem.total_good_price).toLocaleString(),
  );

const getMainProductClass = (): DynamicClassType => ({
  'flex w-full justify-between items-start': true,
  'border-b-default-1 pb-[1.875vw]': isHaveOptions,
  'p-[1.875vw_1.875vw_1.875vw_0.9375vw]': !props.isFailedOrder,
  'p-[1.875vw]': props.isFailedOrder,
});
const getMainProductPriceClass = (): DynamicClassType => ({
  'typo-r-h3 text-white-disabled flex justify-end whitespace-nowrap pl-5': true,
  'typo-b-h3 text-white-01': !isHaveOptions,
});
const getProductCheckedStatusClass = (): DynamicClassType => ({
  'typo-b-h2 gap-[0.78125vw] pl-[1.25vw] flex-1 break-all': true,
  'text-white-disabled': orderChecked.value,
  'text-white-01': !orderChecked.value,
});
</script>

<template>
  <article class="relative max-w-[44.375vw]">
    <div
      class="bg-alpha-white-10 flex flex-col rounded-t-[0.625vw]"
      @click="checkSubOrder"
    >
      <div :class="getMainProductClass()">
        <div
          v-if="props.isFailedOrder"
          class="typo-b-h2 text-white-01 min-h-[2.34375vw] w-9/12
            gap-[0.78125vw]"
        >
          {{ translateLanguage(orderItem.name_array, orderItem.display_name) }}
        </div>
        <CheckboxLabel
          v-else
          class="flex min-h-[2.34375vw] items-start"
          :orderChecked="orderChecked"
        >
          <div :class="getProductCheckedStatusClass()">
            {{
              translateLanguage(orderItem.name_array, orderItem.display_name)
            }}
          </div>
        </CheckboxLabel>
        <span :class="getMainProductPriceClass()">
          {{ getMainProductPrice() }}
        </span>
      </div>
      <div
        v-if="isHaveOptions"
        class="flex flex-col gap-[1.875vw] p-[1.875vw]"
      >
        <div
          v-for="(option, optionIndex) in props.orderItem.option"
          :key="optionIndex"
          class="typo-r-h3 text-white-disabled flex justify-between"
        >
          <div class="flex w-9/12 gap-[0.3125vw]">
            <span>-</span>
            <span class="w-full break-all leading-7">
              {{ translateLanguage(option.name_array, option.display_name) }}
              <span
                class="typo-r-h3"
                v-html="getOptionCount(option)"
              ></span>
            </span>
          </div>
          <span>{{ getOptionPrice(option) }}</span>
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
