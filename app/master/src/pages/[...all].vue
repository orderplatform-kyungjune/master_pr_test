<script setup lang="ts">
import { pushPage } from '@router/route.helper';
import pathName from '@router/pathName';

const { ORDERLIST } = pathName;
const goMainPage = () => pushPage(ORDERLIST);
</script>

<template>
  <div class="flex flex-col items-center justify-center space-y-10 text-5xl font-bold uppercase text-amber-600">
    <p>존재하지 않는 페이지입니다.</p>
    <p>메인으로 돌아가시겠습니까?</p>
    <button
      class="btn text-[1.40625vw] text-white"
      type="button"
      @click="goMainPage"
    >
      확인
    </button>
  </div>
</template>

<route lang="yaml">
meta:
layout: 404
</route>
