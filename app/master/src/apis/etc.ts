import { sendRequest } from '@utils/commonUtils';
import { requestKakaoAlimtalkParams } from '@interfaces/etc';
import endpoints from '@apis/endpoints';

export const requestKakaoAlimtalk = (params: requestKakaoAlimtalkParams) => sendRequest(endpoints.happyTalk.req, params);

export default requestKakaoAlimtalk;
