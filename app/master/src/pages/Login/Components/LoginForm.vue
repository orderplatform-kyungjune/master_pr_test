<script setup lang="ts">
import { ref } from 'vue';
import { useTranslation } from 'i18next-vue';
import { useToastStore, useUserStore } from '@store/index';
import { pushPage } from '@router/route.helper';
import pathName from '@router/pathName';
import { LoginInfoType } from '@interfaces/User';
import { DynamicClassType } from '@interfaces/DynamicClass';
import { requestMasterLogin } from '@apis/user';
import useApi from '@apis/useApi';

const { t, i18next } = useTranslation();

const { STORE } = pathName;
const loginInfo = ref<LoginInfoType>({
  id: '',
  password: '',
} as LoginInfoType);

const { setAuthInfo, selectStore } = useUserStore();
const { addToast } = useToastStore();

const isFulfilled = () =>
  loginInfo.value.id.length > 0 && loginInfo.value.password.length > 0;

const getLoginButtonClass = (): DynamicClassType => ({
  'typo-r-h4 w-full rounded-[0.625vw] p-[1.71875vw_1.25vw] active:bg-[#252A35] outline-none':
    true,
  'bg-depth-03': !isFulfilled(),
  'btn-bg-primary': isFulfilled(),
});

const { request } = useApi(requestMasterLogin, '로그인');

/**
 * login():
 * - 로그인 유효성 처리
 * - 로그인 성공 시
 *    - userAuth 스토어 상태 저장
 *    - userAuth 로컬스토리지 생성
 * - 매장 선택 페이지로 이동
 */
const login = async () => {
  if (!loginInfo.value.id) {
    addToast(t('아이디에러'), 'error', 1.5);
    return;
  }
  if (!loginInfo.value.password) {
    addToast(t('비밀번호에러'), 'error', 1.5);
    return;
  }

  const res = await request(loginInfo.value);
  if (res.data.code === 400) {
    addToast(t('로그인에러'), 'error', 1.5);
    return;
  }

  const {
    data: { data },
  } = res;
  setAuthInfo(data);

  const storeData = data.shop_data;

  if (storeData?.length === 1) {
    await i18next.changeLanguage(storeData[0].store_masterLanguage ?? 'KR');
    selectStore(storeData[0]);
  } else {
    pushPage(STORE);
  }
};
</script>

<template>
  <input
    v-model="loginInfo.id"
    type="text"
    aria-label="id"
    :placeholder="t('아이디')"
    class="typo-r-h4 text-black-01 mb-[0.9375vw] h-[5vw] w-full
      rounded-[0.625vw]"
    @keyup.enter="login"
  />
  <input
    v-model="loginInfo.password"
    aria-label="password"
    type="password"
    :placeholder="t('비밀번호')"
    class="typo-r-h4 text-black-01 mb-[1.875vw] h-[5vw] w-full rounded-[0.625vw]"
    @keyup.enter="login"
  />
  <button
    :class="getLoginButtonClass()"
    type="button"
    @click="login"
  >
    {{ t('로그인') }}
  </button>
</template>
