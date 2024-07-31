export interface LoginInfoType {
  id: string;
  password: string;
}

export interface RedirectionLoginInfoType {
  store_code: string;
  first_login_key: string;
}

interface MemberType {
  member_id: string;
  member_code: string;
  member_name: string;
  member_auth: string;
  member_login_datetime: string;
}

/**
 *  "KR": "한국어" - 'ko',
 *  "EN": "영어" - 'en',
 *  "JP": "일본어" - 'jp',
 *  "CN": "중국어(번체)" - 'zh_hant',
 *  "CN-S": "중국어(간체)" - 'zh_hans'
 */
export interface ShopDataType {
  store_info_hash: string;
  store_code: string;
  store_name: string;
  store_id: string;
  store_apiType: number;
  store_masterLanguage: 'KR' | 'EN' | 'JP' | 'CN' | 'CN-S';
  store_theme: string;
  store_preCreditTableUse: boolean;
  store_posHas: boolean;
  store_version: string;
  store_standardPriceUnit: string;
  store_timezone: string;
}

export interface StoreInfo {
  member_data: MemberType;
  shop_data: ShopDataType[];
}

export interface StoreData extends StoreInfo {
  jwt: string;
}

export interface AuthType extends StoreData {
  store: ShopDataType;
  uCode: string;
  MACAddr: string;
}
