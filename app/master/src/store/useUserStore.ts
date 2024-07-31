import { ref, computed } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { setSentryUserAndExtraInfoSentryWhenProduction } from '@utils/sentryUtil';
import { useLocalStorageData } from '@utils/localStorage';
import { serviceGeneralErrorHandler } from '@utils/errorHandler';
import { isProduction } from '@utils/commonUtils';
import { useSocketStore } from '@store/index';
import { pushPage } from '@router/route.helper';
import pathname from '@router/pathName';
import { AuthType, ShopDataType, StoreData } from '@interfaces/User';
import { QuickSettingType } from '@interfaces/Menu';
import { changeLanguage } from '@i18n/i18next';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import { requestStoreList } from '@apis/user';
import useApi from '@apis/useApi';
import { requestShopDefaultStatus } from '@apis/settings';

const { ORDERLIST, LOGIN } = pathname;

/**
 * useUserStore():
 * - 유저정보 관련 스토어
 */
const useUserStore = defineStore('UserAuth', () => {
  const { useApiRequest } = useMasterApiRequest();

  const userAuth = ref(useLocalStorageData<AuthType | null>('userAuth'));

  const isLoggedIn = computed(
    () =>
      userAuth.value?.member_data &&
      userAuth.value?.store &&
      userAuth.value.store?.store_code,
  );
  const isTorderTwo = computed(
    () => userAuth.value?.store?.store_apiType === 2,
  );
  const masterLanguage = computed(() => {
    const { i18next } = useTranslation();
    return i18next.language;
  });
  const isPrepaymentStore = computed(
    () => userAuth.value?.store?.store_preCreditTableUse || false,
  );
  const isTorderOneStore = computed(
    () => userAuth.value?.store?.store_apiType === 1 || false,
  );
  const isNoposStore = computed(
    () => !userAuth.value?.store?.store_posHas || false,
  );
  const isCustomTheme = computed(
    () => userAuth.value?.store?.store_theme === 'hyatt',
  );

  /**
   * - 매장 선택 함수
   * - 매장 선택 시
   *    - userAuth.store 스토어 상태 저장
   *    - userAuth 로컬스토리지 덮어씌움
   * - 소켓 연결 종료
   * - 주문보기 페이지로 이동 (이동되며 소켓 재연결)
   */
  const selectStore = async (storeData: ShopDataType) => {
    if (!userAuth.value) return;

    userAuth.value.store = storeData;
    if (isProduction()) {
      window.location.href = storeData.store_version; // FIXME: 메모리 누수 지점으로 의심됨
    }

    await changeLanguage(storeData.store_masterLanguage ?? 'KR');

    setSentryUserAndExtraInfoSentryWhenProduction();

    pushPage(ORDERLIST);
  };

  /**
   * - 유저정보를 통한 매장 리스트를 불러오는 함수
   * - userAuth.shop_data 스토어 상태 저장
   * - userAuth 로컬스토리지 덮어씌움
   */
  const updateStoreList = () =>
    useApi(requestStoreList, '매장정보 요청')
      .request({ member_code: userAuth.value?.member_data?.member_code ?? '' })
      .then(serviceGeneralErrorHandler)
      .then((data) => {
        if (!userAuth.value) return;
        userAuth.value.shop_data = data.data.shop_data;
      });

  /**
   * - 로그아웃 함수
   * - 로컬스토리지의 userAuth 제거
   * - 스토어의 userAuth 초기화
   * - 소켓 연결 해제
   * - 로그인 페이지로 이동
   */
  const logout = () => {
    const { disconnectSocket } = useSocketStore();
    userAuth.value = null;
    disconnectSocket();
    pushPage(LOGIN);
  };

  const setAuthInfo = (res: StoreData) => {
    const user = { ...res } as AuthType;

    // TODO: UUID 라이브러리를 사용해서 해결 하는 방법을 고민
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    user.uCode = Array.from({ length: 5 })
      .map(() =>
        characters.charAt(Math.floor(Math.random() * characters.length)),
      )
      .join('');

    user.MACAddr = window.UUID?.getMacAddress?.() ?? '00:00:00:00:00:00';
    userAuth.value = user;
  };

  /*
   * 상점 빠른설정 관련 로직
   * */
  const quickSettingList = ref<QuickSettingType[]>([
    {
      name: '태블릿 화면',
      description: '태블릿 화면 설명',
      status: true,
      quickSetting: 'display',
      open: 'open',
      close: 'close',
    },
    {
      name: '태블릿 주문',
      description: '태블릿 주문 설명',
      status: true,
      quickSetting: 'order',
      open: 'open_order',
      close: 'close_order',
    },
    {
      name: '주문 내역',
      description: '주문 내역 설명',
      status: true,
      quickSetting: 'recent',
      open: 'open_recent',
      close: 'close_recent',
    },
    // {
    //   name: () => t('케이블 연결 알림'),
    //   description: () => t('케이블 연결 알림 설명'),
    //   status: true,
    //   quickSetting: '케이블',
    //   open: 'open',
    //   close: 'close',
    // },
  ]);

  const requestShopStatus = () =>
    useApiRequest(
      requestShopDefaultStatus,
      (data: any) => {
        quickSettingList.value[0].status = data.display;
        quickSettingList.value[1].status = data.order;
        quickSettingList.value[2].status = data.recent;
      },
      {},
      '상점정보',
    );

  const getParamsFromQuickData = (quickData: QuickSettingType) => {
    const setting = quickSettingList.value.find(
      (item) => item.quickSetting === quickData.quickSetting,
    );
    if (setting) {
      if (quickData.status) {
        return setting.open;
      }
      return setting.close;
    }
    return '';
  };

  const updateQuickSettingStatus = (
    quickSetting: string,
    newStatus: boolean,
  ) => {
    const setting = quickSettingList.value.find(
      (item) => item.quickSetting === quickSetting,
    );
    if (setting) {
      setting.status = newStatus;
    }
  };

  const checkStandardPriceUnit = (price: string | number) => {
    if (price === '') return '';

    const unit = userAuth.value?.store?.store_standardPriceUnit;

    if (unit === '$') {
      if (typeof price === 'number') {
        return `$ ${price.toFixed(2)}`;
      }
      return `$ ${Number(price.replace(/,/g, '')).toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
    }
    if (unit === '¥') {
      return `¥ ${price}`;
    }
    return `${price}원`;
  };

  return {
    userAuth,
    isLoggedIn,
    isTorderTwo,
    masterLanguage,
    isPrepaymentStore,
    isTorderOneStore,
    isNoposStore,
    isCustomTheme,
    quickSettingList,
    setAuthInfo,
    logout,
    selectStore,
    updateStoreList,
    requestShopStatus,
    getParamsFromQuickData,
    updateQuickSettingStatus,
    checkStandardPriceUnit,
  };
});

export default useUserStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
