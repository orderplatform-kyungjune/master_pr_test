import { sendRequest } from '@utils/commonUtils';
import {
  requestTimerCreateType,
  requestTimerUpdateType,
  requestTimerDeleteType,
  requestTimerListType,
  requestTimerDetailType,
} from '@interfaces/TimerMessage';
import {
  RequestUpdateLanguageType,
  requestUpdateShopDefaultStatusType,
} from '@interfaces/Settings';
import endpoints from '@apis/endpoints';

export const requestShopDefaultStatus = (param: { store_code?: string }) =>
  sendRequest(endpoints.quick.info, param);
export const requestUpdateShopDefaultStatus = (
  param: requestUpdateShopDefaultStatusType,
) => sendRequest(endpoints.quick.update, param);
export const requestTimerMessageCreate = (param: requestTimerCreateType) =>
  sendRequest(endpoints.message.create, param);
export const requestTimerMessageUpdate = (param: requestTimerUpdateType) =>
  sendRequest(endpoints.message.update, param);
export const requestTimerMessageDelete = (param: requestTimerDeleteType) =>
  sendRequest(endpoints.message.delete, param);
export const requestTimerMessageList = (param: requestTimerListType) =>
  sendRequest(endpoints.message.list, param);
export const requestTimerMessageDetail = (param: requestTimerDetailType) =>
  sendRequest(endpoints.message.info, param);
export const requestUpdateLanguage = (param: RequestUpdateLanguageType) =>
  sendRequest(endpoints.option.language, param);
