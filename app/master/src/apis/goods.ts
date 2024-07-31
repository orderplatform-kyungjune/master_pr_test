import { sendRequest } from '@utils/commonUtils';
import {
  GoodsOptionRequestParamsType,
  GoodsUpdateRequestParamsType,
} from '@interfaces/Goods';
import { requestCategoryListParams } from '@interfaces/Category';
import endpoints from '@apis/endpoints';

export const requestProductList = (params: requestCategoryListParams) => sendRequest(endpoints.goods.list, params);
export const requestProductSticker = (params: GoodsOptionRequestParamsType) => sendRequest(endpoints.goods.info, params);
export const requestProductUpdate = (params: GoodsUpdateRequestParamsType) => sendRequest(endpoints.goods.update, params);
