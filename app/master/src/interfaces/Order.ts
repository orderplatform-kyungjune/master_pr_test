export interface OrderListParamType {
  order?: string;
  store_code?: string;
  is_master_db?: boolean;
}

export interface CheckOrderParmaType {
  store_code?: string;
  commit: boolean;
  order_view_key: string;
}

export interface CheckProductOrderCheckParamType extends CheckOrderParmaType {
  order_view_product_key: string;
}

export interface TableResetParamType {
  store_code?: string;
  table_id: string;
}

export interface RecentOrderParamType {
  store_code?: string;
  order_key: string;
  is_master_db: boolean;
}

export interface NameArrayType {
  en: string;
  jp: string;
  ko: string;
  zh_hans: string;
  zh_hant: string;
}

export interface visitGroupType {
  total: number;
  gentleman: number;
  lady: number;
}

export interface OptionType {
  good_qty: number;
  name_array: NameArrayType;
  pos_price: number;
  display_name: string;
}

export interface OrderListType {
  display_name: string;
  good_qty: number;
  good_price: number;
  total_good_price: number;
  order_product_commit: boolean;
  order_product_key: string;
  name_array: NameArrayType;
  option: OptionType[];
}

export const TABLE_ORDER_VIEW = {
  firstOrder: 0,
  order: 1,
  call: 2,
  settingComplete: 3,
  evaluation: 4,
  action: 5,
  game: 6,
} as const;

export type TableOrderViewType =
  (typeof TABLE_ORDER_VIEW)[keyof typeof TABLE_ORDER_VIEW];

export interface OrderListDataType {
  order_key: string;
  orderSequence: number;
  order_commit: boolean;
  order_time: string;
  table_number: string;
  table_name: string;
  viewType: TableOrderViewType;
  errorMsg: string;
  requestIP: string;
  order_list: OrderListType[];
  order_total_price: number;
  order_total_count: number;
  visitGroups: visitGroupType;
}

export interface OrderListRootDataType {
  all: OrderListDataType[];
  checked: OrderListDataType[];
  unchecked: OrderListDataType[];
  errors: OrderListDataType[];
}

export interface tableInfoType {
  first_order_time: string;
  table_id: string;
  table_name: string;
  total_price: number;
  total_count: number;
  order_use: 'Y' | 'N';
  visitGroups: number;
}

export interface TableOptionType {
  good_qty: number;
  good_price: number;
  name_array: NameArrayType;
  display_name: string;
}

export interface OrderInfo {
  order_time: string;
}

export interface TableOrderListType {
  good_qty: number;
  good_price: number;
  name_array: NameArrayType;
  option: TableOptionType[];
  display_name: string;
}

export interface TableOrderInfoType {
  order_cnt: number;
  order_price: number;
  order_time: string;
  order_key: string;
  view_type: TableOrderViewType;
}

export interface TableOrderType {
  order_info: TableOrderInfoType;
  order_list: TableOrderListType[];
}

export interface OrderTableDataType {
  info: tableInfoType;
  orders: TableOrderType[];
}

export interface OrderTableRootDataType {
  all: OrderTableDataType[];
  taken: OrderTableDataType[];
  untaken: OrderTableDataType[];
}

export interface OrderListFilterType {
  type: 'card' | 'list';
  order: 'desc' | 'asc';
}
