import { sendRequest } from '@utils/commonUtils';
import {
  GoodsOptionRequestParamsType,
  OptionUpdateRequestParamsType,
} from '@interfaces/Goods';
import endpoints from '@apis/endpoints';

export const requestOptionUpdate = (params: OptionUpdateRequestParamsType) => sendRequest(endpoints.option.update, params);
export const requestProductOptions = (params: GoodsOptionRequestParamsType) => sendRequest(endpoints.option.info, params);
