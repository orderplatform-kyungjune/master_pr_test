import { ref } from 'vue';
import {
  acceptHMRUpdate,
  defineStore,
} from 'pinia';
import { DeviceInfoType } from '@interfaces/etc';

const useAndroidStore = defineStore('Android', () => {
  const deviceInfo = ref<string>('');
  const parsedDeviceInfo = ref<DeviceInfoType>({} as DeviceInfoType);

  const getDeviceInfo = async () => {
    const requestDeviceInfo = async (event: MessageEvent<any>) => {
      try {
        const msg = event?.data;
        const methodName = msg?.methodName;

        if (methodName === 'getDeviceUsage') {
          deviceInfo.value = msg.message;

          const fixedString = deviceInfo.value.replace(/:\s*,/g, ': null,');

          const unescapedString = fixedString.replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\"/g, '"');

          const stringWithVersionString = unescapedString.replace(/\\"version\\": (\d+\.\d+\.\d+),/g, '"version": "$1",');

          const stringWithNulls = stringWithVersionString.replace(/:\s*(,|\n|\})/g, ': null$1');

          const refinedString = stringWithNulls.replace(/\s+/g, '');

          let parsedJson;
          try {
            parsedJson = JSON.parse(refinedString);
          } catch (error) {
            console.error('Parsing error:', error);
          }

          parsedDeviceInfo.value = parsedJson;
        }
      } catch (e) {
        console.error(e);
      }
    };

    try {
      if (window?.UUID) {
        window?.UUID.getDeviceUsage();
      }
      window.addEventListener('message', (event) => requestDeviceInfo(event));
    } catch (err) {
      console.error(err);
    } finally {
      window.removeEventListener('message', (event) => requestDeviceInfo(event));
    }
  };

  return {
    deviceInfo,
    parsedDeviceInfo,
    getDeviceInfo,
  };
});

export default useAndroidStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAndroidStore, import.meta.hot));
}
