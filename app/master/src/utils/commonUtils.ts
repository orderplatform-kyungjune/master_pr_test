import { IS_PROD, IS_STAGING } from '@utils/modeUtils';
import {
  sendRequest as sendRequest2,
  sendRequestWithoutToken as sendRequestWithoutToken2,
} from '@utils/axios';
import {
  OrderListDataType,
  TABLE_ORDER_VIEW,
  TableOrderViewType,
} from '@interfaces/Order';

/**
 * @deprecated axios.ts 의 {@link sendRequest} 로 대체
 * @param url
 * @param params
 */
export const sendRequest = sendRequest2;

/**
 * @deprecated axios.ts 의 {@link sendRequestWithoutToken} 로 대체
 * @param url
 * @param param
 */
export const sendRequestWithoutToken = sendRequestWithoutToken2;

export const getOrderTime = (orderTime: string) => orderTime.split(' ')[1];

export const checkPosOrderType = (viewType: TableOrderViewType) => {
  if (viewType === TABLE_ORDER_VIEW.firstOrder) return '첫주문';
  if (viewType === TABLE_ORDER_VIEW.order) return '주문';
  if (viewType === TABLE_ORDER_VIEW.call) return '호출';
  if (viewType === TABLE_ORDER_VIEW.settingComplete) return '세팅완료';
  if (viewType === TABLE_ORDER_VIEW.evaluation) return '평가';
  if (viewType === TABLE_ORDER_VIEW.action) return '경매';
  if (viewType === TABLE_ORDER_VIEW.game) return '게임';
  return '주문';
};

export const checkOrderType = (orderInfo: OrderListDataType) => {
  const orderStatus = orderInfo.viewType;

  if (orderInfo.errorMsg) return '주문 실패';
  checkPosOrderType(orderInfo.viewType);

  if (orderStatus === 2) return '호출';
  return '주문';
};

export const filteredTime = (times: string) => {
  let timeInfo;
  if (times) {
    const [day, time] = times.split(' ');
    timeInfo = `${day.replace('20', '').replaceAll('-', '.')} ${time}`;
  } else {
    timeInfo = '주문시간 누락';
  }
  return timeInfo;
};

// FIXME: 화면에서 보여주는 포트 사이즈 비율 단계가 10% 이나 로직상은 5% 이다.
export const fontRate = [0.9, 0.95, 1, 1.05, 1.1] as const;
export const setCurrentFontSize = (fontSize: number) => {
  if (fontRate.length < 0 || fontRate.length <= fontSize) {
    throw new Error(`${fontSize} 폰트 사이즈는 설정할 수 없습니다.`);
  }

  const calc = fontRate[fontSize];
  // TODO: document 에 직접값을 설정하지 않고 vue value 값을 이용하여 설정하는 방법이 있다면 수정.
  [3.125, 2.5, 2.3438, 1.875, 1.5625, 1.4063, 1.25, 0.9375].forEach(
    (size, index) => {
      document.documentElement.style.setProperty(
        `--h${index}-size`,
        `${size * calc}vw`,
      );
    },
  );
};

// eslint-disable-next-line vue/max-len
// FIXME: !window.origin.includes('local') 가 존재하는 이유가 배포된 버전에서 local 이 포함된 도메인은 실환경 테스트 용으로 사용 하고 있기 때문인가? 아닐 경우 삭제해도 될듯 함.
export const isProduction = () => IS_PROD && !window.origin.includes('local');
export const isStaging = () => IS_STAGING && !window.origin.includes('local');

export const isProductionAndTablet = () => isProduction() && window.UUID;

export const vwToPx = (vw: number) => {
  const { clientWidth } = document.documentElement;
  return (vw / 100) * clientWidth;
};
