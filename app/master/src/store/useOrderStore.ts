import { computed, ref, watchEffect } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useLocalStorageData } from '@utils/localStorage';
import {
  OrderListDataType,
  OrderListFilterType,
  OrderTableDataType,
} from '@interfaces/Order';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import { requestOrderList, requestTableOrderList } from '@apis/order';

/**
 * useOrderStore():
 * - 주문 관련 스토어.
 */
const useOrderStore = defineStore('Order', () => {
  const { useApiRequest } = useMasterApiRequest();

  // 주문리스트 필터 관련
  const orderListFilter = ref(
    useLocalStorageData<OrderListFilterType>('orderListFilter', {
      type: 'list',
      order: 'desc',
    }),
  );

  watchEffect(() => {
    useLocalStorageData<OrderListFilterType>(
      'orderListFilter',
      orderListFilter.value,
    );
  });

  /**
   * currentViewType:
   * - 주문 데이터 뷰 타입.
   * - 'list' | 'table'
   */
  const currentViewType = ref<'list' | 'table'>('list');

  /**
   * selectedListType:
   * - 리스트형 주문 데이터 타입.
   * - 'all' | 'checked' | 'unchecked'
   */
  const selectedListType = ref<'all' | 'checked' | 'unchecked' | 'failed'>(
    'unchecked',
  );

  /**
   * changeListType():
   * - 리스트형 주문 데이터 타입 변경 함수.
   * - param {'all' | 'checked' | 'unchecked'} type - 리스트 타입
   * - return {void}
   */
  const changeListType = (type: 'all' | 'checked' | 'unchecked' | 'failed') => {
    selectedListType.value = type;
  };

  /**
   * selectedListType:
   * - 리스트형 주문 데이터 타입.
   * - 'all' | 'checked' | 'unchecked'
   */
  const selectedTableType = ref<'all' | 'taken' | 'untaken'>('taken');

  /**
   * changeListType():
   * - 리스트형 주문 데이터 타입 변경 함수.
   * - param {'all' | 'checked' | 'unchecked'} type - 리스트 타입
   * - return {void}
   */
  const changeTableType = (type: 'all' | 'taken' | 'untaken') => {
    selectedTableType.value = type;
  };

  const resetListAndTableType = () => {
    if (selectedListType.value !== 'unchecked') {
      selectedListType.value = 'unchecked';
    }
    if (selectedTableType.value !== 'taken') {
      selectedTableType.value = 'taken';
    }
  };

  /**
   * orderList, checkedList, uncheckedList:
   * - 리스트형 주문 데이터.
   * - orderList: 전체 주문 데이터.
   * - checkedList: 주문 확인된 데이터.
   * - uncheckedList: 주문 확인되지 않은 데이터.
   */
  const refOrderList = ref<OrderListDataType[]>([] as OrderListDataType[]);
  const orderList = computed({
    get: () => refOrderList.value,
    set: (value: OrderListDataType[]) => {
      refOrderList.value = value;
    },
  });

  const checkedList = computed(() =>
    refOrderList.value.filter((item) => item.order_commit && !item.errorMsg),
  );
  const uncheckedList = computed(() =>
    refOrderList.value.filter((item) => !item.order_commit && !item.errorMsg),
  );
  const orderFailList = computed(() =>
    refOrderList.value.filter((item) => item.errorMsg || false),
  );

  const isHaveFailedOrder = computed(() => orderFailList.value.length);

  const getOrderListByType = (orderType: string) => {
    if (orderType === 'checked') {
      return checkedList.value;
    }
    if (orderType === 'unchecked') {
      return uncheckedList.value;
    }
    if (orderType === 'failed') {
      return orderFailList.value;
    }
    return orderList.value;
  };

  const selectedList = computed<OrderListDataType[]>(() =>
    getOrderListByType(selectedListType.value),
  );

  /**
   * tableOrderList:
   * - 테이블형 주문 데이터.
   * - tableOrderList: 전체 주문 데이터.
   */
  const refTableOrderList = ref<OrderTableDataType[]>(
    [] as OrderTableDataType[],
  );
  const tableOrderList = computed({
    get: () => refTableOrderList.value,
    set: (value: OrderTableDataType[]) => {
      refTableOrderList.value = value;
    },
  });

  const tableTakenOrderList = computed(() =>
    tableOrderList.value.filter((item) => item.orders.length > 0),
  );

  const tableUntakenOrderList = computed(() =>
    tableOrderList.value.filter((item) => item.orders.length === 0),
  );

  const getTableListByType = (orderType: string) => {
    if (orderType === 'taken') {
      return tableTakenOrderList.value;
    }
    if (orderType === 'untaken') {
      return tableUntakenOrderList.value;
    }
    return tableOrderList.value;
  };

  const selectedTableList = computed(() =>
    getTableListByType(selectedTableType.value),
  );

  /**
   * getOrderHistory():
   * - 주문 리스트 불러오는 함수.
   * - param {string} store_code - 매장코드
   * - param {boolean} is_master_db - true ? 마스터 디비 : 슬레이브 디비
   * - return {void} 주문 리스트 데이터 할당
   */
  const getOrderHistory = (isSocket?: boolean) =>
    useApiRequest(
      requestOrderList,
      (data: OrderListDataType[]) => {
        orderList.value = data;
      },
      {
        order: orderListFilter.value.order,
        is_master_db: isSocket ?? false,
      },
      '주문 리스트',
    );

  /**
   * getOrderHistoryTableType():
   * - 테이블 주문 리스트 불러오는 함수. (테이블은 포스 데이터 기반)
   * - param: { store_code: string }
   * - param {string} store_code - 매장코드
   * - param {string} type - 리스트 타입
   * - return {void} 주문 리스트 데이터 세팅
   */

  const getOrderHistoryTableType = () =>
    useApiRequest(
      requestTableOrderList,
      (data: OrderTableDataType[]) => {
        tableOrderList.value = data;
      },
      {},
      '주문 테이블',
    );

  /**
   * getListCount():
   * - 주문 리스트 배열의 길이를 리턴함
   * - param {checked || unchecked} type - 리스트 타입
   * - return {number} 주문 리스트 배열 길이
   */
  const getListCount = (type: string) => {
    if (type === 'checked') return checkedList.value.length;
    if (type === 'unchecked') return uncheckedList.value.length;
    if (type === 'failed') return orderFailList.value.length;
    return orderList.value.length;
  };

  const getTableCount = (type: string) => {
    if (type === 'taken') return tableTakenOrderList.value.length ?? 0;
    if (type === 'untaken') return tableUntakenOrderList.value.length ?? 0;
    return tableOrderList.value.length;
  };

  const uncheckedOrderCount = computed(() => uncheckedList.value.length ?? 0);

  return {
    currentViewType,
    selectedListType,
    orderList,
    checkedList,
    uncheckedList,
    orderFailList,
    tableOrderList,
    selectedList,
    selectedTableType,
    selectedTableList,
    isHaveFailedOrder,
    uncheckedOrderCount,
    orderListFilter,
    getOrderHistory,
    getOrderHistoryTableType,
    getListCount,
    getTableCount,
    changeListType,
    changeTableType,
    resetListAndTableType,
  };
});

export default useOrderStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrderStore, import.meta.hot));
}
