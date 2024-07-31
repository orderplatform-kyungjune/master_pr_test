import {
  ref,
  computed,
} from 'vue';
import {
  acceptHMRUpdate,
  defineStore,
} from 'pinia';
import {
  GoodsOptionDataType,
  GoodsType,
} from '@interfaces/Goods';
import useMasterApiRequest from '@composable/useMasterApiRequest';
import { requestProductOptions } from '@apis/option';
import { requestProductList } from '@apis/goods';

/**
 * useGoodsStore:
 * - 상품 관련 스토어.
 */
const useGoodsStore = defineStore('Goods', () => {
  const { useApiRequest } = useMasterApiRequest();

  /**
   * totalGoodsList:
   * - 전체 상품 데이터.
   */
  const refTotalGoodsList = ref<GoodsType[]>([] as GoodsType[]);
  const totalGoodsList = computed({
    get: () => refTotalGoodsList.value,
    set: (value: GoodsType[]) => {
      refTotalGoodsList.value = value;
    },
  });

  /**
   * getGoodsList():
   * - 상품 데이터 요청 함수.
   * - param {string} store_code - 매장코드
   * - param {string} searchType - 조회타입
   * - return {void} 상품 데이터 할당
   */
  const getGoodsList = () => useApiRequest(requestProductList, (data: GoodsType[]) => {
    totalGoodsList.value = data;
  }, { searchType: 'goods_list' }, '상품');

  /**
   * changeGoodSaleStatus(goodCode: string, goodSale: boolean, goodUse: boolean):
   * - 상품 판매상태 변경 함수 (Mutation)
   * - param {string} goodCode - 상품코드
   * - param {string} goodSale - 상품품절상태
   * - param {string} goodUse - 상품판매상태
   * - return {void} 상품 데이터 내 특정 상품 상태 변경 후 재할당
   */
  const changeGoodSaleStatus = (goodCode: string, goodSale: boolean, goodUse: boolean) => {
    const isSale = goodSale ? 'Y' : 'N';
    const isUse = goodUse ? 'Y' : 'N';

    totalGoodsList.value = totalGoodsList.value.map((good) => {
      if (good.goodCode === goodCode) {
        return {
          ...good,
          goodSale: isSale,
          goodUse: isUse,
        };
      }
      return good;
    });
  };

  /**
   * changeGoodStickerStatus(goodCode: string, label: string, status: boolean):
   * - 상품 스티커 변경 함수 (Mutation)
   * - param {string} goodCode - 상품코드
   * - param {string} label - 라벨키값
   * - param {string} goodUse - 상품판매상태
   * - return {void} 상품 데이터 내 특정 상품 스티커 변경 후 재할당
   */
  const changeGoodStickerStatus = (goodCode: string, label: string, status: boolean) => {
    const isUse = status ? 'Y' : 'N';

    totalGoodsList.value = totalGoodsList.value.map((good) => {
      if (good.goodCode === goodCode) {
        return {
          ...good,
          goodsLabel: {
            ...good.goodsLabel,
            [label]: isUse,
          },
        };
      }
      return good;
    });
  };

  /**
   * optionData:
   * - 상품 옵션 데이터.
   */
  const refOptionData = ref<GoodsOptionDataType[]>([] as GoodsOptionDataType[]);
  const optionData = computed({
    get: () => refOptionData.value,
    set: (value: GoodsOptionDataType[]) => {
      refOptionData.value = value;
    },
  });

  /**
   * requestOptionData(goodsCode: string):
   * - 선택 상품 옵션 데이터 요청 함수
   * - param {string} goodsCode - 상품코드
   * - return {void} 선택 상품 옵션 데이터 할당
   */
  const requestOptionData = (goodsCode: string) => useApiRequest(requestProductOptions, ({ option }: any) => {
    optionData.value = option;
  }, { goodsCode }, '상품');

  return {
    totalGoodsList,
    optionData,
    getGoodsList,
    changeGoodSaleStatus,
    changeGoodStickerStatus,
    requestOptionData,
  };
});

export default useGoodsStore;

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGoodsStore, import.meta.hot));
}
