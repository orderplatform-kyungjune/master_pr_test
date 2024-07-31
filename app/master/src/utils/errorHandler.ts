import { AxiosError, AxiosResponse } from 'axios';
import { useToastStore, useUserStore } from '@store/index';
import * as Sentry from '@sentry/vue';
import { t } from '@i18n/i18next';
import { Response } from '@apis/apis';

/**
 * @deprecated src/apis/useApi 를 사용할 경우 해당 함수는 사용하지 않음
 * @param err
 * @param apiName
 * @param teleport
 */
const errorHandler = (err: any, apiName: string, teleport?: boolean) => {
  const { addToast } = useToastStore();

  if (err instanceof AxiosError) {
    const axiosError = err as AxiosError;

    // 네트워크 오류 처리
    if (!navigator.onLine) {
      console.error(`${apiName} - 인터넷 연결 끊김`, axiosError);
      addToast(`${apiName} - 인터넷 연결 끊김`, 'error', 1.5, teleport);
      return;
    }

    // Axios 네트워크 오류 코드 처리
    switch (axiosError.code) {
      case 'ECONNABORTED':
        console.error(`${apiName} - 요청 시간 초과`, axiosError);
        // addToast(`${apiName} - 요청 시간 초과`, 'error', 1.5, teleport);
        break;
      case 'ECONNREFUSED':
        console.error(`${apiName} - 연결 거부됨`, axiosError);
        // addToast(`${apiName} - 연결 거부됨`, 'error', 1.5, teleport);
        break;
      case 'ENETDOWN':
        console.error(`${apiName} - 네트워크가 다운됨`, axiosError);
        // addToast(`${apiName} - 네트워크가 다운됨`, 'error', 1.5, teleport);
        break;
      case 'ETIMEDOUT':
        console.error(`${apiName} - 연결 시도 시간 초과`, axiosError);
        // addToast(`${apiName} - 연결 시도 시간 초과`, 'error', 1.5, teleport);
        break;
    }

    // 서버 응답 상태 코드 처리
    switch (axiosError.response?.status) {
      case 400:
        console.error(`${apiName} - 잘못된 요청`, axiosError);
        addToast(
          t('요청을 처리할 수 없습니다. 문제가 계속되면 문의해 주세요.'),
          'error',
          1.5,
          teleport,
        );
        break;
      case 401:
        console.error(`${apiName} - 권한이 없습니다.`, axiosError);
        addToast(`${apiName} - 권한이 없습니다.`, 'error', 1.5, teleport);
        break;
      case 403:
        console.error(`${apiName} - 접근이 금지되었습니다.`, axiosError);
        addToast(`${apiName} - 접근이 금지되었습니다.`, 'error', 1.5, teleport);
        break;
      case 404:
        console.error(`${apiName} - 찾을 수 없습니다.`, axiosError);
        addToast(`${apiName} - 찾을 수 없습니다.`, 'error', 1.5, teleport);
        break;
      case 405:
        console.error(`${apiName} - 허용되지 않는 메서드`, axiosError);
        addToast(`${apiName} - 허용되지 않는 메서드`, 'error', 1.5, teleport);
        break;
      case 409:
        console.error(`${apiName} - 충돌`, axiosError);
        addToast(`${apiName} - 충돌`, 'error', 1.5, teleport);
        break;
      case 500:
        console.error(`${apiName} - 서버 내부 오류`, axiosError);
        addToast(
          t('서버에서 문제가 발생했습니다. 문제가 지속되면 문의해 주세요.'),
          'error',
          1.5,
          teleport,
        );
        break;
      case 502:
        console.error(`${apiName} - 잘못된 게이트웨이`, axiosError);
        addToast(`${apiName} - 잘못된 게이트웨이`, 'error', 1.5, teleport);
        break;
      case 503:
        console.error(`${apiName} - 서비스 사용 불가`, axiosError);
        addToast(`${apiName} - 서비스 사용 불가`, 'error', 1.5, teleport);
        break;
      default:
        console.error(`${apiName} - 알 수 없는 오류`, axiosError);
        // addToast(`${apiName} - 알 수 없는 오류`, 'error', 1.5, teleport);
        break;
    }
  } else if (err instanceof ServiceError) {
    addToast(`${err.message}`, 'error', 1.5, teleport);
  } else {
    console.error(`${apiName} - 알 수 없는 오류`, err);
    // addToast(`${apiName} - 알 수 없는 오류`, 'error', 1.5, teleport);
  }
};
export default errorHandler;

export class ServiceError extends Error {}

export const serviceGeneralErrorHandler = <R = any>(
  result: AxiosResponse<Response<R>>,
) => {
  const { data, status } = result;

  if (status !== 200) {
    // TODO: 네트워크 status 오류 처리에 대한 message 처리 루틴이 필요함.
    throw new ServiceError(String(status));
  }

  if (!data.result) {
    throw new ServiceError(data.msg);
  }

  if (data.code === 401) {
    Sentry.captureMessage(
      `${result.request.path} 권한 에러로 인한 로그아웃 처리`,
      'error',
    );
    useUserStore().logout();
    throw new ServiceError('권한 에러로 인한 로그아웃 처리');
  }

  if (data.code === 400) {
    Sentry.captureMessage(
      `${result.request.path} 요청 에러 - ${data.msg}`,
      'error',
    );

    throw new ServiceError('실패');
  }
  return data;
};
