<script setup lang="ts">
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { setDefaultUrl } from '@utils/axios';
import {
  useModalStore,
  useAdministratorStore,
  useAndroidStore,
  useOrderDetailStore,
} from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';

const { t } = useTranslation();

const { closeModal } = useModalStore();
const { parsedDeviceInfo: deviceInfo } = storeToRefs(useAndroidStore());
const { getDeviceInfo } = useAndroidStore();
const { usePointer } = storeToRefs(useAdministratorStore());
const { normalTime, simpleTime } = storeToRefs(useOrderDetailStore());

// TODO: 여기서 외 getDeviceInfo 를 설정하고 있고 window.UUID 여부를 검증하지 않고 있는지 확인 필요.
getDeviceInfo();

const permutePointer = () => {
  usePointer.value = !usePointer.value;
};

const setOrderPopupTime = () => {
  normalTime.value = 1000;
  simpleTime.value = 1000;
};

const endpointsPw = ref('');
const endpointsValue = ref(`${window.location.protocol}//`);
const isEndpointsEditable = computed(() => endpointsPw.value === 'tomax12#$');
const setEndpointsUrl = (isReset: boolean) => {
  if (isEndpointsEditable.value) {
    setDefaultUrl(
      isReset ? import.meta.env.VITE_API_BASE_URL : endpointsValue.value,
    );
  }
};

const getCardClass = (): DynamicClassType => ({
  'typo-r-h3 h-full rounded-[0.625vw] p-[1vw] active:bg-[#292929AA]': true,
  'bg-[#292929]': !usePointer.value,
  'bg-[#FFFFFF] text-black-01': usePointer.value,
});
</script>

<template>
  <div class="bg-modal-dim absolute z-[1000] size-full">
    <div
      class="typo-r-h4 text-white-01 z-[1001] flex h-full w-[full] flex-col
        gap-[2vw] p-[2vw]"
    >
      <div class="flex w-full justify-between">
        <p class="typo-b-h2">
          {{ t('관리자 모드') }}
          <span class="typo-b-h5 text-white-disabled ml-[0.5vw]">
            ※ 실험적 기능에 대한 접근 페이지입니다.
          </span>
        </p>
        <div
          class="typo-r-h3 bg-depth-02 h-full rounded-[0.625vw] p-[1vw]"
          @click="closeModal('administrator')"
        >
          {{ t('종료') }}
        </div>
      </div>
      <div class="flex h-[23.4375vw] w-full flex-col gap-[2vw]">
        <p class="typo-b-h3">
          실험 기능
          <span class="typo-b-h5 text-white-disabled ml-[0.5vw]">
            ※ 모든 실험 기능은 새로고침 시 초기화됩니다.
          </span>
        </p>
        <div class="flex w-full gap-[1vw]">
          <div
            :class="getCardClass()"
            @click="permutePointer"
          >
            {{ usePointer ? '터치 포인터 비활성화' : '터치 포인터 활성화' }}
          </div>
          <div
            class="typo-r-h3 h-full rounded-[0.625vw] bg-[#292929] p-[1vw]
              active:bg-[#292929AA]"
            @click="setOrderPopupTime"
          >
            주문 팝업 노출 시간 변경
          </div>
        </div>
      </div>
      <div class="flex h-[23.4375vw] w-full flex-col gap-[2vw]">
        <p class="typo-b-h3">
          API BASE URL
          <span class="typo-b-h5 text-white-disabled ml-[0.5vw]">
            ※ Base Url은 새로고침 시 기본값으로 초기화됩니다.
          </span>
        </p>
        <div class="flex w-full flex-col gap-[1vw]">
          <div class="flex w-1/2 gap-[1vw]">
            <input
              v-model="endpointsPw"
              type="password"
              aria-label="password"
              class="w-1/4 rounded-[1vw] text-black"
            />
            <input
              v-model="endpointsValue"
              type="text"
              :disabled="!isEndpointsEditable"
              aria-label="text"
              class="w-3/4 rounded-[1vw] text-black"
              :class="isEndpointsEditable ? '' : 'bg-[#AAAAAA]'"
            />
          </div>
          <div class="flex gap-[1vw]">
            <div
              class="typo-r-h3 h-full rounded-[0.625vw] bg-[#292929] p-[1vw]
                active:bg-[#292929AA]"
              @click="setEndpointsUrl(false)"
            >
              API BASE URL CHANGE
            </div>
            <div
              class="typo-r-h3 h-full rounded-[0.625vw] bg-[#292929] p-[1vw]
                active:bg-[#292929AA]"
              @click="setEndpointsUrl(true)"
            >
              API BASE URL RESET
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col gap-[2vw]">
        <p class="typo-b-h3">
          태블릿 상태
          <span class="typo-b-h5 text-white-disabled ml-[0.5vw]">
            ※ 태블릿에서만 정상 노출됩니다.
          </span>
        </p>
        <div class="flex gap-[2vw]">
          <div class="flex flex-col gap-[1vw]">
            <p class="typo-b-h3">App Status</p>
            <p>APP VERSION: {{ deviceInfo?.version ?? '' }}</p>
            <p>BRIGHT: {{ deviceInfo?.bright ?? '' }}</p>
          </div>
          <div class="flex flex-col gap-[1vw]">
            <p class="typo-b-h3">Device Info</p>
            <p>CPU: {{ `${deviceInfo?.cpu}%` ?? '' }}</p>
            <p>TOTAL RAM: {{ `${deviceInfo?.ram?.total}Mb` ?? '' }}</p>
            <p>APP USE RAM: {{ `${deviceInfo?.ram?.app}Mb` ?? '' }}</p>
            <p>TOTAL USED RAM: {{ `${deviceInfo?.ram?.used}Mb` ?? '' }}</p>
            <p>Used Storage: {{ `${deviceInfo?.storage?.used}Mb` ?? '' }}</p>
            <p>Free Storage: {{ `${deviceInfo?.storage?.free}Mb` ?? '' }}</p>
          </div>
          <div class="flex flex-col gap-[1vw]">
            <p class="typo-b-h3">Network Status</p>
            <p>Name: {{ deviceInfo?.wifi?.ssid ?? '' }}</p>
            <p>Strength: {{ `${deviceInfo?.wifi?.strength}dBm` ?? '' }}</p>
            <p>Speed: {{ `${deviceInfo?.wifi?.speed}Mbps` ?? '' }}</p>
          </div>
          <div class="flex flex-col gap-[1vw]">
            <p class="typo-b-h3">Battery Status</p>
            <p>LEFT BATTERY: {{ `${deviceInfo?.battery}%` ?? '' }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
