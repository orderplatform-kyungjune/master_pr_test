import { storeToRefs } from 'pinia';
import { useUserStore } from '@store/index';
import { NameArrayType } from '@interfaces/Order';

export const translateLanguage = (
  languageObject: NameArrayType,
  fallback: string,
) => {
  const { masterLanguage } = storeToRefs(useUserStore());

  if (masterLanguage.value === 'ko') {
    return languageObject?.ko
      ? String(languageObject?.ko ?? '')
      : fallback ?? '';
  }
  if (masterLanguage.value === 'en') {
    return languageObject?.en
      ? String(languageObject?.en ?? '')
      : fallback ?? '';
  }
  if (masterLanguage.value === 'jp') {
    return languageObject?.jp
      ? String(languageObject?.jp ?? '')
      : fallback ?? '';
  }
  if (masterLanguage.value === 'zh_hans') {
    return languageObject?.zh_hans
      ? String(languageObject?.zh_hans ?? '')
      : fallback ?? '';
  }
  if (masterLanguage.value === 'zh_hant') {
    return languageObject?.zh_hant
      ? String(languageObject?.zh_hant ?? '')
      : fallback ?? '';
  }

  return fallback;
};

export const changeLanguageNotation = (
  defaultLanguage: 'KR' | 'EN' | 'JP' | 'CN' | 'CN-S' | undefined,
) => {
  switch (defaultLanguage) {
    case 'KR':
      return 'ko';
    case 'EN':
      return 'en';
    case 'JP':
      return 'jp';
    case 'CN':
      return 'zh_hant';
    case 'CN-S':
      return 'zh_hans';
    default:
      return 'ko';
  }
};
