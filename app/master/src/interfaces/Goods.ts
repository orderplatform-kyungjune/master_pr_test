import { NameArrayType } from '@interfaces/Order';

export interface GoodsOptionRequestParamsType {
  store_code?: string;
  goodsCode: string;
}

export interface OptionUpdateRequestParamsType {
  store_code?: string;
  option_no: number;
  option_isSale: boolean;
}

export type SupportedLanguages = 'ko' | 'en' | 'jp' | 'zh_hans' | 'zh_hant';

export interface GoodNameArrayType extends Record<SupportedLanguages, string> {}

export interface GoodsUpdateRequestParamsType {
  store_code?: string;
  goodsCode: string;
  label?: {
    name: string;
    status: boolean;
  };
  is_sale?: boolean;
  is_use?: boolean;
}

export interface OptionDataType {
  option_no: number;
  option_code: string;
  option_name: string;
  option_isSale: boolean;
  option_name_array: GoodNameArrayType;
}

export interface GoodsOptionDataType {
  name: string;
  name_array: GoodNameArrayType;
  require: boolean;
  group_num: number;
  limit_qty: number;
  isSale_cnt: number;
  option_item: OptionDataType[];
}

export interface GoodsLabelType {
  best: string;
  hit: string;
  md: string;
  sale: string;
  new: string;
  vegan: string;
  spicy: string;
  signature: string;
}

export interface CategoryInfoType {
  is_first_on_child: boolean;
  big_code: number;
  child_code: number;
  big_name: string;
  child_name: string;
  big_name_array: NameArrayType;
  child_name_array: NameArrayType;
}

export interface GoodsType {
  goodCode: string;
  goodDpName: string;
  goodNameArray: GoodNameArrayType;
  goodUse: string;
  goodSale: string;
  is_option: boolean;
  goodImage: string;
  goodsLabel: GoodsLabelType;
  categoryInfo: CategoryInfoType;
  imageLock: string;
  saleLock: string;
  useLock: string;
}
