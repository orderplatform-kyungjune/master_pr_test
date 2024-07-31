import { useLocalStorageData } from '@utils/localStorage';
import { isProductionAndTablet } from '@utils/commonUtils';
import { Vue } from '@sentry/vue/types/types';
import * as Sentry from '@sentry/vue';
import { AuthType } from '@interfaces/User';

export const initSentryWhenProduction = (app: Vue | Vue[] | undefined) => {
  if (isProductionAndTablet()) {
    Sentry.init({
      app,
      dsn: import.meta.env.VITE_SENTRY_DSN,
      release: import.meta.env.VITE_SENTRY_RELEASE,
      // integrations: [
      //   new Sentry.BrowserTracing({ routingInstrumentation: Sentry.vueRouterInstrumentation(router) }),
      //   new Sentry.Replay(),
      // ],
      tracingOptions: { trackComponents: true },
      attachProps: true,

      // 리플레이 미사용
      // tracePropagationTargets: [
      //   'local',
      //   /^http:\/\/local\.torder\.io/,
      // ],
      // tracesSampleRate: 1.0,
      // replaysSessionSampleRate: 0.1,
      // replaysOnErrorSampleRate: 1.0,
    });
  }
};

export const setSentryUserAndExtraInfoSentryWhenProduction = () => {
  const userAuth = useLocalStorageData<AuthType>('userAuth').value;

  if (userAuth && Object.keys(userAuth).length && isProductionAndTablet()) {
    Sentry.setUser({
      id: userAuth.store.store_code,
      username: userAuth.store.store_name,
    });
  }
};
