import { ref, reactive, computed } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import {
  NoticeListDataType,
  PageInfoType,
  requestNoticeListParams,
} from '@interfaces/Notice';
import { SearchFilterMenuType } from '@interfaces/Menu';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import { requestNoticeList } from '@apis/notice';

/**
 * useNoticeStore():
 * - 공지사항 관련 스토어
 */
const useNoticeStore = defineStore('Notice', () => {
  const { useApiRequest } = useMasterApiRequest();

  const filterList: SearchFilterMenuType[] = [
    {
      id: 1,
      name: '전체',
      value: ['EVENT', 'UPDATE', 'NOTICE', 'NEWS'],
    },
    {
      id: 2,
      name: '공지사항',
      value: ['NOTICE'],
    },
    {
      id: 3,
      name: '업데이트',
      value: ['UPDATE'],
    },
    {
      id: 4,
      name: '이벤트',
      value: ['EVENT'],
    },
    {
      id: 5,
      name: '뉴스',
      value: ['NEWS'],
    },
  ];

  const noticeCount = ref<number>(0);

  const refSelectedFilter = ref<SearchFilterMenuType>(filterList[0]);
  const selectedFilter = computed({
    get: () => refSelectedFilter.value,
    set: (value: SearchFilterMenuType) => {
      refSelectedFilter.value = value;
    },
  });

  const refNoticeList = ref<NoticeListDataType>({} as NoticeListDataType);
  const noticeList = computed({
    get: () => refNoticeList.value,
    set: (value: NoticeListDataType) => {
      refNoticeList.value = value;
    },
  });
  const refPageInfo = ref<PageInfoType>({} as PageInfoType);
  const pageInfo = computed({
    get: () => refPageInfo.value,
    set: (value: PageInfoType) => {
      refPageInfo.value = value;
    },
  });

  const noticeParams = reactive<requestNoticeListParams>({
    searchTxt: '',
    page: 1,
    perPage: 7,
    noticeCategory: ['EVENT', 'UPDATE', 'NOTICE', 'NEWS'],
    searchType: 'all',
  });

  const getNoticeList = () =>
    useApiRequest(
      requestNoticeList,
      (data, page_info) => {
        noticeList.value = data as NoticeListDataType;
        pageInfo.value = page_info as PageInfoType;
        noticeCount.value = (data as NoticeListDataType).new_count;
      },
      noticeParams,
      '공지사항',
    );

  const changeFilter = (item: SearchFilterMenuType) => {
    selectedFilter.value = item;
    noticeParams.noticeCategory = selectedFilter.value.value;
    noticeParams.page = 1;
    getNoticeList().call();
  };

  const resetNoticeParams = () => {
    noticeParams.searchTxt = '';
    noticeParams.page = 1;
    noticeParams.noticeCategory = ['EVENT', 'UPDATE', 'NOTICE', 'NEWS'];
    noticeParams.searchTxt = '';
    changeFilter(filterList[0]);
  };

  return {
    filterList,
    selectedFilter,
    noticeParams,
    noticeList,
    pageInfo,
    noticeCount,
    getNoticeList,
    changeFilter,
    resetNoticeParams,
  };
});

export default useNoticeStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNoticeStore, import.meta.hot));
}
