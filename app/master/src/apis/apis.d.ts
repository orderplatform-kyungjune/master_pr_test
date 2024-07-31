export interface Response<T = any> {
  result: boolean,
  code: number,
  data: T,
  msg: string,
  page_info?: T,
}
