<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useNoticeStore } from '@store/index';
import NoticeHeader from '@pages/Notice/Components/NoticeHeader.vue';
import NoticeBoard from '@pages/Notice/Components/NoticeBoard.vue';
import Pagenation from '@layouts/UI/Pagenation.vue';

const {
  getNoticeList,
  filterList,
  changeFilter,
} = useNoticeStore();
const {
  selectedFilter,
  pageInfo,
  noticeParams,
} = storeToRefs(useNoticeStore());

getNoticeList().call();

const checkFilter = ref<boolean>(false);

const permuteFilter = () => {
  checkFilter.value = !checkFilter.value;
};

const navigate = (page: number) => {
  noticeParams.value.page = page;
  getNoticeList().call();
};
</script>

<template>
  <div class="flex size-full flex-col">
    <NoticeHeader
      :filterList="filterList"
      :selectedFilter="selectedFilter"
      :checkFilter="checkFilter"
      :permuteFilter="permuteFilter"
      :changeFilter="changeFilter"
    />
    <NoticeBoard class="mt-[1.5625vw]" />
    <div class="mt-[1.25vw] flex h-[3.125vw] w-full items-center justify-center">
      <Pagenation
        :pageInfo="pageInfo"
        :navigate="navigate"
      />
    </div>
  </div>
</template>
