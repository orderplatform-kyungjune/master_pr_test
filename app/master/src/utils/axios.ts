import axios, { CreateAxiosDefaults } from 'axios';
import { useLocalStorageData } from '@utils/localStorage';
import { AuthType } from '@interfaces/User';

const config: CreateAxiosDefaults = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  transformResponse: (res) => {
    let result;
    try {
      result = JSON.parse(res, (_, v) =>
        typeof v === 'bigint' ? Number(v) : v,
      );
    } catch (e) {
      return res;
    }
    return result;
  },
};

axios.defaults.headers.common.Accept = 'application/json';
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

const axiosWithoutAuth = axios.create(config);

const axiosWithAuth = axios.create(config);
axiosWithAuth.interceptors.request.use((configOrigin) => {
  const cfg = configOrigin;
  const accessToken = useLocalStorageData<AuthType | null>('userAuth').value
    ?.jwt;

  cfg.headers.Authorization = `Bearer ${accessToken}`;
  cfg.validateStatus = (status) => status === 200;
  return cfg;
});

/**
 * 서비스 URL 변경
 * @param url
 */
export const setDefaultUrl = (url: string) => {
  axiosWithoutAuth.defaults.baseURL = url;
  axiosWithAuth.defaults.baseURL = url;
};

/**
 * @param url
 * @param params
 */
export const sendRequest = axiosWithAuth.post;

/**
 * @param url
 * @param param
 */
export const sendRequestWithoutToken = axiosWithoutAuth.post;
