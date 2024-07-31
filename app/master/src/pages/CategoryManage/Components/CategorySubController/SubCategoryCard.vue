<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import Toggle from '@vueform/toggle';
import { useCategoryStore, useToastStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { ChildCategoryListType } from '@interfaces/Category';
import { translateLanguage } from '../../../../utils/langTranferUtils';

const { t } = useTranslation();

const { selectedCategory } = storeToRefs(useCategoryStore());
const { requestChangeCategoryStatus } = useCategoryStore();
const { addToast } = useToastStore();

const changeCategoryStatus = async (
  info: ChildCategoryListType,
  index: number,
) => {
  // eslint-disable-next-line no-param-reassign
  info.requestStatus = true;
  const getTranslatedName = translateLanguage(
    info.categoryNameArray,
    info.categoryName,
  );

  if (info.categoryUse === 'Y') {
    addToast(
      t('분류 노출 토스트', { categoryName: getTranslatedName }),
      'success',
      1.5,
    );
  } else {
    addToast(
      t('분류 숨김 토스트', { categoryName: getTranslatedName }),
      'success',
      1.5,
    );
  }

  const { call, error } = requestChangeCategoryStatus(
    'child',
    info.categoryCode,
    info.categoryUse,
    selectedCategory.value.categoryCode,
  );

  await call();

  // eslint-disable-next-line no-param-reassign
  info.requestStatus = false;

  if (error.value !== null) {
    if (selectedCategory.value.child[index].categoryUse === 'Y') {
      selectedCategory.value.child[index].categoryUse = 'N';
    } else {
      selectedCategory.value.child[index].categoryUse = 'Y';
    }
  }
};

const isChildCategoryOverTen = computed(
  () =>
    selectedCategory.value &&
    selectedCategory.value.child &&
    selectedCategory.value.child.length > 10,
);

const getCardContainerClass = (): DynamicClassType => ({
  'grid w-full grid-cols-3 gap-[0.78125vw] overflow-y-auto scrollbar-hide':
    true,
  'h-[40vw]': isChildCategoryOverTen.value,
});

const getCardClass = (status: string): DynamicClassType => ({
  'flex flex-col w-full gap-[2.34375vw] rounded-[0.78125vw] p-[1.875vw_1.5625vw] scrollbar-hide':
    true,
  'bg-depth-03': status === 'Y',
  'bg-depth-02': status === 'N',
});

const getCardTextClass = (status: string): DynamicClassType => ({
  'typo-r-h2 truncate': true,
  'text-black-disabled': status === 'N',
});
</script>

<template>
  <div class="h-[40vw] w-full">
    <div
      v-auto-animate
      :class="getCardContainerClass()"
    >
      <div
        v-for="(item, index) in selectedCategory.child"
        :key="item.categoryCode"
        :class="getCardClass(item.categoryUse)"
      >
        <div :class="getCardTextClass(item.categoryUse)">
          {{ translateLanguage(item.categoryNameArray, item.categoryName) }}
        </div>
        <div class="flex justify-end">
          <Toggle
            id="중분류 토글 버튼"
            v-model="item.categoryUse"
            class="typo-b-h7 border-none"
            :classes="{
              handle: 'toggle-handles',
              handleOff: 'left-[0.3125vw]',
              handleOn: 'left-[95%] transform -translate-x-full',
            }"
            true-value="Y"
            false-value="N"
            on-label="ON"
            off-label="OFF"
            :disabled="item.requestStatus"
            @change="changeCategoryStatus(item, index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
