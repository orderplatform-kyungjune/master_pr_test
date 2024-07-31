import {
  sendRequest,
  sendRequestWithoutToken,
} from '@utils/axios';
import {
  LoginInfoType,
  RedirectionLoginInfoType,
  ShopDataType,
  StoreData,
  StoreInfo,
} from '@interfaces/User';
import endpoints from '@apis/endpoints';
import { Response } from '@apis/apis';

export interface UserStoreInfoRequest {
  store_code: string,
}

export interface UserStoreInfoData {
  shop_data: ShopDataType,
}

export const requestMasterLogin = (loginInfo: LoginInfoType) => sendRequestWithoutToken<Response<StoreData>>(endpoints.users.login, loginInfo);
export const requestMasterRedirectionLogin = (loginInfo: RedirectionLoginInfoType) => sendRequestWithoutToken<Response<StoreData>>(endpoints.users.first_login, loginInfo);
export const requestStoreList = (member_code: { member_code: string }) => sendRequest<Response<StoreInfo>>(endpoints.users.info, member_code);
export const requestStoreInfo = (param: UserStoreInfoRequest) => sendRequest<Response<UserStoreInfoData>>(endpoints.users.store_info, param);
