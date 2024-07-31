import { NameArrayType } from '@interfaces/Order';

export interface requestCategoryListParams {
  store_code?: string;
  searchType: string;
}

export interface requestCategoryUpdateParams {
  store_code?: string;
  type: string;
  categoryCode?: number;
  updateCategoryCode: number[];
  updateCategoryUse: string[];
}

export interface ChildCategoryListType {
  categoryCode: number;
  categoryName: string;
  categoryUse: string;
  requestStatus: boolean;
  categoryNameArray: NameArrayType;
}

export interface CategoryListType {
  categoryCode: number;
  categoryName: string;
  categoryUse: string;
  categoryNameArray: NameArrayType;
  child: ChildCategoryListType[];
}
