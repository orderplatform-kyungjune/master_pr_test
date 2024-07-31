<script setup lang="ts">
import { computed } from 'vue';
import { useTranslation } from 'i18next-vue';
import { IS_ORIGIN } from '@utils/modeUtils';
import { translateLanguage } from '@utils/langTranferUtils';
import { useOrderDetailStore } from '@store/index';
import CheckboxLabel from '@layouts/UI/CheckboxLabel.vue';
import { OptionType, OrderListDataType } from '@interfaces/Order';
import { DynamicClassType } from '@interfaces/DynamicClass';
import icon_warning from '@assets/icon/icon_warning.svg?url';

const props = defineProps<{
  orderData: OrderListDataType;
  isFailedOrder: boolean;
}>();

const { t } = useTranslation();

const { postCheckOrder, postCheckSubOrder, getSelectedTablesOrderList } =
  useOrderDetailStore();

const openOrderDetailModalWithIndex = (subOrderKey: string) => {
  const mutatedSubOrderIndex = props.orderData.order_list.findIndex(
    (item) => item.order_product_key === subOrderKey,
  );
  getSelectedTablesOrderList(props.orderData, mutatedSubOrderIndex);
};

const uncheckedSubOrder = computed(() =>
  props.orderData.order_list.reduce(
    (a, b) => a + (b.order_product_commit ? 0 : 1),
    0,
  ),
);

const getSubOrderListSortByCommit = computed(() => {
  const orderData = [...props.orderData.order_list];
  orderData.sort(
    (a, b) =>
      (!a.order_product_commit ? -1 : 1) - (!b.order_product_commit ? -1 : 1),
  );
  return orderData;
});

const getPreviewOptions = (optionData: OptionType[]) => optionData.slice(0, 3);

const checkOrder = (order: OrderListDataType) => {
  postCheckOrder(order);
};

const getCardBodyWrapperClass = (): DynamicClassType => ({
  'flex relative h-[43.75vw] w-full flex-col p-[1.25vw]': true,
  'justify-center': props.isFailedOrder,
});

const getCardBodyClass = (index: number): DynamicClassType => ({
  'border-[0.078125vw] border-[#3A414F] flex w-full flex-col rounded-[0.625vw]':
    true,
  'mb-[3.75vw]': props.orderData.order_list.length - 1 === index,
});
</script>

<template>
  <div :class="getCardBodyWrapperClass()">
    <div
      v-if="props.isFailedOrder"
      class="flex flex-col items-center gap-[1.25vw]"
    >
      <p class="typo-b-h2">
        <span class="text-error-01">
          {{ t('주문접수실패') }}
        </span>
        {{ t('했습니다') }}
      </p>
      <p
        v-if="IS_ORIGIN"
        class="typo-r-h4 text-white-disabled text-center"
      >
        {{ t('주문접수실패설명') }}
      </p>
    </div>
    <div
      v-else
      class="relative size-full"
    >
      <div class="flex justify-between">
        <div>
          <div
            v-if="uncheckedSubOrder !== 0"
            class="flex items-center gap-[0.46875vw]"
          >
            <img
              class="size-[1.875vw]"
              :src="icon_warning"
              alt="icon_warning"
            />
            <span class="typo-r-h5 text-error-01">
              {{ t('미완료') }} {{ uncheckedSubOrder }}
            </span>
          </div>
        </div>
        <CheckboxLabel
          class="items-center"
          :orderChecked="props.orderData.order_commit"
          @click="checkOrder(props.orderData)"
        >
          <div class="typo-b-h3 text-white-01 line-clamp-1 pl-[0.78125vw]">
            {{ t('전체 완료하기') }}
          </div>
        </CheckboxLabel>
      </div>
      <div
        class="relative top-[1.25vw] h-[calc(100%_-_2.5vw)] w-full
          overflow-y-scroll scrollbar-hide"
      >
        <div
          v-auto-animate
          class="absolute flex w-full flex-col gap-[0.78125vw] scrollbar-hide"
        >
          <div
            v-for="(subOrder, index) in getSubOrderListSortByCommit"
            :key="subOrder.order_product_key"
            :class="getCardBodyClass(index)"
          >
            <div
              class="bg-depth-03 flex w-full items-center justify-between
                rounded-t-[0.625vw] p-[0.78125vw_1.25vw_0.78125vw_0.46875vw]"
            >
              <CheckboxLabel
                class="items-center"
                :orderChecked="subOrder.order_product_commit"
                @click="
                  postCheckSubOrder(
                    index,
                    props.orderData.order_key,
                    subOrder.order_product_key,
                  )
                "
              >
                <span
                  class="typo-b-h3 text-white-01 min-w-[19.53125vw]
                    max-w-[19.53125vw] gap-[0.78125vw] truncate pl-[0.78125vw]"
                >
                  {{
                    translateLanguage(
                      subOrder.name_array,
                      subOrder.display_name,
                    )
                  }}
                </span>
              </CheckboxLabel>
              <span
                class="typo-r-h6 text-white-disabled w-[8.5vw] text-end"
                @click="
                  openOrderDetailModalWithIndex(subOrder.order_product_key)
                "
              >
                {{ t('자세히보기') }}
              </span>
            </div>
            <div
              v-if="subOrder.option.length >= 1"
              class="typo-r-h5 flex w-full flex-col gap-[0.46875vw]
                p-[0.78125vw_1.25vw]"
              @click="
                postCheckSubOrder(
                  index,
                  props.orderData.order_key,
                  subOrder.order_product_key,
                )
              "
            >
              <div
                v-for="(option, optionKey) in getPreviewOptions(
                  subOrder.option,
                )"
                :key="optionKey"
                class="flex gap-[0.625vw]"
              >
                <span class="text-white-disabled">
                  -{{
                    translateLanguage(option.name_array, option.display_name)
                  }}
                </span>
                <span>X {{ option.good_qty }}</span>
              </div>
              <p
                v-if="subOrder.option.length > 3"
                class="text-white-disabled"
              >
                ...
              </p>
            </div>
            <div
              class="flex w-full items-center justify-between
                border-t-[0.078125vw] border-solid border-[#3A414F] p-[1.25vw]"
              @click="
                postCheckSubOrder(
                  index,
                  props.orderData.order_key,
                  subOrder.order_product_key,
                )
              "
            >
              <span class="typo-r-h5">{{ t('주문수량') }}</span>
              <span class="typo-b-h4 text-primary-01">
                {{ subOrder.good_qty }}
                {{ t('개') }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
