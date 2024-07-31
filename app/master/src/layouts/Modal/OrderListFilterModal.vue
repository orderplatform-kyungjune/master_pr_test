<script setup lang="ts">
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useTranslation } from 'i18next-vue';
import { useModalStore, useOrderStore } from '@store/index';
import { DynamicClassType } from '@interfaces/DynamicClass';
import icon_system from '@assets/icon/icon_system.svg?url';
import icon_order_by from '@assets/icon/icon_order_by.svg?url';
import icon_list from '@assets/icon/icon_list.svg?url';
import icon_loading from '@assets/icon/UX/loading.svg?url';

const { t } = useTranslation();

const { getOrderHistory } = useOrderStore();
const { orderListFilter } = storeToRefs(useOrderStore());
const { closeModal } = useModalStore();

const loading = ref<boolean>(false);

const confirmFilter = async () => {
  closeModal('orderListFilter');
};

const permuteType = (type: 'card' | 'list') => {
  orderListFilter.value.type = type;
};

const permuteOrder = async (order: 'desc' | 'asc') => {
  orderListFilter.value.order = order;

  const { call } = getOrderHistory();

  loading.value = true;
  try {
    await call();
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
};

const getCardButtonClass = (): DynamicClassType => ({
  'typo-r-h4 border-ghost-1 flex min-w-[13.59375vw] items-center gap-[0.625vw] rounded-[0.625vw] p-[1.09375vw_1.25vw] active:btn-ghost-pressed':
    true,
  'bg-white text-black': orderListFilter.value.type === 'card',
  'text-white-01': orderListFilter.value.type !== 'card',
});

const getListButtonClass = (): DynamicClassType => ({
  'typo-r-h4 border-ghost-1 flex min-w-[13.59375vw] items-center gap-[0.625vw] rounded-[0.625vw] p-[1.09375vw_1.25vw] active:btn-ghost-pressed':
    true,
  'bg-white text-black': orderListFilter.value.type === 'list',
  'text-white-01': orderListFilter.value.type !== 'list',
});

const getDescButtonClass = (): DynamicClassType => ({
  'typo-r-h4 border-ghost-1 flex w-[13.59375vw] items-center gap-[0.625vw] rounded-[0.625vw] p-[1.09375vw_1.25vw] active:btn-ghost-pressed':
    true,
  'bg-white text-black': orderListFilter.value.order === 'desc',
  'text-white-01': orderListFilter.value.order !== 'desc',
});

const getAscButtonClass = (): DynamicClassType => ({
  'typo-r-h4 border-ghost-1 flex w-[13.59375vw] items-center gap-[0.625vw] rounded-[0.625vw] p-[1.09375vw_1.25vw] active:btn-ghost-pressed':
    true,
  'bg-white text-black': orderListFilter.value.order === 'asc',
  'text-white-01': orderListFilter.value.order !== 'asc',
});

const getConfirmButtonClass = (): DynamicClassType => ({
  'typo-b-h3 text-white-01 active:btn-bg-primary-pressed flex h-[5vw] w-[22.65625vw] items-center justify-center rounded-[0.625vw]':
    true,
  'btn-bg-primary': !loading.value,
  'btn-bg-primary-pressed': loading.value,
});
</script>

<template>
  <div
    class="bg-modal-dim absolute z-[1000] flex size-full items-center
      justify-center"
    @click.self="closeModal('orderListFilter')"
  >
    <div
      class="border-modal-2 relative flex w-[54.375vw] flex-col items-center
        rounded-[0.9375vw] bg-black"
    >
      <div
        class="flex h-[6.71875vw] w-full items-start justify-between
          border-b-[0.078125vw] border-b-[#FC0000]
          p-[2.34375vw_2.34375vw_1.875vw_2.34375vw]"
      >
        <div class="typo-b-h1 text-white-01 flex flex-col gap-[0.9375vw]">
          {{ t('필터 설정') }}
        </div>
      </div>
      <div
        class="flex size-full flex-col gap-[2.34375vw]
          p-[2.5vw_2.34375vw_2.34375vw_2.34375vw]"
      >
        <div class="flex h-auto w-full flex-col gap-[3.75vw]">
          <div class="flex flex-col gap-[1.875vw]">
            <span class="typo-r-h3">{{ t('유형') }}</span>
            <div class="flex gap-[0.78125vw]">
              <div
                :class="getCardButtonClass()"
                @click="permuteType('card')"
              >
                <img
                  :src="icon_system"
                  alt="icon_system"
                />
                {{ t('카드형') }}
              </div>
              <div
                :class="getListButtonClass()"
                @click="permuteType('list')"
              >
                <img
                  :src="icon_list"
                  alt="icon_list"
                />
                {{ t('리스트형') }}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-[1.875vw]">
            <span class="typo-r-h3">{{ t('정렬') }}</span>
            <div class="flex gap-[0.78125vw]">
              <div
                :class="getDescButtonClass()"
                @click="permuteOrder('desc')"
              >
                <img
                  :src="icon_order_by"
                  alt="icon_order_by"
                />
                {{ t('최신순') }}
              </div>
              <div
                :class="getAscButtonClass()"
                @click="permuteOrder('asc')"
              >
                <img
                  :src="icon_order_by"
                  alt="icon_order_by"
                />
                {{ t('오래된 순') }}
              </div>
            </div>
          </div>
        </div>
        <div class="flex w-full justify-end">
          <div
            :class="getConfirmButtonClass()"
            @click="confirmFilter"
          >
            <img
              v-if="loading"
              class="animate-spin"
              :src="icon_loading"
              alt="loading"
            />
            <span v-else>
              {{ t('확인') }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
