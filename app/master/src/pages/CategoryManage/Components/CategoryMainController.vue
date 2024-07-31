<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import Toggle from '@vueform/toggle';
import { translateLanguage } from '@utils/langTranferUtils';
import useCategoryStore from '@store/useCategoryStore';
import { useToastStore } from '@store/index';
import { CategoryListType } from '@interfaces/Category';

const { t } = useTranslation();

const { addToast } = useToastStore();

const { selectedCategory } = storeToRefs(useCategoryStore());

const { requestChangeCategoryStatus } = useCategoryStore();

const requestStatus = ref<boolean>(false);

const changeCategoryStatus = async (info: CategoryListType) => {
  requestStatus.value = true;

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
    'big',
    info.categoryCode,
    info.categoryUse,
  );

  await call();
  requestStatus.value = false;

  if (error.value !== null) {
    if (selectedCategory.value.categoryUse === 'Y') {
      selectedCategory.value.categoryUse = 'N';
    } else {
      selectedCategory.value.categoryUse = 'Y';
    }
  }
};
</script>

<template>
  <div
    class="relative mb-[1.5625vw] mt-[5.3125vw] flex h-[4.6875vw] w-full
      items-center justify-between"
  >
    <div class="flex flex-col gap-[0.78125vw]">
      <p class="typo-b-h2">
        {{ t('대분류 노출') }}
      </p>
      <p class="typo-r-h4 text-black-disabled">
        {{ t('대분류 노출 설명') }}
      </p>
    </div>
    <div>
      <Toggle
        id="대분류 토글 버튼"
        v-model="selectedCategory.categoryUse"
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
        :disabled="requestStatus"
        @change="changeCategoryStatus(selectedCategory as CategoryListType)"
      />
    </div>
  </div>
</template>
