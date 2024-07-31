/**
 * src/pages 의 경로가 추가될 때마다 추가 되어야 함.
 */
const PathName = {
  LOGIN: 'Login',
  STORE: 'Store',
  NOTICE: 'Notice',
  ORDERLIST: 'OrderList',
  ORDERTABLE: 'OrderTable',
  PAYMENTHISTORY: 'PaymentHistory',
  DASHBOARD: 'Dashboard',
  PRODUCTMANAGE: 'ProductManage',
  CATEGORYMANAGE: 'CategoryManage',
  QUICKSETTINGS: 'QuickSetting',
  SETTINGS: 'Settings',
  S_ORDER: 'Settings-Order',
  S_PICKUP: 'Settings-PickUp',
  S_ALCOHOL: 'Settings-AlcoholOrderManage',
  S_ERROR: 'Settings-OrderErrorList',
  S_PAYMANAGE: 'Settings-PaymentManage',
  S_PAYHISTORY: 'Settings-PaymentHistory',
  S_PAYCANCEL: 'Settings-PaymentCancelManage',
  S_TIMERMESSAGE: 'Settings-TimerMessage',
  S_TIMERMESSAGE_WRITE: 'Settings-TimerMessage-Write',
  S_TABLEGAME: 'Settings-TableGame',
  S_SERVINGROBOT: 'Settings-ServingRobot',
  S_LANGUAGE: 'Settings-LanguageManage',
  S_FONT: 'Settings-FontManage',
  S_THEME: 'Settings-ThemeManage',
} as const;
export default PathName;

export type RouteNameType = (typeof PathName)[keyof typeof PathName] | 'Notice-id';
