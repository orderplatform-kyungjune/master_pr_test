import { sendRequest } from '@utils/commonUtils';
import {
  CheckOrderParmaType,
  CheckProductOrderCheckParamType,
  OrderListParamType,
  RecentOrderParamType,
  TableResetParamType,
} from '@interfaces/Order';
import endpoints from '@apis/endpoints';

export const requestOrderList = (params: OrderListParamType) => sendRequest(endpoints.order.list, params);
export const requestTableOrderList = (params: OrderListParamType) => sendRequest(endpoints.order.table, params);
export const requestCheckOrder = (params: CheckOrderParmaType) => sendRequest(endpoints.order.orderChecked, params);
export const requestOrderProductChecked = (params: CheckProductOrderCheckParamType) => sendRequest(endpoints.order.orderProductChecked, params);
export const requestTableReset = (params: TableResetParamType) => sendRequest(endpoints.order.tableReset, params);
export const requestRecentOrder = (params: RecentOrderParamType) => sendRequest(endpoints.order.info, params);

export default {
  requestOrderList,
  requestTableOrderList,
  requestCheckOrder,
  requestOrderProductChecked,
  requestTableReset,
  requestRecentOrder,
};
