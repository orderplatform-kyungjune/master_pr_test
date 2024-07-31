import { sendRequest } from '@utils/commonUtils';
import {
  requestCategoryListParams,
  requestCategoryUpdateParams,
} from '@interfaces/Category';
import endpoints from '@apis/endpoints';

export const requestCategoryList = (params: requestCategoryListParams) => sendRequest(endpoints.category.list, params);
export const requestCategoryUpdate = (params: requestCategoryUpdateParams) => sendRequest(endpoints.category.update, params);
