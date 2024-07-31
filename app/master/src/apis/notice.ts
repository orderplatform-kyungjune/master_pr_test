import { sendRequest } from '@utils/commonUtils';
import {
  requestNoticeDetailFilesParams,
  requestNoticeDetailParams,
  requestNoticeListParams,
} from '@interfaces/Notice';
import endpoints from '@apis/endpoints';

export const requestNoticeList = (params: requestNoticeListParams) => sendRequest(endpoints.notice.list, params); // /notice/list 의 응답이 데이터에 page_info 필드가 유일하게 존재함.
export const requestNoticeDetail = (params: requestNoticeDetailParams) => sendRequest(endpoints.notice.info, params);
export const requestNoticeDetailFile = (params: requestNoticeDetailFilesParams) => sendRequest(endpoints.notice.send_file_link, params);
