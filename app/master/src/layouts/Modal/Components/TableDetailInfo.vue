<script setup lang='ts'>
import OrderTimeLine from '@layouts/Modal/Components/TableOrderDetail/OrderTimeLine.vue';
import OrderInfo from '@layouts/Modal/Components/TableOrderDetail/OrderInfo.vue';
import {
  OrderTableDataType,
  TableOrderType,
} from '@interfaces/Order';

const props = defineProps<{
  selectedTableData: OrderTableDataType,
  orderItem: TableOrderType,
  totalPrice: number,
  selectOrder: (index: number) => void,
}>();
</script>

<template>
  <div class="flex h-full w-[45.9375vw] flex-col justify-between pb-[2.34375vw]">
    <OrderTimeLine
      :totalOrder="props.selectedTableData.orders"
      :orderItem="props.orderItem"
      :selectOrder="props.selectOrder"
    />
    <OrderInfo
      :totalPrice="props.totalPrice"
      :orderCnt="props.selectedTableData.info.total_count"
    />
  </div>
</template>
