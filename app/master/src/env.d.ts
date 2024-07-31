/// <reference types="vite/client" />
/// <reference types="vue/macros-global" />
/// <reference types="vite-plugin-pages/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string,
  readonly VITE_SOCKET_URL: string,
  readonly VITE_CYPRESS_TEST: boolean,
  readonly VITE_FIRST_LOGIN_KEY: string,
  readonly VITE_SENTRY_DSN: string,
  readonly VITE_SENTRY_TOKEN: string,
  readonly VITE_SENTRY_AUTH_TOKEN: string,
  readonly VITE_SENTRY_RELEASE: string,
  readonly VITE_REGION: string,
  // 다른 환경 변수들에 대한 타입 정의...
}

interface ImportMeta {
  readonly env: ImportMetaEnv,
}

declare module '*.vue' {
  import { type DefineComponent } from 'vue';

  const component: DefineComponent<{}, {}, any>;
  export default component;
}
