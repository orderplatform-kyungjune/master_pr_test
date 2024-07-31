import i18next from 'i18next';
import { changeLanguageNotation } from '@utils/langTranferUtils';
import zh_hant from '@i18n/locales/zh_hant/translation.json';
import zh_hans from '@i18n/locales/zh_hans/translation.json';
import ko_KR from '@i18n/locales/ko/translation.json';
import jp_JP from '@i18n/locales/jp/translation.json';
import en_US from '@i18n/locales/en/translation.json';

const languages = ['ko', 'en', 'jp', 'zh_hans', 'zh_hant'];

// 추후에 수정 필요
function loadResource(lng: string) {
  let module;

  switch (lng) {
    case 'ko': {
      module = ko_KR;
      break;
    }
    case 'en': {
      module = en_US;
      break;
    }
    case 'jp': {
      module = jp_JP;
      break;
    }
    case 'zh_hans': {
      module = zh_hans;
      break;
    }
    case 'zh_hant': {
      module = zh_hant;
      break;
    }
    default:
      break;
  }

  return module;
}

function getResources(lngArr: string[]) {
  const resources: any = {};

  lngArr.forEach((lng) => {
    resources[lng] = { translation: loadResource(lng) };
  });

  return resources;
}

export async function initializeI18next(lng = 'ko') {
  await i18next.init({
    lng,
    fallbackLng: false,
    returnEmptyString: false,
    keySeparator: false,
    nsSeparator: false,
    interpolation: {
      prefix: '%{',
      suffix: '}',
      escapeValue: false,
    },
    parseMissingKeyHandler(key) {
      /* eslint-disable-next-line no-console */
      console.warn('parseMissingKeyHandler', `'key': '${key}'`);
      const keySeparator = '~~';
      const value = key.includes(keySeparator)
        ? key.split(keySeparator)[1]
        : key;

      return value;
    },
    resources: getResources(languages),
  });
}

export async function changeLanguage(lng: 'KR' | 'EN' | 'JP' | 'CN' | 'CN-S') {
  await i18next.changeLanguage(changeLanguageNotation(lng));
}

export function t(key: string, options?: any): string {
  if (options) {
    return i18next.t(key, {
      ...options,
      interpolation: { escapeValue: false },
    }) as string;
  }
  return i18next.t(key);
}
