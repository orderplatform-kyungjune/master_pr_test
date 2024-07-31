import { computed, ref } from 'vue';
import i18next from 'i18next';
import dayjs from 'dayjs';

export default function useCurrentTime() {
  const date = ref(dayjs().tz());
  const tableDate = ref(dayjs().tz());

  setInterval(() => {
    date.value = dayjs().tz();
  }, 1000);

  setInterval(() => {
    tableDate.value = dayjs().tz();
  }, 60000);

  const currentDate = computed(() => {
    const currentLanguage = i18next.language;

    if (currentLanguage === 'en') {
      return date.value.locale('en').format('MMM D');
    }
    if (
      currentLanguage === 'jp' ||
      currentLanguage === 'zh_hans' ||
      currentLanguage === 'zh_hant'
    ) {
      return date.value.format('M月 D日');
    }
    return date.value.format('M월 D일');
  });
  const currentTime = computed(() => date.value.format('HH:mm:ss'));

  return {
    date,
    tableDate,
    currentDate,
    currentTime,
  };
}
