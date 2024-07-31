import { useRoute } from 'vue-router';
import { ref } from 'vue';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import { useLocalStorageData } from '@utils/localStorage';
import {
  useModalStore,
  useOrderStore,
  useSocketStore,
  useToastStore,
} from '@store/index';
import { OrderListDataType, OrderTableDataType } from '@interfaces/Order';
import { commonConfirmDataType } from '@interfaces/Modal';
import { t } from '@i18n/i18next';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import {
  requestCheckOrder,
  requestOrderProductChecked,
  requestRecentOrder,
  requestTableReset,
} from '@apis/order';

/**
 * useOrderDetailStore():
 * - 주문 상세 모달 관련 스토어.
 */
const useOrderDetailStore = defineStore('OrderDetail', () => {
  const { useApiRequest } = useMasterApiRequest();
  const { openModalWithData } = useModalStore();
  const { addToast } = useToastStore();

  const { getOrderHistory, getOrderHistoryTableType } = useOrderStore();
  const { openModal, closeModal } = useModalStore();

  const route = useRoute();

  const localNormalTime = useLocalStorageData<number>('autoClose');

  /**
   * 상세 주문 모달 창 timer 시간
   */
  const normalTime = ref<number>(localNormalTime.value ?? 10);
  /**
   * 페이지가 주문내역 탭이 아닌 다른 탭에 있을 경우 하단에 노출되는 주문 내역 모달 창 timer 시간
   */
  const simpleTime = ref<number>(5);

  const isSimpleOrderModalOpened = ref<boolean>(false);
  const isSimpleOrderOpenedInModal = ref<boolean>(false);
  const openTime = ref<number>(10);
  const simpleOpenTime = ref<number>(5);
  let closeInterval: number;
  let simpleCloseInterval: number;

  const setNormalTime = (time: number) => {
    normalTime.value = time;
  };

  const clearCloseInterval = (isSimple: boolean) => {
    if (isSimple) {
      clearInterval(simpleCloseInterval);
    } else {
      clearInterval(closeInterval);
    }
  };

  const setCloseInterval = (isSimple: boolean, modal?: boolean) => {
    const { flag } = storeToRefs(useModalStore());
    if (isSimple) {
      simpleCloseInterval = setInterval(() => {
        simpleOpenTime.value -= 1;
        if (simpleOpenTime.value === 0) {
          clearCloseInterval(isSimple);
          isSimpleOrderModalOpened.value = false;
        }
        if (modal) {
          isSimpleOrderOpenedInModal.value = false;
        }
      }, 1000);
    } else {
      closeInterval = setInterval(() => {
        openTime.value -= 1;
        if (openTime.value === 0) {
          clearCloseInterval(isSimple);
          flag.value.orderDetail = false;
        }
      }, 1000);
    }
  };

  const resetOpenTime = (isSimple: boolean) => {
    if (isSimple) {
      simpleOpenTime.value = simpleTime.value;
    } else {
      openTime.value = normalTime.value;
    }
  };

  const openOrderDetailModal = (
    isSimple: boolean,
    modal?: boolean,
    isFailOrder?: boolean,
  ) => {
    const { flag } = storeToRefs(useModalStore());
    // 주문 실패 상세화면에서는 자동 닫기 타이머 미동작
    if (!isFailOrder) {
      clearCloseInterval(isSimple);
      resetOpenTime(isSimple);
      setCloseInterval(isSimple, modal);
    }
    if (isSimple) {
      isSimpleOrderModalOpened.value = true;
      if (modal) {
        isSimpleOrderOpenedInModal.value = true;
      }
    } else {
      flag.value.orderDetail = true;
    }
  };

  const closeOrderDetailModal = (isSimple: boolean, modal?: boolean) => {
    const { flag } = storeToRefs(useModalStore());

    clearCloseInterval(isSimple);
    if (isSimple) {
      isSimpleOrderModalOpened.value = false;
      if (modal) {
        isSimpleOrderOpenedInModal.value = false;
      }
    } else {
      flag.value.orderDetail = false;
    }
  };

  // 주문 팝업 관련 상태
  const selectedTableName = ref<string>('');
  const isSelectedTableHavePrevOrder = ref<boolean>(false);
  const selectedOrder = ref<OrderListDataType>({} as OrderListDataType);

  type mutatedSubOrderCardType = {
    mutated: boolean;
    index: number;
  };
  const mutatedSubOrderCard = ref<mutatedSubOrderCardType>({
    mutated: false,
    index: 0,
  });

  const setSelectedOrderList = (
    isSimple: boolean,
    orderItem: OrderListDataType,
    modal?: boolean,
  ) => {
    selectedOrder.value = orderItem;
    const isFailOrder = orderItem?.errorMsg?.length > 1;
    openOrderDetailModal(isSimple, modal, isFailOrder);
  };

  const getSelectedTablesOrderList = (
    orderItem: OrderListDataType,
    subOrderIndex?: number,
  ) => {
    setSelectedOrderList(false, orderItem);
    if (subOrderIndex) {
      mutatedSubOrderCard.value.mutated = true;
      mutatedSubOrderCard.value.index = subOrderIndex;
    }
  };

  const socketGetOrderItem = (order_key: string) =>
    useApiRequest(
      requestRecentOrder,
      (data: OrderListDataType) => {
        const { flag } = storeToRefs(useModalStore());

        const evaluateCondition = () => {
          if (flag.value.orderDetail) return 'orderDetail';
          if (flag.value.tableDetail) return 'tableDetail';
          if (route.path.includes('orderlist')) return 'orderListPath';
          return 'default';
        };

        switch (evaluateCondition()) {
          case 'orderDetail':
            setSelectedOrderList(false, data);
            break;
          case 'tableDetail':
            setSelectedOrderList(true, data);
            break;
          case 'orderListPath':
            setSelectedOrderList(false, data);
            break;
          default:
            setSelectedOrderList(true, data);
        }
      },
      {
        order_key,
        is_master_db: true,
      },
      '최신 주문 내역',
    );

  // 주문 확인 로직
  const postCheckOrder = async (
    orders: OrderListDataType,
    updateSubOrders: boolean = true,
  ) => {
    const { sendPickUpAlert } = useSocketStore();
    const { orderList } = storeToRefs(useOrderStore());
    const { flag } = storeToRefs(useModalStore());

    const index = orderList.value.findIndex(
      (order) => order.order_key === orders.order_key,
    );

    // 원래의 상태를 저장
    const originalOrderCommit = orderList.value[index].order_commit;
    const selectedOriginalOrderCommit = selectedOrder.value.order_commit;

    orderList.value[index].order_commit = !originalOrderCommit;

    if (flag.value.orderDetail) {
      selectedOrder.value.order_commit = !selectedOriginalOrderCommit;
    }

    const isPickupOn = useLocalStorageData('is_pickup_on', false);

    const openPickUpModal = () => {
      openModalWithData('commonConfirm', {
        title: t('픽업요청'),
        message: t('픽업요청 메세지', {
          table_name: orderList.value[index].table_name,
        }),
        buttonName: t('확인'),
        cancelName: t('아니오'),
        onClickButton: () => {
          sendPickUpAlert(orderList.value[index].table_number);
        },
      } as commonConfirmDataType);
    };

    if (isPickupOn.value && !originalOrderCommit) {
      openPickUpModal();
    }

    if (originalOrderCommit) {
      addToast(
        t('주문취소 토스트', {
          order_sequence: orderList.value[index].orderSequence,
        }),
        'warning',
        1.5,
        flag.value.orderDetail,
      );
    } else {
      addToast(
        t('주문완료 토스트', {
          order_sequence: orderList.value[index].orderSequence,
        }),
        'success',
        1.5,
        flag.value.orderDetail,
      );
    }

    // postCheckSubOrder로 트리거 되는 경우 API CALL 및 하위 값 소급 변경은 하지 않음. - 서버가 함.
    if (updateSubOrders) {
      orderList.value[index].order_list = orderList.value[index].order_list.map(
        (subOrder) => ({
          ...subOrder,
          order_product_commit: !originalOrderCommit,
        }),
      );

      if (flag.value.orderDetail) {
        selectedOrder.value.order_list = selectedOrder.value.order_list.map(
          (subOrder) => ({
            ...subOrder,
            order_product_commit: !originalOrderCommit,
          }),
        );
      }

      const { call: requestOrderCheck, error: orderCheckError } = useApiRequest(
        requestCheckOrder,
        () => {},
        {
          commit: orderList.value[index].order_commit,
          order_view_key: orders.order_key,
        },
        '주문 확인',
      );

      await requestOrderCheck();

      if (orderCheckError.value !== null) {
        // 에러 발생 시 원래의 상태로 복원
        orderList.value[index].order_commit = originalOrderCommit;
        selectedOrder.value.order_commit = selectedOriginalOrderCommit;
        if (updateSubOrders) {
          orderList.value[index].order_list = orderList.value[
            index
          ].order_list.map((subOrder) => ({
            ...subOrder,
            order_product_commit: originalOrderCommit,
          }));
          selectedOrder.value.order_list = selectedOrder.value.order_list.map(
            (subOrder) => ({
              ...subOrder,
              order_product_commit: originalOrderCommit,
            }),
          );
        }

        if (originalOrderCommit) {
          addToast(
            `${orderList.value[index].orderSequence} 주문 완료취소를 실패했습니다.`,
            'error',
            1.5,
            flag.value.orderDetail,
          );
        } else {
          addToast(
            `${orderList.value[index].orderSequence} 주문 완료를 실패했습니다.`,
            'error',
            1.5,
            flag.value.orderDetail,
          );
        }
      }
    }
  };

  // 주문 건별 확인 로직
  const postCheckSubOrder = async (
    subOrderIndex: number,
    orderKey?: string,
    mutatedSubKey?: string,
  ) => {
    const { flag } = storeToRefs(useModalStore());
    // orderKey | mutatedSubKey 의 존재 의의는 카드형뷰에 의해 필요로 함.
    // 상세 모달에서의 주문확인과 카드형뷰의 주문확인이 겹쳐 하나로 처리함.
    // 상당히 복잡해져있는 상황으로 두개를 나누거나 전반적인 리팩토링이 필요함.
    const { orderList } = storeToRefs(useOrderStore());

    let orderIndex: number;
    if (!orderKey) {
      orderIndex = orderList.value.findIndex(
        (item) => item.order_key === selectedOrder.value.order_key,
      );
    } else {
      orderIndex = orderList.value.findIndex(
        (item) => item.order_key === orderKey,
      );
    }

    // 원래의 서브오더 체크 상태를 저장
    let originalSubOrderCommitStatus: boolean;
    let selectedOriginalSubOrderCommitStatus: boolean;

    if (flag.value.orderDetail) {
      originalSubOrderCommitStatus =
        orderList.value[orderIndex].order_list[subOrderIndex]
          .order_product_commit;
      selectedOriginalSubOrderCommitStatus =
        selectedOrder.value.order_list[subOrderIndex].order_product_commit;
      selectedOrder.value.order_list[subOrderIndex].order_product_commit =
        !originalSubOrderCommitStatus;
      orderList.value[orderIndex].order_list[
        subOrderIndex
      ].order_product_commit = !originalSubOrderCommitStatus;
    } else {
      const mutatedSubOrderIndex = orderList.value[
        orderIndex
      ].order_list.findIndex(
        (item) => item.order_product_key === mutatedSubKey,
      );
      originalSubOrderCommitStatus =
        orderList.value[orderIndex].order_list[mutatedSubOrderIndex]
          .order_product_commit;
      selectedOriginalSubOrderCommitStatus =
        orderList.value[orderIndex].order_list[mutatedSubOrderIndex]
          .order_product_commit;
      orderList.value[orderIndex].order_list[
        mutatedSubOrderIndex
      ].order_product_commit = !originalSubOrderCommitStatus;
    }

    const checkedSubOrderCount = orderList.value[orderIndex].order_list.reduce(
      (previousValue, currentValue) =>
        previousValue + (currentValue.order_product_commit ? 1 : 0),
      0,
    );

    const isFulfilledSubOrderCheck =
      checkedSubOrderCount === orderList.value[orderIndex].order_list.length;
    const wasPreviouslyFulfilled =
      checkedSubOrderCount + 1 ===
        orderList.value[orderIndex].order_list.length &&
      originalSubOrderCommitStatus;

    const getOrderViewProductKey = () => {
      if (orderKey) {
        const mutatedSubOrderIndex = orderList.value[
          orderIndex
        ].order_list.findIndex(
          (item) => item.order_product_key === mutatedSubKey,
        );
        return (
          orderList.value[orderIndex].order_list[mutatedSubOrderIndex]
            .order_product_key ||
          selectedOrder.value.order_list[subOrderIndex].order_product_key
        );
      }
      return (
        orderList.value[orderIndex].order_list[subOrderIndex]
          .order_product_key ||
        selectedOrder.value.order_list[subOrderIndex].order_product_key
      );
    };

    // 모든 서브오더가 체크되었을 때 또는 모든 서브오더가 체크된 상태에서 하나를 해제했을 때
    if (isFulfilledSubOrderCheck || wasPreviouslyFulfilled) {
      if (orderKey) {
        setTimeout(async () => {
          await postCheckOrder(orderList.value[orderIndex], false);
        }, 400);
      } else {
        await postCheckOrder(orderList.value[orderIndex], false);
      }
    }

    const { call: requestOrderProductCheck, error: orderProductError } =
      useApiRequest(
        requestOrderProductChecked,
        () => {},
        {
          commit:
            !originalSubOrderCommitStatus ||
            !selectedOriginalSubOrderCommitStatus,
          order_view_key:
            orderList.value[orderIndex].order_key ||
            selectedOrder.value.order_key,
          order_view_product_key: getOrderViewProductKey(),
        },
        '주문 확인',
      );

    await requestOrderProductCheck();

    if (orderProductError.value !== null) {
      if (orderKey) {
        const mutatedSubOrderIndex = orderList.value[
          orderIndex
        ].order_list.findIndex(
          (item) => item.order_product_key === mutatedSubKey,
        );
        orderList.value[orderIndex].order_list[
          mutatedSubOrderIndex
        ].order_product_commit = originalSubOrderCommitStatus;
        selectedOrder.value.order_list[
          mutatedSubOrderIndex
        ].order_product_commit = selectedOriginalSubOrderCommitStatus;
      } else {
        orderList.value[orderIndex].order_list[
          subOrderIndex
        ].order_product_commit = originalSubOrderCommitStatus;
        selectedOrder.value.order_list[subOrderIndex].order_product_commit =
          selectedOriginalSubOrderCommitStatus;
      }
    }
  };

  const getSubOrderCheckStatus = (subOrderIndex: number) => {
    const { orderList } = storeToRefs(useOrderStore());

    const orderIndex = orderList.value.findIndex(
      (item) => item.order_key === selectedOrder.value.order_key,
    );
    return orderList.value[orderIndex].order_list[subOrderIndex]
      .order_product_commit;
  };

  // 테이블 뷰
  const selectedTableData = ref<OrderTableDataType>({} as OrderTableDataType);

  const openTableDetail = (tableData: OrderTableDataType) => {
    if (tableData.info.first_order_time.length > 1) {
      selectedTableData.value = tableData;
      openModal('tableDetail');
    } else {
      addToast(
        t('미사용테이블선택', { tableName: tableData.info.table_name }),
        'warning',
        1.5,
        true,
      );
    }
  };

  const postTableReset = (table_id: string) =>
    useApiRequest(
      requestTableReset,
      () => {
        getOrderHistoryTableType().call();
        getOrderHistory().call();
        closeModal('tableDetail');
      },
      { table_id },
      '테이블 리셋',
    );

  return {
    normalTime,
    simpleTime,
    openTime,
    isSimpleOrderModalOpened,
    selectedTableName,
    selectedOrder,
    isSelectedTableHavePrevOrder,
    selectedTableData,
    mutatedSubOrderCard,
    setNormalTime,
    getSelectedTablesOrderList,
    openOrderDetailModal,
    closeOrderDetailModal,
    resetOpenTime,
    socketGetOrderItem,
    postCheckOrder,
    postCheckSubOrder,
    openTableDetail,
    postTableReset,
    setSelectedOrderList,
    getSubOrderCheckStatus,
  };
});

export default useOrderDetailStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOrderDetailStore, import.meta.hot));
}
