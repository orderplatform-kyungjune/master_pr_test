<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { translateLanguage } from '@utils/langTranferUtils';
import useCategoryStore from '@store/useCategoryStore';
import { useRefsStore, useToastStore } from '@store/index';
import { sleep } from '@packages/library';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { ChildCategoryListType } from '@interfaces/Category';

const { t } = useTranslation();

// const props = defineProps<{
//   scrollTo?: (index: number) => void,
// }>();
//
// if (props.scrollTo) {
//   const index = totalGoodsList.value.findIndex((item) => item.child_code === code);
//   if (index === -1) {
//     addToast('해당 카테고리에 상품이 존재하지 않습니다.', 'warning', 1.5);
//   } else {
//     props.scrollTo(index);
//   }
// }
const {
  selectedSubCategory,
  selectedCategory,
  // totalGoodsList,
} = storeToRefs(useCategoryStore());

const { addToast } = useToastStore();

const { subCategoryRef, categoryNavigatorRef } = storeToRefs(useRefsStore());

const { selectSubCategory } = useCategoryStore();

const getCategoryName = (category: ChildCategoryListType) =>
  translateLanguage(category.categoryNameArray, category.categoryName);

const selectSubCategoryAndMoveToProduct = async (code: number) => {
  selectSubCategory(code);
  await sleep.sleep(10);
  const categoryIndex = subCategoryRef.value.findIndex(
    (item) => item.id === code.toString(),
  );
  subCategoryRef.value?.[categoryIndex].scrollIntoView({ behavior: 'auto' });

  const index = categoryNavigatorRef.value.findIndex((item) => {
    const refinedId = item.id.replace('product-navigator ', '').split('-')[1];
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

  categoryNavigatorRef.value?.[index]?.scrollIntoView({ behavior: 'auto' });
};

const getListTypeClass = (
  category: ChildCategoryListType,
): DynamicClassType => ({
  'relative typo-b-h2 py-[0.625vw] whitespace-nowrap': true,
  'text-white-01':
    category.categoryCode === selectedSubCategory.value.categoryCode,
  'text-black-disabled break-words max-w-[16.25vw] overflow-hidden text-ellipsis':
    category.categoryCode !== selectedSubCategory.value.categoryCode,
});
</script>

<template>
  <div
    class="absolute mt-[5vw] flex h-[3.75vw] w-full overflow-x-auto
      scrollbar-hide"
  >
    <div class="relative flex max-h-[3.75vw] gap-[1.5625vw]">
      <div
        v-for="list in selectedCategory.child"
        :id="String(list.categoryCode)"
        :key="list.categoryCode"
        ref="subCategoryRef"
        class="relative flex items-center gap-[0.3125vw] overflow-hidden"
        @click="selectSubCategoryAndMoveToProduct(list.categoryCode)"
      >
        <div class="overflow-hidden">
          <p :class="getListTypeClass(list)">
            {{ getCategoryName(list) }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
