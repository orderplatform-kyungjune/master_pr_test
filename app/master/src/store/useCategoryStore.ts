import {
  ref,
  computed,
} from 'vue';
import {
  acceptHMRUpdate,
  defineStore,
} from 'pinia';
import {
  CategoryListType,
  ChildCategoryListType,
} from '@interfaces/Category';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import {
  requestCategoryList,
  requestCategoryUpdate,
} from '@apis/category';

const useCategoryStore = defineStore('Category', () => {
  const { useApiRequest } = useMasterApiRequest();

  const refCategoryList = ref<CategoryListType[]>([] as CategoryListType[]);
  const categoryList = computed({
    get: () => refCategoryList.value,
    set: (value: CategoryListType[]) => {
      refCategoryList.value = value;
    },
  });

  const refSelectedCategory = ref<CategoryListType>({} as CategoryListType);
  const selectedCategory = computed({
    get: () => refSelectedCategory.value,
    set: (value: CategoryListType) => {
      refSelectedCategory.value = value;
    },
  });

  const refSelectedSubCategory = ref<ChildCategoryListType>({} as ChildCategoryListType);
  const selectedSubCategory = computed({
    get: () => refSelectedSubCategory.value,
    set: (value: ChildCategoryListType) => {
      refSelectedSubCategory.value = value;
    },
  });

  const categoryListLoading = computed(() => categoryList.value.length !== 0);

  const selectSubCategory = (subCategoryCode: number) => {
    selectedSubCategory.value = selectedCategory.value.child.find((item) => item.categoryCode === subCategoryCode) ?? categoryList.value[0].child[0];
  };

  const selectCategory = (category: number) => {
    selectedCategory.value = categoryList.value.find((item) => item.categoryCode === category) ?? categoryList.value[0];
    if (selectedCategory.value.child[0]) {
      selectSubCategory(selectedCategory.value.child[0].categoryCode);
    }
  };

  const getCategoryList = (searchType: string) => useApiRequest(requestCategoryList, (data: CategoryListType[]) => {
    categoryList.value = data;
    selectCategory(categoryList.value[0].categoryCode);
  }, { searchType }, '카테고리');

  const requestChangeCategoryStatus = (type: string, updateCategoryCode: number, updateCategoryUse: string, categoryCode?: number) => {
    const {
      call,
      loading,
      error,
    } = useApiRequest(requestCategoryUpdate, () => {
    }, {
      type,
      updateCategoryCode: [updateCategoryCode],
      updateCategoryUse: [updateCategoryUse],
      categoryCode,
    }, '카테고리 상태 변경');

    return {
      call,
      loading,
      error,
    };
  };

  return {
    categoryList,
    selectedCategory,
    categoryListLoading,
    selectedSubCategory,
    selectCategory,
    selectSubCategory,
    getCategoryList,
    requestChangeCategoryStatus,
  };
});

export default useCategoryStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCategoryStore, import.meta.hot));
}
