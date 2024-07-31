<script setup lang="ts">
import { Ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useLocalStorageData } from '@utils/localStorage';
import { translateLanguage } from '@utils/langTranferUtils';
import {
  useCategoryStore,
  useGoodsStore,
  useModalStore,
  useRefsStore,
  useUserStore,
} from '@store/index';
import SubCategoryNavigation from '@pages/ProductManage/Components/SubCategoryNavigation.vue';
import CategoryNavigation from '@pages/CategoryManage/Components/CategoryNavigation.vue';
import { sleep } from '@packages/library';
import { LabelsType } from '@interfaces/Menu';
import { GoodsType } from '@interfaces/Goods';
import iconEmpty from '@assets/icon/icon_empty_product.svg?url';
import arrowRight from '@assets/icon/icon_arrow_right.svg?url';
import iconRecommend from '@assets/icon/badge/icon_recommend.svg?url';
import iconNew from '@assets/icon/badge/icon_new.svg?url';
import iconHit from '@assets/icon/badge/icon_hit.svg?url';
import iconDiscount from '@assets/icon/badge/icon_discount.svg?url';
import iconBest from '@assets/icon/badge/icon_best.svg?url';

const { t } = useTranslation();

const isCompactMenu = useLocalStorageData<boolean>('isCompactMenu', false);

const { mainCategoryRef, subCategoryRef, categoryNavigatorRef } =
  storeToRefs(useRefsStore());

const { selectedCategory, selectedSubCategory } =
  storeToRefs(useCategoryStore());
const { selectCategory, selectSubCategory, getCategoryList } =
  useCategoryStore();
const { isCustomTheme } = storeToRefs(useUserStore());

const { totalGoodsList } = storeToRefs(useGoodsStore());
const { getGoodsList } = useGoodsStore();

const { openModalWithData } = useModalStore();

await getCategoryList('productManage').call();
await getGoodsList().call();

const labels: Readonly<LabelsType[]> = [
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

const customThemeLabels: Readonly<LabelsType[]> = [
  {
    name: 'best',
    text: 'BEST',
    icon: iconBest,
  },
  {
    name: 'new',
    text: 'NEW',
    icon: iconNew,
  },
];

const isLabelOn = (product: GoodsType, label: LabelsType) =>
  product.goodsLabel[label.name] === 'Y';

const getTopThreeLabels = (product: GoodsType) => {
  if (isCustomTheme.value) {
    return customThemeLabels
      .filter((label) => isLabelOn(product, label))
      .slice(0, 3);
  }
  return labels.filter((label) => isLabelOn(product, label)).slice(0, 3);
};

const getRemainingLabelsCount = (product: GoodsType) => {
  const count = labels.filter((label) => isLabelOn(product, label)).length - 3;
  return count > 0 ? count : 0;
};

const getGoodStatus = (product: GoodsType) => {
  const isGoodSale = product.goodUse === 'Y';
  const isGoodSoldOut = product.goodSale === 'Y';

  if (!isGoodSale && !isGoodSoldOut) return '판매중';
  if (!isGoodSale && isGoodSoldOut) return '품절(보임)';
  if (isGoodSale && !isGoodSoldOut) return '판매 중지(숨김)';
  if (isGoodSale && isGoodSoldOut) return '품절(숨김)';
  return '';
};

const observerVwToPx = (vw: number) => {
  const { clientWidth } = document.documentElement;
  const px = (vw / 100) * clientWidth;

  return `-${px}px`;
};

const vObserver = {
  mounted: (el: Element, binding: Ref<GoodsType>) => {
    const { big_code: mainCode, child_code: subCode } =
      binding.value.categoryInfo;
    const setCategory = async (
      entry: IntersectionObserverEntry,
      observer: IntersectionObserver,
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
      rootMargin: `0px 0px ${observerVwToPx(41.09375)} 0px`,
      threshold: 0.1,
    };

    const observers = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => setCategory(entry, observer));
    }, options);

    observers.observe(el);
  },
};

const vImgObserver = {
  mounted: (el: Element, binding: Ref<GoodsType>) => {
    const loadImage = (
      entry: IntersectionObserverEntry,
      observer: IntersectionObserver,
    ) => {
      if (entry.isIntersecting) {
        const imgEl = entry.target;
        if (imgEl instanceof HTMLImageElement) {
          imgEl.src = imgEl.dataset.src ?? '';
          observer.unobserve(imgEl);
        }
      }
    };

    const options = {
      root: document.querySelector('#watchable-product-table'),
      rootMargin: '0px 0px 400px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => loadImage(entry, observer));
    }, options);

    observer.observe(el);
  },
};

const getLastCategoryMarginBottom = (goods: GoodsType[]) => {
  let lastItemIdx = -1;
  let lastItem = null;

  // Array.findLast 지원안하는 파폭 버전임.
  for (let i = goods.length - 1; i >= 0; i -= 1) {
    if (goods[i].categoryInfo.is_first_on_child) {
      lastItem = goods[i];
      lastItemIdx = i;
      break;
    }
  }

  if (lastItem) {
    const lastGoodsLength = goods.length - lastItemIdx;
    switch (lastGoodsLength) {
      case 0:
        return ' mb-[40.703125vw]';
      case 1:
        return ' mb-[32.03125vw]';
      case 2:
        return ' mb-[22.578125vw]';
      case 3:
        return ' mb-[13.125vw]';
      default:
        return ' mb-[7.8125vw]';
    }
  }
  return ' mb-[7.8125vw]';
};

const getProductTableClass = (goods: GoodsType[], index: number) => {
  let defaultClass =
    'typo-b-h4 flex w-full flex-col items-center border-b-[0.078125vw] border-b-[#252A35]';

  if (index === totalGoodsList.value.length - 1) {
    defaultClass += getLastCategoryMarginBottom(goods);
  }
  return defaultClass;
};
</script>

<template>
  <CategoryNavigation />
  <SubCategoryNavigation />
  <div
    class="bg-depth-01 mt-[10.3125vw] h-[49.0625vw] w-full overflow-y-auto
      rounded-t-[0.625vw]"
  >
    <div class="relative size-full border-collapse text-center">
      <div
        class="typo-r-h5 text-white-01 bg-depth-03 sticky top-0 z-10
          h-[4.0625vw]"
      >
        <div class="flex size-full items-center">
          <div
            :class="isCompactMenu ? 'typo-r-h5 w-[52.5%]' : 'typo-r-h5 w-[42%]'"
          >
            {{ t('상품정보') }}
          </div>
          <div
            :class="isCompactMenu ? 'typo-r-h5 w-[47.5%]' : 'typo-r-h5 w-[58%]'"
          >
            {{ t('상태 변경') }}
          </div>
        </div>
      </div>
      <div
        id="watchable-product-table"
        class="table-body bg-depth-01 absolute h-[45vw] w-full overflow-y-auto"
      >
        <div class="h-[45vw] w-full overflow-y-auto scrollbar-hide">
          <div
            v-for="(product, productIndex) in totalGoodsList"
            :id="`${product.categoryInfo.big_code}-${product.categoryInfo.child_code}-${productIndex}`"
            :key="`${product.goodCode} - ${productIndex}`"
            v-observer="product"
            :class="getProductTableClass(totalGoodsList, productIndex)"
          >
            <div
              v-if="product.categoryInfo.is_first_on_child"
              :id="`product-navigator ${product.categoryInfo.big_code}-${product.categoryInfo.child_code}-${productIndex}`"
              ref="categoryNavigatorRef"
              class="bg-depth-02 typo-r-h3 flex w-full gap-[0.78125vw]
                p-[1.25vw_2.34375vw]"
            >
              <span class="max-w-[49%] truncate">
                {{
                  translateLanguage(
                    product.categoryInfo.big_name_array,
                    product.categoryInfo.big_name,
                  )
                }}
              </span>
              <span class="max-w-[2%]"> > </span>
              <span class="max-w-[49%] truncate">
                {{
                  translateLanguage(
                    product.categoryInfo.child_name_array,
                    product.categoryInfo.child_name,
                  )
                }}
              </span>
            </div>
            <div class="flex h-[9.453125vw] w-full">
              <div
                class="product-wrapper typo-r-h4 relative flex h-[9.375vw]
                  items-center justify-center"
                :class="
                  isCompactMenu
                    ? 'w-[50.5%] pl-[2.34375vw]'
                    : 'w-[42%] pl-[2.34375vw]'
                "
              >
                <div
                  class="flex h-[7.96875vw] w-full items-center gap-[1.25vw]"
                >
                  <img
                    v-if="product.goodImage.length > 1"
                    v-img-observer="product.goodImage"
                    class="h-[5.625vw] min-w-[5.625vw] max-w-[5.625vw]
                      rounded-[0.625vw]"
                    :src="iconEmpty"
                    :data-src="product.goodImage"
                    alt="product_img"
                  />
                  <div
                    v-else
                    class="bg-depth-02 flex h-[5.625vw] min-w-[5.625vw]
                      items-center justify-center rounded-[0.625vw]"
                  >
                    <img
                      class="h-[4.140625vw] w-[3.75vw] rounded-[0.625vw]"
                      :src="iconEmpty"
                      alt="product_img"
                    />
                  </div>
                  <div
                    class="flex w-auto flex-col items-center justify-center
                      gap-[1.25vw]"
                  >
                    <p
                      class="typo-r-h3 text-white-01 line-clamp-1
                        w-[24.140625vw] break-words text-start"
                    >
                      {{
                        translateLanguage(
                          product.goodNameArray,
                          product.goodDpName,
                        )
                      }}
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
                        <span class="typo-b-h7 text-white-01">
                          {{ t(label.text) }}
                        </span>
                      </div>
                      <span
                        v-if="getRemainingLabelsCount(product) > 0"
                        class="typo-b-h6 text-white-disabled"
                      >
                        +{{ getRemainingLabelsCount(product) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                class="flex h-[9.375vw] w-[58%] items-center justify-center"
                :class="isCompactMenu ? 'w-[49.5%] pr-[2.34375vw]' : 'w-[58%]'"
              >
                <div
                  class="flex h-[4.21875vw] w-[43.4375vw] items-center
                    gap-[1.25vw]"
                >
                  <div
                    v-if="product.is_option"
                    id="상품관리 - 옵션 상태 변경 클릭"
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
                    id="상품관리 - 스티커 변경 클릭"
                    class="border-ghost-1 flex h-[4.21875vw] w-[11.875vw]
                      items-center justify-center rounded-[0.625vw]
                      active:bg-[#FFFFFF33]"
                    @click="
                      openModalWithData('productSticker', {
                        goodsCode: product.goodCode,
                        goodsLabel: product.goodsLabel,
                        goodsName: product.goodDpName,
                        goodNameArray: product.goodNameArray,
                      })
                    "
                  >
                    {{ t('스티커 변경') }}
                  </div>
                  <div
                    id="상품관리 - 판매 상태 변경 클릭"
                    class="btn-bg-gray typo-r-h3 text-black-01
                      active:bg-depth-03 flex h-[4.21875vw] w-[17.578125vw]
                      items-center justify-between rounded-[0.625vw]
                      p-[1.09375vw_1.25vw]"
                    @click="
                      openModalWithData('productSale', {
                        goodsCode: product.goodCode,
                        goodsName: product.goodDpName,
                        goodNameArray: product.goodNameArray,
                        saleStatus: getGoodStatus(product),
                        useLock: product.useLock,
                        saleLock: product.saleLock,
                      })
                    "
                  >
                    <span
                      id="상품관리 - 판매 상태 변경 클릭"
                      v-html="t(getGoodStatus(product))"
                    ></span>
                    <img
                      id="상품관리 - 판매 상태 변경 클릭"
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
  </div>
</template>
