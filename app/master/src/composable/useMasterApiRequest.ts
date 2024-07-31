import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import errorHandler from '@utils/errorHandler';
import { useToastStore, useUserStore } from '@store/index';
import * as Sentry from '@sentry/vue';
import { t } from '@i18n/i18next';

type RequestFunction<T, P = {}> = (params: P) => Promise<{
  data: { code: number; data: T; msg: string; result: boolean; page_info?: T };
}>;
type SuccessHandler<T> = (data: T, page_info?: T) => void;

/**
 * useMasterApiRequest():
 * - API 요청 컴포저블
 *
 * - TypeScript
 * - T : 응답 데이터의 타입입니다. API 응답의 실제 데이터 부분의 타입을 나타내며, 함수 내에서 이 데이터를 처리할 때 이 타입을 기준으로 함.
 * - P : 요청 파라미터의 타입입니다. API 요청 시 전달되는 파라미터의 타입을 나타냅니다.
 *
 */
export default function useMasterApiRequest() {
  /**
   * @deprecated
   * {@link useApi} 로 대체
   * useApiRequest(requestFunction, onSuccess, params, apiName)
   * @param {RequestFunction<T, P>} requestFunction - API 요청 함수
   * @param {SuccessHandler<T>} onSuccess - API 요청 성공 시 실행되는 함수
   * @param {P} params - API 요청 시 전달되는 파라미터
   * @param {string} apiName - API 요청 이름
   * @return {call, loading, error} - API 요청 함수, 로딩 상태, 에러 상태
   */
  const useApiRequest = <T, P>(
    requestFunction: RequestFunction<T, P>,
    onSuccess: SuccessHandler<T>,
    params: P,
    apiName: string,
    teleport?: boolean,
  ) => {
    const loading = ref(false);
    const error = ref<string | null>(null);

    const { userAuth } = storeToRefs(useUserStore());

    const call = async () => {
      loading.value = true;
      error.value = null;

      const { addToast } = useToastStore();

      try {
        const res = await requestFunction({
          ...params,
          store_code: userAuth.value?.store.store_code,
        });

        if (res.data.code === 401) {
          error.value = res.data.msg;
          Sentry.captureMessage(
            `${apiName} 권한 에러로 인한 로그아웃 처리`,
            'error',
          );

          addToast(
            t('권한 에러로 인해 로그아웃 되었습니다.'),
            'error',
            1.5,
            teleport,
          );
          useUserStore().logout();
        }

        if (res.data.code === 400) {
          error.value = res.data.msg;
          Sentry.captureMessage(
            `${apiName} 요청 에러 - ${error.value}`,
            'error',
          );

          addToast(
            t('요청을 처리할 수 없습니다. 문제가 계속되면 문의해 주세요.'),
            'error',
            1.5,
            teleport,
          );
        }

        if (res.data.code === 200) {
          if (res.data.page_info) {
            onSuccess(res.data.data, res.data.page_info);
          } else {
            onSuccess(res.data.data);
          }
        }
      } catch (err) {
        errorHandler(err, apiName, teleport);
        error.value = 'error';
      } finally {
        loading.value = false;
      }
    };

    return {
      call,
      loading,
      error,
    };
  };

  /**
   * @deprecated
   * {@link useApi} 로 대체
   * useApiRequestWithoutStoreCode(requestFunction, onSuccess, params, apiName)
   * @param {RequestFunction<T, P>} requestFunction - API 요청 함수
   * @param {SuccessHandler<T>} onSuccess - API 요청 성공 시 실행되는 함수
   * @param {P} params - API 요청 시 전달되는 파라미터
   * @param {string} apiName - API 요청 이름
   * @return {call, loading, error} - API 요청 함수, 로딩 상태, 에러 상태
   */
  const useApiRequestWithoutStoreCode = <T, P>(
    requestFunction: RequestFunction<T, P>,
    onSuccess: SuccessHandler<T>,
    params: P,
    apiName: string,
    teleport?: boolean,
  ) => {
    const loading = ref(false);
    const error = ref<string | null>(null);
    const { addToast } = useToastStore();

    const call = async () => {
      loading.value = true;
      error.value = null;

      try {
        const res = await requestFunction({ ...params });

        if (res.data.code === 401) {
          error.value = res.data.msg;
          useUserStore().logout();
          addToast(
            t('권한 에러로 인해 로그아웃 되었습니다.'),
            'error',
            1.5,
            teleport,
          );
        }

        if (res.data.code === 400) {
          error.value = res.data.msg;
          addToast(
            t('요청을 처리할 수 없습니다. 문제가 계속되면 문의해 주세요.'),
            'error',
            1.5,
            teleport,
          );
        }

        if (res.data.code === 200) {
          onSuccess(res.data.data);
        }
      } catch (err) {
        errorHandler(err, apiName, teleport);
        error.value = '500';
      } finally {
        loading.value = false;
      }
    };

    return {
      call,
      loading,
      error,
    };
  };

  return {
    useApiRequest,
    useApiRequestWithoutStoreCode,
  };
}
