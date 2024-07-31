export interface requestNoticeListParams {
  store_code?: string,
  page: number,
  perPage: number,
  searchType: string,
  searchTxt: string,
  noticeCategory: string[],
}

export interface requestNoticeDetailParams {
  store_code?: string,
  notice_id: number,
}

export interface requestNoticeDetailFilesParams {
  store_code?: string,
  phone_number: string,
  notice_id: number,
  notice_file_id: number[],
}

export interface ListType {
  notice_category: string,
  notice_id: number,
  notice_title: string,
  notice_top_fix: string,
  notice_on: string,
  author: string,
  create_date: string,
  has_file_list: boolean,
}

export interface NoticeListDataType {
  list: ListType[],
  new_count: number,
  notice_fix_count: number,
}

export interface PageInfoType {
  total: number,
  per_page: number,
  current_page: number,
  last_page: number,
  first_page_url: string,
  last_page_url: string,
  prev_page_url: string,
  next_page_url: string,
  path: string,
  from: number,
  to: number,
}

export interface NoticeListRootDataType {
  result: boolean,
  code: number,
  page_info: PageInfoType,
  data: NoticeListDataType,
}

export interface FileListType {
  notice_file_id: number,
  notice_file_name: string,
}

export interface NoticeDetailDataType {
  notice_category: string,
  notice_id: number,
  notice_title: string,
  author: string,
  create_date: string,
  notice_desc: string,
  fileList: FileListType[],
}
export interface NoticeDetailRootDataType {
  info: NoticeDetailDataType,
  new_count: number,
}
