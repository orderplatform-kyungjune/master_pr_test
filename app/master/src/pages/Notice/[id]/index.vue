<script setup lang="ts">
import { useRoute } from 'vue-router';
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import useNoticeStore from '@store/useNoticeStore';
import { useModalStore } from '@store/index';
import { goBack } from '@router/route.helper';
import NoticeSkeleton from '@pages/Notice/[id]/Components/NoticeSkeleton.vue';
import {
  NoticeDetailDataType,
  NoticeDetailRootDataType,
} from '@interfaces/Notice';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import iconAttach from '@assets/icon/icon_attach.svg?url';
import arrowLeft from '@assets/icon/icon_arrow_left.svg?url';
import { requestNoticeDetail } from '@apis/notice';

const { t } = useTranslation();

const { useApiRequest } = useMasterApiRequest();
const { noticeCount } = storeToRefs(useNoticeStore());
const { openModalWithData } = useModalStore();

const noticeDetail = ref<NoticeDetailDataType>({} as NoticeDetailDataType);

const route = useRoute();

const isHaveFiles = computed(() => noticeDetail.value.fileList.length > 0);

const sendingFiles = computed(() => ({
  notice_id: route.params.id,
  notice_file_id: noticeDetail.value.fileList.map(
    (item) => item.notice_file_id,
  ),
}));

const getNoticeDetail = () =>
  useApiRequest(
    requestNoticeDetail,
    (data: NoticeDetailRootDataType) => {
      noticeDetail.value = data.info;
      noticeCount.value = data.new_count;
    },
    { notice_id: Number(route.params.id) },
    '공지사항 상세',
  );

const { call, loading } = getNoticeDetail();

call();
</script>

<template>
  <NoticeSkeleton v-if="loading" />
  <div
    v-else
    class="size-full"
  >
    <div
      class="mb-[1.875vw] h-[1.875vw] w-full cursor-pointer"
      @click="goBack"
    >
      <img
        class="size-[1.875vw]"
        :src="arrowLeft"
        alt="arrowLeft"
      />
    </div>
    <div
      class="border-b-default-1 flex w-full flex-col gap-[0.78125vw] pb-[1.25vw]"
    >
      <div class="typo-b-h2 flex w-full gap-[0.78125vw] whitespace-nowrap">
        <span>
          {{ t(noticeDetail.notice_category) }}
        </span>
        <span class="text-white-disabled w-[89%]">
          {{ noticeDetail.notice_title }}
        </span>
      </div>
      <span class="typo-r-h4 text-black-disabled">
        {{ noticeDetail.create_date.replace('20', '').replaceAll('-', '.') }}
      </span>
    </div>
    <div
      class="typo-b-h2 h-[42.8125vw] w-full overflow-y-auto pt-[1.5625vw]
        scrollbar-hide"
    >
      <div
        class="board pb-[10vw] leading-10 text-white"
        v-html="noticeDetail.notice_desc"
      ></div>
      <div
        v-if="isHaveFiles"
        class="typo-b-h4 text-black-01 mt-[3.125vw] flex w-full items-start
          justify-between rounded-[0.625vw] bg-[#FFFFFF]
          p-[1.875vw_1.25vw_1.875vw_1.5625vw]"
      >
        <div class="flex gap-[0.78125vw]">
          <span>{{ t('첨부파일') }}</span>
          <span class="text-primary-01">{{
            t('총N개', { count: noticeDetail.fileList.length })
          }}</span>
        </div>
        <div
          class="typo-r-h5 text-white-disabled flex w-[36.875vw] flex-col
            gap-[0.9375vw]"
        >
          <div
            v-for="item in noticeDetail.fileList"
            :key="item.notice_file_id"
            class="flex gap-[0.3125vw]"
          >
            <img
              class="size-[1.5625vw]"
              :src="iconAttach"
              alt="iconAttach"
            />
            <span>{{ item.notice_file_name }}</span>
          </div>
        </div>
        <div
          class="btn-bg-primary text-white-01 typo-b-h4 mt-auto flex
            h-[4.0625vw] w-[18.59375vw] items-center justify-center
            rounded-[0.625vw] text-center"
          @click="openModalWithData('sendingNoticeFile', sendingFiles)"
        >
          {{ t('카카오톡첨부') }}
        </div>
      </div>
    </div>
    <div class="h-[6.875vw] w-full">
      <div
        class="text-black-01 bg-alpha-white-100 active:text-white-01 typo-b-h4
          flex h-[3.75vw] w-[11.171875vw] items-center justify-center
          rounded-[0.625vw] active:bg-[#252A35]"
        @click="goBack"
      >
        {{ t('목록보기') }}
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.board {
  span {
    color: white !important;
  }

  p {
    color: white !important;
  }
}
</style>
