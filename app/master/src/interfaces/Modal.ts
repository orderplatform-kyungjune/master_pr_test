import { NameArrayType } from '@interfaces/Order';
import { GoodsLabelType } from '@interfaces/Goods';

export interface ProductWithGoodsCodeType {
  goodsCode: string;
  goodsName: string;
  goodNameArray: NameArrayType;
}

export interface ProductStickerDataType extends ProductWithGoodsCodeType {
  goodsLabel: GoodsLabelType;
}

export interface ProductSaleDataType extends ProductWithGoodsCodeType {
  saleStatus: string;
  useLock: string;
  saleLock: string;
}

export interface UrgentNoticeDataType {
  noticeTitle: string;
  noticeDesc: string;
  createDate: string;
  noticeCategory: string;
}

export interface commonConfirmDataType {
  title: string;
  message: string;
  buttonName: string;
  cancelName?: string;
  onClickButton: Function;
}

export interface timeSelectDataType {
  timeType: string;
  defaultHour: string;
  defaultMinute: string;
  setSelectedTime: Function;
  minimumHour: string;
  minimumMinute: string;
}

export interface OptionConfirmDataType {
  goodsName: string;
  goodNameArray: NameArrayType;
  group_name: string;
  options_name: string;
  option_no: number;
  option_isSale: boolean;
  index: number;
  group_name_array: NameArrayType;
  option_name_array: NameArrayType;
}

export interface modalType {
  commonConfirm: boolean;
  orderDetail: boolean;
  tableDetail: boolean;
  languageChange: boolean;
  sendingNoticeFile: boolean;
  timeSelect: boolean;
  urgentNotice: boolean;
  productOptions: boolean;
  productOptionsConfirm: boolean;
  productSticker: boolean;
  productSale: boolean;
  kakaoCs: boolean;
  administrator: boolean;
  dashboardDaySelector: boolean;
  orderListFilter: boolean;
  autoClose: boolean;
}

export interface modalDataType {
  productOptions: ProductWithGoodsCodeType;
  productOptionsConfirm: OptionConfirmDataType;
  productSticker: ProductStickerDataType;
  productSale: ProductSaleDataType;
  commonConfirm: commonConfirmDataType;
  tableDetail: timeSelectDataType;
  languageChange: any;
  sendingNoticeFile: any;
  timeSelect: any;
  urgentNotice: UrgentNoticeDataType;
}
