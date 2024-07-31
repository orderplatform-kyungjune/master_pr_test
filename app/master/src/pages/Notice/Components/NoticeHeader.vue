<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import useNoticeStore from '@store/useNoticeStore';
import { SearchFilterMenuType } from '@interfaces/Menu';
import arrow_top from '@assets/icon/icon_arrow_top.svg?url';
import arrow_bottom from '@assets/icon/icon_arrow_bottom.svg?url';

const { t } = useTranslation();

const { getNoticeList } = useNoticeStore();
const { noticeParams } = storeToRefs(useNoticeStore());

const props = defineProps<{
  filterList: SearchFilterMenuType[];
  selectedFilter: SearchFilterMenuType;
  checkFilter: boolean;
  permuteFilter: () => void;
  changeFilter: (item: SearchFilterMenuType) => void;
}>();

const animatedPermuteFilter = async () => {
  props.permuteFilter();
};

const animatedChangeFilter = (item: SearchFilterMenuType) => {
  props.changeFilter(item);
  animatedPermuteFilter();
};

const searchNotice = async () => {
  await getNoticeList().call();
};

const getFilterListClass = (id: number) => ({
  'typo-r-h4 active:bg-depth-02 h-[4.140625vw] w-full border-b-[0.078125vw] border-[#11111180] p-[1.25vw]':
    true,
  'typo-b-h4': props.selectedFilter.id === id,
  'active:rounded-t-[0.625vw]': id === 1,
  'border-none active:rounded-b-[0.625vw] h-[4.0625vw]': id === 5,
});
</script>

<template>
  <div class="z-10 flex h-[4.0625vw] w-full">
    <div
      class="bg-depth-02 relative mr-[0.9375vw] flex h-full w-[11.875vw]
        items-center justify-between rounded-[0.625vw] p-[1.25vw] transition-all"
      @click="animatedPermuteFilter"
    >
      <span class="typo-r-h4">{{ t(props.selectedFilter.name) }}</span>
      <img
        :src="props.checkFilter ? arrow_top : arrow_bottom"
        alt="arrow_top"
        class="size-[0.9375vw]"
      />
    </div>
    <div
      v-auto-animate
      class="absolute left-0 top-[7.8125vw]"
    >
      <div
        v-if="props.checkFilter"
        class="bg-depth-03 absolute z-20 h-[20.625vw] w-[11.875vw]
          rounded-[0.625vw] shadow-[0_-0.078125vw_0.625vw_0_#111111A6]"
      >
        <div
          v-for="item in props.filterList"
          :key="item.id"
          :class="getFilterListClass(item.id)"
          @click="animatedChangeFilter(item)"
        >
          {{ t(item.name) }}
        </div>
      </div>
    </div>
    <input
      v-model="noticeParams.searchTxt"
      class="typo-r-h4 bg-depth-02 border-list-1 mr-[0.78125vw] h-full
        w-[39.453125vw] rounded-[0.625vw] p-[1.25vw] outline-none
        focus:border-white"
      :placeholder="t('검색어')"
      @keyup.enter="searchNotice"
    />
    <button
      type="button"
      class="w-[8.984375vw] rounded-[0.625vw] bg-white text-black outline-none
        active:bg-[#FFFFFF33] active:text-white"
      @click="searchNotice"
    >
      <span class="typo-r-h3">{{ t('검색') }}</span>
    </button>
  </div>
</template>
