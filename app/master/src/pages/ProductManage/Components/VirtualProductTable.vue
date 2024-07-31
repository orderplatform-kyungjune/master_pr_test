<script setup lang="ts">
import { Ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useVirtualList } from '@vueuse/core';
import { vwToPx } from '@utils/commonUtils';
import {
  useCategoryStore,
  useGoodsStore,
  useModalStore,
  useRefsStore,
} from '@store/index';
import SubCategoryNavigation from '@pages/ProductManage/Components/SubCategoryNavigation.vue';
import CategoryNavigation from '@pages/CategoryManage/Components/CategoryNavigation.vue';
import { sleep } from '@packages/library';
import { LabelsType } from '@interfaces/Menu';
import { CategoryInfoType, GoodsType } from '@interfaces/Goods';
import iconEmpty from '@assets/icon/icon_empty_product.svg?url';
import arrowRight from '@assets/icon/icon_arrow_right.svg?url';
import iconRecommend from '@assets/icon/badge/icon_recommend.svg?url';
import iconNew from '@assets/icon/badge/icon_new.svg?url';
import iconHit from '@assets/icon/badge/icon_hit.svg?url';
import iconDiscount from '@assets/icon/badge/icon_discount.svg?url';
import iconBest from '@assets/icon/badge/icon_best.svg?url';

const { t } = useTranslation();

const { mainCategoryRef, subCategoryRef } = storeToRefs(useRefsStore());

const { selectedCategory, selectedSubCategory } =
  storeToRefs(useCategoryStore());
const { selectCategory, selectSubCategory, getCategoryList } =
  useCategoryStore();

const { totalGoodsList } = storeToRefs(useGoodsStore());
const { getGoodsList } = useGoodsStore();

const { openModalWithData } = useModalStore();

await getCategoryList('').call();
await getGoodsList().call();

const labels: LabelsType[] = [
  {
    name: 'best',
    text: 'BEST',
    icon: iconBest,
  },
  {
    name: 'hit',
    text: 'HIT',
    icon: iconHit,
  },
  {
    name: 'new',
    text: '신메뉴',
    icon: iconNew,
  },
  {
    name: 'sale',
    text: '할인',
    icon: iconDiscount,
  },
  {
    name: 'md',
    text: '추천',
    icon: iconRecommend,
  },
];

const isLabelOn = (product: GoodsType, label: LabelsType) =>
  product.goodsLabel[label.name] === 'Y';

const getTopThreeLabels = (product: GoodsType) =>
  labels.filter((label) => isLabelOn(product, label)).slice(0, 3);

const getRemainingLabelsCount = (product: GoodsType) => {
  const count = labels.filter((label) => isLabelOn(product, label)).length - 3;
  return count > 0 ? count : 0;
};

const getGoodStatus = (product: GoodsType) => {
  const isGoodSale = product.goodUse === 'Y';
  const isGoodSoldOut = product.goodSale === 'Y';

  if (!isGoodSale && !isGoodSoldOut) return t('판매중');
  if (!isGoodSale && isGoodSoldOut) return t('품절(보임)');
  if (isGoodSale && !isGoodSoldOut) return t('판매 중지(숨김)');
  if (isGoodSale && isGoodSoldOut) return t('품절(숨김)');
  return '';
};

const observerVwToPx = (vw: number) => {
  const { clientWidth } = document.documentElement;
  const px = (vw / 100) * clientWidth;

  return `-${px}px`;
};

const initialVirtualList = useVirtualList(totalGoodsList.value, {
  itemHeight: vwToPx(9.375),
  overscan: 3,
});

let virtualListObject = initialVirtualList;
let lists = initialVirtualList.list;
let { containerProps } = initialVirtualList;
let { wrapperProps } = initialVirtualList;

watch(
  () => totalGoodsList.value,
  () => {
    const result = useVirtualList(totalGoodsList.value, {
      itemHeight: vwToPx(9.375),
      overscan: 3,
    });
    virtualListObject = result;
    lists = result.list;
    containerProps = result.containerProps;
    wrapperProps = result.wrapperProps;
    document.querySelector('#watchable-product-table')?.scrollBy(0, 1);
    document.querySelector('#watchable-product-table')?.scrollBy(0, -1);
  },
);

const vObserver = {
  mounted: (el: Element, binding: Ref<CategoryInfoType>) => {
    const { big_code: mainCode, child_code: subCode } = binding.value;
    const setCategory = async (
      entry: IntersectionObserverEntry,
      _: IntersectionObserver,
    ) => {
      if (entry.isIntersecting) {
        const isSameMainCategory =
          mainCode === selectedCategory.value.categoryCode;
        if (!isSameMainCategory) {
          selectCategory(mainCode);
          await sleep.sleep(10);
          const index = mainCategoryRef.value.findIndex(
            (item) => item.id === mainCode.toString(),
          );
          mainCategoryRef.value?.[index].scrollIntoView({ behavior: 'auto' });
        }
        const isSameSubCategory =
          subCode === selectedSubCategory.value.categoryCode;
        if (!isSameSubCategory) {
          selectSubCategory(subCode);
          await sleep.sleep(10);
          const index = subCategoryRef.value.findIndex(
            (item) => item.id === subCode.toString(),
          );
          if (subCategoryRef.value?.[index]) {
            subCategoryRef.value?.[index].scrollIntoView({ behavior: 'auto' });
          }
        }
      }
    };
    const options = {
      root: document.querySelector('#watchable-product-table'),
      rootMargin: `0px 0px ${observerVwToPx(35.625)} 0px`,
      threshold: 0.1,
    };

    const observers = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => setCategory(entry, observer));
    }, options);

    observers.observe(el);
  },
};
</script>

<template>
  <CategoryNavigation :scrollTo="virtualListObject.scrollTo" />
  <SubCategoryNavigation :scrollTo="virtualListObject.scrollTo" />
  <div
    class="bg-depth-01 mt-[10.3125vw] h-[49.0625vw] w-full overflow-y-auto
      rounded-t-[0.625vw] scrollbar-hide"
  >
    <div class="relative size-full border-collapse text-center">
      <div
        class="typo-r-h5 text-white-01 bg-depth-03 sticky top-0 z-10
          h-[4.0625vw]"
      >
        <div class="flex size-full items-center">
          <div class="typo-r-h5 w-[35.9375vw]">
            {{ t('상품정보') }}
          </div>
          <div class="typo-r-h5 w-[46.875vw]">
            {{ t('상태 변경') }}
          </div>
        </div>
      </div>
      <div
        id="watchable-product-table"
        v-bind="containerProps"
        class="table-body bg-depth-01 absolute h-[45vw] w-full overflow-y-auto
          scrollbar-hide"
      >
        <div
          class="h-[45vw] w-full overflow-y-auto"
          v-bind="wrapperProps"
        >
          <div
            v-for="({ data: product }, i) in lists"
            :id="`${product.goodCode}-${product.goodDpName}-${i}`"
            :key="`${product.goodCode} - ${i}`"
            v-observer="product"
            class="typo-b-h4 flex h-[9.375vw] w-full items-center
              border-b-[0.078125vw] border-b-[#252A35]"
          >
            <div
              class="product-wrapper typo-r-h4 relative flex h-[9.375vw]
                w-[35.9375vw] items-center justify-center"
            >
              <div
                class="flex h-[7.96875vw] w-[32.5vw] items-center gap-[1.25vw]"
              >
                <img
                  v-if="product.goodImage.length > 1"
                  class="size-[5.625vw] rounded-[0.625vw]"
                  :src="product.goodImage"
                  alt="product_img"
                />
                <div
                  v-else
                  class="bg-depth-02 flex size-[5.625vw] items-center
                    justify-center rounded-[0.625vw]"
                >
                  <img
                    class="h-[4.140625vw] w-[3.75vw] rounded-[0.625vw]"
                    :src="iconEmpty"
                    alt="product_img"
                  />
                </div>
                <div
                  class="flex h-[5.625vw] w-[24.140625vw] flex-col items-center
                    justify-center gap-[1.25vw]"
                >
                  <p
                    class="typo-r-h3 text-white-01 line-clamp-1 h-[1.875vw]
                      w-[24.140625vw] break-words text-start"
                  >
                    {{ product.goodDpName }}
                  </p>
                  <div
                    class="flex h-[2.1875vw] w-full items-center gap-[0.625vw]"
                  >
                    <div
                      v-for="label in getTopThreeLabels(product)"
                      :key="label.name"
                      class="flex h-[2.5vw] items-center justify-center
                        gap-[0.3125vw] rounded-[7.8125vw] bg-[#FFFFFF0D]
                        p-[0.625vw_1.25vw]"
                    >
                      <img
                        class="size-[1.25vw]"
                        :src="label.icon"
                        alt="label"
                      />
                      <span class="typo-b-h7 text-white-01">{{
                        t(label.text)
                      }}</span>
                    </div>
                    <span
                      v-if="getRemainingLabelsCount(product) > 0"
                      class="typo-b-h6 text-white-disabled"
                      >+{{ getRemainingLabelsCount(product) }}</span
                    >
                  </div>
                </div>
              </div>
            </div>
            <div class="flex h-[9.375vw] w-[46.875vw] items-center">
              <div
                class="flex h-[4.21875vw] w-[43.4375vw] items-center
                  gap-[1.25vw]"
              >
                <div
                  v-if="product.is_option"
                  class="border-ghost-1 flex h-[4.21875vw] w-[11.875vw]
                    items-center justify-center rounded-[0.625vw]
                    active:bg-[#FFFFFF33]"
                  @click="
                    openModalWithData('productOptions', {
                      goodsCode: product.goodCode,
                      goodsName: product.goodDpName,
                      goodNameArray: product.goodNameArray,
                    })
                  "
                >
                  {{ t('옵션 상태 변경') }}
                </div>
                <div
                  v-else
                  class="text-white-disabled typo-r-h4 flex h-[4.21875vw]
                    w-[11.875vw] items-center justify-center"
                >
                  -
                </div>
                <div
                  class="border-ghost-1 flex h-[4.21875vw] w-[11.875vw]
                    items-center justify-center rounded-[0.625vw]
                    active:bg-[#FFFFFF33]"
                  @click="
                    openModalWithData('productSticker', {
                      goodsCode: product.goodCode,
                      goodsLabel: product.goodsLabel,
                      goodsName: product.goodDpName,
                    })
                  "
                >
                  {{ t('스티커 변경') }}
                </div>
                <div
                  class="btn-bg-gray typo-r-h3 text-black-01 active:bg-depth-03
                    flex h-[4.21875vw] w-[17.578125vw] items-center
                    justify-between rounded-[0.625vw] p-[1.09375vw_1.25vw]"
                  @click="
                    openModalWithData('productSale', {
                      goodsCode: product.goodCode,
                      goodsName: product.goodDpName,
                    })
                  "
                >
                  <span v-html="getGoodStatus(product)"></span>
                  <img
                    class="size-[1.5625vw]"
                    :src="arrowRight"
                    alt="arrowRight"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
