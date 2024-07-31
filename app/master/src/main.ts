import { createApp } from 'vue';
import { createPinia } from 'pinia';
import '@styles/main.pcss';
import I18NextVue from 'i18next-vue';
import i18next from 'i18next';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import isLeapYear from 'dayjs/plugin/isLeapYear';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import dayjs from 'dayjs';
// eslint-disable-next-line import/extensions
import 'dayjs/locale/ko.js';
import { initSentryWhenProduction } from '@utils/sentryUtil';
import router from '@router/index';
import { autoAnimatePlugin } from '@formkit/auto-animate/vue';
import App from './App.vue';
import '@vueform/toggle/themes/default.css';

dayjs.extend(isLeapYear);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.locale('ko');

const app = createApp(App);

initSentryWhenProduction(app);

app.config.warnHandler = (msg, vm, trace) => {
  if (msg.includes('Invalid watch source:')) {
    return;
  }
  console.warn(msg + trace);
};

app
  .use(createPinia())
  .use(router)
  .use(I18NextVue, { i18next })
  .use(autoAnimatePlugin)
  .mount('#app');
