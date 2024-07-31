<script setup lang="ts">
import { useRoute } from 'vue-router';
import {
  ref,
  computed,
  watchEffect,
} from 'vue';
import { PageInfoType } from '@interfaces/Notice';
import { DynamicClassType } from '@interfaces/DynamicClass';
import arrowRightBlack from '@assets/icon/icon_arrow_right_black.svg?url';
import arrowRight from '@assets/icon/icon_arrow_right.svg?url';
import arrowLeftBlack from '@assets/icon/icon_arrow_left_black.svg?url';
import arrowLeft from '@assets/icon/icon_arrow_left.svg?url';
import arrowDoubleRightBlack from '@assets/icon/icon_arrow_double_right_black.svg?url';
import arrowDoubleRight from '@assets/icon/icon_arrow_double_right.svg?url';
import arrowDoubleLeftBlack from '@assets/icon/icon_arrow_double_left_black.svg?url';
import arrowDoubleLeft from '@assets/icon/icon_arrow_double_left.svg?url';

const props = defineProps<{
  pageInfo: PageInfoType,
  navigate: (page: number) => void,
}>();

const route = useRoute();

const totalPage = computed(() => props.pageInfo.last_page);

const startPage = ref(1);
const endPage = ref(5);

watchEffect(() => {
  if (props.pageInfo.current_page > 3 && props.pageInfo.current_page <= totalPage.value - 2) {
    startPage.value = props.pageInfo.current_page - 2;
    endPage.value = props.pageInfo.current_page + 2;
  } else if (props.pageInfo.current_page > totalPage.value - 2) {
    startPage.value = totalPage.value - 4;
    endPage.value = totalPage.value;
  } else {
    startPage.value = 1;
    endPage.value = Math.min(5, totalPage.value);
  }
  startPage.value = Math.max(1, startPage.value);
  endPage.value = Math.min(totalPage.value, endPage.value);
});

const displayedPages = computed(() => {
  const pages = [];
  for (let i = startPage.value; i <= endPage.value; i += 1) {
    pages.push(i);
  }
  return pages;
});

const navigate = (direction: string|number) => {
  if (direction === 'first') {
    props.navigate(1);
  } else if (direction === 'last') {
    props.navigate(props.pageInfo.last_page);
  } else if (direction === 'prev') {
    if (props.pageInfo.current_page > 1) {
      props.navigate(props.pageInfo.current_page - 1);
    }
  } else if (direction === 'next') {
    if (props.pageInfo.current_page !== props.pageInfo.last_page) {
      props.navigate(props.pageInfo.current_page + 1);
    }
  } else {
    props.navigate(Number(direction));
  }
};

const getPageClass = (i: number): DynamicClassType => ({
  'typo-r-h2 flex h-[3.125vw] w-[3.90625vw] items-center justify-center rounded-[0.78125vw] cursor-pointer active:btn-bg-primary-pressed': true,
  'bg-[#FC0000] text-white-01': i === props.pageInfo.current_page,
  'text-black-disabled': i !== props.pageInfo.current_page,
});

const getLeftNavigationClass = (): DynamicClassType => ({
  'flex h-[3.125vw] w-[3.90625vw] cursor-pointer items-center justify-center rounded-[0.625vw] border-default-1 bg-depth-02': true,
  'active:bg-depth-03 active:border-transparent-1': props.pageInfo.current_page !== 1,
});
const getRightNavigationClass = (): DynamicClassType => ({
  'flex h-[3.125vw] w-[3.90625vw] cursor-pointer items-center justify-center rounded-[0.625vw] border-default-1 bg-depth-02': true,
  'active:bg-depth-03 active:border-transparent-1': props.pageInfo.current_page !== props.pageInfo.last_page,
});

const isFirstPage = computed(() => props.pageInfo.current_page === 1);
const isLastPage = computed(() => props.pageInfo.current_page === props.pageInfo.last_page);
</script>

<template>
  <div class="flex size-full items-center justify-center gap-[1.09375vw]">
    <div class="flex h-[3.125vw] w-[7.34375vw] justify-end gap-[1.09375vw]">
      <div
        v-if="!route.path.includes('notice')"
        :class="getLeftNavigationClass()"
        @click="navigate('first')"
      >
        <img
          :src="isFirstPage ? arrowDoubleLeftBlack : arrowDoubleLeft"
          alt="arrowDoubleLeft"
        />
      </div>
      <div
        :class="getLeftNavigationClass()"
        @click="navigate('prev')"
      >
        <img
          :src="isFirstPage ? arrowLeftBlack : arrowLeft"
          alt="arrowDoubleLeft"
        />
      </div>
    </div>
    <div class="flex gap-[1.09375vw]">
      <div
        v-for="i in displayedPages"
        :key="i"
        :class="getPageClass(i)"
        @click="navigate(i)"
      >
        {{ i }}
      </div>
    </div>
    <div class="flex h-[3.125vw] w-[7.34375vw] justify-start gap-[1.09375vw]">
      <div
        :class="getRightNavigationClass()"
        @click="navigate('next')"
      >
        <img
          :src="isLastPage ? arrowRightBlack : arrowRight"
          alt="arrowDoubleLeft"
        />
      </div>
      <div
        v-if="!route.path.includes('notice')"
        :class="getRightNavigationClass()"
        @click="navigate('last')"
      >
        <img
          :src="isLastPage ? arrowDoubleRightBlack : arrowDoubleRight"
          alt="arrowDoubleLeft"
        />
      </div>
    </div>
  </div>
</template>
