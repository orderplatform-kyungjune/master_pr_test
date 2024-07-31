<script setup lang='ts'>
import { useRoute } from 'vue-router';
import { useTranslation } from 'i18next-vue';
import { serviceGeneralErrorHandler } from '@utils/errorHandler';
import {
  useSocketStore,
  useUserStore,
} from '@store/index';
import LoginForm from '@pages/Login/Components/LoginForm.vue';
import { ShopDataType } from '@interfaces/User';
import { requestMasterRedirectionLogin } from '@apis/user';
import useApi from '@apis/useApi';

const { t } = useTranslation();

const route = useRoute();
const { store_code: isRedirectionLogin } = route.query;

/**
 * redirectionLogin():
 * - 마스터1 -> 마스터2 리디렉션 시 로그인 유지를 위한 함수.
 * - userAuth.shop_data 스토어 상태 저장
 * - userAuth 로컬스토리지 덮어씌움
 */
const {
  setAuthInfo,
  selectStore,
} = useUserStore();

if (isRedirectionLogin) {
  const { request } = useApi(requestMasterRedirectionLogin, '리디렉션 로그인');
  request({
    store_code: isRedirectionLogin as string,
    first_login_key: import.meta.env.VITE_FIRST_LOGIN_KEY as string,
  })
    .then(serviceGeneralErrorHandler)
    .then((response) => {
      const { data } = response;
      setAuthInfo(data);

      let store: ShopDataType|undefined;
      if (data.shop_data.length === 1) {
        [store] = data.shop_data;
      } else {
        store = data.shop_data.find((item) => item.store_code === isRedirectionLogin);
      }

      if (store) {
        const { disconnectSocket } = useSocketStore();
        disconnectSocket();
        selectStore(store);
      }
    });
}
</script>

<template>
  <div class="flex w-full flex-col items-start">
    <p class="text-white-01 typo-b-h1 mb-[2.34375vw]">
      {{ t('로그인 설명') }}
    </p>
    <LoginForm />
  </div>
</template>
