import { IS_US_EAST } from '@utils/modeUtils';
import pathName from '@router/pathName';
import {
  Menu,
  OrderListTapType,
  SettingMenu,
  TableListTapType,
} from '@interfaces/Menu';
import icon_setting from '@assets/icon/lnb/icon_setting.svg?url';
import icon_order_global from '@assets/icon/lnb/icon_order_global.svg?url';
import icon_order from '@assets/icon/lnb/icon_order.svg?url';
import icon_notice from '@assets/icon/lnb/icon_notice.svg?url';
import icon_goods from '@assets/icon/lnb/icon_goods.svg?url';
import icon_category from '@assets/icon/lnb/icon_category.svg?url';
import activeSystem from '@assets/icon/icon_setting_active.svg';
import system from '@assets/icon/icon_setting.svg';
import refresh from '@assets/icon/icon_refresh.svg';

const {
  NOTICE,
  ORDERLIST,
  SETTINGS,
  PRODUCTMANAGE,
  CATEGORYMANAGE,
  QUICKSETTINGS,
  S_TIMERMESSAGE,
  S_FONT,
  S_PICKUP,
  S_LANGUAGE,
} = pathName;

export const sideMenuArray: Readonly<Menu[]> = [
  {
    PathName: NOTICE,
    name: '공지사항',
    shortName: '공지',
    icon: icon_notice,
    id: '공지사항 버튼',
  },
  {
    PathName: ORDERLIST,
    name: '주문보기',
    shortName: '주문',
    icon: IS_US_EAST ? icon_order_global : icon_order,
    id: '주문보기 버튼',
  },
  {
    PathName: CATEGORYMANAGE,
    name: '분류관리',
    shortName: '분류',
    icon: icon_category,
    id: '분류관리 버튼',
  },
  {
    PathName: PRODUCTMANAGE,
    name: '상품관리',
    shortName: '상품',
    icon: icon_goods,
    id: '상품관리 버튼',
  },
  // {
  //   PathName: PAYMENTHISTORY,
  //   name: '결제내역',
  //   shortName: '공지',
  //   icon: icon_prepayment,
  //   id: '공지사항 버튼',
  // },
  // {
  //   PathName: DASHBOARD,
  //   name: '상점분석',
  //   shortName: '공지',
  //   icon: icon_analysis,
  //   id: '대시보드 버튼',
  // },
  {
    PathName: SETTINGS,
    name: '설정',
    shortName: '설정',
    icon: icon_setting,
    id: '설정 버튼',
  },
];

// 캐나다망 공지사항 버튼 숨김 처리
export const excludedSideMenuArray = () =>
  sideMenuArray.filter((menu: Menu) => menu.PathName !== NOTICE);

export const sideBottomMenuArray: Readonly<Menu[]> = [
  {
    PathName: QUICKSETTINGS,
    name: '빠른설정',
    icon: system,
    activeIcon: activeSystem,
  },
  {
    PathName: '',
    name: '새로고침',
    icon: refresh,
  },
];

export const settingSideMenuArray: Readonly<SettingMenu[]> = [
  // {
  //   PathName: '',
  //   name: '주문 관리',
  //   sideMenu: [
  //     {
  //       PathName: S_ORDER,
  //       name: '주문하기',
  //       description: '주문하기 설명',
  //     },
  //     {
  //       PathName: S_PICKUP,
  //       name: '픽업 요청',
  //       description: '픽업 요청 설명',
  //     },
  //     {
  //       PathName: S_ALCOHOL,
  //       name: '주류 주문',
  //       description: '주류 주문 설명',
  //     },
  //     {
  //       PathName: S_ERROR,
  //       name: '주문 오류 내역',
  //       description: '주문 오류 내역 설명',
  //     },
  //   ],
  // },
  // {
  //   PathName: '',
  //   name: '결제 관리',
  //   sideMenu: [
  //     {
  //       PathName: S_PAYMANAGE,
  //       name: '결제 보류 처리',
  //       description: '결제 보류 처리 설명',
  //     },
  //     {
  //       PathName: S_PAYHISTORY,
  //       name: '결제 내역',
  //       description: '결제 내역 설명',
  //     },
  //     {
  //       PathName: S_PAYCANCEL,
  //       name: '결제 주문 강제 취소',
  //       description: '결제 주문 강제 취소 설명',
  //     },
  //   ],
  // },
  {
    PathName: '',
    name: '매장 관리',
    id: '설정 - 매장 관리 클릭',
    sideMenu: [
      {
        PathName: S_TIMERMESSAGE,
        name: '타이머 메시지',
        description: '타이머 메시지 설명',
        id: '설정 - 매장 관리 - 타이머 메시지 클릭',
      },
      {
        PathName: S_PICKUP,
        name: '픽업 요청',
        description: '픽업 요청 설명',
      },
    ],
  },
  // {
  //   PathName: '',
  //   name: '부가서비스 관리',
  //   sideMenu: [
  //     {
  //       PathName: S_TABLEGAME,
  //       name: '테이블 게임',
  //       description: '테이블 게임 설명',
  //     },
  //     {
  //       PathName: S_SERVINGROBOT,
  //       name: '서빙 로봇',
  //       description: '서빙 로봇 설명',
  //     },
  //   ],
  // },
  {
    PathName: '',
    name: '마스터 설정',
    id: '설정 - 마스터 설정 클릭',
    sideMenu: [
      {
        PathName: S_LANGUAGE,
        name: '언어설정',
        description: '언어설정 설명',
      },
      // {
      //   PathName: S_THEME,
      //   name: '테마 선택',
      //   description: '테마 선택 설명',
      // },
      {
        PathName: S_FONT,
        name: '글자 크기 변경',
        description: '글자 크기 변경 설명',
        id: '설정 - 마스터 설정 - 글자 크기 변경 클릭',
      },
      {
        PathName: 'autoClose',
        name: '주문 상세내역 노출 시간',
        description: '주문 상세내역 노출 시간을 변경합니다.',
        id: '설정 - 마스터 설정 - 주문 상세내역 자동 닫기 시간',
      },
      {
        PathName: 'storeSelect',
        name: '매장선택',
        description: '매장선택 설정 설명',
        id: '설정 - 마스터 설정 - 매장선택 클릭',
      },
      {
        PathName: 'logout',
        name: '로그아웃',
        description: '로그아웃 설명',
        id: '설정 - 마스터 설정 - 로그아웃 클릭',
      },
    ],
  },
];

export const listTypeArray: Readonly<OrderListTapType[]> = [
  {
    id: 1,
    name: '전체',
    type: 'all',
  },
  {
    id: 2,
    name: '접수',
    type: 'unchecked',
  },
  {
    id: 3,
    name: '완료',
    type: 'checked',
  },
  {
    id: 4,
    name: '주문 실패',
    type: 'failed',
  },
];

export const tableTypeArray: Readonly<TableListTapType[]> = [
  {
    id: 1,
    name: '전체',
    type: 'all',
  },
  {
    id: 2,
    name: '이용 중',
    type: 'taken',
  },
  {
    id: 3,
    name: '이용 안 함',
    type: 'untaken',
  },
];
