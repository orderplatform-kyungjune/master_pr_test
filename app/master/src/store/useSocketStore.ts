import { ref } from 'vue';
import io from 'socket.io-client';
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia';
import dayjs from 'dayjs';
import { IS_US_EAST } from '@utils/modeUtils';
import { serviceGeneralErrorHandler } from '@utils/errorHandler';
import { isProduction, isStaging } from '@utils/commonUtils';
import {
  useUserStore,
  useOrderStore,
  useOrderDetailStore,
  useNoticeStore,
  useModalStore,
  useAndroidStore,
  useToastStore,
} from '@store/index';
import { changeLanguage, t } from '@i18n/i18next';
import { requestStoreInfo } from '@apis/user';
import useApi from '@apis/useApi';

/**
 * useSocketStore():
 * - 소켓 관련 스토어
 */
const useSocketStore = defineStore('Socket', () => {
  const { openModalWithData } = useModalStore();
  const { getOrderHistory, getOrderHistoryTableType } = useOrderStore();

  /**
   * - 유저정보(매장정보) 갱신 함수.
   * - 1분마다 매장정보 API 요청.
   * - store_info_hash 클라와 응답값 비교하여 다를 시 응답값으로 교체 및 노티 노출.
   */
  let userAuthInterval: number;

  /**
   * 1. beepInterval
   * - 인터벌 초기 변수
   * 2. continualSendingBeep()
   * - 1분 마다 주기적으로 Beep 데이터를 쏘는 함수.
   */
  let beepInterval: number;

  /**
   * isSocketConnected
   * - 소켓 연결 상태값
   * - App.vue 내 해당 값으로 소켓 연결 상태를 파악하여 연결상태를 유지시키고 있음.
   * - 소켓 연결 및 해제 시 해당 값이 참조되고 있음.
   */
  const isSocketConnected = ref<boolean>(false);

  const URL: string = import.meta.env.VITE_SOCKET_URL;

  /**
   * socket 인스턴스 생성
   * 1.autoConnect : 소켓 객체 생성과 동시에 자동 연결 여부
   *   - false = 필요한 곳에서 연결시키기 위함.
   * 2.transports : 소켓 트랜스포트 방식 : 'websocket', 'polling' 두 가지 방식 존재.
   *   - 'websocket' = 현재로선 polling 방식을 사용하지 않음.
   */
  const socket = io(URL, {
    autoConnect: false,
    transports: ['websocket'],
  });

  /**
   * socketIncomingOrder():
   * - orderview 소켓 채널 內 주문건에 대한 처리를 담당하는 함수
   * - serverOrderKey : 소켓을 통해 들어온 주문건의 오더 키
   * - clientOrderKey : 클라이언트에 존재하는 주문내역의 최신 오더 키
   * - 불일치 시 주문이 들어온 경우로 최신 주문만을 리턴하는 API (socketGetOrderItem(serverOrderKey))를 호출.
   * - 이후 전체 주문 리스트 (테이블 형 포함) 요청 및 주문 호출 벨을 비동기로 호출함.
   * - 주문 인입 시 UUID.playOrderBell() 실행 - '티오더' 음성
   * - message.type === 'posResponseMessage'
   */
  const socketIncomingOrder = async (message: any) => {
    const { orderList } = storeToRefs(useOrderStore());
    const { socketGetOrderItem, setSelectedOrderList } = useOrderDetailStore();

    if (
      message.type === 'order' ||
      message.viewType ||
      message.type === 'paidOrder'
    ) {
      // 클라 주문키가 없는 경우 -> 주문 페이지가 아닌 경우 새로고침 시 주문키가 미존재 || 주문 자체가 없는경우
      const clientOrderKey = orderList.value[0]?.order_key;
      const serverOrderKey = message.order_view_key;
      if (serverOrderKey !== clientOrderKey) {
        // 전체 주문 리스트 (테이블 형 포함) 요청 및 주문 호출 벨을 울림.
        // 소켓을 통해 주문이 들어온 경우 최신 주문만을 리턴하는 API 호출
        await Promise.all([
          getOrderHistory(true).call(),
          getOrderHistoryTableType().call(),
          socketGetOrderItem(serverOrderKey).call(),
        ]);
        if (window?.UUID?.playOrderBell) {
          window.UUID.playOrderBell();
        }
      }
    }

    // 주문 에러 건
    if (message.type === 'posResponseMessage') {
      const targetOrderKey = message.orderKey;
      const isErrorOrder = message.errorMsg.length !== 0;
      if (isErrorOrder && targetOrderKey) {
        await getOrderHistory(true).call();
        const targetData = orderList.value.find(
          (item) => item.order_key === targetOrderKey,
        );

        if (targetData && targetData.errorMsg.length !== 0) {
          setSelectedOrderList(false, targetData);
        }
      }
    }
  };

  /**
   * socketIncomingNoticeCountUp():
   * - orderview 소켓 채널 內 신규 공지에 대한 함수
   * - message.type === 'countUpdate'
   * - noticeCount를 소켓 응답값으로 치환함.
   */
  const socketIncomingNoticeCountUp = (message: any) => {
    const { getNoticeList } = useNoticeStore();
    if (message.type === 'countUpdate') {
      getNoticeList().call();
    }
  };

  /**
   * socketUrgentNotice():
   * - orderview 소켓 채널 內 긴급 공지에 대한 함수
   * - message.type === 'notice'
   * - message.data 를 담은 긴급 공지 모달 오픈
   */
  const socketUrgentNotice = (message: any) => {
    if (message.type === 'notice') {
      openModalWithData('urgentNotice', message.data);
    }
  };

  /**
   * socketTableClear():
   * - torder 소켓 채널 內 테이블이 비워진 경우에 대한 함수
   * - 테이블이 비워질 경우 테이블 데이터를 재호출 함.
   */
  const socketTableClear = async (message: any) => {
    if (message.type_msg === 'init') {
      await getOrderHistoryTableType().call();
    }
  };

  /**
   * sendPickUpAlert():
   * - 픽업요청
   */
  const sendPickUpAlert = async (table_code: string) => {
    const { userAuth } = storeToRefs(useUserStore());
    if (!userAuth.value?.store) return;

    const message = {
      store: { code: userAuth.value.store.store_code },
      table: { code: table_code },
      type: 'message',
      message: '주문하신 메뉴가 나왔습니다.',
    };
    socket.emit('torder', message);
  };

  /**
   * getBeepData():
   * - 소켓에 전달할 Beep 데이터를 만들어주는 함수.
   */
  const getBeepData = async () => {
    const { userAuth } = storeToRefs(useUserStore());
    const { deviceInfo } = storeToRefs(useAndroidStore());
    const { getDeviceInfo } = useAndroidStore();

    const time = Date.now();
    const ISONow = new Date(time).toISOString();
    const datetime = dayjs(ISONow).format();
    const { location } = window;

    if (window?.UUID) {
      await getDeviceInfo();
    }

    return {
      type: 'beep',
      uCode: userAuth.value?.uCode,
      MACAddr: userAuth.value?.MACAddr,
      deviceUsage: window?.UUID ? deviceInfo.value : {},
      location: {
        ancestorOrigins: location.ancestorOrigins,
        href: location.href,
        origin: window.origin,
        protocol: location.protocol,
        host: location.host,
        hostname: location.hostname,
        port: location.port,
        pathname: location.pathname,
        search: location.search,
        hash: location.hash,
      },
      store: { code: userAuth.value?.store?.store_code ?? '' },
      time: Date.now(),
      path: location.pathname,
      datetime,
    };
  };

  const continualSendingBeep = () => {
    const sendBeep = async () => {
      const beepData = await getBeepData();
      socket.emit('event', beepData);
    };
    sendBeep();
    beepInterval = setInterval(async () => {
      sendBeep();
    }, 60_000);
  };

  const updateStoreInfo = async () => {
    const { userAuth } = storeToRefs(useUserStore());

    if (!userAuth.value) return;
    const { store_info_hash, store_code } = userAuth.value.store;

    const { addToast } = useToastStore();

    const { request } = useApi(requestStoreInfo, '매장정보갱신');
    const {
      data: { shop_data },
    } = await request({ store_code }).then(serviceGeneralErrorHandler);
    const isUserAuthUpdated = store_info_hash !== shop_data.store_info_hash;

    if (!shop_data.store_timezone) {
      if (IS_US_EAST) {
        dayjs.tz.setDefault('America/New_York');
      } else {
        dayjs.tz.setDefault('Asia/Seoul');
      }
    } else {
      dayjs.tz.setDefault(shop_data.store_timezone);
    }

    if (isUserAuthUpdated) {
      userAuth.value.store = shop_data;

      if (shop_data.store_timezone) {
        dayjs.tz.setDefault(shop_data.store_timezone);
      }

      await changeLanguage(shop_data.store_masterLanguage ?? 'KR');
      addToast(t('매장정보갱신안내'), 'success', 1.5);
    }

    if (isProduction() || isStaging()) {
      const currentUrl = `${window.location.origin}${window.location.pathname}`;
      const formatInitTabletVersion =
        shop_data.store_version[shop_data.store_version?.length - 1] !== '/'
          ? `${shop_data.store_version}/`
          : shop_data.store_version;

      if (currentUrl !== formatInitTabletVersion) {
        window.location.href = shop_data.store_version;
      }
    }
  };

  /**
   * stopBeepAndUpdateUserAuthInterval():
   * - beep 및 유저정보(매장정보) 갱신 인터벌 클리어 함수.
   */
  const stopBeepAndUpdateUserAuthInterval = () => {
    clearInterval(beepInterval);
    clearInterval(userAuthInterval);
  };

  /**
   * connectSocket():
   * - 소켓 연결 함수.
   * - isSocketConnected 가 false 일 경우에만 동작함.
   * - false 일 경우
   *   1. 소켓 연결
   *   2. isSocketConnected -> true
   *   3. continualSendingBeep() 실행
   */
  const connectSocket = () => {
    if (!isSocketConnected.value) {
      socket.connect();
      isSocketConnected.value = true;
      continualSendingBeep();
      updateStoreInfo();
      userAuthInterval = setInterval(updateStoreInfo, 60_000);
    }
  };

  /**
   * - 소켓 연결제거 함수.
   * - isSocketConnected 가 true 일 경우에만 동작함.
   * - true 일 경우
   *   1. 소켓 종료
   *   2. isSocketConnected -> false
   *   3. stopBeepInterval() 실행
   */
  const disconnectSocket = () => {
    if (isSocketConnected.value) {
      socket.disconnect();
      isSocketConnected.value = false;
      stopBeepAndUpdateUserAuthInterval();
    }
  };

  /**
   * orderview socket listen channel
   * - orderview 소켓 응답 채널
   * - 비동기로 이뤄저야 함으로 async / await 제외함
   */
  socket.on('orderview', (message: any) => {
    socketIncomingOrder(message);
    socketIncomingNoticeCountUp(message);
    socketUrgentNotice(message);
  });

  /**
   * torder socket listen channel
   * - orderview 소켓 응답 채널
   * - 비동기로 이뤄저야 함으로 async / await 제외함
   */
  socket.on('torder', socketTableClear);

  /**
   * storeUpdate - 상점 정보 변경시 소켓 응답 메시지
   * 상점 정보만 업데이트
   * TODO: 분류, 상품 정보도 즉각 업데이트 되도록 추가 작업 필요
   * 국내망에서 사용
   */
  socket.on('storeUpdate', () => {
    updateStoreInfo();
  });

  /**
   * storeUpdate - 상점 정보 변경시 소켓 응답 메시지
   * 상점 정보만 업데이트
   * TODO: 분류, 상품 정보도 즉각 업데이트 되도록 추가 작업 필요
   * 해외망에서 사용
   */
  socket.on('storeHash', () => {
    updateStoreInfo();
  });

  return {
    isSocketConnected,
    connectSocket,
    disconnectSocket,
    sendPickUpAlert,
  };
});

export default useSocketStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSocketStore, import.meta.hot));
}
