import { createRouter, createWebHashHistory } from 'vue-router';
import { setupLayouts } from 'virtual:generated-layouts';
import { storeToRefs } from 'pinia';
import { useLocalStorageData } from '@utils/localStorage';
import useSocketStore from '@store/useSocketStore';
import { useNoticeStore } from '@store/index';
import pathName from '@router/pathName';
import { AuthType } from '@interfaces/User';
import type { RouteNameType } from './pathName';
import generatedRoutes from '~pages';

export { RouteNameType };

const routes = [
  ...setupLayouts(generatedRoutes),
  {
    path: '/',
    redirect: '/orderlist',
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

/**
 * Code Splitting 으로 인한 신규 버전 배포 시 구버전의 dynamically imported module 에러 핸들링.
 */
router.onError((error, to) => {
  if (error.message.includes('Failed to fetch dynamically imported module')) {
    window.location = to.fullPath as Location | (string & Location);
  }
});

/**
 * 로그인 또는 매장 선택 페이지를 제외한 페이지에서 소켓 연결을 유지하기 위한 코드 레벨
 * 전역에서 감시하기 위해 App.vue에 작성됨.
 */
router.beforeEach((to, from, next) => {
  try {
    const { isSocketConnected } = storeToRefs(useSocketStore());
    const { connectSocket } = useSocketStore();
    const { resetNoticeParams } = useNoticeStore();

    const userAuth = useLocalStorageData<AuthType | null>('userAuth').value;
    const isLoggedIn = !!userAuth?.store?.store_code;

    // 상점 선택창으로 이동
    if (to.path === '/store') {
      next();
      return;
    }

    // 공지사항 관련 로직
    if (isLoggedIn && !from.path.includes('notice')) {
      resetNoticeParams();
    }

    // 사용자가 로그인하지 않은 상태에서 로그인 페이지를 제외한 페이지에 접근하려고 하면 로그인 페이지로 리디렉션
    if (!isLoggedIn && to.path !== '/login') {
      next('/login');
      return;
    }

    // 사용자가 로그인한 상태에서 소켓이 끊어져있는지 확인 후 재연결
    if (isLoggedIn) {
      if (to.name !== pathName.LOGIN && to.name !== pathName.STORE) {
        if (!isSocketConnected.value) {
          connectSocket();
        }
      }
    }

    // 사용자가 이미 로그인한 상태라면 로그인 페이지로 다시 리디렉션하지 않음
    if (isLoggedIn && to.path === '/login') {
      next('/orderlist');
      return;
    }

    next();
  } catch (error) {
    console.error('페이지 오류 :\n', error);
    // 오류가 발생한 경우, 에러 페이지로 리디렉션하거나, 다음 라우트로 진행하게 할 수 있습니다.
    next();
  }
});

export default router;
