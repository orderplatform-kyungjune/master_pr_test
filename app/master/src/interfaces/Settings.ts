export interface requestUpdateShopDefaultStatusType {
  storeCode?: string;
  type:
    | 'open'
    | 'close'
    | 'open_order'
    | 'close_order'
    | 'open_recent'
    | 'close_recent';
}

export interface RequestUpdateLanguageType {
  store_code?: string;
  lang: 'KR' | 'EN' | 'JP' | 'CN' | 'CN-S';
}
