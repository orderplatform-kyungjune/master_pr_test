<script setup lang="ts">
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import { useRefsStore, useToastStore, useCategoryStore } from '@store/index';
import { sleep } from '@packages/library';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { CategoryListType } from '@interfaces/Category';

const { t } = useTranslation();

// const props = defineProps<{
//   scrollTo?: (index: number) => void,
// }>();
//
// const { totalGoodsList } = storeToRefs(useGoodsStore());
// if (props.scrollTo) {
//   const index = totalGoodsList.value.findIndex((item) => item.categoryInfo.big_code === code);
//   categoryNavigatorRef.value?.[index].scrollIntoView({ behavior: 'auto' });
// if (index === -1) {
//   addToast('해당 카테고리에 상품이 존재하지 않습니다.', 'warning', 1.5);
// } else {
//   props.scrollTo(index);
// }
// }

const { categoryList, selectedCategory } = storeToRefs(useCategoryStore());

const { mainCategoryRef, categoryNavigatorRef } = storeToRefs(useRefsStore());

const { addToast } = useToastStore();
const route = useRoute();
const { selectCategory } = useCategoryStore();

const getCategoryName = (category: CategoryListType) =>
  translateLanguage(category.categoryNameArray, category.categoryName);

const getCardStatusIndicatorText = (status: string) => {
  if (status === 'Y') {
    return 'On';
  }
  return 'Off';
};

const selectCategoryAndMoveToProduct = async (code: number) => {
  const prevCode = selectedCategory.value.categoryCode;
  selectCategory(code);
  await sleep.sleep(10);
  const categoryIndex = mainCategoryRef.value.findIndex(
    (item) => item.id === code.toString(),
  );
  mainCategoryRef.value?.[categoryIndex].scrollIntoView({ behavior: 'auto' });
  if (prevCode !== code) {
    document.querySelector('#category-navigation')?.scrollBy(20, 0);
  }

  if (!route.path.includes('categorymanage')) {
    const index = categoryNavigatorRef.value.findIndex((item) => {
      const refinedId = item.id.replace('product-navigator ', '').split('-')[0];
      if (refinedId === code.toString()) {
        return item;
      }
      return null;
    });

    if (index === -1) {
      addToast(t('네비게이션-존재하지않는상품'), 'warning', 1.5);
    } else {
      const navigationRef = categoryNavigatorRef.value?.[index];

      if (navigationRef) {
        navigationRef.scrollIntoView({ behavior: 'auto' });
      }
    }
  }
};

const getCardClass = (category: CategoryListType): DynamicClassType => ({
  'relative flex items-start gap-[0.3125vw] overflow-hidden"': true,
  selected: category.categoryCode === selectedCategory.value.categoryCode,
  'max-w-[19.53125vw]':
    category.categoryCode !== selectedCategory.value.categoryCode,
});

const getListTypeClass = (category: CategoryListType): DynamicClassType => ({
  'relative typo-b-h2 whitespace-nowrap': true,
  'text-primary-01':
    category.categoryCode === selectedCategory.value.categoryCode,
  'text-black-disabled overflow-hidden text-ellipsis break-words max-w-[16.25vw]':
    category.categoryCode !== selectedCategory.value.categoryCode,
});

const getCardStatusIndicatorClass = (category: CategoryListType) => ({
  'flex h-[2.34375vw] w-[2.96875vw] items-center justify-center rounded-[0.78125vw]':
    true,
  'bg-[#FC0000]':
    category.categoryUse === 'Y' &&
    category.categoryCode === selectedCategory.value.categoryCode,
  'bg-[#444B59]':
    category.categoryUse === 'N' ||
    category.categoryCode !== selectedCategory.value.categoryCode,
});
</script>

<template>
  <div
    id="category-navigation"
    class="absolute flex h-[3.75vw] w-full overflow-x-auto scrollbar-hide"
  >
    <div class="relative flex max-h-[3.75vw] gap-[1.5625vw] pr-[1.5625vw]">
      <div
        v-for="list in categoryList"
        :id="String(list.categoryCode)"
        :key="list.categoryCode"
        ref="mainCategoryRef"
        :class="getCardClass(list)"
        @click="selectCategoryAndMoveToProduct(list.categoryCode)"
      >
        <div class="overflow-hidden">
          <p :class="getListTypeClass(list)">
            {{ getCategoryName(list) }}
          </p>
        </div>
        <div :class="getCardStatusIndicatorClass(list)">
          <span class="text-black-01">
            {{ getCardStatusIndicatorText(list.categoryUse) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
