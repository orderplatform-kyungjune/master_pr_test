<script setup lang="ts">
import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import useNoticeStore from '@store/useNoticeStore';
import { pushPageWithParams } from '@router/route.helper';
import { ListType } from '@interfaces/Notice';
import { DynamicClassType } from '@interfaces/DynamicClass';
import iconAttach from '@assets/icon/icon_attach.svg?url';

const { t } = useTranslation();

const { noticeList, pageInfo } = storeToRefs(useNoticeStore());

const isListHaveFullfiled = computed(
  () =>
    noticeList.value &&
    noticeList.value.list &&
    noticeList.value.list.length > 0,
);

const isNewBoard = (list: ListType) =>
  list.notice_on === 'N' || list.notice_on === 'U';

const getNoticeIdStatus = (list: ListType, i: number) => {
  if (list.notice_top_fix === 'fixed') {
    return t('고정');
  }
  return pageInfo.value.from + i;
};

const getRowClass = (index: number, list: ListType): DynamicClassType => ({
  'table-body typo-b-h4 active:bg-depth-03 h-[6.328125vw] flex items-center':
    true,
  'border-b-[0.078125vw] border-b-[#252A35]':
    index !== noticeList.value.list.length - 1,
  'text-white-01': isNewBoard(list),
  'text-black-disabled': !isNewBoard(list),
});
</script>

<template>
  <div
    class="bg-depth-01 scrollbar-hide relative h-[48.359375vw] w-full
      overflow-y-auto rounded-[0.625vw]"
  >
    <div
      v-auto-animate
      class="size-full border-collapse text-center"
    >
      <div class="text-white-01 bg-depth-03 flex h-[4.0625vw] items-center">
        <div class="typo-r-h5 w-[12%] rounded-tl-[0.625vw]">No.</div>
        <div class="typo-r-h5 w-[12%]">
          {{ t('구분') }}
        </div>
        <div class="typo-r-h5 w-[61%]">
          {{ t('제목') }}
        </div>
        <div class="typo-r-h5 w-[15%] rounded-tr-[0.625vw]">
          {{ t('작성일') }}
        </div>
      </div>
      <div
        v-if="!isListHaveFullfiled"
        class="bg-depth-01 absolute h-[44.296875vw] w-full"
      >
        <div
          class="typo-r-h3 text-black-disabled bg-depth-01 absolute flex
            size-full items-center justify-center"
        >
          {{ t('공지사항 없음') }}
        </div>
      </div>
      <div
        v-else
        v-auto-animate
        class="table-body bg-depth-01 scrollbar-hide flex h-[44.296875vw] w-full
          flex-col overflow-y-auto"
      >
        <div
          v-for="(list, i) in noticeList.list"
          :key="list.notice_id"
          :class="getRowClass(i, list)"
          @click="pushPageWithParams('Notice-id', list.notice_id)"
        >
          <div class="typo-b-h4 w-[12%]">
            {{ getNoticeIdStatus(list, i) }}
          </div>
          <div class="typo-r-h3 w-[12%]">
            {{ t(list.notice_category) }}
          </div>
          <div
            class="typo-b-h2 flex h-[5.625vw] w-[61%] items-center justify-start
              gap-[0.78125vw] px-[1.5625vw]"
          >
            <span class="line-clamp-1 text-start">
              {{ list.notice_title }}
            </span>
            <img
              v-if="list.has_file_list"
              class="size-[1.5625vw]"
              :src="iconAttach"
              alt="iconAttach"
            />
            <div
              v-if="list.notice_on === 'N'"
              class="max-w-[25%]"
            >
              <div
                class="typo-b-h7 text-white-01 flex size-[1.5625vw] items-center
                  justify-center rounded-full bg-[#FF0000]"
              >
                N
              </div>
            </div>
          </div>
          <div class="w-[15%]">
            {{ list.create_date.replace('20', '').replaceAll('-', '.') }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
