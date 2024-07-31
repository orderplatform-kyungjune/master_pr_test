import { ref } from 'vue';
import { AxiosError } from 'axios';
import { ServiceError } from '@utils/errorHandler';
import { useToastStore } from '@store/index';

const networkErrorHandler = (err: any, apiName?: string): void => {
  const { addToast } = useToastStore();
  const prefix = apiName ? `${apiName} - ` : '';

  if (err instanceof AxiosError) {
    const axiosError = err as AxiosError;

    // 네트워크 오류 처리
    if (!navigator.onLine) {
      console.error(`${prefix}인터넷 연결 끊김`, axiosError);
      addToast(`${prefix}인터넷 연결 끊김`, 'error', 1.5);
      return;
    }

    // Axios 네트워크 오류 코드 처리
    switch (axiosError.code) {
      case 'ECONNABORTED':
        console.error(`${prefix}요청 시간 초과`, axiosError);
        addToast(`${prefix}요청 시간 초과`, 'error', 1.5);
        break;
      case 'ECONNREFUSED':
        console.error(`${prefix}연결 거부됨`, axiosError);
        addToast(`${prefix}연결 거부됨`, 'error', 1.5);
        break;
      case 'ENETDOWN':
        console.error(`${prefix}네트워크가 다운됨`, axiosError);
        addToast(`${prefix}네트워크가 다운됨`, 'error', 1.5);
        break;
      case 'ETIMEDOUT':
        console.error(`${prefix}연결 시도 시간 초과`, axiosError);
        addToast(`${prefix}연결 시도 시간 초과`, 'error', 1.5);
        break;
      default:
        console.error(`${prefix}네트워크 에러`, axiosError);
        addToast(`${prefix}네트워크 에러`, 'error', 1.5);
        break;
    }

    // 서버 응답 상태 코드 처리
    switch (axiosError.response?.status) {
      case 400:
        console.error(`${prefix}잘못된 요청`, axiosError);
        addToast(`${prefix}잘못된 요청`, 'error', 1.5);
        break;
      case 401:
        console.error(`${prefix}권한이 없습니다.`, axiosError);
        addToast(`${prefix}권한이 없습니다.`, 'error', 1.5);
        break;
      case 403:
        console.error(`${prefix}접근이 금지되었습니다.`, axiosError);
        addToast(`${prefix}접근이 금지되었습니다.`, 'error', 1.5);
        break;
      case 404:
        console.error(`${prefix}찾을 수 없습니다.`, axiosError);
        addToast(`${prefix}찾을 수 없습니다.`, 'error', 1.5);
        break;
      case 405:
        console.error(`${prefix}허용되지 않는 메서드`, axiosError);
        addToast(`${prefix}허용되지 않는 메서드`, 'error', 1.5);
        break;
      case 409:
        console.error(`${prefix}충돌`, axiosError);
        addToast(`${prefix}충돌`, 'error', 1.5);
        break;
      case 500:
        console.error(`${prefix}서버 내부 오류`, axiosError);
        addToast(`${prefix}서버 내부 오류`, 'error', 1.5);
        break;
      case 502:
        console.error(`${prefix}잘못된 게이트웨이`, axiosError);
        addToast(`${prefix}잘못된 게이트웨이`, 'error', 1.5);
        break;
      case 503:
        console.error(`${prefix}서비스 사용 불가`, axiosError);
        addToast(`${prefix}서비스 사용 불가`, 'error', 1.5);
        break;
      default:
        console.error(`${prefix}알 수 없는 오류`, axiosError);
        addToast(`${prefix}알 수 없는 오류`, 'error', 1.5);
        break;
    }
  } else if (err instanceof ServiceError) {
    addToast(`${err.message}`, 'error', 1.5);
  } else {
    console.error(`${prefix}알 수 없는 오류`, err);
    addToast(`${prefix}알 수 없는 오류`, 'error', 1.5);
  }
};

/**
 * TODO: tanstack 라이브러리로 변경 검토
 * @param requestFunction
 * @param apiName
 * @param errorHandler
 */
const useApi = <T, R = any>(
  requestFunction: (...param: T[]) => Promise<R>,
  apiName?: string,
  errorHandler: (err: any, desc?: string) => void = networkErrorHandler,
) => {
  const loading = ref<boolean>(false);
  const error = ref<string | null>(null);

  const request = async (param: T) => {
    try {
      loading.value = true;
      error.value = null;
      const res = await requestFunction(param);
      loading.value = false;
      return res;
    } catch (err) {
      let message;
      if (err instanceof Error) message = err.message;
      else message = String(error);
      errorHandler(err, apiName);
      error.value = message;
      return Promise.reject(message);
    }
  };

  return {
    request,
    loading,
    error,
  };
};

export default useApi;
